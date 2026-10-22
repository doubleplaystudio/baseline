/* =====================================================
   Draggable Marquee

   Attribute:
     data-draggable-marquee-init        → Wrapper
     data-draggable-marquee-collection  → bewegter Container
     data-draggable-marquee-list        → Liste (wird geklont)
     data-duration="20"                 → Sekunden pro Durchlauf
     data-direction="left|right"        → Startrichtung
     data-multiplier="40"               → max. Tempo beim Ziehen
     data-sensitivity="0.01"            → Reaktion auf Drag-Tempo

   Läuft endlos, lässt sich per Maus/Touch anschubsen und
   kehrt danach in die Grundrichtung zurück.
   ===================================================== */

export function initDraggableMarquee() {
  const wrappers = document.querySelectorAll("[data-draggable-marquee-init]");
  if (!wrappers.length) return;

  const getNumberAttr = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute("data-draggable-marquee-init") === "initialized") return;

    const collection = wrapper.querySelector("[data-draggable-marquee-collection]");
    const list = wrapper.querySelector("[data-draggable-marquee-list]");
    if (!collection || !list) return;

    const duration = getNumberAttr(wrapper, "data-duration", 20);
    const multiplier = getNumberAttr(wrapper, "data-multiplier", 40);
    const sensitivity = getNumberAttr(wrapper, "data-sensitivity", 0.01);

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    // Liste so oft klonen, bis die Fläche lückenlos gefüllt ist
    const minRequiredWidth = wrapperWidth + listWidth + 2;
    while (collection.scrollWidth < minRequiredWidth) {
      const listClone = list.cloneNode(true);
      listClone.setAttribute("data-draggable-marquee-clone", "");
      listClone.setAttribute("aria-hidden", "true");
      collection.appendChild(listClone);
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0);
    gsap.set(collection, { x: 0 });

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: "none",
      repeat: -1,
      onReverseComplete: () => marqueeLoop.progress(1),
      modifiers: {
        x: (x) => wrapX(parseFloat(x)) + "px",
      },
    });

    const initialDirection = (wrapper.getAttribute("data-direction") || "left").toLowerCase();
    const baseDirection = initialDirection === "right" ? -1 : 1;

    const timeScale = { value: baseDirection };
    wrapper.setAttribute("data-direction", baseDirection < 0 ? "right" : "left");

    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      wrapper.setAttribute("data-direction", timeScale.value < 0 ? "right" : "left");
    }

    applyTimeScale();

    // Drag: kurz beschleunigen, dann in Ruherichtung zurückfallen
    const marqueeObserver = Observer.create({
      target: wrapper,
      type: "pointer,touch",
      preventDefault: true,
      debounce: false,
      onChangeX: (observerEvent) => {
        let velocity = observerEvent.velocityX * -sensitivity;
        velocity = gsap.utils.clamp(-multiplier, multiplier, velocity);
        gsap.killTweensOf(timeScale);
        const restingDirection = velocity < 0 ? -1 : 1;
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocity, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDirection, duration: 1.0 });
      },
    });

    marqueeLoop.resume();
    applyTimeScale();
    marqueeObserver.enable();

    wrapper.setAttribute("data-draggable-marquee-init", "initialized");
  });
}
