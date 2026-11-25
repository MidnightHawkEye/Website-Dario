/* Scoring is shared by the browser and the local tests. Runs live in memory. */
const blackridgeCircuitScore = (() => {
  "use strict";

  const rules = [
    { basePoints: 1000, parRotations: 9, rotationPenalty: 15, hintPenalty: 150 },
    { basePoints: 1500, parRotations: 15, rotationPenalty: 20, hintPenalty: 250 },
    { basePoints: 2000, parRotations: 32, rotationPenalty: 25, hintPenalty: 350 },
  ];
  const hintLimit = 3;
  const ranks = [
    { minimum: 4000, name: "BLACKRIDGE MASTER" },
    { minimum: 3000, name: "CIRCUIT ENGINEER" },
    { minimum: 2000, name: "SYSTEM TECHNICIAN" },
    { minimum: 0, name: "CIRCUIT EXPLORER" },
  ];
  const maxPoints = rules.reduce((total, rule) => total + rule.basePoints, 0);

  function scoreLevel(rule, rotations, hintsUsed) {
    const { basePoints, parRotations, rotationPenalty, hintPenalty } = rule;
    const extraRotations = Math.max(0, rotations - parRotations);
    const rotationDeduction = extraRotations * rotationPenalty;
    const hintDeduction = hintsUsed * hintPenalty;
    const points = Math.max(0, basePoints - rotationDeduction - hintDeduction);
    return { rotations, hintsUsed, parRotations, extraRotations, rotationDeduction, hintDeduction, points, basePoints };
  }

  function rankFor(points) {
    return ranks.find(rank => points >= rank.minimum).name;
  }

  function createRun() {
    const results = [];
    const hints = new Set();
    let levelIndex;

    function begin(index) {
      if (!rules[index] || index > results.length) return false;
      // Discard the current level on retry. Earlier levels keep their scores.
      results.length = index;
      hints.clear();
      levelIndex = index;
      return true;
    }

    function showHint(index) {
      if (levelIndex === undefined || index === undefined || results[levelIndex]) return false;
      if (hints.has(index)) return true;
      if (hints.size >= hintLimit) return false;
      hints.add(index);
      return true;
    }

    function complete(rotations) {
      if (levelIndex === undefined) return null;
      if (results[levelIndex]) return results[levelIndex];
      const result = scoreLevel(rules[levelIndex], rotations, hints.size);
      results[levelIndex] = result;
      return result;
    }

    function summary() {
      if (results.length !== rules.length) return null;
      const total = { points: 0, rotations: 0, hintsUsed: 0, maxPoints };
      for (const result of results) {
        total.points += result.points;
        total.rotations += result.rotations;
        total.hintsUsed += result.hintsUsed;
      }
      total.results = [...results];
      total.rank = rankFor(total.points);
      return total;
    }

    return { begin, showHint, complete, summary, hasHint: index => hints.has(index), hintCount: () => hints.size };
  }

  return { rules, hintLimit, scoreLevel, rankFor, createRun };
})();

if (typeof module !== "undefined" && module.exports) module.exports = blackridgeCircuitScore;
