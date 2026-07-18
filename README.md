# 🛡️ PrivacyShield — *Kendini Bul, Korun*

Kendi **dijital ayak izini** gör, **yüz tanımaya karşı** fotoğrafına savunma ekle.
Her şey tarayıcında çalışır — görsellerin asla bir sunucuya gitmez.

> ⚠️ **Etik kullanım:** Bu araç yalnızca **kendi adın ve fotoğrafın** içindir.
> Başkalarını izlemek, takip etmek veya taciz etmek için kullanmayın.

---

## ✨ Özellikler

| # | Özellik | Açıklama |
|---|---------|----------|
| 1 | **Kendini bul** | Adınla internette nerelerde geçtiğini gör (Google CSE veya demo verisi) |
| 2 | **Adversarial Noise (Cloak)** | Göze görünmez gürültü ile yüz tanıma sistemlerini şaşırtır (Fawkes mantığı) |
| 3 | **Piksel / Mozaik** | Yüz bölgesini tanınmaz hale getirir |
| 4 | **EXIF / Meta Veri Silme** | GPS, cihaz, tarih gibi gizli bilgileri temizler |
| 5 | **Su İşareti** | Görünür filigran + görünmez LSB steganografi işareti |
| 6 | **TR / EN Dil** | Sağ üst köşeden dil değiştirme |
| 7 | **Tamamen tarayıcı tabanlı** | Görseller sunucuya yüklenmez, işleme istemcide yapılır |

---

## 📁 Proje Yapısı

```
privacy-shield/
├── app.py                     # Flask uygulaması (statik sunucu + /api/search)
├── requirements.txt           # flask, requests
├── services/
│   ├── __init__.py
│   └── web_search.py          # Google CSE → canlı; yoksa simülasyon
└── static/
    ├── index.html             # Tek sayfa, 4 adımlı akış
    ├── css/style.css          # Koyu tema, neon-mavi vurgu
    └── js/
        ├── i18n.js            # TR/EN sözlük + dil değiştirici
        ├── face.js            # face-api.js yükleme + yüz tespiti
        ├── defense.js         # 4 savunma algoritması
        └── app.js             # Akış kontrolü, durum yönetimi
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Python yükle (yoksa)
[python.org](https://www.python.org/downloads/) → Python 3.9+ önerilir.
Kurulumda **"Add Python to PATH"** kutusunu işaretle.

### 2. Bağımlılıkları yükle
```bash
cd privacy-shield
pip install -r requirements.txt
```

### 3. Çalıştır
```bash
python app.py
```
Tarayıcıda aç: **http://localhost:5000**

> Arama modu otomatik seçilir:
> - `GOOGLE_CSE_API_KEY` + `GOOGLE_CSE_ID` tanımlıysa → **CANLI MOD**
> - Tanımsızsa → **DEMO MOD** (sahte sonuç verileri)

---

## 🔑 (Opsiyonel) Gerçek Arama İçin Google CSE Anahtarı

Demo modu yeterli değilse, gerçek internet aramasını açmak için:

1. **API anahtarı al:**
   - [Google Cloud Console](https://console.cloud.google.com/) → yeni proje
   - APIs & Services → Library → **Custom Search API** → Enable
   - APIs & Services → Credentials → Create Credentials → **API Key**

2. **Arama Motoru (CSE) oluştur:**
   - [programmablesearchengine.google.com](https://programmablesearchengine.google.com/)
   - "Tüm web'i ara" seçeneği açık yeni motor oluştur
   - **Search engine ID**'yi kopyala

3. **Ortam değişkenlerini tanımla (Windows CMD):**
   ```cmd
   set GOOGLE_CSE_API_KEY=AIza...
   set GOOGLE_CSE_ID=a1b2c3...
   python app.py
   ```
   PowerShell:
   ```powershell
   $env:GOOGLE_CSE_API_KEY="AIza..."
   $env:GOOGLE_CSE_ID="a1b2c3..."
   python app.py
   ```

Başlangıçta `Arama modu: LIVE (Google CSE)` yazıyorsa hazırsın.

> 💡 Google CSE **günde 100 sorgu** ücretsizdir.

---

## 🧪 Kullanım Akışı

1. **Adım 1 – Profil:** Adını gir, fotoğrafını yükle (opsiyonel)
2. **Adım 2 – Bul:** "Ara" butonuna bas, dijital ayak izini gör
3. **Adım 3 – Koru:** Yüzü otomatik tespit edilir, korumaları seç, "Savunmayı uygula"
4. **Adım 4 – Sonuç:** Orijinal vs. korumalı yan yana, indir, ipuçlarını oku

---

## 🛠️ Teknik Notlar

### Savunma Algoritmaları (`static/js/defense.js`)
- **Adversarial Noise:** Piksel başına ±(0.8–6) delta, yüz bölgesinde 1.6× daha agresif.
  Gözle görünmez ama yüz embedding vektörünü kaydırır → yanlış eşleşme.
- **Pixelate:** Küçük canvas'a indirip büyüterek lossy mozaik.
- **EXIF:** Canvas export doğal olarak tüm meta veriyi (GPS, cihaz, tarih) siler.
- **Watermark:** Görünür banner + LSB steganografi (R kanalına 2 bit/piksel).

### Yüz Tespiti (`static/js/face.js`)
- `face-api.js` (TinyFaceDetector) CDN'den yüklenir.
- Model yüklenemezse (çevrimdışı) savunma yine çalışır, sadece yüz bölgesi yerine tüm görsel işlenir.

### Gizlilik
- Görseller asla backend'e gönderilmez.
- Backend'e yalnızca **ad metni** gider (sadece CSE araması için).
- Hiçbir veri saklanmaz.

---

## 🌐 Python Yüklü Değilse

Tüm görüntü işleme tarayıcıda olduğu için `static/index.html`'i doğrudan açarak bile **Koru** ve **Sonuç** adımları çalışır.
Sadece **İnternette bulma** özelliği backend gerektirir (`/api/search`).
Bu durumda arayüz demo verisi gösterir.

---

## ⚖️ Etik ve Yasal

- Bu araç **self-privacy** (kendi gizliliğini yönetme) amacıyla yapıldı.
- Kullanım şartlarını kabul ederek yalnızca **kendinle ilgili** içerik işlersin.
- Başkalarının izni olmadan onların görüntülerini işlemek veya takip etmek **yasaktır**.
- Savunma yöntemleri %100 koruma garantisi değildir; ek bir katman sağlar.
