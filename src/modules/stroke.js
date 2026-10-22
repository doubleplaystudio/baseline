/* =====================================================
   Stroke – Scroll Animation

   Attribut: animate-stroke="true" auf .stroke
   Die Linie zeichnet sich beim Scrollen von links nach rechts.
   ===================================================== */

export function initStroke() {
  const strokes = document.querySelectorAll('.stroke[animate-stroke="true"]');
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
