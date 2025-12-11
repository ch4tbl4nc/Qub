import pyotp
import qrcode
from io import BytesIO
import base64

def generate_totp_secret():
    """Génère un secret TOTP aléatoire"""
    return pyotp.random_base32()

def get_totp_uri(secret: str, username: str, issuer: str = "Qub"):
    """Génère l'URI TOTP pour QR code"""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=username, issuer_name=issuer)

def verify_totp_code(secret: str, code: str) -> bool:
    """Vérifie un code TOTP (6 chiffres)"""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)

def generate_qr_code(uri: str) -> str:
    """Génère un QR code en base64"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"