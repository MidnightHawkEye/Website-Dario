(() => {
  const settings = {
    enabled: true,      // false schaltet BLACKRIDGE FLUX vollständig aus.
    intensity: .9,      // Helligkeit und Dichte der Strömung, zwischen 0 und 1.
    mistLimit: 24,      // Maximale Zahl gleichzeitig sichtbarer Nebelschlieren.
    sparkLimit: 64,     // Maximale Zahl gleichzeitig sichtbarer Lichtpunkte.
    trailLimit: 44,     // Stützpunkte inklusive unsichtbarer Reserve am Ende.
    trailLife: 3900,    // Lebensdauer eines Spurpunkts in Millisekunden.
    trailFadeStart: .16, // Ab diesem Anteil der Strecke vom Kopf aus fällt die Deckkraft.
    trailFadePower: 1.25, // Stärkerer Abfall im hinteren Bereich des Smoothstep-Verlaufs.
    trailMinWidth: .16, // Anteil der ursprünglichen Breite am Ende der Spur.
    trailWidth: 1.35,   // Breitenfaktor für die Lichtspur. 1 entspricht der ursprünglichen Breite.
    particleSpeed: 1,   // Faktor für die Drift von Nebel und Lichtpunkten.
    lifetime: [1800, 4200], // Lebensdauer von Nebel und Lichtpunkten in Millisekunden.
    mistOpacity: .23,   // Deckkraft einer Nebelschliere vor dem Ausblenden, maximal .25.
    glow: .65,          // Leuchten der Lichtpunkte und Spur, zwischen 0 und 1.
    followSpeed: 17,    // Nachziehgeschwindigkeit. Grössere Werte folgen schneller.
    maxPixelRatio: 1.75, // Obergrenze für die Canvas-Auflösung auf hochauflösenden Displays.
  };

  const hero = document.querySelector('[data-hero-flux]');
  const image = hero?.querySelector('.hero-visual img');
  if (!settings.enabled || !settings.intensity || !hero || !image || !window.ResizeObserver) return;

  const capability = matchMedia('(min-width: 40rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const foreground = [...hero.querySelectorAll('.hero-content, .hero-benefits li')];
  const lowBudget = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
  const budget = lowBudget ? .6 : 1;
  const pixelBudget = lowBudget ? 620_000 : 1_420_000;
  const intensity = Math.max(0, Math.min(1, settings.intensity));
  const glow = Math.max(0, Math.min(1, settings.glow));
  const followSpeed = Math.max(1, settings.followSpeed);
  const limits = {
    mist: Math.floor(settings.mistLimit * budget),
    sparks: Math.floor(settings.sparkLimit * budget),
    trail: Math.floor(settings.trailLimit * budget),
  };
  const trailReserve = lowBudget ? 4 : 6;
  const mist = [];
  const sparks = [];
  const trail = [];

  let canvas;
  let context;
  let brushes;
  let width = 0;
  let height = 0;
  let foregroundBounds = [];
  let head;
  let target;
  let lastInput;
  let carriedDistance = 0;
  let motion = 0;
  let frame = 0;
  let lastFrame = 0;
  let sweep = 0;
  let listening = false;
  let supported = true;
  let onscreen = true;

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  function brush(size, color, misty) {
    const stamp = document.createElement('canvas');
    stamp.width = stamp.height = size;
    const paint = stamp.getContext('2d');

    // Three soft lobes give the mist a directional shape without per-frame blurs.
    const lobes = misty ? [[.37, .48, .32, .66], [.58, .52, .37, .72], [.72, .43, .24, .39]] : [[.5, .5, .5, 1]];
    for (const [x, y, radius, alpha] of lobes) {
      const gradient = paint.createRadialGradient(x * size, y * size, 0, x * size, y * size, radius * size);
      gradient.addColorStop(0, `rgba(${color},${alpha})`);
      gradient.addColorStop(misty ? .48 : .22, `rgba(${color},${alpha * (misty ? .37 : .87)})`);
      gradient.addColorStop(1, `rgba(${color},0)`);
      paint.fillStyle = gradient;
      paint.fillRect(0, 0, size, size);
    }
    return stamp;
  }

  function stopInput() {
    head = target = lastInput = undefined;
    carriedDistance = motion = 0;
  }

  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = lastFrame = 0;
    stopInput();
    mist.length = sparks.length = trail.length = 0;
    context?.clearRect(0, 0, width, height);
    if (canvas) canvas.hidden = true;
  }

  function fitCanvas() {
    if (!canvas || !width || !height) return;
    const density = Math.min(devicePixelRatio || 1, settings.maxPixelRatio, lowBudget ? 1.25 : Infinity, Math.sqrt(pixelBudget / (width * height)));
    const pixelWidth = Math.max(1, Math.round(width * density));
    const pixelHeight = Math.max(1, Math.round(height * density));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
  }

  function measure() {
    const { left, top } = hero.getBoundingClientRect();
    const nextWidth = hero.clientWidth;
    const nextHeight = hero.clientHeight;
    foregroundBounds = foreground.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left - left, right: rect.right - left, top: rect.top - top, bottom: rect.bottom - top };
    });
    if (width !== nextWidth || height !== nextHeight) {
      reset();
      width = nextWidth;
      height = nextHeight;
    }
    fitCanvas();
  }

  function createCanvas() {
    const surface = document.createElement('canvas');
    const renderer = surface.getContext('2d');
    if (!renderer) {
      supported = false;
      updateCapability();
      return false;
    }
    surface.className = 'hero-flux';
    surface.setAttribute('aria-hidden', 'true');
    surface.hidden = true;
    canvas = surface;
    context = renderer;
    brushes ??= {
      mist: ['39,109,244', '52,154,230'].map((color) => brush(96, color, true)),
      sparks: ['70,140,255', '141,209,255', '94,204,235', '225,243,255'].map((color) => brush(24, color, false)),
    };
    hero.append(canvas);
    fitCanvas();
    return true;
  }

  function add(list, limit, particle) {
    if (!limit) return;
    if (list.length >= limit) list.shift();
    list.push(particle);
  }

  function emit(x, y, dx, dy, now, strength) {
    const [minLife, maxLife] = settings.lifetime;
    const speed = (16 + strength * 29) * settings.particleSpeed;
    const angle = Math.atan2(dy, dx);
    const origin = {
      x, y, born: now, life: settings.trailLife,
      vx: dx * 17, vy: dy * 12 - 10, phase: randomBetween(0, Math.PI * 2),
      strength, sweep, tailOpacity: 0,
    };
    // The next frame can advance several samples at once. Never evict a point
    // that contributed visible light in the previous frame.
    if (trail.length < limits.trail || trail[0].tailOpacity === 0) add(trail, limits.trail, origin);
    add(mist, limits.mist, {
      x: x + randomBetween(-9, 9), y: y + randomBetween(-7, 7), born: now,
      life: randomBetween(minLife, maxLife), vx: dx * speed * .53, vy: dy * speed * .49 - 12,
      radius: randomBetween(30, 62) + strength * 18, spin: randomBetween(-.5, .5),
      angle: angle + randomBetween(-.38, .38), phase: randomBetween(0, Math.PI * 2),
      alpha: intensity * Math.min(.25, settings.mistOpacity) * (.58 + strength * .42),
      brush: brushes.mist[Math.random() < .25 ? 1 : 0], origin,
    });

    const sparkCount = strength > .58 && Math.random() < intensity * budget ? 2 : 1;
    for (let index = 0; index < sparkCount; index += 1) {
      const bend = randomBetween(-30, 30) * settings.particleSpeed;
      add(sparks, limits.sparks, {
        x: x + randomBetween(-6, 6), y: y + randomBetween(-6, 6), born: now,
        life: randomBetween(minLife, maxLife), vx: dx * speed - dy * bend, vy: dy * speed + dx * bend - 9,
        radius: randomBetween(1.65, 3.7), phase: randomBetween(0, Math.PI * 2),
        alpha: intensity * glow * randomBetween(.34, .79),
        brush: brushes.sparks[Math.floor(Math.random() ** 1.55 * brushes.sparks.length)], origin,
      });
    }
  }

  function schedule() {
    if (!frame && onscreen && !document.hidden) frame = requestAnimationFrame(paintFrame);
  }

  function pointerMove(event) {
    if (event.pointerType !== 'mouse' || !onscreen || document.hidden || width < 48 || !height || !image.naturalWidth) return;
    const { left, top } = hero.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    if (x < 0 || x >= width || y < 0 || y >= height) {
      stopInput();
      return;
    }
    if (!canvas && !createCanvas()) return;

    const time = performance.now();
    if (!head) {
      canvas.hidden = false;
      sweep += 1;
      head = { x, y };
      target = lastInput = { x, y, time };
      emit(x, y, .85, -.2, time, .16);
      schedule();
      return;
    }

    const distance = Math.hypot(x - lastInput.x, y - lastInput.y);
    if (distance < .25) return;
    canvas.hidden = false;
    const pointerSpeed = distance / Math.max(12, time - lastInput.time);
    motion += (Math.min(1, pointerSpeed / 1.8) - motion) * .48;
    target = lastInput = { x, y, time };
    schedule();
  }

  function advance(now, dt) {
    if (!target || !head) return false;

    const dx = target.x - head.x;
    const dy = target.y - head.y;
    const remaining = Math.hypot(dx, dy);
    if (remaining < .75) {
      head.x = target.x;
      head.y = target.y;
      return false;
    }

    const distance = remaining * (1 - Math.exp(-followSpeed * dt));
    const unitX = dx / remaining;
    const unitY = dy / remaining;
    const total = carriedDistance + distance;
    const interval = (19 - motion * 11) / Math.max(.25, intensity * budget);
    const count = Math.min(lowBudget ? 2 : 4, Math.floor(total / interval));
    for (let index = 1; index <= count; index += 1) {
      const along = distance * index / (count + 1);
      emit(head.x + unitX * along, head.y + unitY * along, unitX, unitY, now, motion);
    }
    carriedDistance = total % interval;
    head.x += unitX * distance;
    head.y += unitY * distance;
    return true;
  }

  function age(list, now, dt) {
    let active = 0;
    for (const particle of list) {
      const elapsed = Math.max(0, now - particle.born);
      if (elapsed >= particle.life) {
        if (list === trail) particle.tailOpacity = 0;
        continue;
      }
      const curl = Math.sin(particle.phase + elapsed * .007);
      particle.elapsed = elapsed;
      particle.progress = elapsed / particle.life;
      particle.x += (particle.vx + curl * 10) * dt;
      particle.y += (particle.vy + curl * 8) * dt;
      list[active++] = particle;
    }
    list.length = active;
  }

  function foregroundOpacity(x, y) {
    let opacity = 1;
    for (const box of foregroundBounds) {
      // The effect stays visible behind the copy at a lower strength, with soft edges.
      const distance = Math.max(box.left - x, x - box.right, box.top - y, y - box.bottom, 0);
      opacity = Math.min(opacity, .48 + Math.min(distance / 72, 1) * .52);
    }
    return opacity;
  }

  function fadeOpacity(progress) {
    return (1 - progress) ** 2 * (1 + 2 * progress);
  }

  function prepareTrail() {
    const sections = [];
    const visibleFrom = Math.max(0, trail.length - limits.trail + trailReserve);
    for (let index = 0; index < visibleFrom; index += 1) trail[index].tailOpacity = 0;

    // Each uninterrupted pointer sweep tapers independently. Use travelled
    // distance so changes in sampling density don't change the shape of the fade.
    for (let end = trail.length - 1; end >= visibleFrom;) {
      const newest = trail[end];
      newest.distance = 0;
      let start = end;
      while (start > visibleFrom && trail[start - 1].sweep === newest.sweep) {
        const from = trail[start];
        const to = trail[--start];
        to.distance = from.distance + Math.hypot(to.x - from.x, to.y - from.y);
      }

      const length = trail[start].distance;
      for (let index = start; index <= end; index += 1) {
        const point = trail[index];
        const ratio = length ? point.distance / length : 0;
        const fade = Math.max(0, (ratio - settings.trailFadeStart) / (1 - settings.trailFadeStart));
        point.tailOpacity = fadeOpacity(fade) ** settings.trailFadePower;
        point.opacity = intensity * glow * foregroundOpacity(point.x, point.y)
          * fadeOpacity(point.progress) * (.13 + point.strength * .14) * point.tailOpacity;
      }
      if (length) sections.push({ start, end });
      end = start - 1;
    }
    return sections.reverse();
  }

  function drawParticles() {
    for (const particle of mist) {
      const spread = particle.radius * (1 + particle.progress * .58);
      context.globalAlpha = particle.alpha * foregroundOpacity(particle.x, particle.y)
        * Math.min(1, .18 + particle.elapsed / 130) * fadeOpacity(particle.progress)
        * (.3 + .7 * particle.origin.tailOpacity);
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.angle + particle.progress * particle.spin);
      context.drawImage(particle.brush, -spread, -spread * .59, spread * 2, spread * 1.18);
      context.restore();
    }
    for (const particle of sparks) {
      const radius = particle.radius * (1 - .3 * particle.progress);
      context.globalAlpha = particle.alpha * foregroundOpacity(particle.x, particle.y)
        * Math.min(1, .12 + particle.elapsed / 95) * fadeOpacity(particle.progress)
        * (.3 + .7 * particle.origin.tailOpacity);
      context.drawImage(particle.brush, particle.x - radius, particle.y - radius, radius * 2, radius * 2);
    }
  }

  function drawTrail(sections) {
    context.globalAlpha = 1;
    context.lineCap = 'round';
    for (const { start, end } of sections) {
      for (let index = start; index <= end; index += 1) {
        const point = trail[index];
        const previous = index === start ? point : trail[index - 1];
        const next = index === end ? point : trail[index + 1];
        const x0 = (previous.x + point.x) / 2;
        const y0 = (previous.y + point.y) / 2;
        const x1 = (point.x + next.x) / 2;
        const y1 = (point.y + next.y) / 2;
        if (x0 === x1 && y0 === y1) continue;

        // Adjacent curves use the same alpha at the shared midpoint. Both the
        // core and the surrounding glow start at exactly zero on the tail.
        const from = index === start ? 0 : (previous.opacity + point.opacity) / 2;
        const to = (point.opacity + next.opacity) / 2;
        const taper = settings.trailMinWidth + (1 - settings.trailMinWidth) * Math.sqrt(point.tailOpacity);
        const widthFactor = taper * settings.trailWidth;
        const middleY = point.y + Math.sin(point.phase + point.progress * 4) * point.progress * 8;
        context.beginPath();
        context.moveTo(x0, y0);
        context.quadraticCurveTo(point.x, middleY, x1, y1);
        for (const [color, width] of [['38,107,255', 3.4 + point.strength * 2.8], ['125,202,255', .85 + point.strength * .7]]) {
          const paint = context.createLinearGradient(x0, y0, x1, y1);
          paint.addColorStop(0, `rgba(${color},${from})`);
          paint.addColorStop(1, `rgba(${color},${to})`);
          context.lineWidth = width * widthFactor;
          context.strokeStyle = paint;
          context.stroke();
        }
      }
    }
  }

  function paintFrame(now) {
    frame = 0;
    const dt = lastFrame ? Math.min(.048, Math.max(0, (now - lastFrame) / 1000)) : 1 / 60;
    lastFrame = now;
    const following = advance(now, dt);
    age(mist, now, dt);
    age(sparks, now, dt);
    age(trail, now, dt);
    const sections = prepareTrail();
    context.clearRect(0, 0, width, height);
    drawParticles();
    drawTrail(sections);
    context.globalAlpha = 1;
    if (following || mist.length || sparks.length || trail.length) schedule();
    else {
      lastFrame = 0;
      canvas.hidden = true;
    }
  }

  const resize = new ResizeObserver(measure);
  const visibility = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => {
    onscreen = entry.isIntersecting;
    if (!onscreen) reset();
  }) : null;

  function updateCapability() {
    const eligible = supported && capability.matches;
    if (eligible === listening) return;
    listening = eligible;
    if (eligible) {
      onscreen = true;
      visibility?.observe(hero);
      resize.observe(hero);
      for (const element of foreground) resize.observe(element);
      window.addEventListener('resize', measure);
      hero.addEventListener('pointerenter', pointerMove);
      hero.addEventListener('pointermove', pointerMove);
      hero.addEventListener('pointerleave', stopInput);
      hero.addEventListener('pointercancel', stopInput);
      measure();
      return;
    }
    visibility?.disconnect();
    resize.disconnect();
    window.removeEventListener('resize', measure);
    hero.removeEventListener('pointerenter', pointerMove);
    hero.removeEventListener('pointermove', pointerMove);
    hero.removeEventListener('pointerleave', stopInput);
    hero.removeEventListener('pointercancel', stopInput);
    reset();
    canvas?.remove();
    canvas = context = undefined;
  }

  capability.addEventListener('change', updateCapability);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  window.addEventListener('pagehide', reset);
  updateCapability();
})();
