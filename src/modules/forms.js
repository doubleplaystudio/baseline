/* =====================================================
   Forms – Advanced Validation

   Struktur:
     [data-form-validate]          → Wrapper um das Webflow-Formular
       form
         [data-validate]           → Feldgruppe (Input, Textarea, Select)
           input[min] / input[max] → Mindest-/Maximallänge (optional)
           [data-radiocheck-group] → Radio-/Checkbox-Gruppe, min/max (optional)
         [data-submit]             → eigener Submit-Button
           input[type="submit"]    → versteckter echter Submit

   Zustände auf [data-validate]: is--filled, is--success, is--error
   Spam-Schutz: Absenden unter 5 Sekunden nach Seitenaufruf wird blockiert.
   CSS: css/modules/forms.css
   ===================================================== */

export function initAdvancedFormValidation() {
  const forms = document.querySelectorAll("[data-form-validate]");
  if (!forms.length) return;

  forms.forEach((formContainer) => {
    const startTime = new Date().getTime();

    const form = formContainer.querySelector("form");
    if (!form) return;

    const validateFields = form.querySelectorAll("[data-validate]");
    const dataSubmit = form.querySelector("[data-submit]");
    if (!dataSubmit) return;

    const realSubmitInput = dataSubmit.querySelector('input[type="submit"]');
    if (!realSubmitInput) return;

    function isSpam() {
      const currentTime = new Date().getTime();
      return currentTime - startTime < 5000;
    }

    // Select-Optionen mit ungültigen Werten deaktivieren (Placeholder)
    validateFields.forEach(function (fieldGroup) {
      const select = fieldGroup.querySelector("select");
      if (!select) return;
      select.querySelectorAll("option").forEach(function (option) {
        if (
          option.value === "" ||
          option.value === "disabled" ||
          option.value === "null" ||
          option.value === "false"
        ) {
          option.setAttribute("disabled", "disabled");
        }
      });
    });

    function validateAndStartLiveValidationForAll() {
      let allValid = true;
      let firstInvalidField = null;

      validateFields.forEach(function (fieldGroup) {
        const input = fieldGroup.querySelector("input, textarea, select");
        const radioCheckGroup = fieldGroup.querySelector("[data-radiocheck-group]");
        if (!input && !radioCheckGroup) return;

        if (input) input.__validationStarted = true;
        if (radioCheckGroup) {
          radioCheckGroup.__validationStarted = true;
          const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
          inputs.forEach(function (input) {
            input.__validationStarted = true;
          });
        }

        updateFieldStatus(fieldGroup);

        if (!isValid(fieldGroup)) {
          allValid = false;
          if (!firstInvalidField) {
            firstInvalidField = input || radioCheckGroup.querySelector("input");
          }
        }
      });

      if (!allValid && firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    }

    function isValid(fieldGroup) {
      const radioCheckGroup = fieldGroup.querySelector("[data-radiocheck-group]");

      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        if (!inputs.length) return false; // Guard: leere Gruppe
        const checkedCount = radioCheckGroup.querySelectorAll("input:checked").length;
        const min = parseInt(radioCheckGroup.getAttribute("min")) || 1;
        const max = parseInt(radioCheckGroup.getAttribute("max")) || inputs.length;

        if (inputs[0].type === "radio") return checkedCount >= 1;
        if (inputs.length === 1) return inputs[0].checked;
        return checkedCount >= min && checkedCount <= max;
      }

      const input = fieldGroup.querySelector("input, textarea, select");
      if (!input) return false;

      let valid = true;
      const min = parseInt(input.getAttribute("min")) || 0;
      const max = parseInt(input.getAttribute("max")) || Infinity;
      const value = input.value.trim();
      const length = value.length;

      if (input.tagName.toLowerCase() === "select") {
        if (
          value === "" ||
          value === "disabled" ||
          value === "null" ||
          value === "false"
        ) {
          valid = false;
        }
      } else if (input.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailPattern.test(value);
      } else {
        if (input.hasAttribute("min") && length < min) valid = false;
        if (input.hasAttribute("max") && length > max) valid = false;
      }

      return valid;
    }

    function updateFieldStatus(fieldGroup) {
      const radioCheckGroup = fieldGroup.querySelector("[data-radiocheck-group]");

      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        const checkedInputs = radioCheckGroup.querySelectorAll("input:checked");

        fieldGroup.classList.toggle("is--filled", checkedInputs.length > 0);

        if (isValid(fieldGroup)) {
          fieldGroup.classList.add("is--success");
          fieldGroup.classList.remove("is--error");
        } else {
          fieldGroup.classList.remove("is--success");
          const started = Array.from(inputs).some((input) => input.__validationStarted);
          fieldGroup.classList.toggle("is--error", started);
        }
        return;
      }

      const input = fieldGroup.querySelector("input, textarea, select");
      if (!input) return;

      fieldGroup.classList.toggle("is--filled", !!input.value.trim());

      if (isValid(fieldGroup)) {
        fieldGroup.classList.add("is--success");
        fieldGroup.classList.remove("is--error");
      } else {
        fieldGroup.classList.remove("is--success");
        fieldGroup.classList.toggle("is--error", !!input.__validationStarted);
      }
    }

    // Live-Validierung: startet erst, wenn der Nutzer sinnvoll interagiert hat
    validateFields.forEach(function (fieldGroup) {
      const input = fieldGroup.querySelector("input, textarea, select");
      const radioCheckGroup = fieldGroup.querySelector("[data-radiocheck-group]");

      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(function (input) {
          input.__validationStarted = false;

          input.addEventListener("change", function () {
            requestAnimationFrame(function () {
              if (!input.__validationStarted) {
                const checkedCount = radioCheckGroup.querySelectorAll("input:checked").length;
                const min = parseInt(radioCheckGroup.getAttribute("min")) || 1;
                if (checkedCount >= min) input.__validationStarted = true;
              }
              if (input.__validationStarted) updateFieldStatus(fieldGroup);
            });
          });

          input.addEventListener("blur", function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        });
        return;
      }

      if (!input) return;
      input.__validationStarted = false;

      if (input.tagName.toLowerCase() === "select") {
        input.addEventListener("change", function () {
          input.__validationStarted = true;
          updateFieldStatus(fieldGroup);
        });
        return;
      }

      input.addEventListener("input", function () {
        const length = input.value.trim().length;
        const min = parseInt(input.getAttribute("min")) || 0;
        const max = parseInt(input.getAttribute("max")) || Infinity;

        if (!input.__validationStarted) {
          if (input.type === "email") {
            if (isValid(fieldGroup)) input.__validationStarted = true;
          } else if (
            (input.hasAttribute("min") && length >= min) ||
            (input.hasAttribute("max") && length <= max)
          ) {
            input.__validationStarted = true;
          }
        }

        if (input.__validationStarted) updateFieldStatus(fieldGroup);
      });

      input.addEventListener("blur", function () {
        input.__validationStarted = true;
        updateFieldStatus(fieldGroup);
      });
    });

    function trySubmit() {
      if (!validateAndStartLiveValidationForAll()) return;
      if (isSpam()) {
        alert("Form submitted too quickly. Please try again.");
        return;
      }
      realSubmitInput.click();
    }

    dataSubmit.addEventListener("click", trySubmit);

    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        trySubmit();
      }
    });
  });
}
