/* =====================================================
   Copy Email – E-Mail in die Zwischenablage

   Struktur:
     .copy-email-button               → Button
       data-copy-email="hi@…"         → E-Mail (optional)
       [data-copy-email-element]      → sonst: Text aus diesem Kind
   Nach dem Kopieren: data-copy-button="copied" auf dem Button.
   CSS: css/modules/copy-email.css
   ===================================================== */

export function initCopyEmailClipboard() {
  const buttons = document.querySelectorAll(".copy-email-button");
  if (!buttons.length) return;

  const copyEmail = (button) => {
    const emailEl = button.querySelector("[data-copy-email-element]");
    const email =
      button.getAttribute("data-copy-email") ||
      (emailEl ? emailEl.textContent.trim() : "");
    if (!email || !navigator.clipboard) return;

    navigator.clipboard.writeText(email).then(() => {
      button.setAttribute("data-copy-button", "copied");
      button.setAttribute("aria-label", "Email copied to clipboard!");
    });
  };

  const handleInteraction = (e) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
    ) {
      e.preventDefault();
      copyEmail(e.currentTarget);
    }
  };

  const reset = (button) => {
    button.removeAttribute("data-copy-button");
    button.setAttribute("aria-label", "Copy email to clipboard");
  };

  buttons.forEach((button) => {
    button.addEventListener("click", handleInteraction);
    button.addEventListener("keydown", handleInteraction);
    button.addEventListener("mouseleave", () => {
      reset(button);
      button.blur(); // Keyboard-Focus-Styling entfernen
    });
    button.addEventListener("blur", () => reset(button));
  });
}
