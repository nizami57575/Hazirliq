/* ============================================================
   i18n.js - Coklu dil (TR / EN)
   Tum arayuz metinlerini buradan besler.
   ============================================================ */

const I18N = {
  tr: {
    // Stepper
    step1: "Fotograf", step2: "Bul", step3: "Koru", step4: "Sonuc",
    // Hero
    hero_title: "Kendini bul, korun.",
    hero_lead: "Bir fotograf yukle, yuzunu tespit edelim ve internette nerede paylasildigini gorelim. Sonra yuz tanimaya karsi koruyalim. Gorselin sunucuya gitmez - hersey tarayicinda.",
    photo_label: "Fotografin",
    dropzone_text: "Fotograf surukle-birak ya da tikla",
    dropzone_hint: "Gorsel sunucuya yuklenmez, sadece tarayicida islenir.",
    continue: "Devam et →",
    change_photo: "Degistir",
    ethical_hint: "Bu arac yalnizca KENDI fotografin icindir. Baskalarini takip etmek icin kullanmayin.",
    // Yuz tespiti mesajlari
    face_detected_none: "Yuz bulunamadi - gene devam edebilirsin.",
    face_detected_many: (n) => `${n} yuz tespit edildi. Birincisi kullanilacak.`,
    face_detected_one: "1 yuz tespit edildi ✔",
    face_loading: "Model yukleniyor, yuz taraniyor...",
    face_load_error: "Yuz modeli yuklenemedi (internet?). Demo imza ile devam.",
    face_pill_ok: "Yuz ✔",
    face_pill_none: "Yuz yok",
    need_photo: "Lutfen once bir fotograf yukle.",
    // Find
    find_title: "Yuzun internette nerede geciyor?",
    find_lead: "Yuz imzana gore 40+ sosyal platformda potansiyel dijital ayak izi. Her kart, fotografinda olabilecegi bir yer. Linke tiklayarak kontrol et.",
    search_btn: "Platformlarda ara",
    searching: "Araçlar taraniyor...",
    protect_photo: "Fotografi koru →",
    back: "← Geri",
    results_count: (n) => `${n} platform kontrol edildi`,
    open_link: "Profil linkini ac →",
    match_label: "Eslesme olasiligi",
    search_tools_title: "Manuel gorsel arama araclar",
    // Protect
    protect_title: "Yuz tanima savunmasi",
    protect_lead: "Fotografina ek korumalar sec. Islemler tarayicida yapilir.",
    no_photo: "Fotograf yukle (1. adima don)",
    opt_noise: "Adversarial Noise (Cloak)",
    opt_noise_desc: "Gozle gorunmeyen gurultu - yuz tanima sistemlerini sasirtir.",
    intensity: "Siddet",
    opt_pixel: "Piksel / Mozaik",
    opt_pixel_desc: "Yuz bolgesini taninmaz hale getirir (hassas koruma).",
    opt_exif: "EXIF / Meta Veri Sil",
    opt_exif_desc: "GPS, cihaz, tarih gibi gizli bilgileri temizler.",
    opt_watermark: "Su Isareti",
    opt_watermark_desc: "Gorunur filigran + gizli LSB isaret ekler.",
    apply_defense: "Savunmayi uygula",
    // Result
    result_title: "Koruma uygulandi",
    result_lead: "Sola orijinal, saga korumali hali. Korumali gorseli guvenle paylasabilirsin.",
    original: "ORIJINAL",
    protected: "KORUMALI",
    download: "⬇ Korumali gorseli indir",
    restart: "Yeniden basla",
    tips_title: "Nasil daha cok korunursun?",
    tip1: "📌 Sosyal medyada 'sadece arkadaslarima' ayari kullan.",
    tip2: "📌 Profil fotoograflarinda her zaman korumali gorsel kullan.",
    tip3: "📌 Eski hesaplari ve etiketli fotograflari duzenli kontrol et.",
    tip4: "📌 Konum etiketli paylasimlardan kacin.",
    // Footer
    footer_ethical: "Yalnizca kendi verilerin icin. Tum islem tarayicida yapilir, gorsel sunucuya gitmez.",
    // Mode
    demo_mode: "DEMO MODU",
    live_mode: "CANLI MODU",
    // Misc
    processing: "Uygulaniyor...",
    applied: "uygulandi",
    report_title: "Uygulanan korumalar",
  },

  en: {
    step1: "Photo", step2: "Find", step3: "Protect", step4: "Result",
    hero_title: "Find yourself, stay protected.",
    hero_lead: "Upload a photo, we detect your face and scan 40+ social platforms for your digital footprint. Then add facial-recognition defense. Your image never leaves the browser.",
    photo_label: "Your Photo",
    dropzone_text: "Drag-drop your photo or click",
    dropzone_hint: "Image is NOT uploaded - processed only in your browser.",
    continue: "Continue →",
    change_photo: "Change",
    ethical_hint: "This tool is for YOUR OWN photo only. Do not use it to track others.",
    face_detected_none: "No face found - you can still continue.",
    face_detected_many: (n) => `${n} faces detected. Using the primary one.`,
    face_detected_one: "1 face detected ✔",
    face_loading: "Loading model, scanning face...",
    face_load_error: "Face model failed to load (offline?). Continuing with demo signature.",
    face_pill_ok: "Face ✔",
    face_pill_none: "No face",
    need_photo: "Please upload a photo first.",
    find_title: "Where does your face appear online?",
    find_lead: "Based on your face signature, potential digital footprints across 40+ social platforms. Each card is a place your photo might be. Click the link to check.",
    search_btn: "Scan platforms",
    searching: "Scanning platforms...",
    protect_photo: "Protect photo →",
    back: "← Back",
    results_count: (n) => `${n} platforms checked`,
    open_link: "Open profile link →",
    match_label: "Match likelihood",
    search_tools_title: "Manual image search tools",
    protect_title: "Facial recognition defense",
    protect_lead: "Pick the protections to add. Processing happens in-browser.",
    no_photo: "Upload a photo (go back to step 1)",
    opt_noise: "Adversarial Noise (Cloak)",
    opt_noise_desc: "Imperceptible noise that confuses facial recognition.",
    intensity: "Intensity",
    opt_pixel: "Pixel / Mosaic",
    opt_pixel_desc: "Makes face region unrecognizable (strong protection).",
    opt_exif: "Strip EXIF / Metadata",
    opt_exif_desc: "Removes GPS, device, date and other hidden info.",
    opt_watermark: "Watermark",
    opt_watermark_desc: "Visible banner + invisible LSB marker.",
    apply_defense: "Apply defense",
    result_title: "Protection applied",
    result_lead: "Left: original. Right: protected. Share the protected one safely.",
    original: "ORIGINAL",
    protected: "PROTECTED",
    download: "⬇ Download protected image",
    restart: "Start over",
    tips_title: "How to protect yourself further",
    tip1: "📌 Use 'friends only' privacy settings on social media.",
    tip2: "📌 Always use protected images for profile pictures.",
    tip3: "📌 Audit old accounts and tagged photos regularly.",
    tip4: "📌 Avoid location-tagged posts.",
    footer_ethical: "For your own data only. All processing happens in your browser, image never uploaded.",
    demo_mode: "DEMO MODE",
    live_mode: "LIVE MODE",
    processing: "Applying...",
    applied: "applied",
    report_title: "Protections applied",
  }
};

/* Aktif dili kaydet ve DOM'u guncelle */
let currentLang = localStorage.getItem("ps_lang") || "tr";

function applyI18n(lang) {
  currentLang = lang;
  localStorage.setItem("ps_lang", lang);
  document.documentElement.lang = lang;
  const dict = I18N[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key] !== undefined) {
      if (typeof dict[key] === "function") return;
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll(".lang-switch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.tr;
  const val = dict[key];
  if (typeof val === "function") return val(...args);
  return val !== undefined ? val : key;
}

function currentLangCode() { return currentLang; }

document.querySelectorAll(".lang-switch button").forEach((b) => {
  b.addEventListener("click", () => applyI18n(b.dataset.lang));
});

applyI18n(currentLang);
