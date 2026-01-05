import webview

window = webview.create_window('QUB', '../QUB/client/views/login.html', width=1200, height=800)

<<<<<<< HEAD
webview.start(http_server=True)
=======
webview.start(window, http_server=True, debug=True, )
>>>>>>> 4b4505a2a08d72a90e9539e1dd4f058c1ec0074c
