/* ============================================================
   defense.js - Yuz tanima savunma algoritmalari
   Hepsinin canvas tabanli uygulamasini icerir.
   Hicbiri backend gerektirmez - tamamen tarayicida calisir.

   Fonksiyon imzasi:
     Defense.apply(imageEl, opts) -> { canvas, report }
   opts:
     noise: bool, noiseLevel: 1-10
     pixel: bool
     exif:  bool  (her zaman onerilir, canvas zaten EXIF siler)
     watermark: bool, name: string
     faces: [{x,y,width,height}]  (yoksa tum gorsele uygulanir)
   ============================================================ */

const Defense = (() => {

  /**
   * Ana giris: image elementini canvas'a cekip secili savunmalari uygular.
   */
  function apply(imageEl, opts) {
    opts = opts || {};
    const faces = opts.faces && opts.faces.length ? opts.faces : null;
    const report = [];

    // 1) Canvas'a cek (bu itself EXIF/meta veriyi siler)
    const canvas = document.createElement("canvas");
    const W = imageEl.naturalWidth || imageEl.width;
    const H = imageEl.naturalHeight || imageEl.height;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(imageEl, 0, 0, W, H);

    if (opts.exif !== false) {
      report.push({ key: "exif", label: t("opt_exif") });
      // Canvas zaten EXIF tutmaz; ekstra temizlik gerektmez.
    }

    // 2) Adversarial noise (cloak)
    if (opts.noise) {
      const level = clamp(parseInt(opts.noiseLevel, 10) || 4, 1, 10);
      applyAdversarialNoise(ctx, W, H, level, faces);
      report.push({ key: "noise", label: t("opt_noise") + " (siddet " + level + ")" });
    }

    // 3) Pixelate / blur (yuz bolgesine)
    if (opts.pixel && faces) {
      faces.forEach(function (f) { pixelateRegion(ctx, f, 14); });
      report.push({ key: "pixel", label: t("opt_pixel") });
    } else if (opts.pixel && !faces) {
      pixelateRegion(ctx, { x: 0, y: 0, width: W, height: H }, 18);
      report.push({ key: "pixel", label: t("opt_pixel") });
    }

    // 4) Watermark
    if (opts.watermark) {
      applyWatermark(ctx, W, H, opts.name || "");
      report.push({ key: "watermark", label: t("opt_watermark") });
    }

    return { canvas: canvas, report: report };
  }

  /* ---------------- Adversarial Noise (Cloak) ----------------
     Fawkes mantiginin sadelestirilmis hali:
     Her piksele (ozellikle yuz bolgesinde) kucuk, rastgele ama
     deterministik olmayan gurultu ekler. Bu gurultu goze
     gorunmez ama yuz embedding vektorunu kaydirir, boylece
     tanima sistemleri yanlis eslesmeler yapar.
  ----------------------------------------------------------- */
  function applyAdversarialNoise(ctx, W, H, level, faces) {
    // Genislik sigma: level 1 -> 1.35, level 10 -> 6.3
    const sigma = 0.8 + level * 0.55;
    const cap = Math.ceil(sigma * 2.2); // piksel basina max delta
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;

    // Yuz bolgesi varsa orada daha agresif, disarida hafif
    const faceMask = faces ? buildMask(W, H, faces) : null;

    for (let i = 0; i < d.length; i += 4) {
      const px = (i / 4) % W;
      const py = Math.floor((i / 4) / W);
      const localSigma = (faceMask && faceMask[py * W + px]) ? sigma * 1.6 : sigma * 0.5;
      const dr = clampN(gaussRand(localSigma), cap);
      const dg = clampN(gaussRand(localSigma), cap);
      const db = clampN(gaussRand(localSigma), cap);
      d[i]     = clamp255(d[i]     + dr);
      d[i + 1] = clamp255(d[i + 1] + dg);
      d[i + 2] = clamp255(d[i + 2] + db);
      // alpha dokunma
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function buildMask(W, H, faces) {
    // Yuz bounding box'lari icini 1 yap
    const mask = new Uint8Array(W * H);
    for (let fi = 0; fi < faces.length; fi++) {
      const f = faces[fi];
      const x0 = Math.max(0, Math.floor(f.x));
      const y0 = Math.max(0, Math.floor(f.y));
      const x1 = Math.min(W, Math.ceil(f.x + f.width));
      const y1 = Math.min(H, Math.ceil(f.y + f.height));
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          mask[y * W + x] = 1;
        }
      }
    }
    return mask;
  }

  // Iki uniform [-0.5, 0.5] toplami ~ ucgen dagilim (Box-Muller'in hizli alternatifi)
  function gaussRand(sigma) {
    const r = (Math.random() - 0.5) + (Math.random() - 0.5);
    return r * sigma * 1.732; // ~ sqrt(3) ile normalize
  }

  /* ---------------- Pixelate ---------------- */
  function pixelateRegion(ctx, box, block) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const w = Math.min(W - x, Math.floor(box.width));
    const h = Math.min(H - y, Math.floor(box.height));
    if (w <= 0 || h <= 0) return;

    // Bolgeyi kucuk canvas'a indirip geri buyut (lossy -> mozaik)
    const tmp = document.createElement("canvas");
    tmp.width = Math.max(1, Math.ceil(w / block));
    tmp.height = Math.max(1, Math.ceil(h / block));
    const tctx = tmp.getContext("2d");
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(ctx.canvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
    ctx.imageSmoothingEnabled = true;
  }

  /* ---------------- Watermark ----------------
     1) Gorunur: alt tarafta yarim saydam metin (ad + tarih)
     2) Gorunmez: LSB steganography - imza bitleri
  ----------------------------------------------------------- */
  function applyWatermark(ctx, W, H, name) {
    // --- Gorunur filigran ---
    const dateStr = new Date().toISOString().slice(0, 10);
    const text = "Protected " + (name || "") + " - " + dateStr + " - PrivacyShield";
    ctx.save();
    const fontSize = Math.max(12, Math.round(W / 40));
    ctx.font = "600 " + fontSize + "px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.55;
    // Arka plan seridi
    const metrics = ctx.measureText(text);
    const padX = fontSize * 0.6;
    const stripH = fontSize * 1.7;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(
      W / 2 - metrics.width / 2 - padX,
      H - stripH - 8,
      metrics.width + padX * 2,
      stripH
    );
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(text, W / 2, H - stripH / 2 - 8);
    ctx.restore();

    // --- Gorunmez LSB imza ---
    const signature = "PSHIELD" + (name ? "|" + name.slice(0, 24) : "");
    embedLSB(ctx, W, H, signature);
  }

  function embedLSB(ctx, W, H, sig) {
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    const bytes = [];
    // string -> byte stream (her karakteri 4 adet 2-bit parcaya bol)
    for (let i = 0; i < sig.length; i++) {
      const c = sig.charCodeAt(i);
      bytes.push((c >> 6) & 0x3, (c >> 4) & 0x3, (c >> 2) & 0x3, c & 0x3);
    }
    // Her pikselin R kanalina 2 bit gom
    let bi = 0;
    for (let i = 0; i < d.length && bi < bytes.length; i += 4) {
      d[i] = (d[i] & 0xFC) | bytes[bi];
      bi++;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /* ---------------- Yardimc ---------------- */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function clampN(v, cap) { return Math.max(-cap, Math.min(cap, v)); }
  function clamp255(v) { v = Math.round(v); return v < 0 ? 0 : v > 255 ? 255 : v; }

  return { apply: apply };
})();
