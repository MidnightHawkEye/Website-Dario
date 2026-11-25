const fs = require("node:fs");
const path = require("node:path");
const { posix } = path;
const translations = require("./english.json");
const { getFacts } = require("./faq-facts.cjs");

const root = path.resolve(__dirname, "..");
// Change this during a domain migration and regenerate both languages.
const site = "https://dario-exe.ch/blackridge/";
const routes = {
  "": "en/",
  "leistungen/": "en/services/",
  "preise/": "en/pricing/",
  "ueber-mich/": "en/about/",
  "kontakt/": "en/contact/",
  "impressum/": "en/imprint/",
  "datenschutz/": "en/privacy/",
};
const languages = { de: "de-CH", en: "en" };
const tokens = /<!--[\s\S]*?-->|<(?:"[^"]*"|'[^']*'|[^'">])+>|[^<]+/g;
const translatable = /\b(aria-label|alt|title|placeholder|content)="([^"]*)"/g;
const flatten = value => value.trim().replace(/\s+/g, " ");
const absolute = route => new URL(route, site).href;
const englishPrivacyLinks = {
  "https://www.whatsapp.com/legal/privacy-policy-eea?lang=de": "https://www.whatsapp.com/legal/privacy-policy-eea?lang=en",
  "https://policies.google.com/privacy?hl=de": "https://policies.google.com/privacy?hl=en",
  "https://policies.google.com/privacy/frameworks?hl=de": "https://policies.google.com/privacy/frameworks?hl=en",
};

function relative(from, to) {
  const destination = posix.relative("/" + from, "/" + to) || ".";
  return to.endsWith("/") || !to ? destination + "/" : destination;
}

function englishLink(value, de, en) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(value)) {
    if (/^https:\/\/wa\.me\/\d+\?text=/.test(value)) {
      return value.split("?")[0] + "?text=" + encodeURIComponent("Hello, I visited your Blackridge Technical website and have a question.");
    }
    return englishPrivacyLinks[value] ?? value;
  }
  const match = value.match(/^([^?#]*)(.*)$/);
  const resolved = posix.normalize(posix.join("/" + de, match[1])).slice(1);
  const legacy = { "impressum.html": "impressum/", "datenschutz.html": "datenschutz/" };
  const translated = routes[legacy[resolved] ?? resolved];
  return relative(en, translated ?? resolved) + match[2];
}

function translatePage(source, de, en) {
  const entries = { ...translations[""], ...translations[de] };
  const text = value => {
    const key = flatten(value);
    if (!key) return value;
    if (!Object.hasOwn(entries, key)) throw new Error((de || "Home") + " has an untranslated string: " + key);
    return value.replace(/\S[\s\S]*\S|\S/, () => entries[key]);
  };

  // Keep the form's existing submitted subject values while translating what visitors see.
  if (de === "kontakt/") source = source.replace(/<option>([^<]+)<\/option>/g, '<option value="$1">$1</option>');
  return source.match(tokens).map(token => {
    if (!token.startsWith("<")) return text(token);
    if (token.startsWith("<!--")) return token;
    if (token.startsWith("<html ")) return token.replace('lang="de-CH"', 'lang="en"');
    if (!/^<meta (?:charset|name="viewport"|name="theme-color")/.test(token)) {
      token = token.replace(translatable, (_, attribute, value) => attribute + '="' + text(value).replace(/"/g, "&quot;") + '"');
    }
    return token
      .replace(/\b(href|src)="([^"]+)"/g, (_, attr, href) => attr + '="' + englishLink(href, de, en) + '"')
      .replace(/\bsrcset="([^"]+)"/g, (_, values) => 'srcset="' + values.split(/,\s*/).map(entry => {
        const [url, ...descriptor] = entry.trim().split(/\s+/);
        return [englishLink(url, de, en), ...descriptor].join(" ");
      }).join(", ") + '"');
  }).join("")
    .replace("Privacy<wbr> Notice", "Privacy Notice")
    .replace(/(<a href="\.\.\/contact\/">)Contact Form(?=<\/a>)/g, "$1contact form")
    .replace(/(?<=<\/a>) +([.,])/g, "$1")
    .replace(/(Privacy Notice<\/a>) <\/label>/g, "$1.</label>");
}

function metadata(html, selected, de, en) {
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)[1];
  const link = absolute(selected === "de" ? de : en);
  return [
    '<link rel="canonical" href="' + link + '">',
    '<link rel="alternate" hreflang="de-CH" href="' + absolute(de) + '">',
    '<link rel="alternate" hreflang="en" href="' + absolute(en) + '">',
    '<link rel="alternate" hreflang="x-default" href="' + absolute(de) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Blackridge Technical">',
    '<meta property="og:title" content="' + title.replace(/"/g, "&quot;") + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + link + '">',
    '<meta property="og:locale" content="' + (selected === "de" ? "de_CH" : "en_GB") + '">',
    '<meta property="og:locale:alternate" content="' + (selected === "de" ? "en_GB" : "de_CH") + '">',
    '<meta property="og:image" content="' + absolute("assets/images/hero-setup-eisblau.webp") + '">',
  ].map(line => "  " + line).join("\n");
}

function addLanguageControls(source, selected, de, en) {
  const current = selected === "de" ? de : en;
  const languageLink = (language, route, label) => '        <a href="' + relative(current, route) + '" lang="' +
    languages[language] + '" hreflang="' + languages[language] + '" aria-label="' + label + '"' +
    (selected === language ? ' aria-current="true"' : "") + '>' + language.toUpperCase() + '</a>';
  const header = [
    '      <!-- language-switch:start -->',
    '      <nav class="language-switch" aria-label="' + (selected === "de" ? "Sprache" : "Language") + '">',
    languageLink("de", de, "Deutsch"),
    '        <span aria-hidden="true">|</span>',
    languageLink("en", en, "English"),
    '      </nav>',
    '      <!-- language-switch:end -->',
  ].join("\n");
  return source.replace(/^<\/head>/m, '  <!-- language-meta:start -->\n' + metadata(source, selected, de, en) + '\n  <!-- language-meta:end -->\n</head>')
    .replace(/^(      <\/nav>\n)(    <\/div>\n  <\/header>)/m, (_, first, last) => first + header + "\n" + last);
}

function sitemap(indexable) {
  const entries = [];
  for (const [de, en] of Object.entries(routes)) {
    if (!indexable.includes(de)) continue;
    for (const route of [de, en]) {
      entries.push("  <url>", "    <loc>" + absolute(route) + "</loc>",
        '    <xhtml:link rel="alternate" hreflang="de-CH" href="' + absolute(de) + '"/>',
        '    <xhtml:link rel="alternate" hreflang="en" href="' + absolute(en) + '"/>',
        '    <xhtml:link rel="alternate" hreflang="x-default" href="' + absolute(de) + '"/>', "  </url>");
    }
  }
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', ...entries, "</urlset>", ""].join("\n");
}

const generated = [];
const indexable = [];
for (const [de, en] of Object.entries(routes)) {
  const file = path.join(root, de, "index.html");
  const raw = fs.readFileSync(file, "utf8");
  const source = raw.replace(/\r\n/g, "\n")
    .replace(/^  <!-- language-meta:start -->[\s\S]*?^  <!-- language-meta:end -->\n/m, "")
    .replace(/^      <!-- language-switch:start -->[\s\S]*?^      <!-- language-switch:end -->\n/m, "");
  const german = addLanguageControls(source, "de", de, en);
  if (!source.includes('name="robots" content="noindex"')) indexable.push(de);
  generated.push([file, raw.includes("\r\n") ? german.replace(/\n/g, "\r\n") : german]);
  generated.push([path.join(root, en, "index.html"), addLanguageControls(translatePage(source, de, en), "en", de, en)]);
}
generated.push([path.join(root, "sitemap.xml"), sitemap(indexable)]);
const pages = new Map(generated);
const faqFacts = Object.fromEntries([["de", "preise/", "leistungen/"], ["en", "en/pricing/", "en/services/"]]
  .map(([language, pricing, services]) => [language, getFacts(
    pages.get(path.join(root, pricing, "index.html")),
    pages.get(path.join(root, services, "index.html")),
  )]));
generated.push([path.join(root, "js/faq-facts.mjs"), "// Generated by tools/build-languages.cjs.\nexport const facts = " +
  JSON.stringify(faqFacts, null, 2) + ";\n"]);
for (const [file, contents] of generated) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, "utf8");
}
