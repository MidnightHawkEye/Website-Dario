import { createMatcher } from "./faq-match.mjs";
import { getFaqEntries, routes, suggestions } from "./faq-data.mjs";
import { formEnabled, formId } from "./contact-form-config.js";

const base = new URL("../", import.meta.url);
const limit = 280;
const title = "BLACKRIDGE ASSISTANT";
const strings = {
  de: {
    subtitle: "Digitaler FAQ-Assistent",
    greeting: "Willkommen bei Blackridge Technical! 👋\n\nIch bin der digitale FAQ-Assistent und helfe Ihnen bei Fragen zu unseren Dienstleistungen, Preisen und Abläufen.\n\nWie kann ich Ihnen helfen?",
    open: "FAQ-Assistent öffnen", close: "FAQ-Assistent schliessen", log: "Chatverlauf",
    you: "Sie", assistant: "Assistent", input: "Ihre Frage", placeholder: "Frage eingeben …", send: "Senden",
    pick: "Welche dieser Fragen meinen Sie?",
    unknown: "Zu dieser Frage habe ich leider noch keine passende Antwort gefunden.",
    alternatives: formAvailable => formAvailable
      ? "Vielleicht helfen Ihnen unsere häufig gestellten Fragen weiter. Alternativ können Sie uns gerne über das Kontaktformular schreiben."
      : "Vielleicht helfen Ihnen unsere häufig gestellten Fragen weiter. Auf der Kontaktseite finden Sie E-Mail und WhatsApp.",
    links: { services: "Dienstleistungen", pricing: "Zur Preisübersicht", contact: "Kontakt aufnehmen",
      faq: "Häufig gestellte Fragen", cleaning: "Mehr zur Reinigung", process: "Zum Ablauf", about: "Über Blackridge" },
  },
  en: {
    subtitle: "Digital FAQ Assistant",
    greeting: "Welcome to Blackridge Technical! 👋\n\nI'm the digital FAQ assistant. I can help you with questions about our services, pricing and processes.\n\nHow can I help you?",
    open: "Open FAQ assistant", close: "Close FAQ assistant", log: "Conversation",
    you: "You", assistant: "Assistant", input: "Your question", placeholder: "Type your question …", send: "Send",
    pick: "Which of these questions did you mean?",
    unknown: "Unfortunately, I couldn't find a suitable answer to that question.",
    alternatives: formAvailable => formAvailable
      ? "You can browse our frequently asked questions or contact us using the contact form."
      : "You can browse our frequently asked questions or find our email and WhatsApp options on the contact page.",
    links: { services: "Services", pricing: "View pricing", contact: "Contact Blackridge",
      faq: "Frequently asked questions", cleaning: "About PC cleaning", process: "View the process", about: "About Blackridge" },
  },
};

function element(tag, className, attributes = {}, content) {
  const node = document.createElement(tag);
  if (className) node.className = "faq-assistant__" + className;
  for (const [attribute, value] of Object.entries(attributes)) node.setAttribute(attribute, value);
  if (content !== undefined) node.textContent = content;
  return node;
}

function icon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", new URL("assets/icons/icons.svg#" + name, base).href);
  svg.append(use);
  return svg;
}

export function mountFaqAssistant() {
  if (document.querySelector(".faq-assistant")) return;
  const language = document.documentElement.lang.startsWith("en") ? "en" : "de";
  const copy = strings[language];
  const formAvailable = formEnabled && typeof formId === "string" && /^[a-z0-9_-]+$/i.test(formId.trim());
  const entries = getFaqEntries(formAvailable);
  const matchFaq = createMatcher(entries);

  const root = element("div", "", { class: "faq-assistant", hidden: "" });
  const style = element("link", "", { rel: "stylesheet", href: new URL("css/faq-assistant.css", base).href });
  style.addEventListener("load", () => { root.hidden = false; }, { once: true });
  document.head.append(style);

  const launcher = element("button", "launcher", {
    type: "button", "aria-label": copy.open, "aria-expanded": "false", "aria-controls": "faq-assistant-panel",
  });
  const launcherChat = icon("messages");
  const launcherClose = icon("x");
  launcherClose.classList.add("faq-assistant__launcher-close");
  launcher.append(launcherChat, launcherClose);

  const panel = element("section", "panel", {
    id: "faq-assistant-panel", role: "dialog", "aria-labelledby": "faq-assistant-title",
    "aria-describedby": "faq-assistant-subtitle", hidden: "",
  });
  const header = element("header", "header");
  const brand = element("span", "brand");
  brand.append(icon("messages"));
  const identity = element("div", "identity");
  const heading = element("h2", "title", { id: "faq-assistant-title", lang: "en" }, title);
  identity.append(heading, element("p", "subtitle", { id: "faq-assistant-subtitle" }, copy.subtitle));
  const close = element("button", "close", { type: "button", "aria-label": copy.close });
  close.append(icon("x"));
  header.append(brand, identity, close);

  const log = element("div", "log", { role: "log", "aria-label": copy.log, tabindex: "0" });
  const form = element("form", "form");
  const label = element("label", "", { class: "sr-only", for: "faq-assistant-input" }, copy.input);
  const input = element("input", "input", {
    id: "faq-assistant-input", type: "text", maxlength: String(limit), autocomplete: "off",
    enterkeyhint: "send", placeholder: copy.placeholder,
  });
  const send = element("button", "send", { type: "submit" }, copy.send);
  form.append(label, input, send);
  panel.append(header, log, form);
  root.append(launcher, panel);
  document.body.append(root);

  function closePanel(restoreFocus = true) {
    panel.hidden = true;
    updateViewport();
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", copy.open);
    if (restoreFocus) launcher.focus({ preventScroll: true });
  }

  function addMessage(text, visitor = false) {
    const bubble = element("div", "message");
    if (visitor) bubble.classList.add("faq-assistant__message--visitor");
    bubble.append(element("span", "", { class: "sr-only" }, (visitor ? copy.you : copy.assistant) + ": "),
      element("p", "message-text", {}, text));
    log.append(bubble);
    return bubble;
  }

  function addLinks(bubble, links) {
    const row = element("div", "links");
    for (const destination of links) {
      const [section, anchor] = destination.split("#");
      const url = new URL(routes[language][section], base);
      if (anchor) url.hash = anchor;
      const label = { faq: "faq", reinigung: "cleaning", ablauf: "process" }[anchor] ?? section;
      const link = element("a", "link", { href: url.href }, copy.links[label]);
      link.addEventListener("click", () => closePanel(false));
      row.append(link);
    }
    bubble.append(row);
  }

  function addChoices(bubble, choices) {
    const row = element("div", "choices");
    for (const choice of choices) {
      const question = choice[language].question;
      const button = element("button", "choice", { type: "button" }, question);
      button.addEventListener("click", event => {
        respond(question, [choice]);
        if (event.detail === 0) input.focus({ preventScroll: true });
      });
      row.append(button);
    }
    bubble.append(row);
  }

  function respond(inputText, matches) {
    addMessage(inputText, true);
    if (matches.length === 1) {
      const [match] = matches;
      addLinks(addMessage(match[language].answer), match.links);
    } else if (matches.length > 1) {
      addChoices(addMessage(copy.pick), matches);
    } else {
      addLinks(addMessage(copy.unknown + "\n\n" + copy.alternatives(formAvailable)), ["services#faq", "contact#contact-channel"]);
    }
    log.scrollTop = log.scrollHeight;
  }

  addChoices(addMessage(copy.greeting), suggestions.map(id => entries.find(entry => entry.id === id)));

  function updateViewport() {
    const viewport = window.visualViewport;
    if (panel.hidden) {
      root.style.removeProperty("--faq-visible-height");
      root.style.removeProperty("--faq-keyboard-inset");
      root.classList.remove("faq-assistant--keyboard");
      return;
    }
    if (!viewport) return;
    const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    root.style.setProperty("--faq-visible-height", viewport.height + "px");
    root.style.setProperty("--faq-keyboard-inset", inset + "px");
    root.classList.toggle("faq-assistant--keyboard", window.innerHeight - viewport.height > 80 && viewport.scale === 1);
  }

  launcher.addEventListener("click", () => {
    if (!panel.hidden) {
      closePanel();
      return;
    }
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", copy.close);
    updateViewport();
    const focusTarget = matchMedia("(pointer: coarse)").matches ? close : input;
    focusTarget.focus({ preventScroll: true });
  });
  close.addEventListener("click", () => closePanel());
  form.addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim().slice(0, limit);
    if (!question) return;
    input.value = "";
    respond(question, matchFaq(question));
    input.focus({ preventScroll: true });
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || event.defaultPrevented || panel.hidden || document.querySelector("dialog[open]")) return;
    event.preventDefault();
    closePanel();
  });

  const menu = document.querySelector("[data-menu-toggle]");
  if (menu) {
    new MutationObserver(() => {
      if (!panel.hidden && menu.getAttribute("aria-expanded") === "true") closePanel(false);
    }).observe(menu, { attributes: true, attributeFilter: ["aria-expanded"] });
  }
  window.visualViewport?.addEventListener("resize", updateViewport);
  window.visualViewport?.addEventListener("scroll", updateViewport);
}
