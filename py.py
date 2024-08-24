import qrcode
data = "https://www.youtube.com/watch?v=dXg09Eaa0Yk"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)
img = qr.make_image(fill='black', black_color='white')
img.save("qr_code.png")