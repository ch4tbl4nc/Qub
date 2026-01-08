
"""Lance l'application QUB (backend FastAPI + frontend PyWebView)."""
import threading
import sys
import time
import os
from pathlib import Path
import requests
import webview
import uvicorn

def get_base_path():
    """Retourne le chemin de base (compatible PyInstaller)."""
    if getattr(sys, 'frozen', False):
        # Mode exécutable PyInstaller
        return Path(sys._MEIPASS)
    else:
        # Mode développement
        return Path(__file__).parent

def start_backend():
    """Lance le serveur FastAPI dans un processus séparé."""
    try:
        base_path = get_base_path()
        server_path = base_path / "server"
        
        # Ajouter les chemins au sys.path
        if str(base_path) not in sys.path:
            sys.path.insert(0, str(base_path))
        if str(server_path) not in sys.path:
            sys.path.insert(0, str(server_path))
        
        print(f"[DEBUG] Base path: {base_path}")
        print(f"[DEBUG] Server path: {server_path}")
        print(f"[DEBUG] sys.path: {sys.path[:3]}")
        
        # Changer le répertoire courant vers la base pour les chemins relatifs
        os.chdir(str(base_path))
        print(f"[DEBUG] Working directory: {os.getcwd()}")
        
        # Import direct de l'app
        print("[DEBUG] Importing server.index...")
        from server.index import app
        print("[DEBUG] Import successful!")
        
        config = uvicorn.Config(
            app,
            host="127.0.0.1",
            port=8000,
            log_level="info",
            loop="asyncio"
        )
        server = uvicorn.Server(config)
        print("[DEBUG] Starting uvicorn server...")
        server.run()
    except KeyboardInterrupt:
        pass
    except Exception as exc:
        print(f"[ERROR] Erreur backend: {exc}")
        import traceback
        traceback.print_exc()
        time.sleep(10)

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
    print("[*] Demarrage de QUB...")
    print("[*] Lancement du serveur backend...")
    
    # Lancer le backend dans un thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    if wait_for_backend():
        print("[+] Backend pret !")
        print("[*] Ouverture de l'application...\n")
        
        base_path = get_base_path()
        login_html = str(base_path / 'client' / 'views' / 'login.html')
        
        window = webview.create_window(
            'QUB - Gestion intelligente',
            login_html,
            width=1200,
            height=800,
            resizable=True,
            min_size=(800, 600)
        )
        webview.start(http_server=True, debug=False)
        print("\n[*] Fermeture de l'application...")
    else:
        print("[!] Impossible de demarrer le backend !")
        sys.exit(1)
