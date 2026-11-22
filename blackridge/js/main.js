function setUpNavigation() {
  const menuRoot = document.querySelector("[data-menu-root]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  if (!menuRoot || !toggle || !menu) return;

  const mobile = window.matchMedia("(max-width: 52rem)");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = mobile.matches && !open;
  }

  function syncLayout() {
    const menuHadFocus = menu.contains(document.activeElement);
    const toggleHadFocus = document.activeElement === toggle;

    toggle.hidden = !mobile.matches;
    setMenu(false);

    if (mobile.matches && menuHadFocus) toggle.focus();
    if (!mobile.matches && toggleHadFocus) menu.querySelector("a[href]")?.focus();
  }

  function isMenuOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
  document.addEventListener("click", (event) => {
    if (isMenuOpen() && !menuRoot.contains(event.target)) setMenu(false);
  });
  document.addEventListener("focusin", (event) => {
    if (isMenuOpen() && !menuRoot.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isMenuOpen()) return;

    const returnFocus = menuRoot.contains(document.activeElement);
    setMenu(false);
    if (returnFocus) toggle.focus();
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) setMenu(false);
  });

  mobile.addEventListener("change", syncLayout);
  document.documentElement.dataset.menuReady = "";
  syncLayout();

  const sectionLinks = Array.from(menu.querySelectorAll('a[href^="#"]'))
    .map((link) => ({
      link,
      section: document.getElementById(link.hash.slice(1)),
    }))
    .filter(({ section }) => section);

  if (!sectionLinks.length) return;

  const firstLink = sectionLinks[0];
  sectionLinks.reverse();

  let currentLink;
  let frame;

  // Use one shared threshold so overlapping sections cannot acquire the same active state.
  function updateCurrentLink() {
    frame = undefined;
    const threshold = Math.max(menuRoot.getBoundingClientRect().bottom + 32, window.innerHeight * 0.26);
    const current = sectionLinks.find(({ section }) => section.getBoundingClientRect().top <= threshold)
      ?? firstLink;

    if (current.link === currentLink) return;

    currentLink?.removeAttribute("aria-current");
    currentLink = current.link;
    currentLink.setAttribute("aria-current", "location");
  }

  function scheduleUpdate() {
    frame ??= window.requestAnimationFrame(updateCurrentLink);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  updateCurrentLink();
}

function setUpContactDraft() {
  const form = document.querySelector("[data-contact-draft]");

  if (!form) return;

  const fieldset = form.querySelector("[data-draft-fields]");
  const download = form.querySelector("[data-draft-download]");
  const status = form.querySelector("[data-draft-status]");
  const nameField = form.elements.namedItem("name");
  const email = form.elements.namedItem("email");
  const service = form.elements.namedItem("service");
  const message = form.elements.namedItem("message");

  if (!fieldset || !download || !status || !nameField || !email || !service || !message) return;

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", (event) => {
    event.target.setCustomValidity("");
    status.textContent = "";
  });

  for (const link of document.querySelectorAll("a[data-service]")) {
    link.addEventListener("click", () => {
      const requestedService = link.dataset.service;
      if (!Array.from(service.options).some((option) => option.value === requestedService)) return;

      service.value = requestedService;
      status.textContent = "";
    });
  }

  download.addEventListener("click", () => {
    const name = nameField.value.trim();
    const body = message.value.trim();

    nameField.setCustomValidity(name ? "" : "Bitte geben Sie Ihren Namen ein.");
    message.setCustomValidity(body ? "" : "Bitte beschreiben Sie Ihr Anliegen.");
    if (!form.reportValidity()) return;

    const draft = [
      "Anfrageentwurf für Hasler – Blackridge Technical",
      "",
      `Name: ${name}`,
      `E-Mail-Adresse: ${email.value.trim()}`,
      `Dienstleistung: ${service.selectedOptions[0].label}`,
      "",
      "Nachricht:",
      body,
    ].join("\r\n");

    // The temporary URL points to browser-local content and works on static hosting.
    const url = URL.createObjectURL(new Blob([draft], { type: "text/plain;charset=utf-8" }));
    const file = document.createElement("a");
    file.href = url;
    file.download = "blackridge-anfrage.txt";
    document.body.append(file);
    file.click();
    file.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);

    status.textContent = "Ihr Entwurf steht als Textdatei zum Download bereit.";
  });

  fieldset.disabled = false;
  download.hidden = false;
}

function setUpScrollReveal() {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || typeof window.IntersectionObserver !== "function") return;

  const selector = "[data-reveal]";
  const pending = new Set(Array.from(document.querySelectorAll(selector))
    .filter((target) => target.getBoundingClientRect().top >= window.innerHeight));
  if (!pending.size) return;

  const events = new AbortController();
  const listenerOptions = { signal: events.signal };
  const inset = 40;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        show(entry.target, true);
      } else if (entry.boundingClientRect.bottom <= 0) {
        show(entry.target, false);
      }
    }
  }, { rootMargin: "0px 0px -" + inset + "px 0px" });
  let lastScrollY = window.scrollY;
  let jumpFrame;

  function stopObserving() {
    observer.disconnect();
    events.abort();
    if (jumpFrame !== undefined) window.cancelAnimationFrame(jumpFrame);
  }

  function finishAnimation(event) {
    if (event.target !== event.currentTarget || event.animationName !== "scroll-reveal") return;

    const target = event.currentTarget;
    target.classList.remove("reveal-visible");
    target.removeEventListener("animationend", finishAnimation);
    target.removeEventListener("animationcancel", finishAnimation);
  }

  function show(target, animate) {
    if (!pending.delete(target)) return;

    observer.unobserve(target);
    target.classList.remove("reveal-pending");
    if (animate) {
      target.addEventListener("animationend", finishAnimation);
      target.addEventListener("animationcancel", finishAnimation);
      target.classList.add("reveal-visible");
    }
    if (!pending.size) stopObserving();
  }

  for (const target of pending) {
    target.classList.add("reveal-pending");
    observer.observe(target);
  }

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(selector);
    if (target) show(target, false);
  }, listenerOptions);

  window.addEventListener("scroll", () => {
    const distance = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (distance < window.innerHeight - inset || jumpFrame !== undefined) return;

    // Anchor jumps can skip an element without crossing the observer boundary.
    jumpFrame = window.requestAnimationFrame(() => {
      jumpFrame = undefined;
      for (const target of pending) {
        if (target.getBoundingClientRect().bottom <= 0) show(target, false);
      }
    });
  }, { ...listenerOptions, passive: true });

  motion.addEventListener("change", (event) => {
    if (event.matches) {
      for (const target of pending) target.classList.remove("reveal-pending");
      pending.clear();
      stopObserving();
    }
  }, listenerOptions);
}

for (const year of document.querySelectorAll("[data-current-year]")) {
  const currentYear = String(new Date().getFullYear());
  year.textContent = currentYear;
  if (year.localName === "time") year.dateTime = currentYear;
}

setUpContactDraft();
setUpNavigation();

// Wait for initial fragment navigation and scroll restoration before measuring the viewport.
window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(setUpScrollReveal);
}, { once: true });
