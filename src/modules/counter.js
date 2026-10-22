/* =====================================================
   Number Counter

   Attribute:
     counter="true"           → Element zählt hoch
     data-count="250"         → Zielwert (Pflicht)
     counter-delay="0.5"      → Verzögerung in Sekunden (optional)
     counter-trigger="load"   → sofort statt beim Scrollen (optional)
     counter-tip="true"       → Suffix-Element im selben Parent,
                                wird nach dem Zählen eingeblendet
   ===================================================== */

export function initCounter() {
  const counters = document.querySelectorAll('[counter="true"]');
  if (!counters.length) return;

  counters.forEach((el) => {
    const endValue = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(endValue)) return;

    const delay = parseFloat(el.getAttribute("counter-delay")) || 0;
    const playOnLoad = el.getAttribute("counter-trigger") === "load";

    // Suffix-Element im selben Parent suchen
    const parent = el.parentElement;
    const tip = parent ? parent.querySelector('[counter-tip="true"]') : null;
    if (tip) {
      tip.style.opacity = "0";
      tip.style.transition = "opacity 0.4s ease";
    }

    el.textContent = "0";
    const counter = { value: 0 };

    const tweenVars = {
      value: endValue,
      duration: 3,
      delay: delay,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = Math.round(counter.value);
      },
      onComplete: () => {
        if (tip) tip.style.opacity = "1";
      },
    };

    // Default: ScrollTrigger – bei counter-trigger="load" sofort
    if (!playOnLoad) {
      tweenVars.scrollTrigger = {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      };
    }

    gsap.to(counter, tweenVars);
  });
}
