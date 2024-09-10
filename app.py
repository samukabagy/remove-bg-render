from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
from io import BytesIO

app = Flask(__name__)

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    file = request.files['image']
    image = Image.open(file)
    output = remove(image)
    img_byte_arr = BytesIO()
    output.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return send_file(img_byte_arr, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
