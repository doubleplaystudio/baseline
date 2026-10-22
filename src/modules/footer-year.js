/* =====================================================
   Footer – Dynamisches Jahr

   Element mit id="year" bekommt das aktuelle Jahr.
   ===================================================== */

export function initFooterYear() {
  const yearElement = document.getElementById("year");
  if (!yearElement) return;
  yearElement.textContent = new Date().getFullYear();
}
