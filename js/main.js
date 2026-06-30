(function () {
  document.documentElement.classList.add("js-enabled");

  const hero = document.querySelector("[data-hero]");
  const heroBars = Array.from(document.querySelectorAll("[data-hero-bar]"));
  const heroImage = document.querySelector("[data-hero-image]");
  const heroArcPaths = Array.from(document.querySelectorAll("[data-hero-arc-path]"));
  const heroArcTerminal = document.querySelector("[data-hero-arc-terminal]");
  const heroCopy = document.querySelector(".hero-copy");
  const heroContentItems = heroCopy ? Array.from(heroCopy.children) : [];
  const hero2 = document.querySelector("[data-hero2]");
  const hero2Arc = document.querySelector("[data-hero2-arc]");
  const hero2Image = document.querySelector("[data-hero2-image]");
  const hero2CopyPanel = document.querySelector("[data-hero2-copy-panel]");
  const hero2MediaPanel = document.querySelector("[data-hero2-media-panel]") || hero2Image;
  const hero2MediaImg = hero2MediaPanel ? hero2MediaPanel.querySelector("img") : null;
  const hero2Seam = document.querySelector("[data-hero2-seam]");
  const hero2CopyItems = hero2 ? Array.from(hero2.querySelectorAll(".hero2-panel--copy > :not(.hero2-brand-arc)")) : [];
  const revealSections = Array.from(document.querySelectorAll("[data-reveal-section]"));
  const interactiveElements = Array.from(
    document.querySelectorAll(".btn-primary, .btn-secondary, .cta-card, .radio-card")
  );
  const motion = {
    quick: 160,
    standard: 520,
    slow: 920,
    easeOut: "easeOutCubic",
    easeInOut: "easeInOutCubic",
  };

  function canAnimate() {
    return typeof window.anime === "function";
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function bindNavigation() {
    const toggles = Array.from(document.querySelectorAll("[data-nav-toggle]"));
    if (toggles.length === 0) return;

    const setOpen = (toggle, menu, open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("hidden", !open);
      document.body.classList.toggle("nav-open", open);
    };

    toggles.forEach((toggle) => {
      const scope = toggle.closest("nav") || document;
      const menu = scope.querySelector("[data-nav-menu]");
      if (!menu) return;

      toggle.addEventListener("click", () => {
        setOpen(toggle, menu, toggle.getAttribute("aria-expanded") !== "true");
      });
      menu.querySelectorAll("a, [data-nav-close]").forEach((control) => {
        control.addEventListener("click", () => setOpen(toggle, menu, false));
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(toggle, menu, false);
      });
    });
  }

  function finishHeroReveal() {
    if (!hero) return;
    hero.classList.add("is-complete");
  }

  function revealHeroWithAnime() {
    if (!hero || !canAnimate()) {
      finishHeroReveal();
      return;
    }

    window.anime.set(heroContentItems, { opacity: 0, translateY: 20 });
    heroBars.forEach((bar) => window.anime.set(bar, { scaleY: 0 }));

    finishHeroReveal();

    const timeline = window.anime.timeline({ easing: motion.easeOut });

    timeline.add({
      targets: heroContentItems,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 900,
      delay: window.anime.stagger(90),
    });

    if (heroBars.length > 0) {
      timeline.add(
        {
          targets: heroBars,
          scaleY: [0, 1],
          duration: 1400,
          easing: "easeOutQuint",
        },
        220
      );
    }
  }

  function animateHeroReveal() {
    if (!hero) return;

    if (!canAnimate()) {
      if (heroImage) heroImage.style.clipPath = "inset(0 0 0 0)";
      heroArcPaths.forEach((path) => {
        path.style.strokeDashoffset = "0";
      });
      finishHeroReveal();
      return;
    }

    heroArcPaths.forEach((path) => {
      path.style.strokeDashoffset = String(path.getTotalLength());
    });

    if (heroArcTerminal) {
      window.anime.set(heroArcTerminal, { opacity: 0, scale: 0.55 });
    }

    if (heroImage) {
      heroImage.style.clipPath = "inset(100% 0 0 0)";
    }

    window.anime.set(heroContentItems, { opacity: 0, translateY: 20 });
    finishHeroReveal();

    const timeline = window.anime.timeline({ easing: motion.easeOut });

    timeline.add({
      targets: heroArcPaths,
      strokeDashoffset: 0,
      duration: 1200,
      delay: window.anime.stagger(80),
      easing: motion.easeOut,
    });

    if (heroArcTerminal) {
      timeline.add(
        {
          targets: heroArcTerminal,
          opacity: [0, 1],
          scale: [0.55, 1],
          duration: 420,
          easing: motion.easeOut,
        },
        880
      );
    }

    if (heroImage) {
      timeline.add(
        {
          targets: heroImage,
          clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
          duration: 800,
          easing: motion.easeOut,
        },
        200
      );
    }

    timeline.add(
      {
        targets: heroContentItems,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 640,
        delay: window.anime.stagger(90),
      },
      100
    );
  }

  function bindHero() {
    if (!hero) return;

    window.requestAnimationFrame(() => {
      if (heroBars.length > 0) {
        revealHeroWithAnime();
      } else if (heroArcPaths.length > 0 || heroImage) {
        animateHeroReveal();
      } else {
        finishHeroReveal();
      }
    });
  }

  function animateHero2() {
    if (!hero2) return;

    if (!canAnimate() || prefersReducedMotion()) {
      [hero2CopyPanel, hero2MediaPanel, hero2Arc, hero2MediaImg].filter(Boolean).forEach((element) => {
        element.style.opacity = "";
        element.style.transform = "";
        element.style.clipPath = "";
        element.style.zIndex = "";
      });

      hero2CopyItems.forEach((element) => {
        element.style.opacity = "";
        element.style.transform = "";
      });

      if (hero2Seam) hero2Seam.style.opacity = "0";
      return;
    }

    const isDesktopSplit = window.matchMedia("(min-width: 1024px)").matches;
    const isMobileStack = window.matchMedia("(max-width: 767px)").matches;
    const copyStart = isDesktopSplit
      ? { translateX: -24, translateY: 0 }
      : { translateX: 0, translateY: isMobileStack ? 22 : 26 };
    const mediaStart = isDesktopSplit
      ? { translateX: 24, translateY: 0 }
      : { translateX: 0, translateY: isMobileStack ? -18 : -22 };
    const hero2Panels = [hero2CopyPanel, hero2MediaPanel].filter(Boolean);

    if (hero2Arc) {
      window.anime.set(hero2Arc, { opacity: 0, scale: 0.96 });
    }

    if (hero2CopyPanel) {
      window.anime.set(hero2CopyPanel, {
        opacity: 0,
        scale: 0.985,
        zIndex: 2,
        translateX: copyStart.translateX,
        translateY: copyStart.translateY,
      });
    }

    if (hero2MediaPanel) {
      window.anime.set(hero2MediaPanel, {
        opacity: 0,
        scale: 1.012,
        zIndex: 3,
        translateX: mediaStart.translateX,
        translateY: mediaStart.translateY,
      });
    }

    if (hero2MediaImg) {
      window.anime.set(hero2MediaImg, {
        scale: 1.04,
      });
    }

    if (hero2Seam) {
      window.anime.set(hero2Seam, {
        opacity: 0,
        scaleX: isDesktopSplit ? 1 : 0.46,
        scaleY: isDesktopSplit ? 0.46 : 1,
      });
    }

    window.anime.set(hero2CopyItems, {
      opacity: 0,
      translateY: 18,
    });

    const timeline = window.anime.timeline({
      easing: motion.easeOut,
      complete: function () {
        [hero2CopyPanel, hero2MediaPanel, hero2MediaImg].filter(Boolean).forEach((element) => {
          element.style.opacity = "";
          element.style.transform = "";
          element.style.clipPath = "";
          element.style.zIndex = "";
        });

        hero2CopyItems.forEach((element) => {
          element.style.opacity = "";
          element.style.transform = "";
        });

        if (hero2Seam) {
          hero2Seam.style.opacity = "0";
          hero2Seam.style.transform = "";
        }
      },
    });

    if (hero2Panels.length > 0) {
      timeline.add(
        {
          targets: hero2Panels,
          opacity: 1,
          translateX: 0,
          translateY: 0,
          scale: 1,
          duration: 820,
          easing: "easeOutCubic",
        },
        40
      );
    }

    if (hero2Seam) {
      timeline.add(
        {
          targets: hero2Seam,
          opacity: 0,
          duration: 1,
        },
        0
      );
    }

    if (hero2Arc) {
      timeline.add(
        {
          targets: hero2Arc,
          opacity: [0, 0.72],
          scale: [0.96, 1],
          duration: 720,
          easing: "easeOutCubic",
        },
        260
      );
    }

    if (hero2MediaImg) {
      timeline.add(
        {
          targets: hero2MediaImg,
          scale: [1.04, 1],
          duration: 980,
          easing: "easeOutCubic",
        },
        80
      );
    }

    if (hero2CopyItems.length > 0) {
      timeline.add(
        {
          targets: hero2CopyItems,
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 560,
          delay: window.anime.stagger(75),
          easing: motion.easeOut,
        },
        460
      );
    }
  }

  function mountHeroSwitch(which) {
    const heroSwitch = document.querySelector("[data-hero-switch]");
    const target = which === "2" ? hero2 : hero;
    if (!heroSwitch || !target || heroSwitch.parentElement === target) return;
    target.appendChild(heroSwitch);
  }

  function activateHero(which, animate) {
    if (!hero || !hero2) return;

    const showSecond = which === "2";
    hero.hidden = showSecond;
    hero2.hidden = !showSecond;
    mountHeroSwitch(which);

    const heroSwitch = document.querySelector("[data-hero-switch]");
    if (heroSwitch) {
      heroSwitch.querySelectorAll("[data-hero-switch-btn]").forEach((btn) => {
        const isActive = btn.dataset.heroSwitchBtn === which;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    }

    if (!animate) return;

    window.requestAnimationFrame(() => {
      if (showSecond) {
        animateHero2();
      } else {
        bindHero();
      }
    });
  }

  function bindHeroToggle() {
    if (!hero || !hero2) {
      bindHero();
      return;
    }

    const HERO_KEY = "zc-hero-preview";
    let stored = "1";
    try {
      stored = window.localStorage.getItem(HERO_KEY) || "1";
    } catch (error) {
      stored = "1";
    }
    if (stored !== "1" && stored !== "2") stored = "1";

    const heroSwitch = document.querySelector("[data-hero-switch]");
    if (heroSwitch) {
      heroSwitch.querySelectorAll("[data-hero-switch-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const which = btn.dataset.heroSwitchBtn === "2" ? "2" : "1";
          try {
            window.localStorage.setItem(HERO_KEY, which);
          } catch (error) {}
          activateHero(which, true);
        });
      });
    }

    activateHero(stored, true);
  }

  const revealMotion = {
    duration: 880,
    distance: 26,
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    headingGap: 150,
    cardGap: 170,
    headingToCards: 200,
  };

  function headingPieces(section) {
    const pieces = [];
    Array.from(section.querySelectorAll("[data-reveal-item]")).forEach((wrapper) => {
      const children = Array.from(wrapper.children).filter((node) => node.nodeType === 1);
      if (children.length > 0) {
        pieces.push.apply(pieces, children);
      } else {
        pieces.push(wrapper);
      }
    });
    return pieces;
  }

  function clearInlineTransforms(items) {
    items.forEach((item) => {
      item.style.transform = "";
    });
  }

  function groupChildren(section, selector) {
    return Array.from(section.querySelectorAll(selector + "[data-reveal-group] > *"));
  }

  function runReveal(section, options) {
    const opts = options || {};
    const heads = headingPieces(section);
    const cards = opts.cards || [];

    section.classList.add("is-visible");

    if (!canAnimate() || prefersReducedMotion()) {
      clearInlineTransforms(heads.concat(cards));
      return;
    }

    const cardRise = typeof opts.cardsRise === "number" ? opts.cardsRise : revealMotion.distance;

    if (heads.length > 0) {
      window.anime.set(heads, { opacity: 0, translateY: revealMotion.distance });
    }
    if (cards.length > 0) {
      const fromState = { opacity: 0, translateY: cardRise };
      if (opts.cardsFromX) fromState.translateX = opts.cardsFromX;
      window.anime.set(cards, fromState);
    }

    if (heads.length > 0) {
      window.anime.remove(heads);
      window.anime({
        targets: heads,
        opacity: [0, 1],
        translateY: [revealMotion.distance, 0],
        duration: revealMotion.duration,
        delay: window.anime.stagger(revealMotion.headingGap),
        easing: revealMotion.easing,
        complete: function () {
          clearInlineTransforms(heads);
        },
      });
    }

    if (cards.length > 0) {
      const headTime =
        heads.length > 0 ? (heads.length - 1) * revealMotion.headingGap + revealMotion.duration * 0.45 : 0;
      const staggerOptions = { start: headTime + revealMotion.headingToCards };
      if (opts.cardsReverse) staggerOptions.direction = "reverse";

      const params = {
        targets: cards,
        opacity: [0, 1],
        translateY: [cardRise, 0],
        duration: revealMotion.duration,
        delay: window.anime.stagger(opts.cardGap || revealMotion.cardGap, staggerOptions),
        easing: revealMotion.easing,
        complete: function () {
          clearInlineTransforms(cards);
        },
      };
      if (opts.cardsFromX) params.translateX = [opts.cardsFromX, 0];

      window.anime.remove(cards);
      window.anime(params);
    }
  }

  function revealCredibilitySection(section, observer) {
    const cards = Array.from(section.querySelectorAll("[data-reveal-group] > *"));

    section.classList.add("is-visible");

    if (!canAnimate() || prefersReducedMotion()) {
      clearInlineTransforms(cards);
      animateCounters(section);
      observer.unobserve(section);
      return;
    }

    if (cards.length === 0) {
      animateCounters(section);
      observer.unobserve(section);
      return;
    }

    window.anime.set(cards, { opacity: 0, translateY: revealMotion.distance });
    window.anime.remove(cards);
    window.anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [revealMotion.distance, 0],
      duration: revealMotion.duration,
      delay: window.anime.stagger(revealMotion.cardGap),
      easing: revealMotion.easing,
      complete: function () {
        clearInlineTransforms(cards);
        window.setTimeout(function () {
          animateCounters(section);
        }, 120);
      },
    });

    observer.unobserve(section);
  }

  function revealSection(section, observer) {
    if (section.hasAttribute("data-credibility")) {
      revealCredibilitySection(section, observer);
      return;
    }

    if (section.id === "about") {
      runReveal(section, {
        cards: groupChildren(section, ".process-followups__grid"),
        cardsReverse: true,
        cardsFromX: 22,
        cardsRise: 32,
      });
    } else if (section.classList.contains("audience-section")) {
      runReveal(section, { cards: groupChildren(section, ".audience-cards") });
    } else if (section.id === "faq") {
      runReveal(section, { cards: groupChildren(section, ".faq-list") });
    } else {
      runReveal(section);
    }

    observer.unobserve(section);
  }

  function bindScrollReveals() {
    if (revealSections.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      revealSections.forEach((section) => revealSection(section, { unobserve: function () { } }));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealSection(entry.target, observer);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealSections.forEach((section) => observer.observe(section));
  }

  function animatePress(element, scale) {
    if (!canAnimate() || element.matches(":disabled")) return;

    window.anime.remove(element);
    window.anime({
      targets: element,
      scale: scale,
      duration: motion.quick,
      easing: motion.easeOut,
    });
  }

  function animateCounters(section) {
    if (!canAnimate() || prefersReducedMotion()) return;

    const counters = Array.from(section.querySelectorAll("[data-counter]"));
    counters.forEach(function (el) {
      const target = parseInt(el.dataset.counter, 10);
      const prefix = el.dataset.counterPrefix || "";
      const suffix = el.dataset.counterSuffix || "";
      const obj = { value: 0 };

      window.anime({
        targets: obj,
        value: target,
        duration: 1800,
        easing: "easeOutExpo",
        update: function () {
          el.textContent = prefix + Math.round(obj.value) + suffix;
        },
        complete: function () {
          el.textContent = prefix + target + suffix;
        },
      });
    });
  }

  function bindProcessScroll() {
    const scene = document.querySelector("[data-process-scene]");
    if (!scene) return;

    const grid = document.querySelector("[data-process-grid]");
    const lines = Array.from(document.querySelectorAll("[data-process-line]"));
    const steps = Array.from(document.querySelectorAll("[data-process-step]"));
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let ticking = false;
    let layoutTicking = false;
    let hasCompleted = false;

    function getMarkers() {
      return steps
        .map((step) => step.querySelector(".process-step-marker"))
        .filter(Boolean);
    }

    function layoutProcessLines() {
      if (!grid || lines.length < 2) return;

      const markers = getMarkers();
      if (markers.length < 3) return;

      const gridRect = grid.getBoundingClientRect();
      const isMobile = mobileQuery.matches;

      lines.forEach((line, index) => {
        const markerStart = markers[index];
        const markerEnd = markers[index + 1];
        const startRect = markerStart.getBoundingClientRect();
        const endRect = markerEnd.getBoundingClientRect();

        if (isMobile) {
          const x = startRect.left + startRect.width / 2 - gridRect.left - 1;
          const y1 = startRect.top + startRect.height / 2 - gridRect.top;
          const y2 = endRect.top + endRect.height / 2 - gridRect.top;

          line.style.left = x + "px";
          line.style.top = y1 + "px";
          line.style.width = "2px";
          line.style.height = Math.max(y2 - y1, 0) + "px";
          line.style.transform = "scaleY(var(--line-progress, 0))";
          line.style.transformOrigin = "top center";
          return;
        }

        const y = startRect.top + startRect.height / 2 - gridRect.top - 1;
        const x1 = startRect.left + startRect.width / 2 - gridRect.left;
        const x2 = endRect.left + endRect.width / 2 - gridRect.left;

        line.style.top = y + "px";
        line.style.left = x1 + "px";
        line.style.width = Math.max(x2 - x1, 0) + "px";
        line.style.height = "2px";
        line.style.transform = "scaleX(var(--line-progress, 0))";
        line.style.transformOrigin = "left center";
      });
    }

    function setCompleteState() {
      lines.forEach((line) => line.style.setProperty("--line-progress", "1"));
      steps.forEach((step) => step.classList.add("is-active"));
    }

    function updateProcessScroll() {
      ticking = false;

      if (prefersReducedMotion() || hasCompleted) {
        setCompleteState();
        return;
      }

      let progress;

      if (mobileQuery.matches) {
        const scrollable = scene.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          setCompleteState();
          return;
        }
        progress = clamp(-scene.getBoundingClientRect().top / scrollable, 0, 1);
      } else {
        const rect = (grid || scene).getBoundingClientRect();
        const start = window.innerHeight * 1.0;
        const end = window.innerHeight * 0.1;
        const span = start - end;
        progress = span > 0 ? clamp((start - rect.top) / span, 0, 1) : 1;
      }

      const line1Progress = clamp((progress - 0.08) / 0.34, 0, 1);
      const line2Progress = clamp((progress - 0.42) / 0.34, 0, 1);

      lines.forEach((line, index) => {
        const value = index === 0 ? line1Progress : line2Progress;
        line.style.setProperty("--line-progress", String(value));
      });

      steps.forEach((step, index) => {
        let shouldBeActive;
        if (index === 0) {
          shouldBeActive = progress >= 0.08;
        } else {
          const lineProgress = index === 1 ? line1Progress : line2Progress;
          shouldBeActive = lineProgress >= 0.995;
        }

        if (step.classList.contains("is-active") !== shouldBeActive) {
          step.classList.toggle("is-active", shouldBeActive);
        }
      });

      if (line2Progress >= 0.995) {
        hasCompleted = true;
        setCompleteState();
      }
    }

    function requestProcessUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProcessScroll();
      });
    }

    function requestProcessLayout() {
      if (layoutTicking) return;
      layoutTicking = true;
      window.requestAnimationFrame(function () {
        layoutTicking = false;
        layoutProcessLines();
        updateProcessScroll();
      });
    }

    if (prefersReducedMotion()) {
      layoutProcessLines();
      setCompleteState();
      return;
    }

    window.addEventListener("scroll", requestProcessUpdate, { passive: true });
    window.addEventListener("resize", requestProcessLayout);
    mobileQuery.addEventListener("change", requestProcessLayout);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(requestProcessLayout);
    }
    layoutProcessLines();
    updateProcessScroll();
  }

  function bindCounters() {
    const credibilitySection = document.querySelector("[data-credibility]");
    if (!credibilitySection || credibilitySection.hasAttribute("data-reveal-section")) return;

    if (!("IntersectionObserver" in window)) {
      animateCounters(credibilitySection);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(credibilitySection);
  }

  function bindMicroInteractions() {
    if (interactiveElements.length === 0) return;

    interactiveElements.forEach((element) => {
      element.addEventListener("pointerdown", () => animatePress(element, 0.985));
      element.addEventListener("pointerup", () => animatePress(element, 1));
      element.addEventListener("pointerleave", () => animatePress(element, 1));
      element.addEventListener("blur", () => animatePress(element, 1));
    });
  }

  bindNavigation();
  if (canAnimate()) {
    document.documentElement.classList.add("using-anime");
  }
  bindHeroToggle();
  bindScrollReveals();
  bindProcessScroll();
  bindCounters();
  bindMicroInteractions();
})();
