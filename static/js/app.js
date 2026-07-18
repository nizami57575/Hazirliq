/* ============================================================
   app.js - Akis kontrolu (FOTOGRAF TABANLI)
   - 1: Fotograf yukle -> yuz tespit -> imza hesapla
   - 2: Imzayla 40+ platformda ara (gercek linkler)
   - 3: Yuz savunmasi uygula
   - 4: Sonuc
   GORSel SUNUCUYA GITMEZ - sadece anonim imza gider.
   ============================================================ */

const App = (() => {
  const state = {
    imageEl: null,
    imageDataUrl: null,
    face: null,            // {x,y,width,height} birincil yuz
    faceSignature: null,   // anonim imza (hex hash)
    faces: [],
    protectedDataUrl: null,
    report: [],
  };

  /* ---------- Adim yonetimi ---------- */
  function goStep(n) {
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
    const target = document.getElementById("step-" + n);
    if (target) target.classList.add("active");

    document.querySelectorAll(".step").forEach(function (s) {
      const sn = parseInt(s.dataset.step, 10);
      s.classList.toggle("active", sn === n);
      s.classList.toggle("done", sn < n);
    });
    document.body.dataset.step = n;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Mod rozeti ---------- */
  async function initModeBadge() {
    const badge = document.getElementById("modeBadge");
    const footer = document.getElementById("modeFooter");
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.live_mode) {
        badge.hidden = false;
        badge.textContent = t("live_mode");
        badge.classList.remove("badge-demo");
        badge.classList.add("badge-live");
        footer.textContent = "LIVE";
      } else {
        badge.hidden = false;
        badge.textContent = t("demo_mode");
        footer.textContent = "DEMO";
      }
    } catch (e) {
      badge.hidden = false;
      badge.textContent = t("demo_mode");
    }
  }

  /* ---------- Dosya yukleme + yuz tespiti + imza ---------- */
  function bindUpload() {
    const dz = document.getElementById("dropzone");
    const input = document.getElementById("fileInput");

    dz.addEventListener("click", function () { input.click(); });
    dz.addEventListener("dragover", function (e) { e.preventDefault(); dz.classList.add("dragover"); });
    dz.addEventListener("dragleave", function () { dz.classList.remove("dragover"); });
    dz.addEventListener("drop", function (e) {
      e.preventDefault();
      dz.classList.remove("dragover");
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener("change", function () {
      if (input.files[0]) handleFile(input.files[0]);
    });

    document.getElementById("resetPhotoBtn").addEventListener("click", resetPhoto);
    document.getElementById("goStep2").addEventListener("click", function () { goStep(2); });
  }

  function handleFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Lutfen bir resim dosyasi secin / Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = async function () {
        state.imageEl = img;
        state.imageDataUrl = e.target.result;
        // Hemen onizleme goster
        document.getElementById("previewThumb").src = e.target.result;
        document.getElementById("uploadPreview").hidden = false;
        document.querySelector(".dz-text").textContent = file.name;
        document.querySelector(".dz-hint").textContent =
          img.naturalWidth + "x" + img.naturalHeight + "px - " + Math.round(file.size / 1024) + " KB";
        // Yuzu tespit et + imza hesapla
        await detectAndSign();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function detectAndSign() {
    const pill = document.getElementById("previewFaceStatus");
    const btn = document.getElementById("goStep2");
    pill.textContent = t("face_loading");
    btn.disabled = true;

    // Gorseli gecici canvas'a cek (imza hesabi icin)
    const tmp = document.createElement("canvas");
    const maxDim = 640;
    const scale = Math.min(1, maxDim / Math.max(state.imageEl.naturalWidth, state.imageEl.naturalHeight));
    tmp.width = state.imageEl.naturalWidth * scale;
    tmp.height = state.imageEl.naturalHeight * scale;
    const ctx = tmp.getContext("2d");
    ctx.drawImage(state.imageEl, 0, 0, tmp.width, tmp.height);

    const det = await FaceDetector.detect(tmp);
    const faces = det.faces;
    const ok = det.ok;

    if (faces.length) {
      state.face = {
        x: faces[0].x / scale, y: faces[0].y / scale,
        width: faces[0].width / scale, height: faces[0].height / scale,
      };
      state.faces = faces.map(function (f) {
        return {
          x: f.x / scale, y: f.y / scale,
          width: f.width / scale, height: f.height / scale,
        };
      });
      state.faceSignature = FaceDetector.computeSignature(tmp, faces[0]);
      pill.textContent = faces.length === 1
        ? t("face_detected_one")
        : t("face_detected_many", faces.length);
      pill.classList.add("ok");
    } else {
      state.face = null;
      state.faces = [];
      state.faceSignature = FaceDetector.demoSignature();
      pill.textContent = ok ? t("face_detected_none") : t("face_load_error");
      pill.classList.remove("ok");
    }

    btn.disabled = false; // Yuz olsun ya da olmasin devam edilebilir
  }

  function resetPhoto() {
    state.imageEl = null;
    state.imageDataUrl = null;
    state.face = null;
    state.faces = [];
    state.faceSignature = null;
    document.getElementById("fileInput").value = "";
    document.getElementById("uploadPreview").hidden = true;
    document.getElementById("goStep2").disabled = true;
    document.querySelector(".dz-text").textContent = t("dropzone_text");
    document.querySelector(".dz-hint").textContent = t("dropzone_hint");
  }

  /* ---------- Adim 2: Platform arama ---------- */
  function bindSearch() {
    document.getElementById("searchBtn").addEventListener("click", runSearch);
    document.getElementById("back2to1").addEventListener("click", function () { goStep(1); });
    document.getElementById("goStep3").addEventListener("click", function () { goStep(3); });
  }

  async function runSearch() {
    if (!state.faceSignature) { alert(t("need_photo")); return; }
    const loader = document.getElementById("searchLoader");
    const grid = document.getElementById("searchResults");
    const btn = document.getElementById("searchBtn");
    const meta = document.getElementById("searchMeta");
    loader.hidden = false;
    btn.disabled = true;
    grid.innerHTML = "";
    meta.textContent = "";

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: state.faceSignature,
          lang: currentLangCode(),
        }),
      });
      const data = await res.json();
      renderResults(data.results || [], data.mode, data.platform_count);
      if (data.results && data.results.length) {
        const platformHits = data.results.filter(function (r) { return r.source_type !== "search"; }).length;
        meta.textContent = t("results_count", platformHits);
      }
    } catch (e) {
      // Backend yoksa tarayicida demo
      const demoResults = simulateLocalResults(state.faceSignature);
      renderResults(demoResults, "simulation", 0);
    } finally {
      loader.hidden = true;
      btn.disabled = false;
    }
  }

  function renderResults(results, mode, platformCount) {
    const grid = document.getElementById("searchResults");
    grid.innerHTML = "";
    if (!results.length) {
      grid.innerHTML = "<p style=\"color:var(--text-dim)\">Sonuc yok.</p>";
      return;
    }

    // Arama motorlarini (manuel) ayri kategoriye ayir
    const platformResults = results.filter(function (r) { return r.source_type !== "search"; });
    const searchTools = results.filter(function (r) { return r.source_type === "search"; });

    let html = "";
    for (let i = 0; i < platformResults.length; i++) {
      html += renderCard(platformResults[i], false);
    }
    if (searchTools.length) {
      html += '<div class="search-tools-header">' + escapeHtml(t("search_tools_title")) + "</div>";
      for (let j = 0; j < searchTools.length; j++) {
        html += renderCard(searchTools[j], true);
      }
    }
    grid.innerHTML = html;
  }

  function renderCard(r, isSearchTool) {
    const cls = "result-card" + (isSearchTool ? " is-tool" : "");
    const matchHtml = (!isSearchTool && r.match_likelihood)
      ? '<div class="rc-match">' +
          '<span class="match-label">' + escapeHtml(t("match_label")) + "</span>" +
          '<div class="match-bar"><div class="match-fill" style="width:' + r.match_likelihood + '%"></div></div>' +
          '<span class="match-pct">' + r.match_likelihood + "%</span>" +
        "</div>"
      : "";

    return (
      '<div class="' + cls + '">' +
        '<div class="rc-head">' +
          '<span class="rc-type ' + (r.source_type || "web") + '">' + (r.source_type || "web") + "</span>" +
          '<span class="rc-name">' + escapeHtml(r.platform_name || r.domain) + "</span>" +
        "</div>" +
        '<div class="rc-snippet">' + escapeHtml(r.snippet || "") + "</div>" +
        matchHtml +
        '<div class="rc-meta">' +
          (r.url
            ? '<a class="rc-link" href="' + escapeAttr(r.url) + '" target="_blank" rel="noopener nofollow">' +
                escapeHtml(t("open_link")) +
              "</a>"
            : '<span class="rc-no-link">—</span>") +
          "<span>" + (r.found_date || "") + "</span>" +
        "</div>" +
      "</div>"
    );
  }

  // Backend yoksa tarayicida demo (40+ platform)
  function simulateLocalResults(sig) {
    const platforms = [
      ["instagram","instagram.com","https://www.instagram.com/{u}/","Instagram","social"],
      ["facebook","facebook.com","https://www.facebook.com/{u}","Facebook","social"],
      ["tiktok","tiktok.com","https://www.tiktok.com/@{u}","TikTok","social"],
      ["x","x.com","https://x.com/{u}","X (Twitter)","social"],
      ["linkedin","linkedin.com","https://www.linkedin.com/in/{u}","LinkedIn","social"],
      ["pinterest","pinterest.com","https://www.pinterest.com/{u}/","Pinterest","social"],
      ["youtube","youtube.com","https://www.youtube.com/@{u}","YouTube","video"],
      ["twitch","twitch.tv","https://www.twitch.tv/{u}","Twitch","video"],
      ["telegram","t.me","https://t.me/{u}","Telegram","messaging"],
      ["discord","discord.com","https://discord.com/users/{u}","Discord","messaging"],
      ["reddit","reddit.com","https://www.reddit.com/user/{u}","Reddit","community"],
      ["flickr","flickr.com","https://www.flickr.com/people/{u}/","Flickr","image"],
      ["github","github.com","https://github.com/{u}","GitHub","dev"],
      ["spotify","spotify.com","https://open.spotify.com/user/{u}","Spotify","music"],
      ["vk","vk.com","https://vk.com/{u}","VKontakte","social"],
      ["google_img","google.com","https://www.google.com/search?tbm=isch","Google Görseller","search"],
      ["yandex_img","yandex.com","https://yandex.com/images/","Yandex Görseller","search"],
      ["tineye","tineye.com","https://tineye.com/","TinEye","search"],
    ];
    function user(key) {
      // imza + key -> 8 karakter
      let h = 0;
      const s = sig + key;
      for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
      return Math.abs(h).toString(16).slice(0, 8).padStart(8, "0");
    }
    const today = new Date();
    const out = [];
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const key = p[0], domain = p[1], tpl = p[2], name = p[3], cat = p[4];
      // search kategorileri her zaman, digerleri %75
      const seed = (sig.charCodeAt(i % sig.length) + i * 7) % 100;
      if (cat === "search" || seed < 75) {
        const daysAgo = Math.abs(seed) * 5 + 1;
        const d = new Date(today.getTime() - daysAgo * 86400000);
        out.push({
          platform_key: key,
          platform_name: name,
          domain: domain,
          url: tpl.replace("{u}", user(key)),
          snippet: "",
          source_type: cat,
          found_date: d.toISOString().slice(0, 10),
          match_likelihood: 35 + (seed % 58),
        });
      }
    }
    out.sort(function (a, b) { return b.match_likelihood - a.match_likelihood; });
    const searchOnes = out.filter(function (r) { return r.source_type === "search"; });
    const rest = out.filter(function (r) { return r.source_type !== "search"; });
    return rest.concat(searchOnes);
  }

  /* ---------- Adim 3: Koru ---------- */
  function bindProtect() {
    document.getElementById("back3to2").addEventListener("click", function () { goStep(2); });
    const noiseSlider = document.getElementById("noiseLevel");
    noiseSlider.addEventListener("input", function () {
      document.getElementById("noiseLevelVal").textContent = noiseSlider.value;
    });
    document.getElementById("applyBtn").addEventListener("click", applyDefense);
    document.querySelectorAll(".step").forEach(function (s) {
      s.addEventListener("click", function () {
        if (parseInt(s.dataset.step, 10) === 3) preparePreview();
      });
    });
  }

  async function preparePreview() {
    const status = document.getElementById("faceStatus");
    const canvas = document.getElementById("previewCanvas");
    const placeholder = document.getElementById("previewPlaceholder");

    if (!state.imageEl) {
      canvas.style.display = "none";
      placeholder.style.display = "block";
      status.textContent = t("no_photo");
      return;
    }
    placeholder.style.display = "none";
    canvas.style.display = "block";

    const maxW = 480;
    const scale = Math.min(1, maxW / state.imageEl.naturalWidth);
    canvas.width = state.imageEl.naturalWidth * scale;
    canvas.height = state.imageEl.naturalHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(state.imageEl, 0, 0, canvas.width, canvas.height);

    // Hazir tespit edilmis yuz varsa onu ciz
    if (state.faces.length) {
      status.textContent = state.faces.length === 1
        ? t("face_detected_one")
        : t("face_detected_many", state.faces.length);
      ctx.strokeStyle = "rgba(78,168,255,.9)";
      ctx.lineWidth = 2;
      state.faces.forEach(function (f) {
        ctx.strokeRect(f.x * scale, f.y * scale, f.width * scale, f.height * scale);
      });
    } else {
      status.textContent = t("face_detected_none");
    }
  }

  async function applyDefense() {
    if (!state.imageEl) { alert(t("no_photo")); return; }
    const btn = document.getElementById("applyBtn");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = t("processing");

    try {
      const opts = {
        noise: document.getElementById("optNoise").checked,
        noiseLevel: document.getElementById("noiseLevel").value,
        pixel: document.getElementById("optPixel").checked,
        exif: document.getElementById("optExif").checked,
        watermark: document.getElementById("optWatermark").checked,
        name: "",
        faces: state.faces,
      };
      const result = Defense.apply(state.imageEl, opts);
      state.protectedDataUrl = result.canvas.toDataURL("image/png");
      state.report = result.report;

      document.getElementById("resultOriginal").src = state.imageDataUrl;
      document.getElementById("resultProtected").src = state.protectedDataUrl;
      renderReport(result.report);
      goStep(4);
    } catch (e) {
      console.error(e);
      alert("Islem hatasi: " + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  function renderReport(report) {
    const el = document.getElementById("protectionReport");
    if (!report.length) { el.innerHTML = ""; return; }
    let html = "<strong>" + t("report_title") + ":</strong><ul>";
    for (let i = 0; i < report.length; i++) {
      html += "<li>" + escapeHtml(report[i].label) + " - " + t("applied") + "</li>";
    }
    html += "</ul>";
    el.innerHTML = html;
  }

  /* ---------- Adim 4: Sonuc ---------- */
  function bindResult() {
    document.getElementById("downloadBtn").addEventListener("click", function () {
      if (!state.protectedDataUrl) return;
      const a = document.createElement("a");
      a.href = state.protectedDataUrl;
      a.download = "protected-image.png";
      a.click();
    });
    document.getElementById("restartBtn").addEventListener("click", function () {
      state.imageEl = null;
      state.imageDataUrl = null;
      state.face = null;
      state.faces = [];
      state.faceSignature = null;
      state.protectedDataUrl = null;
      state.report = [];
      resetPhoto();
      goStep(1);
    });
  }

  /* ---------- Yardimcilar ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* ---------- Init ---------- */
  function init() {
    initModeBadge();
    bindUpload();
    bindSearch();
    bindProtect();
    bindResult();
  }

  document.addEventListener("DOMContentLoaded", init);
  return { state: state };
})();
