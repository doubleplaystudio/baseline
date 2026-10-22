/* =====================================================
   Preloader – Logo Reveal

   Attribute:
     data-load-wrap       → Wrapper (Pflicht, sonst läuft nichts)
     data-load-container  → Inhalt (Logo, Text, Progress)
     data-load-bg         → Hintergrund, fährt am Ende nach oben raus
     data-load-progress   → Fortschrittsbalken
     data-load-logo       → Logo, wird per clip-path aufgedeckt
     data-load-text       → zwei Texte, die nacheinander erscheinen
     data-load-reset      → Elemente, die bis zum Start unsichtbar sind (FOUC)

   Signal: Sobald der Hintergrund rausfährt, startet alles mit
   trigger="preloader" (siehe reveal.js, core/signals.js).
   CSS: css/base.css (Loader)
   ===================================================== */

import { signalPreloaderLeaving } from "../core/signals.js";

export function initLogoRevealLoader() {
  const wrap = document.querySelector("[data-load-wrap]");
  if (!wrap) return;

  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");

  const container = wrap.querySelector("[data-load-container]");
  const bg = wrap.querySelector("[data-load-bg]");
  const progressBar = wrap.querySelector("[data-load-progress]");
  const logo = wrap.querySelector("[data-load-logo]");
  const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));

  // Reset-Ziele, die *keine* Split-Text-Ziele sind
  const resetTargets = Array.from(
    wrap.querySelectorAll("[data-load-reset]:not([data-load-text])")
  );

  // Haupt-Timeline
  const loadTimeline = gsap.timeline({
    defaults: { ease: "loader", duration: 3 },
  })
    .set(wrap, { display: "block" })
    .to(progressBar, { scaleX: 1 })
    .to(logo, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
    .to(container, { autoAlpha: 0, duration: 0.5 })
    .to(progressBar, { scaleX: 0, transformOrigin: "right center", duration: 0.5 }, "<")
    .add("hideContent", "<")
    .call(signalPreloaderLeaving, null, "hideContent") // Reveal mit trigger="preloader" startet
    .to(bg, { yPercent: -101, duration: 1 }, "hideContent")
    .set(wrap, { display: "none" })
    .call(() => ScrollTrigger.refresh()); // Layout final → Sticky & Scroll-Trigger neu berechnen (Safari)

  // FOUC-Elemente zu Beginn sichtbar machen
  if (resetTargets.length) {
    loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
  }

  // Zwei Texte: splitten und in die Timeline einhängen
  if (textElements.length >= 2) {
    const firstWord = new SplitText(textElements[0], { type: "lines,chars", mask: "lines" });
    const secondWord = new SplitText(textElements[1], { type: "lines,chars", mask: "lines" });

    gsap.set([firstWord.chars, secondWord.chars], { autoAlpha: 0, yPercent: 125 });
    gsap.set(textElements, { autoAlpha: 1 });

    // Erster Text rein
    loadTimeline.to(firstWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 },
    }, 0);

    // Erster Text raus, zweiter rein
    loadTimeline.to(firstWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 },
    }, ">+=0.4");

    loadTimeline.to(secondWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 },
    }, "<");

    // Zweiter Text raus
    loadTimeline.to(secondWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 },
    }, "hideContent-=0.5");
  }
}
