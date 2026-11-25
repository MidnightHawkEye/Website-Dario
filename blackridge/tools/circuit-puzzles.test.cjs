const assert = require("node:assert/strict");
const { test } = require("node:test");
const puzzle = require("../js/circuit-puzzles.js");
const { rules: scoreRules } = require("../js/circuit-score.js");

const levels = puzzle.configurations.map(puzzle.buildLevel);
const startMasks = level => level.masks.map((mask, index) => puzzle.rotate(mask, level.startTurns[index]));

function shortestSolution(level, start, upperBound) {
  // Cost to orient each tile so that it exposes all ports a route needs.
  const steps = level.masks.map((_, index) => Array.from({ length: 16 }, (_, ports) => {
    const orientations = puzzle.isMovable(level, index) ? 4 : 1;
    for (let turns = 0; turns < orientations; turns += 1) {
      if ((puzzle.rotate(start[index], turns) & ports) === ports) return turns;
    }
    return Infinity;
  }));
  const required = new Uint8Array(start.length);
  const routeLists = level.targets.map(target => {
    const routes = [];
    function walk(index, cost, incoming) {
      if (cost > upperBound) return;
      if (index === target) {
        routes.push({ cost, tiles: [...required.entries()].filter(([, ports]) => ports) });
        return;
      }
      puzzle.directions.forEach((direction, port) => {
        const next = puzzle.neighbor(index, direction, level.size);
        if (next < 0 || next === level.source || required[next]) return;
        const outgoing = incoming | (1 << port);
        const opposite = 1 << ((port + 2) % 4);
        const nextCost = cost + steps[index][outgoing] - steps[index][incoming] + steps[next][opposite];
        if (nextCost > upperBound) return;
        required[index] = outgoing;
        required[next] = opposite;
        walk(next, nextCost, opposite);
        required[next] = 0;
        required[index] = incoming;
      });
    }
    walk(level.source, 0, 0);
    return routes.sort((a, b) => a.cost - b.cost);
  }).sort((a, b) => a.length - b.length);

  // Any connected layout contains a simple path to each terminal. Test the
  // union of those paths, accounting for common tiles once and rejecting
  // unions whose joint port requirements cannot fit a single orientation.
  let best = { cost: Infinity };
  function combine(depth, cost) {
    if (depth === routeLists.length) {
      best = { cost, masks: start.map((mask, index) => puzzle.rotate(mask, steps[index][required[index]])) };
      return;
    }
    for (const route of routeLists[depth]) {
      if (route.cost >= best.cost) break;
      const previous = [];
      let total = cost;
      for (const [index, ports] of route.tiles) {
        const old = required[index];
        const combined = old | ports;
        total += steps[index][combined] - steps[index][old];
        if (total > upperBound || total >= best.cost) break;
        previous.push([index, old]);
        required[index] = combined;
      }
      if (total <= upperBound && total < best.cost) combine(depth + 1, total);
      for (const [index, ports] of previous) required[index] = ports;
    }
  }
  combine(0, 0);
  return best;
}

test("one clockwise quarter-turn maps north to east and west to north", () => {
  assert.equal(puzzle.rotate(1 | 8, 1), 1 | 2);
  assert.equal(puzzle.rotate(1 | 8, 4), 1 | 8);
});

test("power starts at the configured source and requires matching ports without wrapping rows", () => {
  const level = { size: 2, source: 1, targets: [3] };
  assert.deepEqual([...puzzle.findConnection(level, [2, 8, 1, 1]).powered.keys()], [1, 0]);
  assert.deepEqual([...puzzle.findConnection(level, [0, 6, 8, 8]).powered.keys()], [1]);
  assert.deepEqual([...puzzle.findConnection(level, [0, 6, 8, 1]).powered.keys()], [1, 3]);
});

test("an output with no connection or a missing checkpoint blocks completion", () => {
  for (const level of levels) {
    for (const target of level.targets) {
      const masks = [...level.masks];
      masks[target] = 0;
      const result = puzzle.findConnection(level, masks);
      assert.equal(result.powered.has(level.source), true);
      assert.equal(result.powered.has(target), false);
      if (target !== level.output) assert.equal(result.powered.has(level.output), true);
      assert.equal(result.complete, false);
      assert.equal(result.paths.size, 0);
    }
  }
});

for (const [index, level] of levels.entries()) {
  const [minimum, maximum] = [[8, 12], [15, 24], [25, 40]][index];

  test(level.name + " has a valid, deterministic scramble and useful hints", () => {
    assert.equal(level.size, index + 5);
    assert.equal(level.checkpoints.length, index);
    assert.equal(level.fixed.size > 0, index === 2);
    assert.deepEqual(level.startTurns, puzzle.buildLevel(puzzle.configurations[index]).startTurns);
    const masks = startMasks(level);
    assert.equal(puzzle.findConnection(level, masks).complete, false);
    let turns = 0;
    for (const [position, start] of level.startTurns.entries()) {
      if (!puzzle.isMovable(level, position)) assert.equal(start, 0);
    }
    for (const position of level.fixed) assert.equal(puzzle.isMovable(level, position), false);
    while (!puzzle.findConnection(level, masks).complete && turns < level.masks.length * 3) {
      const hint = puzzle.getHint(level, masks);
      assert.ok(puzzle.isMovable(level, hint) && level.hintRoute.includes(hint));
      assert.notEqual(masks[hint], level.masks[hint]);
      masks[hint] = puzzle.rotate(masks[hint], 1);
      turns += 1;
    }
    const result = puzzle.findConnection(level, masks);
    assert.equal(result.complete, true);
    assert.ok(level.targets.every(target => result.paths.has(target)));
  });

  test(level.name + " requires " + minimum + "–" + maximum + " rotations", t => {
    const start = startMasks(level);
    let upperBound = 0;
    for (const position of level.hintRoute) {
      let mask = start[position];
      while (mask !== level.masks[position]) {
        mask = puzzle.rotate(mask, 1);
        upperBound += 1;
      }
    }
    const solution = shortestSolution(level, start, upperBound);
    t.diagnostic("Minimum: " + solution.cost + " | Authored route: " + upperBound);
    assert.ok(solution.cost >= minimum && solution.cost <= maximum, "Shortest solution: " + solution.cost);
    assert.equal(scoreRules[index].parRotations, solution.cost, "The scoring benchmark matches the shortest solution");
    assert.equal(puzzle.findConnection(level, solution.masks).complete, true);
  });
}
