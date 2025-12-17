import webview

window = webview.create_window('QUB', '../QUB/client/views/dashboard.html', width=1200, height=800)

webview.start(window, http_server=True)
