/* =====================================================
   Core – Signale zwischen Modulen

   preloaderLeaving
     Wird aufgelöst, sobald der Preloader rausfährt.
     - Gesendet von: modules/preloader.js
                     oder Projekt-Code via window.Baseline.preloaderDone()
                     (bei data-load-mode="custom")
     - Genutzt von:  modules/reveal.js (trigger="preloader")
     Gibt es auf der Seite keinen Preloader, löst reveal.js
     das Signal selbst sofort aus.
   ===================================================== */

let resolveLeaving;

export const preloaderLeaving = new Promise((resolve) => {
  resolveLeaving = resolve;
});

export function signalPreloaderLeaving() {
  resolveLeaving();
}
