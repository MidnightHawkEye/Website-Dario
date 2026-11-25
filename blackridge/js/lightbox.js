function afterLightboxAnimation(element, name, complete) {
  const animation = element.getAnimations().find((effect) => effect.animationName === name);
  if (animation) {
    animation.finished.then(complete, complete);
  } else {
    complete();
  }
}

function setUpLightbox(gallery) {
  const dialog = document.getElementById(gallery.dataset.lightbox);
  if (typeof dialog?.showModal !== "function") return;

  const closeButton = dialog.querySelector("[data-lightbox-close]");
  const previousButton = dialog.querySelector("[data-lightbox-prev]");
  const nextButton = dialog.querySelector("[data-lightbox-next]");
  const stage = dialog.querySelector("[data-lightbox-stage]");
  const count = dialog.querySelector("[data-lightbox-count]");
  if (!closeButton || !previousButton || !nextButton || !stage || !count) return;

  const tileSelector = "a[data-lightbox-image][href]";
  const root = document.documentElement;
  let tiles = [];
  let opener;
  let index = 0;
  let requestId = 0;
  let pageScroll;
  let swipeStart;
  let pressedBackdrop = false;

  for (const tile of gallery.querySelectorAll(tileSelector)) {
    tile.setAttribute("aria-haspopup", "dialog");
  }

  function swapImage(image) {
    stage.querySelector(".lightbox__image--out")?.remove();
    const previousImage = stage.querySelector(".lightbox__image");
    if (!previousImage) {
      stage.replaceChildren(image);
      return;
    }

    previousImage.setAttribute("aria-hidden", "true");
    previousImage.classList.add("lightbox__image--out");
    stage.append(image);
    afterLightboxAnimation(previousImage, "lightbox-out", () => previousImage.remove());
  }

  async function showImage() {
    const request = ++requestId;
    const tile = tiles[index];
    const image = new Image();
    image.className = "lightbox__image";
    image.alt = tile.querySelector("img")?.alt ?? "";
    image.decoding = "async";
    image.draggable = false;
    image.src = tile.href;
    const position = (index + 1) + " / " + tiles.length;
    stage.setAttribute("aria-busy", "true");

    try {
      await image.decode();
    } catch {
      if (!dialog.open || request !== requestId) return;
      const error = document.createElement("p");
      error.className = "lightbox__error";
      error.setAttribute("role", "status");
      error.textContent = document.documentElement.lang === "en"
        ? "This image could not be loaded."
        : "Dieses Bild konnte nicht geladen werden.";
      stage.replaceChildren(error);
      count.textContent = position;
      stage.removeAttribute("aria-busy");
      return;
    }

    if (!dialog.open || request !== requestId) return;
    swapImage(image);
    count.textContent = position;
    stage.removeAttribute("aria-busy");
  }

  function moveImage(offset) {
    if (tiles.length < 2 || dialog.classList.contains("is-closing")) return;
    index = (index + offset + tiles.length) % tiles.length;
    showImage();
  }

  function closeLightbox() {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    requestId += 1;
    dialog.classList.add("is-closing");
    afterLightboxAnimation(dialog, "lightbox-out", () => dialog.close());
  }

  gallery.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const tile = event.target.closest(tileSelector);
    if (!tile || !gallery.contains(tile)) return;

    event.preventDefault();
    if (dialog.open || opener) return;
    tiles = [...gallery.querySelectorAll(tileSelector)];
    opener = tile;
    index = tiles.indexOf(tile);
    previousButton.hidden = nextButton.hidden = tiles.length < 2;
    pageScroll = { left: window.scrollX, top: window.scrollY, behavior: "instant" };
    root.classList.toggle("has-lightbox-gutter", window.innerWidth > root.clientWidth);
    root.classList.add("has-lightbox");
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
    window.scrollTo(pageScroll);
    showImage();
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => moveImage(-1));
  nextButton.addEventListener("click", () => moveImage(1));

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  dialog.addEventListener("close", () => {
    requestId += 1;
    root.classList.remove("has-lightbox", "has-lightbox-gutter");
    dialog.classList.remove("is-closing");
    stage.replaceChildren();
    stage.removeAttribute("aria-busy");
    count.textContent = "";
    swipeStart = undefined;
    pressedBackdrop = false;
    opener?.focus({ preventScroll: true });
    if (pageScroll) window.scrollTo(pageScroll);
    opener = undefined;
    pageScroll = undefined;
    tiles = [];
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveImage(event.key === "ArrowLeft" ? -1 : 1);
    }

    if (event.key !== "Tab") return;
    const lastButton = nextButton.hidden ? closeButton : nextButton;
    const first = document.activeElement === closeButton;
    const last = document.activeElement === lastButton;
    if ((event.shiftKey && first) || (!event.shiftKey && last)) {
      event.preventDefault();
      (event.shiftKey ? lastButton : closeButton).focus();
    }
  });

  dialog.addEventListener("pointerdown", (event) => {
    pressedBackdrop = event.target === dialog;
    if (event.pointerType === "touch" && event.isPrimary && event.target.matches(".lightbox__image")) {
      swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
  });

  dialog.addEventListener("pointerup", (event) => {
    if (event.pointerId !== swipeStart?.id) return;
    const horizontal = event.clientX - swipeStart.x;
    const vertical = event.clientY - swipeStart.y;
    swipeStart = undefined;
    if (Math.abs(horizontal) >= 45 && Math.abs(horizontal) > Math.abs(vertical) * 1.3) {
      moveImage(horizontal < 0 ? 1 : -1);
    }
  });

  dialog.addEventListener("pointercancel", (event) => {
    if (event.pointerId === swipeStart?.id) swipeStart = undefined;
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && pressedBackdrop) closeLightbox();
  });
}

document.querySelectorAll("[data-lightbox]").forEach(setUpLightbox);
