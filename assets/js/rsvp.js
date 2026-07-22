(function () {
  let initialized = false;

  function initRSVP() {
    if (initialized) return;

    const data = window.__EVENT_DATA__;
    const rsvp = data?.rsvp;

    const form = document.getElementById("rsvpForm");
    const finalBox = document.getElementById("rsvp-final");
    const section = document.getElementById("rsvp");

    const attendanceSelect = document.getElementById("rsvpAttendance");
    const messageInput = document.getElementById("rsvpMessage");

    if (
      !rsvp ||
      !form ||
      !finalBox ||
      !section ||
      !attendanceSelect
    ) {
      return;
    }

    initialized = true;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const attendance = attendanceSelect.value;
      const message = messageInput?.value.trim() || "";

      if (!attendance) {
        attendanceSelect.focus();
        return;
      }

      const guestName =
        rsvp.invitado?.nombre || "Invitado";

      const finalTitle =
        document.getElementById("rsvp-final-title");

      const finalText =
        document.getElementById("rsvp-final-text");

      const finalName =
        document.getElementById("rsvp-names");

      const confirmedGuest =
        document.getElementById("rsvpConfirmedName");

      const passInfo =
        section.querySelector(".rsvp-pass-info");

      if (confirmedGuest) {
        confirmedGuest.textContent = guestName;
      }

      if (finalTitle) {
        finalTitle.textContent =
          rsvp.final?.titulo || "¡Gracias por confirmar!";
      }

      if (finalText) {
        finalText.innerHTML =
          attendance === "si"
            ? rsvp.final?.texto_si ||
              "Nos encantará compartir este día contigo."
            : rsvp.final?.texto_no ||
              "Gracias por informarnos.";
      }

      if (finalName) {
        finalName.textContent = rsvp.final?.firma || "";
      }

      if (passInfo) {
        passInfo.classList.remove("hidden");
      }

      form.classList.add("hidden");
      finalBox.classList.remove("hidden");
      section.classList.add("completed");

      console.log({
        invitado: guestName,
        asistencia: attendance,
        mensaje: message,
        pases: rsvp.pase?.cantidad,
        mesa: rsvp.mesa?.numero
      });

      finalBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  document.addEventListener("event:data:ready", initRSVP);

  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();