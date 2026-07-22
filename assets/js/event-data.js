fetch("./assets/js/evento.json")
  .then((res) => res.json())
  .then((data) => {
    /* ================= 🔧 HELPERS ================= */

    const isEnabled = (obj) => obj?.enabled !== false;

    const removeSection = (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };

    /* ================= META ================= */

    if (data.meta?.title) document.title = data.meta.title;
    if (data.meta?.lang) document.documentElement.lang = data.meta.lang;

    if (data.meta?.favicon) {
      let link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = `assets/img/${data.meta.favicon}`;
      document.head.appendChild(link);
    }

    /* ================= LOGO ================= */

    const logoEl = document.querySelector(".logo");
    if (logoEl && data.logo?.type === "text") {
      logoEl.textContent = data.logo.value;
    }

    /* ================= AUDIO ================= */

    const audio = document.getElementById("bgSong");
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (audio && isEnabled(data.audio)) {
      audio.src = `assets/audio/${data.audio.src}`;
      audio.loop = data.audio.loop ?? true;
      audio.volume = data.audio.volume ?? 1;

      if (musicIcon && data.audio.icons?.play) {
        musicIcon.src = `assets/img/${data.audio.icons.play}`;
      }

      if (musicToggle && musicIcon) {
        musicToggle.addEventListener("click", () => {
          if (audio.paused) {
            audio.play().catch(() => { });
            musicIcon.src = `assets/img/${data.audio.icons.pause}`;
          } else {
            audio.pause();
            musicIcon.src = `assets/img/${data.audio.icons.play}`;
          }
        });
      }
    }

    /* ================= NAVBAR ================= */

    const navMenu = document.getElementById("navMenu");

    if (navMenu && isEnabled(data.navbar)) {
      navMenu.innerHTML = "";

      data.navbar.items.forEach((item) => {
        if (!item.href || !item.label) return;

        const targetId = item.href.replace("#", "");
        if (data[targetId]?.enabled === false) return;

        navMenu.insertAdjacentHTML(
          "beforeend",
          `<li><a href="${item.href}">${item.label}</a></li>`
        );
      });
    }

    /* ================= HERO ================= */

    if (isEnabled(data.hero)) {
      const hero = data.hero;

      document.getElementById(
        "hero-names"
      ).textContent = `${hero.names.novia} & ${hero.names.novio}`;

      document.querySelector(
        ".hero-bg"
      ).style.backgroundImage = `url('assets/img/${hero.background}')`;

      const labels = hero.countdown_labels;
      if (labels) {
        document.getElementById("label-dias").textContent = labels.dias;
        document.getElementById("label-horas").textContent = labels.horas;
        document.getElementById("label-minutos").textContent = labels.minutos;
        document.getElementById("label-segundos").textContent = labels.segundos;
      }
    } else {
      removeSection("inicio");
    }

    /* ================= PRESENTACIÓN ================= */

    if (isEnabled(data.presentacion)) {
      const p = data.presentacion;
      const padrinosEl = document.getElementById("padrinos");
      const labelPadrinosEl = document.getElementById("label-padrinos");

      document.getElementById("titulo-presentacion").textContent = p.titulo;
      document.getElementById("nombres-presentacion").textContent = p.nombres;
      document.getElementById("frase-presentacion").textContent = p.frase;

      document.getElementById("padres-novia").innerHTML =
        p.padres?.novia?.join("<br>") || "";
      document.getElementById("padres-novio").innerHTML =
        p.padres?.novio?.join("<br>") || "";
      document.getElementById("label-padres-novia").textContent =
        p.labels?.padres_novia || "";
      document.getElementById("label-padres-novio").textContent =
        p.labels?.padres_novio || "";


      if (Array.isArray(p.padrinos) && p.padrinos.length > 0) {
        padrinosEl.innerHTML = p.padrinos.join("<br>");
        labelPadrinosEl.textContent = p.labels?.padrinos || "Padrinos";
      } else {
        padrinosEl?.remove();
        labelPadrinosEl?.remove();
      }

      document.getElementById("texto-final-presentacion").textContent =
        p.texto_final || "";

      const img = document.querySelector(".arco-img img");
      if (img && p.imagen) img.src = `assets/img/${p.imagen}`;
    } else {
      removeSection("presentacion");
    }
    /* ================= UBICACIÓN ================= */

    if (isEnabled(data.ubicacion)) {
      const u = data.ubicacion;

      document.getElementById("ubicacion-titulo").textContent = u.titulo;

      /* ===== FECHA GENERAL ===== */

      const fechaEl = document.getElementById("ubicacion-fecha-general");

      if (fechaEl && data.hero?.fecha_boda) {
        const fecha = new Date(data.hero.fecha_boda);

        fechaEl.textContent = fecha.toLocaleDateString("es-MX", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }

      /* ===== LISTA ===== */

      const lista = document.getElementById("ubicacion-lista");
      lista.innerHTML = "";

      u.lugares
        .filter((l) => isEnabled(l) && l.lugar && l.hora)
        .forEach((lugar) => {
          lista.insertAdjacentHTML(
            "beforeend",
            `
        <div class="ubicacion-card reveal">
          <h3 class="ubicacion-subtitle">${lugar.tipo}</h3>

          <div class="ubicacion-hora">
            ${lugar.hora}
          </div>

          <div class="ubicacion-lugar">
            ${lugar.lugar}
          </div>

          ${lugar.direccion?.length
              ? `
              <div class="ubicacion-direccion">
                ${lugar.direccion.join("<br>")}
              </div>
            `
              : ""
            }

          ${lugar.mapa
              ? `
              <a href="${lugar.mapa}" target="_blank" class="btn-ubicacion">
                Ver ubicación
              </a>
            `
              : ""
            }
        </div>
      `
          );
        });

    } else {
      removeSection("ubicacion");
    }

    /* ================= PROGRAMA ================= */

    if (isEnabled(data.programa)) {
      const programa = data.programa;
      document.getElementById("programa-titulo").textContent = programa.titulo;

      const timeline = document.getElementById("timeline-programa");
      timeline.innerHTML = "";

      programa.items.forEach((item) => {
        timeline.insertAdjacentHTML(
          "beforeend",
          `
          <div class="item ${item.lado} reveal">
            <img class="icon" src="assets/img/${item.icono}">
            <div class="hora">${item.hora}</div>
            <div class="texto">${item.texto}</div>
          </div>
        `
        );
      });
    } else {
      removeSection("programa");
    }

    /* ================= VESTIMENTA ================= */

    if (isEnabled(data.vestimenta)) {
      const v = data.vestimenta;
      document.getElementById("vestimenta-titulo").textContent = v.titulo;
      document.getElementById("vestimenta-icon").src = `assets/img/${v.icono}`;
      document.getElementById("vestimenta-formal").textContent = v.formal;
      document.getElementById("vestimenta-restriccion").innerHTML =
        v.restriccion || "";

      document.getElementById("vestimenta-label-mujeres").textContent =
        v.labels?.mujeres || "Mujeres";

      document.getElementById("vestimenta-label-hombres").textContent =
        v.labels?.hombres || "Hombres";

      document.getElementById("vestimenta-mujeres").innerHTML = v.mujeres;
      document.getElementById("vestimenta-hombres").innerHTML = v.hombres;
    } else {
      removeSection("vestimenta");
    }

    /* ================= REGALOS ================= */

    if (isEnabled(data.regalos)) {
      const r = data.regalos;
      document.getElementById("regalos-titulo").textContent = r.titulo;
      document.querySelector(".regalos-desc").innerHTML = r.descripcion;

      const cont = document.getElementById("regalos-inner");
      cont.innerHTML = "";

      r.items.forEach((item) => {
        cont.insertAdjacentHTML(
          "beforeend",
          `
          <div class="regalo-item reveal-zoom">
            <img src="assets/img/${item.icono}" class="regalo-icon">
            <p class="regalo-label">${item.label}</p>
          </div>
        `
        );
      });
      if (r.boton?.enabled && r.boton.link) {
        cont.insertAdjacentHTML(
          "beforeend",
          `
    <div class="regalo-item reveal">
      <a
        href="${r.boton.link}"
        target="_blank"
        class="btn-regalo"
      >
        ${r.boton.texto}
      </a>
    </div>
    `
        );
      }
    } else {
      removeSection("regalos");
    }

    /* ================= GALERÍA ================= */

    if (isEnabled(data.galeria)) {
      const g = data.galeria;
      document.getElementById("galeria-titulo").textContent = g.titulo;

      const track = document.getElementById("carousel-track");
      track.innerHTML = "";

      g.imagenes.forEach((img) => {
        track.insertAdjacentHTML(
          "beforeend",
          `<img src="assets/img/${img}" class="carousel-img">`
        );
      });
    } else {
      removeSection("galeria");
    }

    /* ================= RSVP ================= */

    if (isEnabled(data.rsvp)) {
      const rsvp = data.rsvp;

      const setText = (id, value = "") => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      };

      const setHTML = (id, value = "") => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = value;
      };

      setText("rsvp-title", rsvp.titulo || "Asistencia");
      setHTML("rsvp-text", rsvp.texto || "");

      /* Invitado personalizado */
      setText("rsvpGuestLabel", rsvp.invitado?.label || "Invitado");
      setText("rsvpGuestName", rsvp.invitado?.nombre || "Invitado");
      setText("rsvpGuestNote", rsvp.invitado?.nota || "");

      /* Asistencia */
      setText(
        "rsvpAttendanceLabel",
        rsvp.asistencia?.label || "¿Podrás acompañarnos?"
      );

      const attendanceSelect = document.getElementById("rsvpAttendance");

      if (attendanceSelect) {
        attendanceSelect.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.textContent =
          rsvp.asistencia?.placeholder ||
          "¿Asistirás a nuestra celebración?";

        attendanceSelect.appendChild(placeholder);

        (rsvp.asistencia?.opciones || []).forEach((opcion) => {
          const option = document.createElement("option");
          option.value = opcion.value;
          option.textContent = opcion.texto;
          attendanceSelect.appendChild(option);
        });
      }

      /* Mensaje */
      setText(
        "rsvpMessageLabel",
        rsvp.mensaje?.label || "Mensaje para los novios (opcional)"
      );

      const message = document.getElementById("rsvpMessage");

      if (message) {
        message.placeholder =
          rsvp.mensaje?.placeholder || "Mensaje para los novios";
      }

      /* Botón y nota */
      setText("rsvpSubmit", rsvp.boton || "Confirmar asistencia");
      setHTML("rsvpNote", rsvp.nota || "");

      /* Datos del resultado */
      setText("rsvpPassLabel", rsvp.pase?.label || "Pases asignados");
      setText("rsvpPassValue", rsvp.pase?.cantidad ?? "");

      setText("rsvpTableLabel", rsvp.mesa?.label || "Mesa asignada");
      setText(
        "rsvpTableValue",
        rsvp.mesa?.numero ? `Mesa ${rsvp.mesa.numero}` : ""
      );

      if (rsvp.pase?.enabled === false) {
        document
          .getElementById("rsvpPassLabel")
          ?.closest(".rsvp-pass-item")
          ?.remove();
      }

      if (rsvp.mesa?.enabled === false) {
        document
          .getElementById("rsvpTableLabel")
          ?.closest(".rsvp-pass-item")
          ?.remove();
      }
    } else {
      removeSection("rsvp");
    }

    /* ================= FOOTER ================= */

    if (data.footer?.enabled !== false) {
      const footer = document.getElementById("footer-text");
      if (footer && data.footer?.text) {
        footer.innerHTML = data.footer.text;
      }
    }

    /* ================= EDITORIAL TEXTS ================= */

    applyEditorialTexts(data.editorial);

    /* ================= GLOBAL ================= */

    window.__EVENT_DATA__ = data;
    document.dispatchEvent(new Event("event:data:ready"));
  })
  .catch((err) => {
    console.error("Error cargando evento.json:", err);
  });

/* ================= EDITORIAL ENGINE ================= */

function applyEditorialTexts(editorial) {
  if (!editorial) return;

  document.querySelectorAll("[data-editorial]").forEach((el) => {
    const key = el.dataset.editorial;
    const cfg = editorial[key];

    if (!cfg || !cfg.enabled || !cfg.text) {
      el.remove();
      return;
    }

    el.textContent = cfg.text;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
  });
}