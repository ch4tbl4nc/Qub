import webview
import uvicorn
import multiprocessing
import time
import sys
from pathlib import Path

def start_backend():
    """Lance le serveur FastAPI dans un processus séparé"""
    server_path = Path(__file__).parent / "server"
    sys.path.insert(0, str(server_path))

    try:
        # On désactive les signaux ici pour laisser le processus parent gérer l'arrêt
        # ou on laisse uvicorn gérer, mais on capture la sortie.
        uvicorn.run(
            "index:app",
            host="127.0.0.1",
            port=8000,
            log_level="error", # On réduit le niveau de log pour masquer les infos de shutdown
            loop="asyncio"     # Force asyncio standard (plus stable sur Windows avec Py3.11+)
        )
    except KeyboardInterrupt:
        # C'est ici que la magie opère : on attrape l'interruption et on ne fait RIEN.
        pass
    except Exception as e:
        # On loggue uniquement les vraies erreurs, pas les arrêts forcés
        print(f"Erreur backend: {e}")

def wait_for_backend():
    """Attend que le backend soit prêt"""
    import requests
    max_attempts = 30
    for i in range(max_attempts):
        try:
            requests.get("http://127.0.0.1:8000/", timeout=1)
            return True
        except:
            time.sleep(0.5)
    return False

if __name__ == '__main__':
    # Nécessaire pour Windows et multiprocessing
    multiprocessing.freeze_support()
    
    print("🚀 Démarrage de QUB...")
    print("📡 Lancement du serveur backend...")
    
    # Lancer le backend dans un processus séparé
    backend_process = multiprocessing.Process(target=start_backend, daemon=True)
    backend_process.start()
    
    # Attendre que le backend soit prêt
    if wait_for_backend():
        print("✅ Backend prêt !")
        print("🖥️  Ouverture de l'application...\n")
        
        # Créer la fenêtre
        window = webview.create_window(
            'QUB - Gestion intelligente', 
            'client/views/login.html', 
            width=1200, 
            height=800,
            resizable=True,
            min_size=(800, 600)
        )
        
        # Démarrer l'application
        webview.start(http_server=True, debug=True)
        
        # Quand la fenêtre se ferme, arrêter le backend
        print("\n👋 Fermeture de l'application...")
        backend_process.terminate()
        backend_process.join(timeout=2)
    else:
        print("❌ Impossible de démarrer le backend !")
        backend_process.terminate()
        sys.exit(1)