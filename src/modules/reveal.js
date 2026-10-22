/* =====================================================
   Reveal – Text & Block Animationen

   Animationen (auf das Element selbst):
     split-letter → Headline, Buchstabe für Buchstabe
     split-lines  → Paragraph, Zeile für Zeile
     fade-block   → Element einfaden (z. B. Buttons)

   Trigger (auf das Element oder einen Parent):
     ohne Attribut       → beim Scrollen (Default)
     trigger="load"      → sofort beim Laden der Seite
     trigger="preloader" → sobald der Preloader rausfährt
                           (ohne Preloader auf der Seite: sofort)

   Optional (auf das Element selbst):
     data-delay="0.2"    → Verzögerung in Sekunden

   Beispiel Hero:
     <section trigger="preloader">
       <h1 split-letter>…</h1>
       <p split-lines data-delay="0.3">…</p>
       <a fade-block data-delay="0.6">…</a>
     </section>

   Timing anpassen: revealConfig unten.
   CSS: css/modules/reveal.css (vorab verstecken)
        css/a11y.css (Reduced Motion)
   Unterlängen: Mask-Klasse .line-mask (Padding im Webflow-Embed)
   ===================================================== */

import { REVEAL_SELECTOR } from "../core/constants.js";
import { preloaderLeaving, signalPreloaderLeaving } from "../core/signals.js";

const revealConfig = {
  start: "clamp(top 85%)",   // Scroll-Startpunkt
  preloaderTimeout: 8000,    // Sicherheitsnetz, falls der Preloader hängt
  letter: { duration: 0.6, each: 0.02, maxStagger: 0.6, ease: "power3.out" },
  lines:  { duration: 0.8, stagger: 0.08, ease: "expo.out" },
  block:  { duration: 0.6, ease: "power3.out" },
};

export function initReveal() {
  const elements = document.querySelectorAll(REVEAL_SELECTOR);
  if (!elements.length) return;

  // Reduced Motion: CSS blendet alles ein, keine Animation
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Kein Preloader auf der Seite → trigger="preloader" verhält sich wie "load"
  if (!document.querySelector("[data-load-wrap]")) signalPreloaderLeaving();

  // Trigger vom Element oder nächsten Parent lesen
  const getTrigger = (el) => {
    const host = el.closest("[trigger]");
    const value = host ? host.getAttribute("trigger") : "";
    return value === "load" || value === "preloader" ? value : "scroll";
  };

  // Timeline passend zum Trigger erzeugen
  const revealTimeline = (el) => {
    const delay = parseFloat(el.getAttribute("data-delay")) || 0;
    const trigger = getTrigger(el);

    if (trigger === "load") {
      return gsap.timeline({ delay });
    }

    if (trigger === "preloader") {
      const tl = gsap.timeline({ delay, paused: true });
      // Nur starten, wenn noch nicht gelaufen (auch nach Re-Split durch Resize)
      const start = () => {
        if (tl.progress() === 0) tl.restart(true); // true = Delay behalten
      };
      preloaderLeaving.then(start);
      setTimeout(start, revealConfig.preloaderTimeout);
      return tl;
    }

    return gsap.timeline({
      delay,
      scrollTrigger: { trigger: el, start: revealConfig.start, once: true },
    });
  };

  // Falls ein Element fehlschlägt: sichtbar machen statt unsichtbar hängen lassen
  const safe = (el, fn) => {
    try {
      fn();
    } catch (e) {
      el.style.visibility = "visible";
      el.style.opacity = "1";
      console.warn("[Baseline] initReveal: Element übersprungen", el, e);
    }
  };

  // Headlines: Buchstabe für Buchstabe
  document.querySelectorAll("[split-letter]").forEach((el) => safe(el, () => {
    SplitText.create(el, {
      type: "chars, words, lines", // words verhindert Umbrüche mitten im Wort
      mask: "lines",
      linesClass: "line",          // Mask-Klasse: .line-mask
      autoSplit: true,             // re-split bei Resize & nach Font-Load
      onSplit(instance) {
        gsap.set(el, { autoAlpha: 1 });
        const c = revealConfig.letter;
        return revealTimeline(el).from(instance.chars, {
          yPercent: 110,
          autoAlpha: 0,
          duration: c.duration,
          ease: c.ease,
          stagger: { amount: Math.min(instance.chars.length * c.each, c.maxStagger) },
        });
      },
    });
  }));

  // Paragraphen: Zeile für Zeile
  document.querySelectorAll("[split-lines]").forEach((el) => safe(el, () => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      autoSplit: true,
      onSplit(instance) {
        gsap.set(el, { autoAlpha: 1 });
        const c = revealConfig.lines;
        return revealTimeline(el).from(instance.lines, {
          yPercent: 110,
          duration: c.duration,
          stagger: c.stagger,
          ease: c.ease,
        });
      },
    });
  }));

  // Blöcke: einfaden
  document.querySelectorAll("[fade-block]").forEach((el) => safe(el, () => {
    const c = revealConfig.block;
    revealTimeline(el).fromTo(el,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: c.duration, ease: c.ease }
    );
  }));
}
