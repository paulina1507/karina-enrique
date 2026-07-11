(function () {
  let initialized = false;

  function initRSVP() {
    if (initialized) return;
    initialized = true;

    const formBox = document.getElementById("rsvp-form");
    const finalBox = document.getElementById("rsvp-final");
    const section = document.getElementById("rsvp");

    if (!formBox || !finalBox || !section) return;

    const btnYes = formBox.querySelector(".rsvp-btn.yes");
    const btnNo = formBox.querySelector(".rsvp-btn.no");

    const titleEl = document.getElementById("rsvp-final-title");
    const textEl = document.getElementById("rsvp-final-text");
    const namesEl = document.getElementById("rsvp-names");

    const passInfo = section.querySelector(".rsvp-pass-info");
    const passLabel = section.querySelector("#rsvpPassLabel");
    const passValue = section.querySelector("#rsvpPassValue");
    const tableLabel = section.querySelector("#rsvpTableLabel");
    const tableValue = section.querySelector("#rsvpTableValue");

    const data = window.__EVENT_DATA__;
    if (!data?.rsvp?.final) return;

    function showFinal() {
      // Ocultar formulario
      formBox.classList.add("hidden");
      section.classList.add("completed");

      // Mostrar bloque pase / mesa
      if (passInfo) passInfo.classList.remove("hidden");

      // 🟢 PASE
      if (
        data.rsvp.pase?.cantidad &&
        passLabel &&
        passValue
      ) {
        passLabel.textContent = data.rsvp.pase.label || "Pase para";
        passValue.textContent = `${data.rsvp.pase.cantidad} personas`;
      }

      // 🟢 MESA
      if (
        data.rsvp.mesa?.numero &&
        tableLabel &&
        tableValue
      ) {
        tableLabel.textContent = data.rsvp.mesa.label || "Mesa asignada";
        tableValue.textContent = `Mesa ${data.rsvp.mesa.numero}`;
      }

      // Texto final
      titleEl.textContent = data.rsvp.final.titulo || "";
      textEl.innerHTML = data.rsvp.final.texto || "";
      namesEl.textContent = data.rsvp.final.firma || "";

      finalBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    btnYes?.addEventListener("click", showFinal);
    btnNo?.addEventListener("click", showFinal);
  }

  // Evento principal
  document.addEventListener("event:data:ready", initRSVP);

  // Fallback si los datos ya existen
  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();
