import { formId } from "./contact-form-config.js";

function setUpContactForm() {
  const form = document.getElementById("blackridge-contact-form");
  if (!form) return;

  const fields = form.querySelector("[data-contact-fields]");
  const submit = form.querySelector("[data-contact-submit]");
  const submitLabel = submit.querySelector("[data-contact-submit-label]");
  const status = document.querySelector("[data-contact-status]");
  const statusTitle = status.querySelector("[data-contact-status-title]");
  const statusMessage = status.querySelector("[data-contact-status-message]");
  const name = form.elements.namedItem("name");
  const subject = form.elements.namedItem("subject");
  const message = form.elements.namedItem("message");
  const subjects = new Set(Array.from(subject.options)
    .filter((option) => option.value && !option.disabled)
    .map((option) => option.value));
  const id = typeof formId === "string" ? formId.trim() : "";
  const endpoint = /^[a-z0-9_-]+$/i.test(id) ? `https://formspree.io/f/${id}` : null;
  let submitting = false;

  function showStatus(state, title = "", text = "") {
    status.dataset.state = state;
    statusTitle.textContent = title;
    statusMessage.textContent = text;
  }

  function showError() {
    showStatus("error", "Nachricht konnte nicht gesendet werden.", "Bitte versuchen Sie es erneut.");
  }

  for (const field of [name, subject, message]) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint || submitting) return;

    const trimmedName = name.value.trim();
    const trimmedMessage = message.value.trim();
    name.setCustomValidity(Array.from(trimmedName).length < name.minLength
      ? "Bitte geben Sie einen Namen mit mindestens zwei Zeichen ein."
      : "");
    subject.setCustomValidity(subjects.has(subject.value) ? "" : "Bitte wählen Sie einen Betreff aus.");
    message.setCustomValidity(Array.from(trimmedMessage).length < message.minLength
      ? "Bitte schreiben Sie eine Nachricht mit mindestens zehn Zeichen."
      : "");
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    if (data.get("_gotcha")) {
      showError();
      return;
    }

    data.set("name", trimmedName);
    data.set("message", trimmedMessage);
    data.delete("privacy");

    const restoreFocus = form.contains(document.activeElement);
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 20_000);

    submitting = true;
    fields.disabled = true;
    submit.disabled = true;
    submitLabel.textContent = "Wird gesendet …";
    form.setAttribute("aria-busy", "true");
    showStatus("pending", "Ihre Nachricht wird gesendet …");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "strict-origin-when-cross-origin",
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Formspree rejected the request.");
      const result = await response.json();

      // Formspree's JSON response includes `next` on success. Keep the current page open.
      if (typeof result?.next !== "string" || !result.next.trim() || "error" in result || "errors" in result) {
        throw new Error("Formspree did not confirm the submission.");
      }

      form.reset();
      showStatus("success", "Nachricht erfolgreich gesendet!", "Vielen Dank für Ihre Nachricht. Ich werde mich bei Gelegenheit bei Ihnen melden.");
    } catch {
      showError();
    } finally {
      window.clearTimeout(deadline);
      submitting = false;
      fields.disabled = false;
      submit.disabled = false;
      submitLabel.textContent = "Nachricht senden";
      form.removeAttribute("aria-busy");
      if (restoreFocus && document.activeElement === document.body) submit.focus({ preventScroll: true });
    }
  });

  if (endpoint) {
    fields.disabled = false;
    submit.disabled = false;
    showStatus("idle");
  }
}

setUpContactForm();
