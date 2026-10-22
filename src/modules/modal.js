/* =====================================================
   Modal – Pop Up

   Attribute:
     data-modal-target="name"  → Trigger, öffnet Modal "name"
     data-modal-name="name"    → das Modal selbst
     data-modal-group-status   → Overlay/Wrapper aller Modals
     data-modal-close          → schließt alle Modals
   Escape schließt ebenfalls.
   CSS: css/modules/modal.css
   ===================================================== */

export function initModalBasic() {
  const modalTargets = document.querySelectorAll("[data-modal-target]");
  if (!modalTargets.length) return;

  const modalGroup = document.querySelector("[data-modal-group-status]");
  const modals = document.querySelectorAll("[data-modal-name]");

  // Öffnen
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener("click", function () {
      const name = this.getAttribute("data-modal-target");

      // Erst alle schließen
      modalTargets.forEach((t) => t.setAttribute("data-modal-status", "not-active"));
      modals.forEach((m) => m.setAttribute("data-modal-status", "not-active"));

      // Dann das angeklickte aktivieren
      const target = document.querySelector(`[data-modal-target="${name}"]`);
      const modal = document.querySelector(`[data-modal-name="${name}"]`);
      if (target) target.setAttribute("data-modal-status", "active");
      if (modal) modal.setAttribute("data-modal-status", "active");

      if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "active");
    });
  });

  function closeAllModals() {
    modalTargets.forEach((t) => t.setAttribute("data-modal-status", "not-active"));
    if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "not-active");
  }

  // Schließen
  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });
}
