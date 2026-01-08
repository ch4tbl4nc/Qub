
"""Lance l'application QUB (backend FastAPI + frontend PyWebView)."""
import multiprocessing
import sys
import time
from pathlib import Path
import requests
import webview
import uvicorn

def start_backend():
    """Lance le serveur FastAPI dans un processus séparé."""
    server_path = Path(__file__).parent / "server"
    sys.path.insert(0, str(server_path))
    try:
        uvicorn.run(
            "index:app",
            host="127.0.0.1",
            port=8000,
            log_level="error",
            loop="asyncio"
        )
    except KeyboardInterrupt:
        pass
    except Exception as exc:
        print(f"Erreur backend: {exc}")

def wait_for_backend():
    """Attend que le backend soit prêt."""
    max_attempts = 30
    for _ in range(max_attempts):
        try:
            requests.get("http://127.0.0.1:8000/", timeout=1)
            return True
        except requests.RequestException:
            time.sleep(0.5)
    return False

if __name__ == '__main__':
    multiprocessing.freeze_support()
    print("🚀 Démarrage de QUB...")
    print("📡 Lancement du serveur backend...")
    backend_process = multiprocessing.Process(target=start_backend, daemon=True)
    backend_process.start()
    if wait_for_backend():
        print("✅ Backend prêt !")
        print("🖥️  Ouverture de l'application...\n")
        window = webview.create_window(
            'QUB - Gestion intelligente',
            'client/views/login.html',
            width=1200,
            height=800,
            resizable=True,
            min_size=(800, 600)
        )
        webview.start(http_server=True, debug=True)
        print("\n👋 Fermeture de l'application...")
        backend_process.terminate()
        backend_process.join(timeout=2)
    else:
        print("❌ Impossible de démarrer le backend !")
        backend_process.terminate()
        sys.exit(1)
