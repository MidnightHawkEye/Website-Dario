import { formEnabled, formId } from "./contact-form-config.js";

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
  const email = form.elements.namedItem("email");
  const subject = form.elements.namedItem("subject");
  const message = form.elements.namedItem("message");
  const privacy = form.elements.namedItem("privacy");
  const english = document.documentElement.lang === "en";
  const copy = english ? {
    error: "Your message could not be sent.",
    retry: "Please try again.",
    name: "Enter a name with at least two characters.",
    email: "Enter a valid email address.",
    subject: "Select a subject.",
    message: "Enter a message with at least ten characters.",
    privacy: "Confirm that you have read the privacy notice.",
    sending: "Sending …",
    pending: "Your message is being sent …",
    success: "Message sent!",
    thanks: "Thank you for your message. I’ll get back to you when I can.",
    send: "Send Message",
  } : {
    error: "Nachricht konnte nicht gesendet werden.",
    retry: "Bitte versuchen Sie es erneut.",
    name: "Bitte geben Sie einen Namen mit mindestens zwei Zeichen ein.",
    subject: "Bitte wählen Sie einen Betreff aus.",
    message: "Bitte schreiben Sie eine Nachricht mit mindestens zehn Zeichen.",
    sending: "Wird gesendet …",
    pending: "Ihre Nachricht wird gesendet …",
    success: "Nachricht erfolgreich gesendet!",
    thanks: "Vielen Dank für Ihre Nachricht. Ich werde mich bei Gelegenheit bei Ihnen melden.",
    send: "Nachricht senden",
  };
  const subjects = new Set(Array.from(subject.options)
    .filter((option) => option.value && !option.disabled)
    .map((option) => option.value));
  const id = typeof formId === "string" ? formId.trim() : "";
  const endpoint = formEnabled && /^[a-z0-9_-]+$/i.test(id) ? `https://formspree.io/f/${id}` : null;
  let submitting = false;

  function showStatus(state, title = "", text = "") {
    status.dataset.state = state;
    statusTitle.textContent = title;
    statusMessage.textContent = text;
  }

  function showError() {
    showStatus("error", copy.error, copy.retry);
  }

  for (const field of [name, email, subject, message, privacy]) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }

  if (english) {
    form.addEventListener("invalid", (event) => {
      const field = event.target;
      if (field.validity.valueMissing || field.validity.typeMismatch || field.validity.tooShort) {
        field.setCustomValidity(copy[field.name] ?? "");
      }
    }, true);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint || submitting) return;

    const trimmedName = name.value.trim();
    const trimmedMessage = message.value.trim();
    name.setCustomValidity(trimmedName && Array.from(trimmedName).length < name.minLength
      ? copy.name
      : "");
    subject.setCustomValidity(subjects.has(subject.value) ? "" : copy.subject);
    message.setCustomValidity(Array.from(trimmedMessage).length < message.minLength
      ? copy.message
      : "");
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    if (data.get("_gotcha")) {
      showError();
      return;
    }

    if (trimmedName) data.set("name", trimmedName);
    else data.delete("name");
    data.set("message", trimmedMessage);
    data.delete("privacy");

    const restoreFocus = form.contains(document.activeElement);
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 20_000);

    submitting = true;
    fields.disabled = true;
    submit.disabled = true;
    submitLabel.textContent = copy.sending;
    form.setAttribute("aria-busy", "true");
    showStatus("pending", copy.pending);

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
      showStatus("success", copy.success, copy.thanks);
    } catch {
      showError();
    } finally {
      window.clearTimeout(deadline);
      submitting = false;
      fields.disabled = false;
      submit.disabled = false;
      submitLabel.textContent = copy.send;
      form.removeAttribute("aria-busy");
      if (restoreFocus && document.activeElement === document.body) submit.focus({ preventScroll: true });
    }
  });

  if (endpoint) {
    form.hidden = false;
    fields.disabled = false;
    submit.disabled = false;
    showStatus("idle");
  }
}

setUpContactForm();
