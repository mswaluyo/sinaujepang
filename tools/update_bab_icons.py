import os, sys, re

sys.stdout.reconfigure(encoding='utf-8')

bab_icons = {
    5: "fa-solid fa-person-cane",           # Bab 5: Pemahaman Kebutuhan Lansia (Penuaan, ICF & Fisik)
    6: "fa-solid fa-apple-whole",           # Bab 6: Sistem Pencernaan, Konstipasi & Nutrisi
    7: "fa-solid fa-heart-pulse",           # Bab 7: Penyakit Kronis, Jantung & Hipertensi
    8: "fa-solid fa-comments",              # Bab 8: Komunikasi Klien, Empati & Menyimak
    9: "fa-solid fa-people-arrows",         # Bab 9: Komunikasi Tim, Horenso & Pelaporan
    10: "fa-solid fa-person-walking",       # Bab 10: Berpindah Tempat & Mekanika Tubuh
    11: "fa-solid fa-wheelchair",           # Bab 11: Kursi Roda & Pencegahan Dekubitus
    12: "fa-solid fa-utensils",             # Bab 12: Bantuan Makan & Mencegah Aspirasi
    13: "fa-solid fa-restroom",             # Bab 13: Bantuan Ekskresi & Privasi Toilet
    14: "fa-solid fa-baby",                 # Bab 14: Popok, Inkontinensia & Kebersihan (atau fa-hand-holding-droplet)
    15: "fa-solid fa-tooth",                # Bab 15: Merapikan Diri & Oral Care (Gigi & Mulut)
    16: "fa-solid fa-bath",                 # Bab 16: Mandi, Nyuyoku & Kebersihan Tubuh
    17: "fa-solid fa-broom"                 # Bab 17: Pekerjaan Rumah Tangga (Kaji, Bersih-bersih & Masak)
}

# Update fa-baby to fa-toilet-paper or fa-droplet if available, fa-toilet-paper / fa-droplet is standard FA
bab_icons[14] = "fa-solid fa-droplet"

with open("public/ssw.html", "r", encoding="utf-8") as f:
    html = f.read()

for b, icon in bab_icons.items():
    # Target structure:
    # <div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-base shrink-0 group-hover:scale-105 transition-transform">
    #   B{b}
    # </div>
    # Replace with:
    # <div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 font-extrabold text-lg flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
    #   <i class="{icon}"></i>
    # </div>
    
    pattern = rf'<div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-base shrink-0 group-hover:scale-105 transition-transform">\s*B{b}\s*</div>'
    replacement = f'<div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 font-extrabold text-lg flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">\n                        <i class="{icon}"></i>\n                      </div>'
    
    html, count = re.subn(pattern, replacement, html)
    print(f"Bab {b} icon updated ({count} replacement): {icon}")

with open("public/ssw.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Finished updating all Bab 5-17 icons in public/ssw.html!")

