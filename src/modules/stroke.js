/* =====================================================
   Stroke – Scroll Animation

   Attribut: animate-stroke (ohne Wert, "true" geht weiterhin)
   Früher zusätzlich an die Klasse .stroke gebunden, jetzt nur noch das Attribut.
   Die Linie zeichnet sich beim Scrollen von links nach rechts.
   ===================================================== */

export function initStroke() {
  const strokes = document.querySelectorAll("[animate-stroke]");
  if (!strokes.length) return;

  strokes.forEach((stroke) => {
    gsap.set(stroke, { scaleX: 0 });

    gsap.to(stroke, {
      scaleX: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: stroke,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });
}
