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
  const finalTitle = finish.querySelector("#circuit-final-title");
  const levelScores = finish.querySelector("[data-circuit-level-scores]");
  const rank = finish.querySelector("[data-circuit-rank]");
  const rankNote = finish.querySelector("[data-circuit-rank-note]");
  const result = dialog.querySelector("[data-circuit-result]");
  const resultLevel = result.querySelector("[data-circuit-result-level]");
  const resultActions = dialog.querySelector("[data-circuit-result-actions]");
  const start = dialog.querySelector("[data-circuit-start]");
  const next = dialog.querySelector("[data-circuit-next]");
  const retry = dialog.querySelector("[data-circuit-retry]");
  const replay = dialog.querySelector("[data-circuit-replay]");
  const finalClose = dialog.querySelector("[data-circuit-final-close]");
  const status = dialog.querySelector("[data-circuit-status]");
  const levelLabel = dialog.querySelector("[data-circuit-level]");
  const rotationLabel = dialog.querySelector("[data-circuit-rotations]");
  const checkpointLabel = dialog.querySelector("[data-circuit-checkpoints]");
  const hintButton = dialog.querySelector("[data-circuit-hint]");
  const hintMessage = dialog.querySelector("[data-circuit-hint-message]");
  const hintCount = dialog.querySelector("[data-circuit-hint-count]");
  const goal = dialog.querySelector("[data-circuit-goal]");
  const root = document.documentElement;
  const english = root.lang === "en";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const puzzle = blackridgeCircuitPuzzles;
  const levels = puzzle.configurations;
  const { hintLimit, createRun } = blackridgeCircuitScore;
  const run = createRun();
  const numbers = new Intl.NumberFormat(english ? "en-CH" : "de-CH");
  const directions = [
    { x: 50, y: 0, label: english ? "up" : "oben", key: "ArrowUp" },
    { x: 100, y: 50, label: english ? "right" : "rechts", key: "ArrowRight" },
    { x: 50, y: 100, label: english ? "down" : "unten", key: "ArrowDown" },
    { x: 0, y: 50, label: english ? "left" : "links", key: "ArrowLeft" },
  ].map((direction, index) => ({ ...puzzle.directions[index], ...direction }));
  const strings = english ? {
    source: "Source", output: "Output", checkpoint: "Checkpoint", fixed: "Fixed component",
    position: (row, column) => "Row " + row + ", column " + column,
    ports: "Ports", hint: "Check its ports. This tile is on a valid route.",
    hintLimit: "You have used all available hints for this level.",
    rankNotes: {
      "BLACKRIDGE MASTER": "Excellent! You solved the circuits with exceptional efficiency.",
      "CIRCUIT ENGINEER": "Very well done! You mastered the technical challenges.",
      "SYSTEM TECHNICIAN": "Well done! All systems are successfully connected.",
      "CIRCUIT EXPLORER": "Challenge complete! With practice, you can improve your score.",
    },
    goal: count => count === 1 ? "Power the checkpoint as well as the output."
      : "Power both checkpoints and the output. Components marked with a lock are fixed.",
  } : {
    source: "Quelle", output: "Ausgang", checkpoint: "Prüfpunkt", fixed: "Fest montiertes Bauteil",
    position: (row, column) => "Zeile " + row + ", Spalte " + column,
    ports: "Anschlüsse", hint: "Prüfe die Anschlüsse. Dieses Feld liegt auf einem gültigen Weg.",
    hintLimit: "Du hast alle verfügbaren Hinweise für dieses Level verwendet.",
    rankNotes: {
      "BLACKRIDGE MASTER": "Ausgezeichnet! Sie haben die Schaltungen besonders effizient gelöst.",
      "CIRCUIT ENGINEER": "Sehr gute Leistung! Sie haben die technischen Herausforderungen erfolgreich gemeistert.",
      "SYSTEM TECHNICIAN": "Gut gemacht! Alle Systeme wurden erfolgreich verbunden.",
      "CIRCUIT EXPLORER": "Challenge abgeschlossen! Mit etwas Übung lässt sich der Score weiter verbessern.",
    },
    goal: count => count === 1 ? "Versorge neben dem Ausgang auch den Prüfpunkt."
      : "Versorge beide Prüfpunkte und den Ausgang. Bauteile mit einem Schloss sind fest montiert.",
  };

  let sequenceIndex = 0;
  let unlocking = false;
  let opener;
  let scrollPosition;
  let levelIndex = 0;
  let level;
  let rotations = 0;
  let hint;
  let solved = false;
  let cells = [];

  const svgNamespace = "http://www.w3.org/2000/svg";
  function svgPart(name, attributes) {
    const element = document.createElementNS(svgNamespace, name);
    for (const [attribute, value] of Object.entries(attributes)) element.setAttribute(attribute, value);
    return element;
  }

  function drawCell(mask, terminal, fixed) {
    const svg = svgPart("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
    const trace = svgPart("g", { class: "circuit-trace" });
    const lines = directions.flatMap(({ x, y }, port) => (mask & (1 << port)) ? ["M50 50L" + x + " " + y] : []);
    trace.append(svgPart("path", { d: lines.join(" ") }));

    if (terminal === "checkpoint") {
      trace.append(svgPart("circle", { cx: "50", cy: "50", r: "11", class: "circuit-checkpoint-ring", "stroke-width": "3" }),
        svgPart("circle", { cx: "50", cy: "50", r: "4" }));
    } else if (terminal) {
      const module = svgPart("rect", { x: "30", y: "30", width: "40", height: "40", rx: "8", fill: "#101d30", stroke: "currentColor", "stroke-width": "3" });
      const symbol = terminal === "source" ? "M54 35L43 51H53L47 65L61 47H50Z" : "M42 50A8 8 0 1 0 58 50A8 8 0 1 0 42 50";
      trace.append(module, svgPart("path", { d: symbol }));
    } else {
      trace.append(svgPart("circle", { cx: "50", cy: "50", r: "4" }));
    }
    svg.append(trace);
    if (fixed) {
      svg.append(svgPart("path", {
        d: "M75 22V17a6 6 0 0 1 12 0v5 M72 22h18v13H72z",
        class: "circuit-lock",
        "stroke-width": "3",
      }));
    }
    return svg;
  }

  function coordinate(index) {
    return strings.position(Math.floor(index / level.size) + 1, index % level.size + 1);
  }

  function currentMasks() {
    return cells.map(({ mask, turns }) => puzzle.rotate(mask, turns));
  }

  function updateCell(cell, index) {
    cell.element.style.setProperty("--circuit-angle", (cell.turns * 90) + "deg");
    if (cell.terminal || !cell.mask) return;
    const mask = puzzle.rotate(cell.mask, cell.turns);
    const ports = directions.filter((_, port) => mask & (1 << port)).map(({ label }) => label);
    const fixedLabel = cell.fixed ? strings.fixed + ". " : "";
    cell.element.setAttribute("aria-label", fixedLabel + coordinate(index) + ". " + strings.ports + ": " + ports.join(", "));
  }

  function clearHint() {
    if (hint !== undefined) cells[hint].element.classList.remove("circuit-hint");
    hint = undefined;
    hintMessage.textContent = "";
  }

  function updateHintCount() {
    hintCount.textContent = run.hintCount() + " / " + hintLimit;
  }

  function levelTitle(index) {
    return "LEVEL " + String(index + 1).padStart(2, "0") + " – " + levels[index].name;
  }

  function fillScores(panel, scores) {
    panel.querySelectorAll("[data-circuit-value]").forEach(field => {
      const key = field.dataset.circuitValue;
      const deduction = key.endsWith("Deduction") && scores[key] > 0;
      field.textContent = (deduction ? "−" : "") + numbers.format(scores[key]);
    });
  }

  function hideScores() {
    finish.hidden = true;
    result.hidden = true;
    resultActions.hidden = true;
    status.textContent = "";
  }

  function showScores() {
    fillScores(result, run.complete(rotations));
    resultLevel.textContent = levelTitle(levelIndex);
    status.textContent = "LEVEL COMPLETE";
    result.hidden = false;
    resultActions.hidden = false;
    const summary = run.summary();
    next.hidden = Boolean(summary);
    replay.hidden = finalClose.hidden = !summary;
    if (!summary) {
      status.focus();
      return;
    }

    fillScores(finish, summary);
    levelScores.replaceChildren(...summary.results.map(({ points, basePoints }, index) => {
      const row = document.createElement("div");
      const label = document.createElement("dt");
      const value = document.createElement("dd");
      label.lang = "en";
      label.textContent = levelTitle(index);
      value.textContent = numbers.format(points) + " / " + numbers.format(basePoints);
      row.append(label, value);
      return row;
    }));
    rank.textContent = summary.rank;
    rankNote.textContent = strings.rankNotes[summary.rank];
    title.textContent = "CIRCUIT COMPLETE";
    finish.hidden = false;
  }

  function showFinalScore(lastCell) {
    finalTitle.focus({ preventScroll: true });
    const scrollTop = dialog.scrollTop;
    const animation = lastCell?.getAnimations().find(item => item.animationName === "circuit-power-pulse");
    function scrollToScore() {
      if (!dialog.open || finish.hidden || !lastCell?.isConnected || document.activeElement !== finalTitle
        || Math.abs(dialog.scrollTop - scrollTop) > 1) return;
      finish.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
    if (animation) animation.finished.then(scrollToScore, scrollToScore);
    else scrollToScore();
  }

  function updatePower() {
    const { powered, complete, paths } = puzzle.findConnection(level, currentMasks());
    cells.forEach(({ element }, index) => element.classList.toggle("circuit-powered", powered.has(index)));
    checkpointLabel.textContent = level.checkpoints.filter(index => powered.has(index)).length + " / " + level.checkpoints.length;
    if (!complete || solved) return;

    solved = true;
    clearHint();
    hintButton.disabled = true;
    cells.filter(({ element }) => element.localName === "button").forEach(({ element }) => {
      element.setAttribute("aria-disabled", "true");
    });
    showScores();
    if (levelIndex === levels.length - 1) {
      // Follow the actual paths to all required terminals. Shared sections pulse once.
      let lastCell;
      let lastDepth = -1;
      for (const [index, depth] of paths) {
        const element = cells[index].element;
        element.style.setProperty("--circuit-delay", (depth * 66) + "ms");
        element.classList.add("circuit-pulse");
        if (depth > lastDepth) {
          lastDepth = depth;
          lastCell = element;
        }
      }
      showFinalScore(lastCell);
    }
  }

  function beginLevel(index) {
    if (!run.begin(index)) return;
    levelIndex = index;
    level = puzzle.buildLevel(levels[index]);
    clearHint();
    solved = false;
    rotations = 0;
    intro.hidden = true;
    game.hidden = false;
    hideScores();
    title.textContent = "CIRCUIT CHALLENGE";
    levelLabel.textContent = "LEVEL " + String(index + 1).padStart(2, "0") + " – " + level.name;
    game.dataset.size = level.size;
    board.style.setProperty("--circuit-size", level.size);
    rotationLabel.textContent = rotations;
    updateHintCount();
    checkpointLabel.parentElement.hidden = !level.checkpoints.length;
    goal.hidden = !level.checkpoints.length;
    goal.textContent = level.checkpoints.length ? strings.goal(level.checkpoints.length) : "";
    hintButton.disabled = false;

    cells = level.masks.map((mask, position) => {
      const terminal = level.terminals.get(position);
      const movable = puzzle.isMovable(level, position);
      const fixed = Boolean(mask && !movable && !terminal);
      const element = document.createElement(movable ? "button" : "span");
      const turns = level.startTurns[position];
      element.className = "circuit-cell";
      if (movable) {
        element.type = "button";
        element.dataset.circuitCell = position;
        element.tabIndex = -1;
      } else if (terminal) {
        element.dataset.circuitTerminal = terminal;
        element.classList.add("circuit-cell-terminal");
        element.setAttribute("role", "img");
        element.setAttribute("aria-label", strings[terminal] + ". " + coordinate(position));
      } else if (fixed) {
        element.setAttribute("role", "img");
        element.dataset.circuitFixed = position;
      } else {
        element.classList.add("circuit-cell-empty");
        element.setAttribute("aria-hidden", "true");
      }
      if (mask) element.append(drawCell(mask, terminal, fixed));
      const cell = { mask, turns, terminal, element, fixed };
      updateCell(cell, position);
      return cell;
    });
    board.replaceChildren(...cells.map(({ element }) => element));
    cells[level.hintRoute.find(position => puzzle.isMovable(level, position))].element.focus();
    updatePower();
  }

  function openChallenge(node) {
    if (document.querySelector("dialog[open]")) return;
    opener = node;
    scrollPosition = { left: scrollX, top: scrollY, behavior: "instant" };
    intro.hidden = false;
    game.hidden = true;
    hideScores();
    clearHint();
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
    rotations += 1;
    rotationLabel.textContent = rotations;
    if (hint === index) clearHint();
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
    let index = puzzle.neighbor(Number(event.target.dataset.circuitCell), direction, level.size);
    while (index >= 0) {
      if (cells[index].element.localName === "button") {
        cells[index].element.focus();
        return;
      }
      index = puzzle.neighbor(index, direction, level.size);
    }
  });

  start.addEventListener("click", () => beginLevel(0));
  next.addEventListener("click", () => {
    if (solved && !next.hidden) beginLevel(levelIndex + 1);
  });
  retry.addEventListener("click", () => {
    if (solved) beginLevel(levelIndex);
  });
  replay.addEventListener("click", () => {
    if (!finish.hidden) beginLevel(0);
  });
  hintButton.addEventListener("click", () => {
    if (solved) return;
    clearHint();
    const masks = currentMasks();
    const candidate = puzzle.getHint(level, masks);
    if (run.showHint(candidate)) {
      hint = candidate;
      updateHintCount();
    } else if (candidate !== undefined) {
      hint = level.hintRoute.find(index => run.hasHint(index) && masks[index] !== level.masks[index]);
      if (hint === undefined) hintMessage.textContent = strings.hintLimit;
    }
    if (hint === undefined) return;
    cells[hint].element.classList.add("circuit-hint");
    hintMessage.textContent = coordinate(hint) + ". " + strings.hint;
  });
  dialog.querySelectorAll("[data-circuit-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button:not(:disabled)")].filter((button) => button.tabIndex >= 0 && !button.closest("[hidden]"));
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
