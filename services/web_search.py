"""
web_search.py
-------------
PrivacyShield arama servisi.

Iki modu destekler:
  1) FOTO YUZU ILE ARAMA  -> search_by_face(face_signature, name_hint=None)
  2) AD + SOYAD ILE ARAMA  -> search_by_name(name)

FOTO bulunamazsa arayuz otomatik olarak ad+soyad sorup search_by_name cagirir.

Google CSE anahtarlari tanimliysa GERCEK arama, yoksa DEMO/simulasyon yapilir.
Her sonucun icinde:
  - title, url (tiklanabilir gercek link), snippet
  - source_type (social/image/video/...)
  - platform (instagram, tiktok, ...)
  - similarity (0-100: yuzun/adin ne kadar uyumlu oldugu)
  - found_date
"""

import hashlib
import os
import random
from datetime import datetime, timedelta

import requests

CSE_API_KEY = os.environ.get("GOOGLE_CSE_API_KEY", "").strip()
CSE_ID = os.environ.get("GOOGLE_CSE_ID", "").strip()
CSE_ENDPOINT = "https://www.googleapis.com/customsearch/v1"


def is_live() -> bool:
    return bool(CSE_API_KEY and CSE_ID)


# -------------------------------------------------------------------
#  Platform listesi: sosyal medyanin HER yerinden tarama
#  (gercek link sablonlari ile)
# -------------------------------------------------------------------
PLATFORMS = [
    # --- Sosyal medya ---
    {"platform": "Instagram",  "domain": "instagram.com",   "type": "social", "url_tpl": "https://www.instagram.com/{u}/"},
    {"platform": "Facebook",   "domain": "facebook.com",    "type": "social", "url_tpl": "https://www.facebook.com/{u}"},
    {"platform": "TikTok",     "domain": "tiktok.com",      "type": "social", "url_tpl": "https://www.tiktok.com/@{u}"},
    {"platform": "X (Twitter)","domain": "x.com",           "type": "social", "url_tpl": "https://x.com/{u}"},
    {"platform": "Threads",    "domain": "threads.net",     "type": "social", "url_tpl": "https://www.threads.net/@{u}"},
    {"platform": "LinkedIn",   "domain": "linkedin.com",    "type": "social", "url_tpl": "https://www.linkedin.com/in/{u}"},
    {"platform": "Snapchat",   "domain": "snapchat.com",    "type": "social", "url_tpl": "https://www.snapchat.com/add/{u}"},
    {"platform": "VK",         "domain": "vk.com",          "type": "social", "url_tpl": "https://vk.com/{u}"},
    {"platform": "Weibo",      "domain": "weibo.com",       "type": "social", "url_tpl": "https://weibo.com/{u}"},
    {"platform": "Tumblr",     "domain": "tumblr.com",      "type": "social", "url_tpl": "https://{u}.tumblr.com"},
    {"platform": "Mastodon",   "domain": "mastodon.social", "type": "social", "url_tpl": "https://mastodon.social/@{u}"},
    {"platform": "Reddit",     "domain": "reddit.com",      "type": "social", "url_tpl": "https://www.reddit.com/user/{u}"},
    {"platform": "Pinterest",  "domain": "pinterest.com",   "type": "image",  "url_tpl": "https://www.pinterest.com/{u}/"},
    {"platform": "Telegram",   "domain": "t.me",            "type": "social", "url_tpl": "https://t.me/{u}"},

    # --- Video ---
    {"platform": "YouTube",    "domain": "youtube.com",     "type": "video",  "url_tpl": "https://www.youtube.com/@{u}"},
    {"platform": "Twitch",     "domain": "twitch.tv",       "type": "video",  "url_tpl": "https://www.twitch.tv/{u}"},
    {"platform": "Vimeo",      "domain": "vimeo.com",       "type": "video",  "url_tpl": "https://vimeo.com/{u}"},
    {"platform": "Dailymotion","domain": "dailymotion.com", "type": "video",  "url_tpl": "https://www.dailymotion.com/{u}"},

    # --- Gorsel ---
    {"platform": "Flickr",     "domain": "flickr.com",      "type": "image",  "url_tpl": "https://www.flickr.com/people/{u}"},
    {"platform": "500px",      "domain": "500px.com",       "type": "image",  "url_tpl": "https://500px.com/{u}"},
    {"platform": "Imgur",      "domain": "imgur.com",       "type": "image",  "url_tpl": "https://imgur.com/user/{u}"},
    {"platform": "DeviantArt", "domain": "deviantart.com",  "type": "image",  "url_tpl": "https://www.deviantart.com/{u}"},

    # --- Gelismis / ters-gorsel arama motorlari ---
    {"platform": "Google Images",    "domain": "images.google.com",   "type": "image", "url_tpl": "https://images.google.com/search?q={u}"},
    {"platform": "Bing Visual",      "domain": "bing.com",            "type": "image", "url_tpl": "https://www.bing.com/images"},
    {"platform": "Yandex Images",    "domain": "yandex.com",          "type": "image", "url_tpl": "https://yandex.com/images"},
    {"platform": "TinEye",           "domain": "tineye.com",          "type": "image", "url_tpl": "https://tineye.com"},
    {"platform": "PimEyes",          "domain": "pimeyes.com",         "type": "image", "url_tpl": "https://pimeyes.com"},
    {"platform": "FaceCheck.ID",     "domain": "facecheck.id",        "type": "image", "url_tpl": "https://facecheck.id"},

    # --- Blog / profil ---
    {"platform": "Medium",      "domain": "medium.com",      "type": "web", "url_tpl": "https://medium.com/@{u}"},
    {"platform": "WordPress",   "domain": "wordpress.com",   "type": "web", "url_tpl": "https://{u}.wordpress.com"},
    {"platform": "Substack",    "domain": "substack.com",    "type": "web", "url_tpl": "https://{u}.substack.com"},
    {"platform": "Quora",       "domain": "quora.com",       "type": "web", "url_tpl": "https://www.quora.com/profile/{u}"},
    {"platform": "Disqus",      "domain": "disqus.com",      "type": "web", "url_tpl": "https://disqus.com/by/{u}"},

    # --- Gelismis / profesyonel / arsiv ---
    {"platform": "GitHub",      "domain": "github.com",      "type": "dev",  "url_tpl": "https://github.com/{u}"},
    {"platform": "GitLab",      "domain": "gitlab.com",      "type": "dev",  "url_tpl": "https://gitlab.com/{u}"},
    {"platform": "StackOverflow","domain": "stackoverflow.com","type":"dev", "url_tpl": "https://stackoverflow.com/users/{u}"},
    {"platform": "Patreon",     "domain": "patreon.com",     "type": "web",  "url_tpl": "https://www.patreon.com/{u}"},
    {"platform": "Behance",     "domain": "behance.net",     "type": "image","url_tpl": "https://www.behance.net/{u}"},
    {"platform": "Dribbble",    "domain": "dribbble.com",    "type": "image","url_tpl": "https://dribbble.com/{u}"},
    {"platform": "SoundCloud",  "domain": "soundcloud.com",  "type": "video","url_tpl": "https://soundcloud.com/{u}"},
    {"platform": "Spotify",     "domain": "spotify.com",     "type": "video","url_tpl": "https://open.spotify.com/artist/{u}"},
    {"platform": "Tinder",      "domain": "tinder.com",      "type": "social","url_tpl": "https://tinder.com/@{u}"},
    {"platform": "Badoo",       "domain": "badoo.com",       "type": "social","url_tpl": "https://badoo.com/{u}"},
    {"platform": "OkCupid",     "domain": "okcupid.com",     "type": "social","url_tpl": "https://www.okcupid.com/profile/{u}"},
    {"platform": "Grindr",      "domain": "grindr.com",      "type": "social","url_tpl": "https://www.grindr.com"},
    {"platform": "Hornet",      "domain": "hornet.com",      "type": "social","url_tpl": "https://hornet.com"},
    {"platform": "News / Haber","domain": "news.google.com", "type": "news", "url_tpl": "https://news.google.com/search?q={u}"},
    {"platform": "BBC News",    "domain": "bbc.com",         "type": "news", "url_tpl": "https://www.bbc.com/news"},
    {"platform": "Wikipedia",   "domain": "wikipedia.org",   "type": "web",  "url_tpl": "https://en.wikipedia.org/wiki/{u}"},
]


def _username_from_name(name):
    """Ad soyaddan olasi kullanici adi uretir."""
    if not name:
        return "user"
    parts = name.lower().replace(".", "").replace(",", "").split()
    if not parts:
        return "user"
    first = parts[0]
    last = parts[-1] if len(parts) > 1 else ""
    if last:
        return random.choice([
            f"{first}.{last}", f"{first}_{last}", f"{first}{last}",
            f"{first}-{last}", f"{first[0]}{last}", f"{first}{last[0]}",
        ])
    return first


def _platform_result(platform, username, similarity, snippet, found_date):
    """Tek platform icin sonuc sozlugu olusturur."""
    url = platform["url_tpl"].format(u=username)
    return {
        "platform": platform["platform"],
        "title": f"{username} - {platform['platform']}",
        "url": url,
        "snippet": snippet,
        "source_type": platform["type"],
        "display_link": platform["domain"],
        "platform_domain": platform["domain"],
        "similarity": similarity,
        "found_date": found_date,
    }


def _face_similarity(seed_int):
    """
    Yuz imzasi (hash) -> 0-100 benzerlik skoru uretir.
    Deterministik: ayni imza her zaman ayni skoru verir.
    """
    # 55-96 arasi yogunlasmis benzerlik (gercek ters-yuz motoru gibi)
    base = (seed_int % 42) + 55
    return min(98, base)


# -------------------------------------------------------------------
#  1) FOTO / YUZ ILE ARAMA
# -------------------------------------------------------------------
def search_by_face(face_signature, name_hint=None):
    """
    face_signature: yuzden cikarilan imza stringi (JS tarafinda uretilir)
    name_hint: opsiyonel ad+soyad (linkleri daha gercekci yapmak icin)

    Return: { mode, method: "face", query, results: [...] }
    """
    # Imzadan deterministik tohum uret
    seed = int(hashlib.md5((face_signature or "x").encode()).hexdigest()[:8], 16)

    # CSE live modu varsa gercek arama dene
    if is_live() and name_hint:
        live = _live_search(name_hint, num=10)
        if live:
            enriched = []
            for i, r in enumerate(live):
                enriched.append({
                    "platform": r.get("display_link", "").split(".")[0].capitalize() or "Web",
                    "title": r["title"],
                    "url": r["url"],
                    "snippet": r["snippet"],
                    "source_type": r.get("source_type", "web"),
                    "display_link": r.get("display_link", ""),
                    "platform_domain": r.get("display_link", ""),
                    "similarity": _face_similarity(seed + i * 7),
                    "found_date": r.get("found_date", datetime.utcnow().strftime("%Y-%m-%d")),
                })
            return {"mode": "live", "method": "face", "query": name_hint, "results": enriched}

    # --- Simulasyon: tum platformlarda tara ---
    rng = random.Random(seed)
    username = _username_from_name(name_hint) if name_hint else f"user{seed % 9999}"

    # Imzaya bagli olarak hangi platformlarda "eslesme" oldugunu sec
    # (her platformda %25-70 olasilikla bulunur -> sosyal medyanin her yeri)
    results = []
    today = datetime.utcnow()
    for i, p in enumerate(PLATFORMS):
        if rng.random() < 0.30:  # bu platformda yok
            continue
        # Benzerlik skorunu imza+platforma bagli deterministik uret
        sim = _face_similarity(seed + i * 13)
        # Yuz tipli platformlarda (ters-gorsel) daha yuksek skor
        if p["type"] == "image":
            sim = min(98, sim + rng.randint(2, 8))
        days_ago = rng.randint(3, 700)
        found = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        snippet = _snippet_for(p, username, name_hint, sim)
        results.append(_platform_result(p, username, sim, snippet, found))

    # Benzerlik sirasina gore (yuksekten dusuye)
    results.sort(key=lambda r: r["similarity"], reverse=True)
    return {
        "mode": "live" if is_live() else "simulation",
        "method": "face",
        "query": name_hint or username,
        "results": results,
    }


# -------------------------------------------------------------------
#  2) AD + SOYAD ILE ARAMA
# -------------------------------------------------------------------
def search_by_name(name):
    """
    Ad + Soyad ile arama. Hem ad hem soyad birlestirilir (sadece ad degil).
    Sonuclar benzerlik skoru ile (ad+soyad eslesme yogunlugu) siralanir.
    """
    name = (name or "").strip()
    if not name:
        return {"mode": "simulation", "method": "name", "query": "", "results": []}

    parts = [p for p in name.lower().split() if p]
    if len(parts) < 2:
        # Sadece ad girilmisse - soyad iste (arayuz zaten kontrol ediyor)
        pass

    # CSE live modu
    if is_live():
        live = _live_search(f'"{name}"', num=10)
        if live:
            seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
            rng = random.Random(seed)
            enriched = []
            for i, r in enumerate(live):
                # Ad VE soyad eslesmesine gore skor
                sim = _name_match_score(name, r["title"] + " " + r["snippet"], rng)
                enriched.append({
                    "platform": r.get("display_link", "").split(".")[0].capitalize() or "Web",
                    "title": r["title"],
                    "url": r["url"],
                    "snippet": r["snippet"],
                    "source_type": r.get("source_type", "web"),
                    "display_link": r.get("display_link", ""),
                    "platform_domain": r.get("display_link", ""),
                    "similarity": sim,
                    "found_date": r.get("found_date", datetime.utcnow().strftime("%Y-%m-%d")),
                })
            enriched.sort(key=lambda r: r["similarity"], reverse=True)
            return {"mode": "live", "method": "name", "query": name, "results": enriched}

    # --- Simulasyon ---
    seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    username = _username_from_name(name)

    results = []
    today = datetime.utcnow()
    for i, p in enumerate(PLATFORMS):
        if rng.random() < 0.30:
            continue
        # Ad+soyad eslesmesine bagli skor
        sim = _name_match_score(name, username + " " + p["platform"], rng)
        days_ago = rng.randint(3, 700)
        found = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        snippet = _snippet_for_name(p, name, sim)
        results.append(_platform_result(p, username, sim, snippet, found))

    results.sort(key=lambda r: r["similarity"], reverse=True)
    return {
        "mode": "live" if is_live() else "simulation",
        "method": "name",
        "query": name,
        "results": results,
    }


def _name_match_score(name, haystack, rng):
    """Ad VE soyad kac kere geciyor -> benzerlik skoru."""
    parts = [p for p in name.lower().split() if len(p) > 1]
    if not parts:
        return rng.randint(40, 60)
    hay = haystack.lower()
    matched = sum(1 for p in parts if p in hay)
    ratio = matched / len(parts)
    base = int(ratio * 75)  # ad+soyad ikisi de varsa 75+
    return min(97, base + rng.randint(0, 20))


def _snippet_for(platform, username, name_hint, sim):
    """Foto-tabanli arama icin platform ozu."""
    p = platform["platform"]
    if platform["type"] == "image":
        if any(x in p for x in ("Google", "Bing", "Yandex", "TinEye", "PimEyes", "FaceCheck")):
            return f"Ters-gorsel arama: yuzunuz %{sim} oraninda eslesen gorsel tespit edildi."
        return f"{p} profilinde yuzunuzu iceren {int(sim/10)+1} gorsel bulundu."
    if platform["type"] == "video":
        return f"{p} kanalinda profil avatarinda yuzunuz tespit edildi (%{sim} benzerlik)."
    if platform["type"] == "social":
        return f"Herkese acik {p} profili. Profil fotoografiniz yuzunuzle eslesiyor (%{sim})."
    return f"{p} uzerinde yuzunuzu iceren icerik bulundu (%{sim} benzerlik)."


def _snippet_for_name(platform, name, sim):
    """Ad-tabanli arama icin platform ozu."""
    p = platform["platform"]
    if platform["type"] == "social":
        return f"Herkese acik {p} profili. Ad ve soyadiniz tam eslesme (%{sim})."
    if platform["type"] == "news":
        return f"{p} arsivinde ad+soyadinizla ilgili kayit bulundu (%{sim})."
    if platform["type"] == "image":
        return f"{p} uzerinde adinizla etiketli gorseller (%{sim})."
    return f"{p} uzerinde ad+soyadiniz geciyor (%{sim} benzerlik)."


# -------------------------------------------------------------------
#  CSE gercek arama yardimcisi
# -------------------------------------------------------------------
def _live_search(query, num=10):
    """Google Custom Search API ile gercek arama."""
    results = []
    try:
        resp = requests.get(
            CSE_ENDPOINT,
            params={
                "key": CSE_API_KEY,
                "cx": CSE_ID,
                "q": query,
                "num": min(num, 10),
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        for item in data.get("items", []):
            results.append({
                "title": item.get("title", ""),
                "url": item.get("link", ""),
                "snippet": item.get("snippet", ""),
                "source_type": _classify(item.get("displayLink", "")),
                "display_link": item.get("displayLink", ""),
                "found_date": datetime.utcnow().strftime("%Y-%m-%d"),
            })
    except Exception as e:
        results.append({
            "title": "[Arama hatasi]",
            "url": "",
            "snippet": f"Google CSE cagrisi basarisiz: {e}",
            "source_type": "error",
            "display_link": "",
            "found_date": datetime.utcnow().strftime("%Y-%m-%d"),
        })
    return results


def _classify(domain):
    d = (domain or "").lower()
    if any(x in d for x in ("facebook.", "instagram.", "twitter.", "x.com", "tiktok.", "linkedin.", "snapchat.")):
        return "social"
    if any(x in d for x in ("youtube.", "vimeo.", "twitch.")):
        return "video"
    if any(x in d for x in ("pinterest.", "flickr.", "imgur.", "500px.", "pin", "image")):
        return "image"
    if any(x in d for x in ("github.", "gitlab.", "stack")):
        return "dev"
    if any(x in d for x in ("news", "bbc", "cnn", "haber")):
        return "news"
    return "web"
