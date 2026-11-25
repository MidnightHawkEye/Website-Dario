export function normalize(text) {
  return text.toLowerCase().replace(/ß/g, "ss").normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function oneTypo(a, b) {
  if (Math.min(a.length, b.length) < 5 || Math.max(a.length, b.length) < 6 || Math.abs(a.length - b.length) > 1) return false;
  if (a.length > b.length) [a, b] = [b, a];
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length !== b.length) return a.slice(i) === b.slice(i + 1);
  if (a.slice(i + 1) === b.slice(i + 1)) return true;
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
}

function strength(term, words) {
  for (let i = 0; i <= words.length - term.length; i++) {
    if (term.every((word, j) => word === words[i + j])) return 2;
  }
  for (let i = 0; i <= words.length - term.length; i++) {
    let typos = 0;
    const close = term.every((word, j) => word === words[i + j] || (++typos === 1 && oneTypo(word, words[i + j])));
    if (close) return 1;
  }
  return 0;
}

export function createMatcher(entries) {
  const data = entries.map(entry => {
    const compile = values => (values ?? []).map(term => normalize(term).split(" "));
    return {
      entry,
      terms: compile([...entry.de.terms, ...entry.en.terms]),
      weak: compile(entry.weak),
      context: compile(entry.context),
      groups: (entry.requires ?? []).map(compile),
      questions: [entry.de.question, entry.en.question, ...(entry.shortQueries ?? [])].map(normalize),
    };
  });

  return function matchFaq(input) {
    if (/<\/?[a-z][^>]*>/i.test(input)) return [];
    const normalized = normalize(input);
    if (!normalized) return [];
    const words = normalized.split(" ");
    const results = data.flatMap(({ entry, terms, weak, context, groups, questions }) => {
      if (questions.includes(normalized)) return [{ entry, score: 24 }];
      if (!groups.every(group => group.some(term => strength(term, words)))) return [];
      const candidates = context.some(term => strength(term, words)) ? terms.concat(weak) : terms;
      const best = Math.max(0, ...candidates.map(term => {
        const match = strength(term, words);
        return match ? 4 + match + Math.min(term.length - 1, 3) + groups.length * 2 + (entry.specificity ?? 0) : 0;
      }));
      return best ? [{ entry, score: best }] : [];
    });
    results.sort((a, b) => b.score - a.score);
    // A broad fallback (e.g. "price") is useful only without a specific topic.
    const specific = results.filter(({ entry }) => !entry.general);
    const ranked = specific.length ? specific : results;
    return ranked.filter(({ score }) => ranked[0].score - score <= 1).slice(0, 3).map(({ entry }) => entry);
  };
}
