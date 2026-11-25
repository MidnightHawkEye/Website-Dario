const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");
const { getFacts } = require("./faq-facts.cjs");

const data = Promise.all([
  import("../js/faq-data.mjs"),
  import("../js/faq-match.mjs"),
  import("../js/faq-facts.mjs"),
]).then(([{ getFaqEntries, suggestions, routes }, { createMatcher, normalize }, { facts }]) => {
  const entries = getFaqEntries(false);
  return { entries, match: createMatcher(entries), normalize, facts, routes, suggestions, getFaqEntries };
});

test("German cleaning variants, typos and punctuation", async () => {
  const { match } = await data;
  for (const question of ["Was kostet eine PC-Reinigung?", "Wie teuer ist es, meinen Computer reinigen zu lassen?",
    "Reinigt ihr auch Gaming-PCs?", "Ich möchte meinen Rechner reinigen lassen.", "PC putzen Preis?",
    "Was kostet eine Innenreinigung?", "PC REINGUNG???", "Wann kann ich meinen Rechner säubern lassen?"]) {
    assert.deepEqual(match(question).map(item => item.id), ["cleaning"], question);
  }
});

test("English variants, personal parts and specific cleaning type", async () => {
  const { match } = await data;
  for (const [question, id] of [
    ["How much does PC cleaning cost?", "cleaning"], ["Can you clean my gaming PC?", "cleaning"],
    ["My computer needs a cleanig.", "cleaning"], ["Can you assemble a gaming PC?", "build"],
    ["I need a new computer.", "build"], ["Baut ihr PCs zusammen?", "build"], ["Ich brauche einen neuen Computer.", "build"],
    ["Can I bring my own PC components?", "parts"], ["Kann ich eigene Hardware mitbringen?", "parts"],
    ["Reinigung mit Wärmeleitpaste am PC?", "deep-cleaning"], ["Waermeleitpaste erneuern?", "deep-cleaning"],
    ["Do you install Windows?", "windows"], ["Can you replace my graphics card?", "upgrade"],
    ["Kann ich dazu eine Offerte anfragen?", "process"], ["How can I get in touch?", "contact"],
  ]) assert.deepEqual(match(question).map(item => item.id), [id], question);
});

test("ties show choices and unsupported questions do not select a topic", async () => {
  const { match, normalize } = await data;
  assert.equal(normalize("  GRÖSSE, Lüfter!  "), "grosse lufter");
  assert.deepEqual(match("Can you clean and build PCs?").map(item => item.id).sort(), ["build", "cleaning"]);
  for (const question of ["", "!!!", "Wie ist das Wetter?", "How much is my flight?", "Build a website", "Can you clean my car?",
    "Do you clean windows?", '<img src=x onerror="window.bad=true">']) {
    assert.deepEqual(match(question), [], question);
  }
});

test("all suggestions resolve, both languages point to existing routes and anchors", async () => {
  const { entries, match, routes, suggestions } = await data;
  const site = path.join(__dirname, "..");
  for (const language of ["de", "en"]) {
    for (const id of suggestions) {
      const item = entries.find(entry => entry.id === id);
      assert.equal(match(item[language].question)[0]?.id, id);
    }
    for (const entry of entries) {
      assert.ok(entry[language].answer.length > 0);
      for (const destination of entry.links) {
        const [section, id] = destination.split("#");
        const html = await fs.readFile(path.join(site, routes[language][section], "index.html"), "utf8");
        if (id) assert.ok(html.includes('id="' + id + '"'), destination);
      }
    }
  }
});

test("prices and services match the rendered pages, and contact copy follows the form status", async () => {
  const { facts, getFaqEntries, routes } = await data;
  for (const language of ["de", "en"]) {
    const read = name => fs.readFile(path.join(__dirname, "..", routes[language][name], "index.html"), "utf8");
    assert.deepEqual(facts[language], getFacts(await read("pricing"), await read("services")));
  }
  const contact = enabled => getFaqEntries(enabled).find(entry => entry.id === "contact");
  assert.match(contact(false).de.answer, /derzeit pausiert/);
  assert.match(contact(false).en.answer, /currently paused/);
  assert.match(contact(true).de.answer, /Kontaktformular verwenden/);
  assert.match(contact(true).en.answer, /use the contact form/);
});
