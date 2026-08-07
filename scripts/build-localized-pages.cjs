const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "de");
const translationsPath = path.join(projectRoot, "js", "i18n.js");

const pageConfigurations = [
    {
        source: "index.html",
        output: "index.html",
        germanUrl: "https://dario-exe.ch/de/",
        linkReplacements: [
            ['href="./devlog.html"', 'href="/de/devlog.html"'],
            ['href="./privacy.html"', 'href="/de/privacy.html"']
        ]
    },
    {
        source: "devlog.html",
        output: "devlog.html",
        germanUrl: "https://dario-exe.ch/de/devlog.html",
        linkReplacements: [
            ['href="./index.html#', 'href="/de/#'],
            ['href="./index.html"', 'href="/de/"'],
            ['href="./devlog.html"', 'href="/de/devlog.html"'],
            ['href="./privacy.html"', 'href="/de/privacy.html"']
        ]
    },
    {
        source: "privacy.html",
        output: "privacy.html",
        germanUrl: "https://dario-exe.ch/de/privacy.html",
        linkReplacements: [
            ['href="./index.html"', 'href="/de/"'],
            ['href="./devlog.html"', 'href="/de/devlog.html"']
        ]
    }
];

function loadGermanTranslations() {
    const source = fs.readFileSync(translationsPath, "utf8");
    const match = source.match(
        /const i18nMessages = Object\.freeze\((\{[\s\S]*?\})\);\s*let currentLanguage/
    );

    if (!match) {
        throw new Error("The translation object could not be read.");
    }

    const sandbox = {};
    vm.runInNewContext(
        `this.messages = Object.freeze(${match[1]});`,
        sandbox
    );

    return sandbox.messages.de;
}

function escapeText(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
    return escapeText(value).replaceAll('"', "&quot;");
}

function translateElementContent(html, translations) {
    const translatedElementPattern =
        /<([a-z][\w:-]*)([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi;

    return html.replace(
        translatedElementPattern,
        (element, tagName, attributes, key) => {
            const translation = translations[key];

            if (typeof translation !== "string") {
                throw new Error(`Missing German translation: ${key}`);
            }

            return `<${tagName}${attributes}>${escapeText(translation)}</${tagName}>`;
        }
    );
}

function translateAttributes(html, translations) {
    const attributeBindings = {
        "data-i18n-placeholder": "placeholder",
        "data-i18n-aria-label": "aria-label",
        "data-i18n-alt": "alt",
        "data-i18n-content": "content"
    };

    Object.entries(attributeBindings).forEach(([dataAttribute, targetAttribute]) => {
        const elementPattern = new RegExp(
            `<[^>]*\\b${dataAttribute}="([^"]+)"[^>]*>`,
            "gi"
        );

        html = html.replace(elementPattern, (element, key) => {
            const translation = translations[key];

            if (typeof translation !== "string") {
                throw new Error(`Missing German translation: ${key}`);
            }

            const targetPattern = new RegExp(
                `\\b${targetAttribute}="[^"]*"`,
                "i"
            );

            if (!targetPattern.test(element)) {
                throw new Error(
                    `Missing ${targetAttribute} attribute for translation: ${key}`
                );
            }

            return element.replace(
                targetPattern,
                `${targetAttribute}="${escapeAttribute(translation)}"`
            );
        });

        return html;
    });

    return html;
}

function updateLanguageLinkState(html, activeLanguage) {
    const languageLinkPattern =
        /<a\b[^>]*class="[^"]*\blanguage-option\b[^"]*"[^>]*data-language="(de|en)"[^>]*>/gi;

    return html.replace(languageLinkPattern, (element, language) => {
        const isActive = language === activeLanguage;
        let updatedElement = element
            .replace(/\s+aria-current="[^"]*"/gi, "")
            .replace(/\s+aria-pressed="[^"]*"/gi, "")
            .replace(/class="([^"]*)"/i, (classAttribute, classNames) => {
                const classes = classNames
                    .split(/\s+/)
                    .filter(Boolean)
                    .filter((className) => className !== "is-active");

                if (isActive) {
                    classes.push("is-active");
                }

                return `class="${classes.join(" ")}"`;
            });

        if (isActive) {
            updatedElement = updatedElement.replace(
                />$/,
                ' aria-current="page">'
            );
        }

        return updatedElement;
    });
}

function buildGermanPage(configuration, translations) {
    const sourcePath = path.join(projectRoot, configuration.source);
    let html = fs.readFileSync(sourcePath, "utf8");
    const htmlComments = [];

    html = html.replace(/<!--[\s\S]*?-->/g, (comment) => {
        const placeholder = `__HTML_COMMENT_${htmlComments.length}__`;
        htmlComments.push(comment);
        return placeholder;
    });

    html = translateElementContent(html, translations);
    html = translateAttributes(html, translations);
    html = html.replace(
        '<html lang="en" data-page-language="en">',
        '<html lang="de-CH" data-page-language="de">'
    );
    html = html.replace(
        /<link rel="canonical" href="[^"]+">/,
        `<link rel="canonical" href="${configuration.germanUrl}">`
    );
    html = html.replace(
        /<meta property="og:url" content="[^"]+">/,
        `<meta property="og:url" content="${configuration.germanUrl}">`
    );
    html = html.replace(
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:locale" content="de_CH">'
    );
    html = html.replace(
        '<meta property="og:locale:alternate" content="de_CH">',
        '<meta property="og:locale:alternate" content="en_US">'
    );
    html = html.replace(
        /\b(href|src)="(css|js|assets)\//g,
        '$1="/$2/'
    );

    configuration.linkReplacements.forEach(([source, replacement]) => {
        html = html.replaceAll(source, replacement);
    });

    html = updateLanguageLinkState(html, "de");
    html = html.replace(/__HTML_COMMENT_(\d+)__/g, (placeholder, index) => {
        return htmlComments[Number(index)];
    });
    html = html.replace(
        "<!DOCTYPE html>",
        "<!DOCTYPE html>\n<!-- Generated by scripts/build-localized-pages.cjs. -->"
    );

    const outputPath = path.join(outputDirectory, configuration.output);
    fs.writeFileSync(outputPath, html, "utf8");
}

const germanTranslations = loadGermanTranslations();
fs.mkdirSync(outputDirectory, { recursive: true });

pageConfigurations.forEach((configuration) => {
    buildGermanPage(configuration, germanTranslations);
});

console.log("German pages generated in /de/.");
