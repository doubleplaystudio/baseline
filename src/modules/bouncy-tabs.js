/* =====================================================
   Bouncy Tabs

   Attribute:
     data-bouncy-tabs-init       → Wrapper
     data-bouncy-tabs-nav        → Button-Leiste (Pflicht)
     data-bouncy-tabs-button     → Tab-Button (mind. 2)
     data-bouncy-tabs-indicator  → aktiver Hintergrund, federt mit (Pflicht)
     data-bouncy-tabs-ghost      → Hover-Hintergrund (optional)
     data-bouncy-tabs-card       → Karte um die Panels (optional)
     data-bouncy-tabs-panels     → Wrapper der Panels (optional)
     data-bouncy-tabs-panel      → Inhalt je Tab, gleiche Reihenfolge wie Buttons
     data-active                 → Start-Tab (auf Button)

   Auto-Rotate alle 5 s, stoppt bei der ersten Interaktion.
   Tastatur: Pfeile links/rechts, Home, End.
   Timing anpassen: config unten.
   CSS: css/modules/bouncy-tabs.css
   ===================================================== */

const config = {
  travel: 0.35,
  settle: 0.25,
  squashDown: 0.15,
  squashBack: 0.45,
  overshoot: 16,
  cardSquash: 0,
  cardInflate: 0,
  autoRotate: 5000, // ms
};

export function initBouncyContentTabs() {
  const roots = document.querySelectorAll("[data-bouncy-tabs-init]");
  if (!roots.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let instanceCount = 0;

  roots.forEach((root) => {
    const nav = root.querySelector("[data-bouncy-tabs-nav]");
    const indicator = root.querySelector("[data-bouncy-tabs-indicator]");
    const ghost = root.querySelector("[data-bouncy-tabs-ghost]");
    const buttons = nav ? Array.from(nav.querySelectorAll("[data-bouncy-tabs-button]")) : [];
    if (!nav || !indicator || buttons.length < 2) return;

    const card = root.querySelector("[data-bouncy-tabs-card]");
    const panelsWrap = root.querySelector("[data-bouncy-tabs-panels]");
    const panels = panelsWrap
      ? Array.from(panelsWrap.querySelectorAll("[data-bouncy-tabs-panel]"))
      : [];
    const hasCard = Boolean(card && panelsWrap && panels.length);

    // ARIA-Verknüpfung Button ↔ Panel
    instanceCount += 1;
    buttons.forEach((button, i) => {
      const panel = panels[i];
      if (!panel) return;
      if (!button.id) button.id = "bouncy-tabs-" + instanceCount + "-tab-" + (i + 1);
      if (!panel.id) panel.id = "bouncy-tabs-" + instanceCount + "-panel-" + (i + 1);
      button.setAttribute("aria-controls", panel.id);
      panel.setAttribute("aria-labelledby", button.id);
    });

    let activeIndex = Math.max(0, buttons.findIndex((b) => b.hasAttribute("data-active")));
    const pos = { left: 0, right: 0 };
    let ghostVisible = false;
    const dur = (d) => (reduceMotion.matches ? 0 : d);

    // ── Auto-Rotate ──────────────────────────────────────
    let autoInterval = null;
    let userInteracted = false;

    function startAuto() {
      if (userInteracted) return;
      autoInterval = setInterval(() => {
        goTo((activeIndex + 1) % buttons.length);
      }, config.autoRotate);
    }

    function stopAuto() {
      clearInterval(autoInterval);
      autoInterval = null;
      userInteracted = true;
    }

    // ── Zustand & Layout ─────────────────────────────────
    function syncButtonState() {
      buttons.forEach((b, i) => {
        b.toggleAttribute("data-active", i === activeIndex);
        b.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
        b.tabIndex = i === activeIndex ? 0 : -1;
        b.style.color = i === activeIndex ? "#fbfbfb" : "";
      });
    }

    function rectFor(button) {
      return {
        left: button.offsetLeft,
        right: button.offsetLeft + button.offsetWidth,
        top: button.offsetTop,
        height: button.offsetHeight,
      };
    }

    function render() {
      gsap.set(indicator, { x: pos.left, width: pos.right - pos.left });
    }

    function place(index) {
      const target = rectFor(buttons[index]);
      pos.left = target.left;
      pos.right = target.right;
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);
      gsap.set(indicator, { scaleY: 1, y: target.top, height: target.height });
      render();
    }

    function setPanelsHeight() {
      if (hasCard && panels[activeIndex]) {
        gsap.set(panelsWrap, { height: panels[activeIndex].offsetHeight });
      }
    }

    function swapPanelsInstant() {
      if (!hasCard) return;
      panels.forEach((p, i) => {
        gsap.killTweensOf(p);
        gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0, x: 0 });
        p.toggleAttribute("data-active", i === activeIndex);
      });
      gsap.set(card, { scaleX: 1, scaleY: 1, x: 0 });
      setPanelsHeight();
    }

    // ── Panel-Wechsel ────────────────────────────────────
    function transitionCard(prevIndex, movingRight) {
      if (!hasCard) return;
      const direction = movingRight ? 1 : -1;
      const incoming = panels[activeIndex];
      const outgoing = panels[prevIndex];
      if (!incoming || !outgoing) return;

      panels.forEach((p) => {
        if (p !== incoming && p !== outgoing) {
          gsap.killTweensOf(p);
          gsap.set(p, { autoAlpha: 0, x: 0 });
          p.removeAttribute("data-active");
        }
      });
      incoming.setAttribute("data-active", "");
      outgoing.removeAttribute("data-active");

      gsap.killTweensOf([card, panelsWrap, incoming, outgoing]);
      gsap.set(card, { transformOrigin: "50% 50%" });
      const targetHeight = incoming.offsetHeight;

      gsap.timeline()
        .to(card, {
          scaleX: 0.96,
          scaleY: 1.02,
          x: direction * 10,
          duration: config.cardSquash,
          ease: "power2.out",
        }, 0)
        .to(outgoing, { x: direction * -35, autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0)
        .to(panelsWrap, { height: targetHeight, duration: 0.3, ease: "power2.inOut" }, 0.1)
        .fromTo(
          incoming,
          { x: direction * 35, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
          config.cardSquash
        )
        .to(card, {
          scaleX: 1,
          scaleY: 1,
          x: 0,
          duration: config.cardInflate,
          ease: "back.out(2)",
        }, config.cardSquash)
        .set(outgoing, { x: 0 });
    }

    // ── Indikator-Bewegung ───────────────────────────────
    function goTo(index) {
      if (index === activeIndex) return;
      const prevIndex = activeIndex;
      const movingRight = index > activeIndex;
      activeIndex = index;
      syncButtonState();

      if (reduceMotion.matches) {
        place(index);
        swapPanelsInstant();
        return;
      }

      transitionCard(prevIndex, movingRight);

      const target = rectFor(buttons[index]);
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);

      const hDir = target.left === pos.left ? (movingRight ? 1 : -1) : (target.left > pos.left ? 1 : -1);
      const distance = Math.abs(target.left - pos.left);
      const maxOvershoot = Math.max(6, config.overshoot);
      let overshoot = gsap.utils.clamp(6, maxOvershoot, distance * 0.08) * hDir;
      if (hDir > 0) {
        overshoot = Math.min(overshoot, nav.clientWidth - target.right);
      } else {
        overshoot = Math.max(overshoot, -target.left);
      }

      gsap.set(indicator, { transformOrigin: "50% 50%" });
      gsap.to(indicator, {
        y: target.top,
        height: target.height,
        duration: config.travel,
        ease: "power3.out",
      });
      gsap.timeline()
        .to(pos, {
          left: target.left + overshoot,
          right: target.right + overshoot,
          duration: config.travel,
          ease: "power3.out",
          onUpdate: render,
        })
        .to(pos, {
          left: target.left,
          right: target.right,
          duration: config.settle,
          ease: "power2.inOut",
          onUpdate: render,
        });
      gsap.timeline()
        .to(indicator, { scaleY: 0.78, duration: config.squashDown, ease: "power2.out" })
        .to(indicator, { scaleY: 1, duration: config.squashBack, ease: "back.out(2.5)" });
    }

    // ── Hover-Ghost ──────────────────────────────────────
    function moveGhost(button) {
      if (!ghost) return;
      const target = rectFor(button);
      const box = {
        x: target.left,
        y: target.top,
        width: target.right - target.left,
        height: target.height,
      };
      if (!ghostVisible) {
        ghostVisible = true;
        gsap.killTweensOf(ghost);
        gsap.set(ghost, box);
        gsap.to(ghost, { autoAlpha: 1, duration: dur(0.25), ease: "power2.out" });
      } else {
        gsap.to(ghost, { ...box, autoAlpha: 1, duration: dur(0.3), ease: "power3.out" });
      }
    }

    function hideGhost() {
      if (!ghost) return;
      ghostVisible = false;
      gsap.to(ghost, { autoAlpha: 0, duration: dur(0.2), ease: "power1.out" });
    }

    function refreshLayout() {
      const rows = new Set(buttons.map((b) => b.offsetTop));
      nav.toggleAttribute("data-wrapped", rows.size > 1);
      place(activeIndex);
      setPanelsHeight();
    }

    // ── Events ───────────────────────────────────────────
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        stopAuto();
        goTo(index);
      });
      button.addEventListener("mouseenter", () => moveGhost(button));
    });

    nav.addEventListener("mouseleave", hideGhost);
    nav.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = Math.min(buttons.length - 1, activeIndex + 1);
      if (event.key === "ArrowLeft") next = Math.max(0, activeIndex - 1);
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next === null) return;
      event.preventDefault();
      if (next !== activeIndex) {
        stopAuto();
        goTo(next);
        buttons[next].focus();
      }
    });

    window.addEventListener("resize", refreshLayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshLayout);

    // ── Start ────────────────────────────────────────────
    if (ghost) gsap.set(ghost, { autoAlpha: 0 });
    panels.forEach((p, i) => gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0 }));

    syncButtonState();
    refreshLayout();
    startAuto();
  });
}
