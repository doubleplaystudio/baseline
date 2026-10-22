/* =====================================================
   Core – Hilfsfunktionen
   ===================================================== */

/**
 * Führt fn aus, sobald das DOM bereit ist.
 * Funktioniert auch, wenn DOMContentLoaded schon vorbei ist
 * (z. B. bei Laden mit defer oder async).
 */
export function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

/**
 * Führt ein Modul isoliert aus.
 * Ein Fehler in einem Modul stoppt die anderen nicht,
 * sondern erscheint als Warnung in der Konsole.
 */
export function run(fn) {
  try {
    fn();
  } catch (e) {
    console.warn("[Baseline] " + fn.name + " failed", e);
  }
}
