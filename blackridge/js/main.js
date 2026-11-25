function setUpNavigation() {
  const menuRoot = document.querySelector("[data-menu-root]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  if (!menuRoot || !toggle || !menu) return;

  const mobile = window.matchMedia("(max-width: 58rem)");

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
    if (!isMenuOpen() || menuRoot.contains(event.target)) return;

    const menuHadFocus = menu.contains(document.activeElement);
    setMenu(false);
    if (menuHadFocus) toggle.focus({ preventScroll: true });
  });
  document.addEventListener("focusin", (event) => {
    if (isMenuOpen() && !menuRoot.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isMenuOpen()) return;

    event.preventDefault();
    setMenu(false);
    toggle.focus({ preventScroll: true });
  });
  menu.addEventListener("click", (event) => {
    if (!isMenuOpen() || !event.target.closest("a[href]")) return;

    setMenu(false);
    toggle.focus({ preventScroll: true });
  });

  mobile.addEventListener("change", syncLayout);
  document.documentElement.dataset.menuReady = "";
  syncLayout();
}

function setUpScrollReveal() {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || typeof window.IntersectionObserver !== "function") return;

  const selector = "[data-reveal]";
  const targets = Array.from(document.querySelectorAll(selector))
    .filter(target => !target.closest("dialog, [role='dialog']"));
  if (!targets.length) return;

  const openDetails = ".faq-item[open], .price-scope[open]";
  const isTopEntry = window.scrollY === 0 && !window.location.hash;
  const seen = new WeakSet();
  const armed = new Map();
  const running = new Set();
  const events = new AbortController();
  const listenerOptions = { signal: events.signal };
  let lastScrollY = window.scrollY;
  let scrollingDown = false;

  function protectedContent(target) {
    return target.matches(":focus-within") || target.closest(openDetails) || target.querySelector(openDetails);
  }

  function settle(target) {
    armed.delete(target);
    running.delete(target);
    target.classList.remove("reveal-pending", "reveal-visible");
  }

  function arm(target) {
    armed.set(target, window.scrollY);
    target.classList.add("reveal-pending");
  }

  function finishAnimation(event) {
    const target = event.target;
    if (event.animationName !== "scroll-reveal" || !running.has(target)) return;
    settle(target);
    // The transform can affect intersections mid-animation. Once it is gone,
    // check the resting position in case the user already scrolled back up.
    if (target.getBoundingClientRect().top >= window.innerHeight && !protectedContent(target)) arm(target);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const { target, rootBounds, boundingClientRect, intersectionRect, isIntersecting } of entries) {
      if (!rootBounds || running.has(target)) continue;
      const firstObservation = !seen.has(target);
      seen.add(target);
      if (protectedContent(target)) {
        settle(target);
      } else if (!isIntersecting) {
        if (boundingClientRect.top >= rootBounds.bottom) arm(target);
        else if (boundingClientRect.bottom <= rootBounds.top) settle(target);
      } else {
        const initialEntry = firstObservation && isTopEntry && window.scrollY === 0 && boundingClientRect.top >= 0;
        const reentry = scrollingDown && window.scrollY > armed.get(target);
        if (!initialEntry && !reentry) {
          settle(target);
          continue;
        }
        // Keep a small gap between becoming fully offscreen and starting
        // again. Short headings need less visible height than large cards.
        const visibleHeight = Math.min(24, boundingClientRect.height * .25);
        if (!initialEntry && intersectionRect.height + .5 < visibleHeight) continue;
        settle(target);
        running.add(target);
        target.classList.add("reveal-visible");
      }
    }
  }, { threshold: [0, .025, .05, .1, .25, .5, 1] });

  window.addEventListener("scroll", () => {
    const position = window.scrollY;
    if (position === lastScrollY) return;
    scrollingDown = position > lastScrollY;
    lastScrollY = position;
  }, { ...listenerOptions, passive: true });

  function settleAncestors(element) {
    for (let target = element.closest(selector); target; target = target.parentElement?.closest(selector)) {
      settle(target);
    }
  }

  document.addEventListener("focusin", event => settleAncestors(event.target), listenerOptions);
  document.addEventListener("toggle", event => {
    if (event.target.matches(openDetails)) settleAncestors(event.target);
  }, { ...listenerOptions, capture: true });
  document.addEventListener("animationend", finishAnimation, listenerOptions);
  document.addEventListener("animationcancel", finishAnimation, listenerOptions);

  motion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    events.abort();
    for (const target of targets) settle(target);
  }, listenerOptions);
  targets.forEach(target => observer.observe(target));
}

for (const year of document.querySelectorAll("[data-current-year]")) {
  const currentYear = String(new Date().getFullYear());
  year.textContent = currentYear;
  if (year.localName === "time") year.dateTime = currentYear;
}

setUpNavigation();

import(new URL("faq-assistant.mjs", document.currentScript.src))
  .then(({ mountFaqAssistant }) => mountFaqAssistant())
  .catch(() => { /* Navigation remains available if the optional widget cannot load. */ });

// Wait for initial fragment navigation and scroll restoration before measuring the viewport.
window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(setUpScrollReveal);
}, { once: true });
