/* The browser and the offline tests share the same grid and electrical rules. */
const blackridgeCircuitPuzzles = (() => {
  "use strict";

  // Paths use row letters and one-based columns. Branches that stop short of
  // the terminals are intentional decoys. The seed only changes the starting angles.
  const configurations = [
    {
      name: "INITIAL POWER", size: 5, seed: 675, source: "C1", output: "C5", checkpoints: [], fixed: [],
      paths: [
        "C1 C2 D2 E2 E3 E4 D4 C4 C5",
        "C2 B2 B3 B4 A4 A5 B5",
        "A1 B1 B2 A2 A3",
        "C3 D3", "D1 E1", "D5 E5",
      ],
    },
    {
      name: "CIRCUIT ROUTING", size: 6, seed: 1615, source: "C1", output: "C6", checkpoints: ["F2"], fixed: [],
      paths: [
        "C1 C2 B2 A2 A3 B3 B4 C4 D4 D5 C5 C6",
        "D4 E4 F4 F3 F2",
        "C2 D2 D3 E3 E2 E1 F1",
        "A3 A4 A5 B5 B6 A6",
        "C5 B5", "D5 D6 E6 F6 F5 E5", "B1 A1", "C3 D3",
      ],
    },
    {
      name: "BLACKRIDGE CORE", size: 7, seed: 2, source: "D1", output: "D7", checkpoints: ["A2", "G6"],
      fixed: ["C5", "D3", "D5", "E5", "B6"],
      paths: [
        "D1 D2 C2 C3 C4 B4 B3 B2 B1 A1 A2",
        "D2 E2 E3 E4 F4 F3 F2 G2 G3 G4 G5 F5 F6 G6",
        "F6 F7 E7 E6 D6 D7",
        "B4 A4 A3 B3", "A4 A5 A6 A7 B7", "B5 C5 D5 E5", "E1 F1 G1",
      ],
      decoys: { B6: "NS", C1: "NE", C6: "NSW", C7: "SW", D3: "NS", D4: "NEW", G7: "NW" },
    },
  ];

  const directions = [
    { row: -1, column: 0 }, { row: 0, column: 1 }, { row: 1, column: 0 }, { row: 0, column: -1 },
  ];

  function neighbor(index, { row, column }, size) {
    const nextRow = Math.floor(index / size) + row;
    const nextColumn = index % size + column;
    if (nextRow < 0 || nextRow >= size || nextColumn < 0 || nextColumn >= size) return -1;
    return nextRow * size + nextColumn;
  }

  function rotate(mask, turns) {
    // Bits are north, east, south and west. Clockwise rotation wraps the fourth bit.
    const steps = turns % 4;
    return ((mask << steps) | (mask >> (4 - steps))) & 15;
  }

  function findConnection(level, masks) {
    const { size, source, targets } = level;
    const queue = [source];
    const powered = new Map([[source, { previous: null, depth: 0 }]]);
    for (let i = 0; i < queue.length; i += 1) {
      const index = queue[i];
      directions.forEach((direction, port) => {
        if (!(masks[index] & (1 << port))) return;
        const adjacent = neighbor(index, direction, size);
        const opposite = 1 << ((port + 2) % 4);
        if (adjacent < 0 || powered.has(adjacent) || !(masks[adjacent] & opposite)) return;
        powered.set(adjacent, { previous: index, depth: powered.get(index).depth + 1 });
        queue.push(adjacent);
      });
    }

    const complete = targets.every(target => powered.has(target));
    const paths = new Map();
    if (complete) {
      for (const target of targets) {
        for (let index = target; index !== null && !paths.has(index);) {
          const { previous, depth } = powered.get(index);
          paths.set(index, depth);
          index = previous;
        }
      }
    }
    return { powered, complete, paths };
  }

  function buildLevel(config) {
    const { size, name } = config;
    function position(location) {
      const match = /^([A-Z])([1-9][0-9]*)$/.exec(location);
      const row = match ? match[1].charCodeAt(0) - 65 : -1;
      const column = match ? Number(match[2]) - 1 : -1;
      if (row < 0 || row >= size || column < 0 || column >= size) {
        throw new Error(name + ": invalid circuit location " + location);
      }
      return row * size + column;
    }
    const source = position(config.source);
    const output = position(config.output);
    const checkpoints = config.checkpoints.map(position);
    const targets = [...checkpoints, output];
    const fixed = new Set(config.fixed.map(position));
    const terminals = new Map([[source, "source"], [output, "output"],
      ...checkpoints.map(index => [index, "checkpoint"])]);
    const masks = Array(size * size).fill(0);

    for (const path of config.paths) {
      const cells = path.split(/\s+/).map(position);
      for (let i = 1; i < cells.length; i += 1) {
        const [from, to] = [cells[i - 1], cells[i]];
        const port = directions.findIndex(direction => neighbor(from, direction, size) === to);
        if (port < 0) throw new Error(name + ": a path contains non-adjacent cells");
        masks[from] |= 1 << port;
        masks[to] |= 1 << ((port + 2) % 4);
      }
    }
    // Standalone pieces can suggest a route without adding ports to a solution tile.
    for (const [location, ports] of Object.entries(config.decoys ?? {})) {
      const index = position(location);
      if (masks[index] || !/^[NESW]+$/.test(ports)) throw new Error(name + ": invalid decoy at " + location);
      for (const port of ports) masks[index] |= 1 << "NESW".indexOf(port);
    }
    for (const index of terminals.keys()) {
      if (![1, 2, 4, 8].includes(masks[index])) {
        throw new Error(name + ": every terminal needs exactly one port");
      }
    }
    if (terminals.size !== targets.length + 1 || [...fixed].some(index => !masks[index] || terminals.has(index))) {
      throw new Error(name + ": invalid fixed cells or duplicate terminals");
    }
    const level = { name, size, source, output, checkpoints, targets, fixed, terminals, masks };
    const solution = findConnection(level, masks);
    if (!solution.complete) throw new Error(name + ": the authored circuit is not solvable");
    level.hintRoute = [...solution.paths].sort((a, b) => a[1] - b[1]).map(([index]) => index);

    // Deterministically rotate the verified solution. Straight wires have two
    // distinct orientations, and a crossing with all four ports never needs a turn.
    let seed = config.seed >>> 0;
    level.startTurns = masks.map((mask, index) => {
      if (!isMovable(level, index)) return 0;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return (seed >>> 16) % (mask === 5 || mask === 10 ? 2 : 4);
    });
    if (findConnection(level, masks.map((mask, index) => rotate(mask, level.startTurns[index]))).complete) {
      throw new Error(name + ": choose a scramble that starts unsolved");
    }
    return level;
  }

  function isMovable(level, index) {
    const mask = level.masks[index];
    return Boolean(mask && mask !== 15 && !level.terminals.has(index) && !level.fixed.has(index));
  }

  function getHint(level, masks) {
    // Point to the first misaligned tile on one verified solution, without
    // showing its target orientation or ruling out other valid paths.
    return level.hintRoute.find(index => isMovable(level, index) && masks[index] !== level.masks[index]);
  }

  return { configurations, directions, neighbor, rotate, findConnection, buildLevel, isMovable, getHint };
})();

if (typeof module !== "undefined" && module.exports) module.exports = blackridgeCircuitPuzzles;
