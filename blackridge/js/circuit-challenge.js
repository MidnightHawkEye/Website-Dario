(() => {
  "use strict";

  const sequence = document.querySelector("[data-circuit-sequence]");
  const dialog = document.querySelector("#circuit-challenge");
  if (!sequence || typeof dialog?.showModal !== "function") return;

  const nodes = [...sequence.querySelectorAll("[data-circuit-node]")];
  const cards = nodes.map((node) => node.closest(".approach-card"));
  const board = dialog.querySelector("[data-circuit-board]");
  const title = dialog.querySelector("#circuit-title");
  const intro = dialog.querySelector("[data-circuit-intro]");
  const game = dialog.querySelector("[data-circuit-game]");
  const finish = dialog.querySelector("[data-circuit-finish]");
  const start = dialog.querySelector("[data-circuit-start]");
  const next = dialog.querySelector("[data-circuit-next]");
  const replay = dialog.querySelector("[data-circuit-replay]");
  const status = dialog.querySelector("[data-circuit-status]");
  const levelLabel = dialog.querySelector("[data-circuit-level]");
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const size = 5;
  const source = 10;
  const output = 14;
  const directions = [
    { row: -1, column: 0, x: 50, y: 0, label: "oben", key: "ArrowUp" },
    { row: 0, column: 1, x: 100, y: 50, label: "rechts", key: "ArrowRight" },
    { row: 1, column: 0, x: 50, y: 100, label: "unten", key: "ArrowDown" },
    { row: 0, column: -1, x: 0, y: 50, label: "links", key: "ArrowLeft" },
  ];

  // Fields are numbered left to right, starting at zero. Each path lists adjacent cells
  // in their solved orientation. Additional paths can branch off or form decoys.
  const levels = [
    { name: "INITIAL POWER", paths: [[10, 11, 12, 13, 14]] },
    { name: "CIRCUIT ROUTING", paths: [
      [10, 11, 6, 7, 8, 13, 14], [7, 2, 3], [8, 9, 4], [17, 18, 19],
    ] },
    { name: "BLACKRIDGE CORE", paths: [
      [10, 11, 16, 21, 22, 17, 18, 13, 14], [11, 6, 1, 2, 7, 12, 13],
      [13, 8, 9, 4], [3, 2], [20, 15, 16], [19, 24, 23, 22], [0, 5, 6],
    ] },
  ];

  let sequenceIndex = 0;
  let unlocking = false;
  let opener;
  let scrollPosition;
  let levelIndex = 0;
  let solved = false;
  let cells = [];

  function neighbor(index, direction) {
    const row = Math.floor(index / size) + direction.row;
    const column = (index % size) + direction.column;
    return row < 0 || row >= size || column < 0 || column >= size ? -1 : row * size + column;
  }

  function rotate(mask, turns) {
    // The four bits are north, east, south and west. A bit wraps on a clockwise turn.
    const steps = turns % 4;
    return ((mask << steps) | (mask >> (4 - steps))) & 15;
  }

  function buildSolution(paths) {
    const masks = Array(size * size).fill(0);
    for (const path of paths) {
      for (let i = 1; i < path.length; i += 1) {
        const from = path[i - 1];
        const to = path[i];
        const direction = directions.findIndex((step) => neighbor(from, step) === to);
        if (direction === -1) throw new Error("Circuit path contains non-adjacent fields.");
        masks[from] |= 1 << direction;
        masks[to] |= 1 << ((direction + 2) % 4);
      }
    }
    return masks;
  }

  function findConnection(masks) {
    // Breadth-first search: a wire conducts only if both tiles have matching ports.
    const queue = [source];
    const previous = new Map([[source, null]]);
    for (let i = 0; i < queue.length; i += 1) {
      const current = queue[i];
      directions.forEach((direction, port) => {
        if (!(masks[current] & (1 << port))) return;
        const adjacent = neighbor(current, direction);
        const opposite = 1 << ((port + 2) % 4);
        if (adjacent < 0 || previous.has(adjacent) || !(masks[adjacent] & opposite)) return;
        previous.set(adjacent, current);
        queue.push(adjacent);
      });
    }

    const path = [];
    if (previous.has(output)) {
      for (let index = output; index !== null; index = previous.get(index)) path.push(index);
      path.reverse();
    }
    return { powered: previous, path };
  }

  const svgNamespace = "http://www.w3.org/2000/svg";
  function svgPart(name, attributes) {
    const element = document.createElementNS(svgNamespace, name);
    for (const [attribute, value] of Object.entries(attributes)) element.setAttribute(attribute, value);
    return element;
  }

  function drawCell(mask, terminal) {
    const svg = svgPart("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
    const trace = svgPart("g", { class: "circuit-trace" });
    const lines = directions.flatMap(({ x, y }, port) => (mask & (1 << port)) ? ["M50 50L" + x + " " + y] : []);
    trace.append(svgPart("path", { d: lines.join(" ") }));

    if (terminal) {
      const module = svgPart("rect", { x: "30", y: "30", width: "40", height: "40", rx: "8", fill: "#101d30", stroke: "currentColor", "stroke-width": "3" });
      const symbol = terminal === "Quelle" ? "M54 35L43 51H53L47 65L61 47H50Z" : "M42 50A8 8 0 1 0 58 50A8 8 0 1 0 42 50";
      trace.append(module, svgPart("path", { d: symbol }));
    } else {
      trace.append(svgPart("circle", { cx: "50", cy: "50", r: "4" }));
    }
    svg.append(trace);
    return svg;
  }

  function updateCell(cell, index) {
    cell.element.style.setProperty("--circuit-angle", (cell.turns * 90) + "deg");
    if (cell.terminal || !cell.mask) return;
    const mask = rotate(cell.mask, cell.turns);
    const ports = directions.filter((_, port) => mask & (1 << port)).map(({ label }) => label);
    const location = "Zeile " + (Math.floor(index / size) + 1) + ", Spalte " + ((index % size) + 1);
    cell.element.setAttribute("aria-label", location + ". Anschlüsse: " + ports.join(", "));
  }

  function updatePower() {
    const { powered, path } = findConnection(cells.map(({ mask, turns }) => rotate(mask, turns)));
    cells.forEach(({ element }, index) => element.classList.toggle("circuit-powered", powered.has(index)));
    if (!path.length) return;

    solved = true;
    cells.filter(({ element }) => element.localName === "button").forEach(({ element }) => {
      element.setAttribute("aria-disabled", "true");
    });
    status.textContent = "LEVEL COMPLETE";

    // The final pulse travels along the actual solved route, including alternate routes.
    if (levelIndex === levels.length - 1) {
      path.forEach((index, order) => {
        const element = cells[index].element;
        element.style.setProperty("--circuit-delay", (order * 66) + "ms");
        element.classList.add("circuit-pulse");
      });
      title.textContent = "CIRCUIT COMPLETE";
      finish.hidden = false;
      return;
    }
    next.hidden = false;
  }

  function beginLevel(index) {
    levelIndex = index;
    solved = false;
    intro.hidden = true;
    game.hidden = false;
    finish.hidden = true;
    next.hidden = true;
    title.textContent = "CIRCUIT CHALLENGE";
    levelLabel.textContent = "LEVEL " + String(index + 1).padStart(2, "0") + " – " + levels[index].name;
    status.textContent = "";

    const masks = buildSolution(levels[index].paths);
    if (!findConnection(masks).path.length) throw new Error("Circuit level has no solved route.");
    const firstWire = directions.map((direction) => neighbor(source, direction))
      .find((adjacent, port) => adjacent >= 0 && (masks[source] & (1 << port)));
    const portToSource = directions.findIndex((direction) => neighbor(firstWire, direction) === source);
    const breakTurns = [1, 2, 3, 0].find((turns) => !(rotate(masks[firstWire], turns) & (1 << portToSource)));
    if (breakTurns === undefined) throw new Error("The first circuit wire must be able to disconnect.");

    // Scramble the solved board deterministically. The first wire always starts disconnected.
    cells = masks.map((mask, position) => {
      const terminal = position === source ? "Quelle" : position === output ? "Ausgang" : "";
      const movable = mask && !terminal;
      const element = document.createElement(movable ? "button" : "span");
      const scrambled = movable ? 1 + ((position * 7 + index * 3) % 3) : 0;
      const turns = position === firstWire ? breakTurns : scrambled;
      element.className = "circuit-cell";
      if (movable) {
        element.type = "button";
        element.dataset.circuitCell = position;
        element.tabIndex = -1;
      } else if (terminal) {
        element.classList.add("circuit-cell-terminal");
        element.setAttribute("role", "img");
        element.setAttribute("aria-label", terminal);
      } else {
        element.classList.add("circuit-cell-empty");
        element.setAttribute("aria-hidden", "true");
      }
      if (mask) element.append(drawCell(mask, terminal));
      const cell = { mask, turns, terminal, element };
      updateCell(cell, position);
      return cell;
    });
    board.replaceChildren(...cells.map(({ element }) => element));
    cells[firstWire].element.focus();
    updatePower();
  }

  function openChallenge(node) {
    if (document.querySelector("dialog[open]")) return;
    opener = node;
    scrollPosition = { left: scrollX, top: scrollY, behavior: "instant" };
    intro.hidden = false;
    game.hidden = true;
    finish.hidden = true;
    board.replaceChildren();
    cells = [];
    title.textContent = "CIRCUIT CHALLENGE UNLOCKED";
    root.classList.toggle("circuit-modal-gutter", innerWidth > root.clientWidth);
    root.classList.add("circuit-modal-open");
    dialog.showModal();
    dialog.scrollTop = 0;
    start.focus({ preventScroll: true });
    window.scrollTo(scrollPosition);
  }

  function resetSequence() {
    sequenceIndex = 0;
    cards.forEach((card) => card.classList.remove("circuit-charged"));
    sequence.classList.remove("circuit-unlocked");
  }

  // Every wrong contact resets the sequence. Correct contacts light their own card.
  nodes.forEach((node, index) => {
    node.hidden = false;
    cards[index].addEventListener("click", () => {
      if (unlocking) return;
      if (index !== sequenceIndex) {
        resetSequence();
        return;
      }
      cards[index].classList.add("circuit-charged");
      sequenceIndex += 1;
      if (sequenceIndex !== nodes.length) return;

      sequence.classList.add("circuit-unlocked");
      unlocking = true;
      window.setTimeout(() => {
        resetSequence();
        unlocking = false;
        openChallenge(node);
      }, reducedMotion.matches ? 0 : 450);
    });
  });

  board.addEventListener("click", (event) => {
    const button = event.target.closest("[data-circuit-cell]");
    if (!button || solved) return;
    const index = Number(button.dataset.circuitCell);
    cells[index].turns += 1;
    updateCell(cells[index], index);
    updatePower();
  });

  board.addEventListener("focusin", (event) => {
    if (!event.target.matches("[data-circuit-cell]")) return;
    const previous = board.querySelector("[tabindex='0']");
    if (previous) previous.tabIndex = -1;
    event.target.tabIndex = 0;
  });

  board.addEventListener("keydown", (event) => {
    const direction = directions.find(({ key }) => key === event.key);
    if (!direction || !event.target.matches("[data-circuit-cell]")) return;
    event.preventDefault();
    let index = neighbor(Number(event.target.dataset.circuitCell), direction);
    while (index >= 0) {
      if (cells[index].element.localName === "button") {
        cells[index].element.focus();
        return;
      }
      index = neighbor(index, direction);
    }
  });

  start.addEventListener("click", () => beginLevel(0));
  next.addEventListener("click", () => beginLevel(levelIndex + 1));
  replay.addEventListener("click", () => beginLevel(0));
  dialog.querySelectorAll("[data-circuit-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button")].filter((button) => button.tabIndex >= 0 && !button.closest("[hidden]"));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });

  dialog.addEventListener("close", () => {
    root.classList.remove("circuit-modal-open", "circuit-modal-gutter");
    opener.focus({ preventScroll: true });
    window.scrollTo(scrollPosition);
  });
})();
