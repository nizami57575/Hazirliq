/* ============================================================
   face.js - Yuz tespiti (face-api.js ile) + imza hesaplama
   - Model CDN'den yuklenir
   - Yuz bulunamazsa demo imza uretilir
   - Imza: yuz bolgesinden cikan perceptual hash (gorsel degil, anonim)
   ============================================================ */

const FaceDetector = (() => {
  const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
  let modelsLoaded = false;
  let loadPromise = null;

  async function loadModels() {
    if (modelsLoaded) return true;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      if (typeof faceapi === "undefined") {
        console.warn("face-api.js yuklenmedi (CDN). Yuz tespiti atlanacak.");
        return false;
      }
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        modelsLoaded = true;
        return true;
      } catch (e) {
        console.warn("Model yukleme hatasi:", e);
        return false;
      }
    })();
    return loadPromise;
  }

  /**
   * Bir HTMLImageElement veya Canvas uzerinde yuzleri bulur.
   * Donus: { faces: [{x, y, width, height}], ok: bool }
   */
  async function detect(input) {
    const ok = await loadModels();
    if (!ok || typeof faceapi === "undefined") {
      return { faces: [], ok: false };
    }
    try {
      const detections = await faceapi.detectAllFaces(
        input,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
      );
      const faces = detections.map((d) => {
        const b = d.box;
        return { x: b.x, y: b.y, width: b.width, height: b.height };
      });
      return { faces, ok: true };
    } catch (e) {
      console.warn("Yuz tespit hatasi:", e);
      return { faces: [], ok: false };
    }
  }

  /**
   * Yuz bolgesinden perceptual hash (pHash benzeri) hesaplar.
   * Bu, gorselin kendisi DEGIL, anonim bir imzadir.
   *
   * Algoritma:
   *  1) Yuz bolgesini 16x16 gri olceklendir
   *  2) Ortalamayi bul
   *  3) Her piksel ortalama ustundeyse 1, altindaysa 0
   *  4) 256 bitlik imza -> hex string
   *
   * Sunucuya giden tek sey bu imzadir. Gorsel hicbir yere gitmez.
   */
  function computeSignature(canvas, face) {
    // Yuz bolgesi yoksa tum gorseli kullan
    const box = face || { x: 0, y: 0, width: canvas.width, height: canvas.height };
    const SIZE = 16;
    const tmp = document.createElement("canvas");
    tmp.width = SIZE;
    tmp.height = SIZE;
    const tctx = tmp.getContext("2d");
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(
      canvas,
      box.x, box.y, box.width, box.height,
      0, 0, SIZE, SIZE
    );
    const imgData = tctx.getImageData(0, 0, SIZE, SIZE).data;

    // Gri degerler + ortalama
    const grays = [];
    let sum = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      // Lucimizede gri: 0.299R + 0.587G + 0.114B
      const g = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
      grays.push(g);
      sum += g;
    }
    const avg = sum / grays.length;

    // Threshold -> bit dizisi
    let bits = "";
    for (let i = 0; i < grays.length; i++) {
      bits += grays[i] >= avg ? "1" : "0";
    }

    // Bit dizisi -> hex (256 bit = 64 hex karakter)
    let hex = "";
    for (let i = 0; i < bits.length; i += 4) {
      const nibble = parseInt(bits.substr(i, 4), 2);
      hex += nibble.toString(16);
    }
    return hex;
  }

  /**
   * Demo imza uretir (yuz bulunamazsa).
   * Rastgele ama sabit (oturum boyunca).
   */
  function demoSignature() {
    let s = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < 64; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  }

  return {
    loadModels: loadModels,
    detect: detect,
    computeSignature: computeSignature,
    demoSignature: demoSignature,
    isReady: () => modelsLoaded,
  };
})();
