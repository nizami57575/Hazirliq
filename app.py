"""
app.py
------
PrivacyShield Flask uygulamasi.

API:
  GET  /api/status           -> { live_mode }
  POST /api/search/face      -> { face_signature, name? } -> yuz ile arama
  POST /api/search/name      -> { name }                  -> ad+soyad ile arama
"""
import os

from flask import Flask, jsonify, request, send_from_directory

from services.web_search import is_live, search_by_face, search_by_name

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")


@app.route("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")


@app.route("/api/status")
def status():
    return jsonify({"live_mode": is_live()})


@app.route("/api/search/face", methods=["POST"])
def api_search_face():
    """Yuz imzasi ile arama."""
    data = request.get_json(silent=True) or {}
    face_signature = data.get("face_signature", "")
    name_hint = data.get("name", "")
    if not face_signature or not isinstance(face_signature, str) or len(face_signature) > 500:
        return jsonify({"error": "Gecersiz yuz imzasi", "results": []}), 400
    if name_hint and len(name_hint) > 120:
        name_hint = ""
    return jsonify(search_by_face(face_signature, name_hint))


@app.route("/api/search/name", methods=["POST"])
def api_search_name():
    """Ad + soyad ile arama (foto bulunamadiginda)."""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")
    if not name or not isinstance(name, str) or len(name) > 120:
        return jsonify({"error": "Gecersiz ad", "results": []}), 400
    return jsonify(search_by_name(name))


if __name__ == "__main__":
    mode = "LIVE (Google CSE)" if is_live() else "DEMO (simulasyon)"
    print("=" * 60)
    print("PrivacyShield baslatiliyor")
    print(f"Arama modu: {mode}")
    print("http://localhost:5000")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=True)
