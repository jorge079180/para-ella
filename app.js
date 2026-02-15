(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // ===== Storage keys =====
  const OPEN_KEY = "sv_open_count_v1";
  const HEARTS_KEY = "sv_hearts_v1";

  // ===== Secret key (cámbiala si quieres) =====
  const SECRET_KEY = "sushi"; // minúsculas, sin acentos

  // ===== Helpers =====
  const safe = (fn) => { try { fn(); } catch {} };

  // ===== Fecha =====
  safe(() => {
    const now = new Date();
    const today = $("#today");
    if (today) today.textContent = now.toLocaleDateString("es-ES", { day:"2-digit", month:"short" });
  });

  // ===== Visitas =====
  const openCount = Number(localStorage.getItem(OPEN_KEY) || "0") + 1;
  localStorage.setItem(OPEN_KEY, String(openCount));
  safe(() => { const el = $("#countOpen"); if (el) el.textContent = String(openCount); });
  safe(() => { const el = $("#countOpen2"); if (el) el.textContent = String(openCount); });

  // ===== Hearts init =====
  safe(() => {
    const hearts = Number(localStorage.getItem(HEARTS_KEY) || "0");
    const el = $("#heartsSaved");
    if (el) el.textContent = String(hearts);
  });

  // ===== Reveal text buttons (+ leer) =====
  $$("[data-reveal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-reveal");
      const el = document.getElementById(id);
      if (!el) return;
      const on = el.classList.toggle("on");
      btn.textContent = on ? "− cerrar" : "+ leer";
    });
  });

  // ===== Filter chips =====
  const chips = $$("#chips .chip");
  const songs = $$("#gridSongs .song");
  function setFilter(tag){
    chips.forEach(c => c.classList.toggle("on", c.dataset.filter === tag));
    songs.forEach(card => {
      const ctag = card.dataset.tag;
      const show = (tag === "all") || (ctag === tag);
      card.style.display = show ? "" : "none";
    });
  }
  chips.forEach(ch => ch.addEventListener("click", () => setFilter(ch.dataset.filter)));

  // ===== Scroll start =====
  safe(() => {
    const btnStart = $("#btnStart");
    const sectionPhoto = $("#sectionPhoto");
    if (btnStart && sectionPhoto){
      btnStart.addEventListener("click", () => {
        sectionPhoto.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  // ===== Theme toggle =====
  safe(() => {
    const btnTheme = $("#btnTheme");
    const modeLabel = $("#modeLabel");
    const icon = btnTheme?.querySelector(".icon");
    const sync = () => {
      const alt = document.body.classList.contains("alt");
      if (modeLabel) modeLabel.textContent = alt ? "noche" : "suave";
      if (icon) icon.textContent = alt ? "☀" : "☾";
    };
    if (btnTheme){
      btnTheme.addEventListener("click", () => {
        document.body.classList.toggle("alt");
        sync();
      });
      sync();
    }
  });

  // ===== Lightbox =====
  safe(() => {
    const openLB = $("#openLightbox");
    const lightbox = $("#lightbox");
    if (!openLB || !lightbox) return;

    const show = () => lightbox.showModal();
    openLB.addEventListener("click", show);
    openLB.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") show();
    });
  });

  // ===== Scroll animations =====
  safe(() => {
    const els = $$(".revealOnScroll");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });
    els.forEach(el => io.observe(el));
  });

  // ===== Typewriter in finale =====
  const LETTER_TEXT =
    "No soy muy bueno expresando lo que siento, pero contigo me nacen ganas de intentarlo. Hay cosas que se vuelven importantes sin hacer ruido, y tú te volviste una de ellas sin que me diera cuenta,  " +
    "en el momento que dejaste de ser alguien con quien hablaba, para convertirte en alguien que espero todos los días. Llevamos ya unos meses y, aunque todavía no tenemos una etiqueta, siento que lo nuestro es especial y muy sincero. Me gusta lo fácil que se siente estar contigo: reír, hablar de cualquier cosa, compartir el día. Sin darme cuenta ya formas parte de mi rutina, y eso me encanta." +
    "No sé exactamente a dónde nos llevará esto, pero sí sé que me gusta lo que somos y cómo se siente. Gracias por elegirme y por dejarme elegirte. 💛"
    ;



  safe(() => {
    const finale = $("#finale");
    const typed = $("#typed");
    if (!finale || !typed) return;

    let done = false;
    const typewriter = (text, el, speed=14) => {
      el.textContent = "";
      let i = 0;
      const t = setInterval(() => {
        el.textContent += text[i] ?? "";
        i++;
        if (i >= text.length) clearInterval(t);
      }, speed);
    };

    const io = new IntersectionObserver((entries) => {
      for (const en of entries){
        if (en.isIntersecting && !done){
          done = true;
          typewriter(LETTER_TEXT, typed, 14);
          io.disconnect();
        }
      }
    }, { threshold: 0.25 });

    io.observe(finale);
  });

  // ===== Open final reveal =====
  safe(() => {
    const btn = $("#btnOpenFinal");
    const box = $("#finalReveal");
    const bar = $("#progressBar");
    if (!btn || !box) return;

    btn.addEventListener("click", () => {
      box.textContent = "Me gustas. Sin prisas. Pero de verdad.";
      box.classList.add("pulse");
      setTimeout(() => box.classList.remove("pulse"), 650);
      if (bar) bar.style.width = "100%";
      safe(() => navigator.vibrate?.(18));
    });
  });

  // ===== Copy =====
  safe(() => {
    const btn = $("#btnCopy");
    const typed = $("#typed");
    const status = $("#status");
    if (!btn || !status) return;

    btn.addEventListener("click", async () => {
      const msg = (typed?.innerText || typed?.textContent || LETTER_TEXT).trim();
      try{
        await navigator.clipboard.writeText(msg);
        status.textContent = "Copiado ✨";
        setTimeout(() => status.textContent = "", 1400);
      }catch{
        status.textContent = "No se pudo copiar.";
        setTimeout(() => status.textContent = "", 1400);
      }
    });
  });

  // ===== Heart =====
  safe(() => {
    const btn = $("#btnHeart");
    const status = $("#status");
    const counter = $("#heartsSaved");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = Number(localStorage.getItem(HEARTS_KEY) || "0") + 1;
      localStorage.setItem(HEARTS_KEY, String(current));
      if (counter) {
        counter.textContent = String(current);
        counter.classList.add("pulse");
        setTimeout(() => counter.classList.remove("pulse"), 650);
      }
      if (status){
        status.textContent = "Corazón guardado 🫶";
        setTimeout(() => status.textContent = "", 1400);
      }
    });
  });

  // ===== Confetti FULLSCREEN =====
  safe(() => {
    const canvas = $("#fxFull");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
      canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
    };
    window.addEventListener("resize", resize);
    resize();

    function confettiFull(n=280){
      canvas.style.display = "block";
      let pieces = Array.from({length:n}, () => ({
        x: Math.random()*canvas.width,
        y: -Math.random()*canvas.height*0.2,
        vx: (Math.random()*2-1) * devicePixelRatio*2.4,
        vy: (Math.random()*3+2) * devicePixelRatio*2.6,
        s: (Math.random()*7+3) * devicePixelRatio,
        a: Math.random()*Math.PI*2,
        va: (Math.random()*0.26-0.13)
      }));

      let t = 0;
      function frame(){
        t++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (const p of pieces){
          p.x += p.vx; p.y += p.vy; p.a += p.va;
          ctx.save();
          ctx.translate(p.x,p.y);
          ctx.rotate(p.a);
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = "rgba(255,255,255,.9)";
          ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s);
          ctx.restore();
        }
        pieces = pieces.filter(p => p.y < canvas.height + 40);
        if (t < 140 && pieces.length) requestAnimationFrame(frame);
        else canvas.style.display = "none";
      }
      requestAnimationFrame(frame);
    }

    const btn = $("#btnConfetti");
    if (btn) btn.addEventListener("click", () => confettiFull(300));
  });

  // ===== Secret modal =====
  safe(() => {
    const modal = $("#secretModal");
    const btnSecret = $("#btnSecret");
    const btnUnlock = $("#btnUnlock");
    const input = $("#secretInput");
    const box = $("#secretBox");
    const status = $("#status");

    if (!modal || !btnSecret || !btnUnlock || !input || !box) return;

    btnSecret.addEventListener("click", () => {
      input.value = "";
      box.hidden = true;
      modal.showModal();
    });

    btnUnlock.addEventListener("click", (e) => {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      if (val === SECRET_KEY){
        box.hidden = false;
      } else {
        box.hidden = true;
        if (status){
          status.textContent = "Esa no era la clave 😄";
          setTimeout(() => status.textContent = "", 1400);
        }
      }
    });
  });

})();
