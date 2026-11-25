(() => {
  "use strict";

  const loader = document.currentScript;
  const base = new URL("../", loader.src);
  const relativePath = location.pathname.startsWith(base.pathname)
    ? location.pathname.slice(base.pathname.length) : "";
  const english = relativePath === "en" || relativePath.startsWith("en/");

  function mountAssistant() {
    import(new URL("js/faq-assistant.mjs", base))
      .then(({ mountFaqAssistant }) => mountFaqAssistant())
      .catch(() => { /* Keep the error page usable if the widget cannot load. */ });
  }

  function localize(view) {
    view.querySelector('[data-signal-language="de"]').hidden = english;
    view.querySelector('[data-signal-language="en"]').hidden = !english;
    document.documentElement.lang = english ? "en" : "de-CH";
    document.querySelector("title").removeAttribute("data-i18n");
    document.title = english
      ? "404 – Page Not Found | Blackridge Technical"
      : "404 – Seite nicht gefunden | Blackridge Technical";
  }

  if (!loader.hasAttribute("data-signal-router")) {
    localize(document.querySelector(".signal-frame"));
    mountAssistant();
    return;
  }

  function prepareStyle(url, signal) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.media = "not all";
    const loaded = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
    document.head.append(link);
    return { link, loaded };
  }

  async function mountSignalLost() {
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 5000);
    let styles = [];
    let mounted = false;
    try {
      const response = await fetch(new URL("404.html", base), { signal: controller.signal });
      if (!response.ok) return;
      const template = new DOMParser().parseFromString(await response.text(), "text/html");
      const view = template.querySelector(".signal-frame");
      if (!view) return;

      for (const [type, attribute] of [["a", "href"], ["img", "src"]]) {
        view.querySelectorAll(type + "[" + attribute + "]").forEach((element) => {
          element.setAttribute(attribute, new URL(element.getAttribute(attribute), base));
        });
      }
      const previousStyles = [...document.querySelectorAll('link[rel="stylesheet"]')];
      styles = [...template.querySelectorAll("link[data-signal-style]")].map((style) => {
        return prepareStyle(new URL(style.getAttribute("href"), base), controller.signal);
      });
      await Promise.all(styles.map(({ loaded }) => loaded));

      localize(view);
      previousStyles.forEach((style) => style.remove());
      styles.forEach(({ link }) => link.removeAttribute("media"));
      for (const link of document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')) {
        link.remove();
      }
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = new URL("assets/logo/blackridge-favicon.png", base);
      document.head.append(icon);
      document.body.className = "signal-lost";
      document.body.replaceChildren(document.adoptNode(view));
      mounted = true;
      mountAssistant();
    } catch {
      // The existing DARIO page is the fallback if the Blackridge files are unavailable.
    } finally {
      window.clearTimeout(deadline);
      if (!mounted) styles.forEach(({ link }) => link.remove());
      delete document.documentElement.dataset.blackridgeErrorPending;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSignalLost, { once: true });
  } else {
    mountSignalLost();
  }
})();
