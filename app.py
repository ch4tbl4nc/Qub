import webview

window = webview.create_window('QUB', '../QUB/client/views/login.html', width=1200, height=800)

webview.start(http_server=True)
