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
  const isTopEntry = window.scrollY === 0 && !window.location.hash;
  const pending = new Set(Array.from(document.querySelectorAll(selector)).filter((target) => {
    const top = target.getBoundingClientRect().top;

    // Sections moved up on their own pages can already be visible on entry.
    return top >= window.innerHeight || (isTopEntry && top >= 0);
  }));
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

setUpNavigation();

// Wait for initial fragment navigation and scroll restoration before measuring the viewport.
window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(setUpScrollReveal);
}, { once: true });
