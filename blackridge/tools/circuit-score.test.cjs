const assert = require("node:assert/strict");
const { test } = require("node:test");
const { rules, hintLimit, scoreLevel, rankFor, createRun } = require("../js/circuit-score.js");

test("an efficient solution can earn each level maximum and 4500 points overall", () => {
  const run = createRun();
  assert.equal(run.summary(), null);
  assert.equal(run.complete(0), null);
  for (const [index, rule] of rules.entries()) {
    assert.ok(run.begin(index));
    assert.equal(scoreLevel(rule, rule.parRotations - 1, 0).points, rule.basePoints);
    assert.equal(run.complete(rule.parRotations).points, rule.basePoints);
  }
  assert.equal(run.summary().points, 4500);
  assert.equal(run.summary().maxPoints, 4500);
  assert.equal(run.summary().rank, "BLACKRIDGE MASTER");
});

test("the rotation deduction applies to extra rotations only", () => {
  assert.deepEqual(scoreLevel(rules[0], 13, 1), {
    rotations: 13, hintsUsed: 1, parRotations: 9, extraRotations: 4,
    rotationDeduction: 60, hintDeduction: 150, points: 790, basePoints: 1000,
  });
  assert.equal(scoreLevel(rules[1], 18, 0).rotationDeduction, 60);
  assert.equal(scoreLevel(rules[2], 34, 0).rotationDeduction, 50);
});

test("distinct hints count once per attempt and stop at three", () => {
  const run = createRun();
  run.begin(0);
  assert.equal(run.showHint(undefined), false);
  assert.equal(run.hintCount(), 0);
  assert.equal(run.showHint(0), true);
  assert.equal(run.showHint(0), true);
  assert.equal(run.hintCount(), 1);
  assert.equal(run.showHint(10), true);
  assert.equal(run.showHint(12), true);
  assert.equal(run.showHint(13), false);
  assert.equal(run.showHint(10), true);
  assert.equal(run.hintCount(), hintLimit);
  assert.equal(run.complete(9).points, 1000 - 3 * 150);
  assert.equal(run.showHint(10), false);
  run.begin(1);
  assert.equal(run.hintCount(), 0);
  assert.equal(run.hasHint(10), false);
  assert.equal(run.showHint(10), true);
  assert.equal(run.complete(15).hintDeduction, 250);
  assert.equal(scoreLevel(rules[2], 32, 2).hintDeduction, 700);
});

test("scores are capped at the level maximum and floored at zero", () => {
  for (const rule of rules) {
    assert.equal(scoreLevel(rule, 0, 0).points, rule.basePoints);
    assert.equal(scoreLevel(rule, 1000, hintLimit).points, 0);
  }
});

test("results are set once, then replaced on retry and cleared on replay", () => {
  const run = createRun();
  assert.equal(run.begin(1), false);
  run.begin(0);
  run.showHint(6);
  const first = run.complete(13);
  assert.equal(first.points, 790);
  assert.equal(run.complete(9), first);
  run.begin(1);
  assert.equal(run.summary(), null);
  run.showHint(2);
  run.complete(15);
  run.begin(1);
  assert.equal(run.hintCount(), 0);
  assert.equal(run.complete(16).points, 1480);
  run.begin(2);
  run.showHint(8);
  run.showHint(9);
  run.complete(35);
  assert.deepEqual(run.summary().results.map(result => result.points), [790, 1480, 1225]);
  assert.deepEqual([run.summary().rotations, run.summary().hintsUsed, run.summary().points], [64, 3, 3495]);
  assert.equal(run.summary().rank, "CIRCUIT ENGINEER");
  run.begin(2);
  assert.equal(run.summary(), null);
  run.complete(32);
  assert.deepEqual(run.summary().results.map(result => result.points), [790, 1480, 2000]);
  assert.equal(run.summary().points, 4270);
  run.begin(0);
  assert.equal(run.hintCount(), 0);
  assert.equal(run.summary(), null);
  assert.equal(run.begin(2), false);
  assert.equal(run.complete(9).points, 1000);
});

test("the exact rank boundaries select the correct award", () => {
  for (const [points, name] of [
    [0, "CIRCUIT EXPLORER"], [1999, "CIRCUIT EXPLORER"],
    [2000, "SYSTEM TECHNICIAN"], [2999, "SYSTEM TECHNICIAN"],
    [3000, "CIRCUIT ENGINEER"], [3999, "CIRCUIT ENGINEER"],
    [4000, "BLACKRIDGE MASTER"], [4500, "BLACKRIDGE MASTER"],
  ]) {
    assert.equal(rankFor(points), name);
  }
});
