from PIL import Image

for name in ['D1.png', 'D3.png', 'D5.png', 'D7.png', 'D9.png', 'D11.png']:
    im = Image.open('public/genkan-quiz/assets/' + name)
    w, h = im.size
    im_scaled = im.resize((w * 2, h * 2), Image.Resampling.LANCZOS)
    im_scaled.save(f'tools/scaled_{name}')

print('Scaled all 6 images 2x')
