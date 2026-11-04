import json, os, shutil

# Target quiz dir & assets
target_quiz_dir = r"public/quizzes/ssw-peternakan-quiz"
target_assets_img = r"public/assets/quizzes/ssw-peternakan-quiz/images"
os.makedirs(target_quiz_dir, exist_ok=True)
os.makedirs(target_assets_img, exist_ok=True)

# Copy 3 images
for img_name in ["ssw_peternakan_q15_silase.png", "ssw_peternakan_q16_tangki.png", "ssw_peternakan_q24_kompos.png"]:
    src = os.path.join(r"public/assets", img_name)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(target_assets_img, img_name))

print("Assets copied.")

questions_data = [
    {
        "no": 1,
        "title": "Ternak adalah hewan yang jinak, tidak akan bertarung.\nPernyataan ini adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 1,
        "analisis": "Meskipun hewan ternak telah didomestikasi, naluri alami dan hierarki kelompok (pecking order / hierarki kawanan) dapat memicu perkelahian atau perilaku agresif, terutama saat memperebutkan pakan, wilayah, atau pasangan. Oleh karena itu pernyataan ini **Salah**.",
        "opt_note": ["(Benar) Salah satu pernyataan tidak tepat", "(Salah) Kunci benar: hewan ternak tetap memiliki naluri bertarung"],
        "trans": "Pertanyaan pengetahuan dasar sifat alami hewan ternak."
    },
    {
        "no": 2,
        "title": "Fase pembuahan sapi betina pertama kalinya terjadi pada umur...",
        "options": [
            {"text": "10-12 bulan", "img": ""},
            {"text": "14-15 bulan", "img": ""},
            {"text": "18-20 bulan", "img": ""},
            {"text": "24-26 bulan", "img": ""}
        ],
        "answer": 1,
        "analisis": "Sapi dara (heifer) umumnya mencapai pubertas dan siap untuk diinseminasi atau dibuahi pertama kali pada usia sekitar **14-15 bulan**, saat bobot badannya telah mencapai sekitar 60-70% dari bobot sapi dewasa.",
        "opt_note": ["10-12 bulan: terlalu dini", "14-15 bulan: usia ideal perkawinan pertama", "18-20 bulan: terlambat", "24-26 bulan: usia melahirkan pertama kali"],
        "trans": "Waktu pembuahan / inseminasi pertama pada sapi betina."
    },
    {
        "no": 3,
        "title": "Material dasar seperti jagung, mylo (sorgum), dan dedak kedelai biasanya...",
        "options": [
            {"text": "Diproduksi lokal", "img": ""},
            {"text": "Diimpor dari luar negeri", "img": ""},
            {"text": "Tidak digunakan dalam peternakan", "img": ""},
            {"text": "Dihasilkan dari limbah pertanian", "img": ""}
        ],
        "answer": 1,
        "analisis": "Di Jepang, sebagian besar bahan baku pakan konsentrat berenergi dan berprotein tinggi seperti jagung, mylo/sorgum, serta bungkil kedelai **diimpor dari luar negeri** karena keterbatasan lahan pertanian lokal.",
        "opt_note": ["Diproduksi lokal: persentase sangat kecil", "Diimpor dari luar negeri: kunci tepat", "Tidak digunakan: salah", "Limbah pertanian: bukan bahan utama konsentrat"],
        "trans": "Sumber asal bahan baku pakan konsentrat peternakan di Jepang."
    },
    {
        "no": 4,
        "title": "Kualitas susu sapi perah...",
        "options": [
            {"text": "Sama untuk semua sapi", "img": ""},
            {"text": "Berbeda antara satu sapi dengan yang lain", "img": ""},
            {"text": "Tidak dipengaruhi oleh pakan", "img": ""},
            {"text": "Hanya dipengaruhi oleh umur sapi", "img": ""}
        ],
        "answer": 1,
        "analisis": "Kualitas susu (kadar lemak susu, protein, dan padatan tanpa lemak) **berbeda antara satu sapi dengan yang lain**, dipengaruhi oleh faktor genetik/keturunan, tahap laktasi, status kesehatan, dan komposisi pakan.",
        "opt_note": ["Sama untuk semua: tidak tepat", "Berbeda antara satu sapi dengan yang lain: kunci tepat", "Tidak dipengaruhi pakan: salah", "Hanya umur: salah"],
        "trans": "Variasi kualitas air susu pada sapi perah."
    },
    {
        "no": 5,
        "title": "Permasalahan mengenai kotoran dibuang ke ladang adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 1,
        "analisis": "Kotoran ternak yang telah diproses dan difermentasi dengan baik menjadi kompos bukanlah suatu permasalahan, melainkan pupuk organik yang bermanfaat untuk menyuburkan tanah ladang pertanian.",
        "opt_note": ["Benar: tidak tepat", "Salah: kunci tepat (kotoran terolah merupakan pupuk bermanfaat)"],
        "trans": "Pemanfaatan kotoran ternak terolah untuk lahan pertanian."
    },
    {
        "no": 6,
        "title": "Sapi bakalan yang akan dikirimkan ke pasar ternak biasanya berumur...",
        "options": [
            {"text": "6 bulan", "img": ""},
            {"text": "8 bulan", "img": ""},
            {"text": "10 bulan", "img": ""},
            {"text": "12 bulan", "img": ""}
        ],
        "answer": 2,
        "analisis": "Pada sistem peternakan sapi potong di Jepang (seperti Wagyu), pedet sapi bakalan dipelihara oleh peternak pembibitan hingga berumur sekitar **10 bulan** sebelum dijual di pasar ternak ke peternak penggemukan.",
        "opt_note": ["6 bulan: masih tahap sapih", "8 bulan: masa pertumbuhan pedet", "10 bulan: umur standar pengiriman ke pasar ternak", "12 bulan: masuk fase penggemukan awal"],
        "trans": "Usia sapi bakalan saat dikirimkan ke pasar lelang ternak."
    },
    {
        "no": 7,
        "title": "Urutan pemeliharaan pedet yang benar adalah...",
        "options": [
            {"text": "Susu Induk Sapi → Susu Pengganti → Susu Afkir → Rumput Kering dan Pakan Campuran", "img": ""},
            {"text": "Susu Pengganti → Susu Induk Sapi → Susu Afkir → Rumput Kering dan Pakan Campuran", "img": ""},
            {"text": "Susu Afkir → Susu Induk Sapi → Susu Pengganti → Rumput Kering dan Pakan Campuran", "img": ""},
            {"text": "Rumput Kering dan Pakan Campuran → Susu Induk Sapi → Susu Pengganti → Susu Afkir", "img": ""}
        ],
        "answer": 0,
        "analisis": "Tahap pemberian pakan pedet dimulai dari kolostrum / susu induk sapi, beralih ke susu pengganti (milk replacer), kemudian masa transisi susu afkir/sapih, hingga akhirnya mengonsumsi pakan padat berupa rumput kering (hay) dan pakan konsentrat campuran.",
        "opt_note": ["Susu Induk → Susu Pengganti → Susu Afkir → Rumput/Konsentrat: urutan tepat", "Opsi lain urutannya terbalik"],
        "trans": "Urutan tahapan pemberian pakan pada pedet yang baru lahir."
    },
    {
        "no": 8,
        "title": "Karakteristik kualitas daging baik dan pertumbuhan cepat dimiliki oleh...",
        "options": [
            {"text": "Sapi Brahman", "img": ""},
            {"text": "Babi Duroc", "img": ""},
            {"text": "Ayam Broiler", "img": ""},
            {"text": "Kambing Boer", "img": ""}
        ],
        "answer": 1,
        "analisis": "Dalam peternakan babi di Jepang, ras **Babi Duroc (Duroc pig)** terkenal memiliki laju pertumbuhan yang cepat, efisiensi pakan tinggi, dan marbling (kualitas daging) yang sangat baik, sehingga sering digunakan sebagai pejantan akhir (terminal sire).",
        "opt_note": ["Sapi Brahman: sapi potong iklim tropis", "Babi Duroc: kunci tepat untuk kualitas daging & pertumbuhan cepat", "Ayam Broiler: unggas pedaging", "Kambing Boer: kambing pedaging"],
        "trans": "Ciri ras ternak unggul untuk kualitas daging dan pertumbuhan."
    },
    {
        "no": 9,
        "title": "Induk yang digunakan untuk kawin silang untuk menghasilkan babi hibrida generasi pertama adalah...",
        "options": [
            {"text": "Babi Duroc", "img": ""},
            {"text": "Babi Landrace/Large Yorkshire", "img": ""},
            {"text": "Babi Hampshire", "img": ""},
            {"text": "Babi Berkshire", "img": ""}
        ],
        "answer": 1,
        "analisis": "Untuk menghasilkan bibit babi komersial (F1 cross), umumnya disilangkan induk betina dari ras **Landrace (L)** dan pejantan **Large Yorkshire (W)** karena memiliki keunggulan fekunditas, jumlah anak per kelahiran tinggi, serta kemampuan mengasuh anak yang baik.",
        "opt_note": ["Babi Duroc: pejantan terminal akhir", "Babi Landrace / Large Yorkshire: kunci tepat untuk jalur induk betina F1", "Babi Hampshire: penghasil daging tanpa lemak", "Babi Berkshire: babi kurobuta"],
        "trans": "Seleksi ras induk pada program persilangan babi hibrida."
    },
    {
        "no": 10,
        "title": "Yang BUKAN termasuk penyakit menular berbahaya adalah...",
        "options": [
            {"text": "Flu Burung", "img": ""},
            {"text": "Kolera Babi", "img": ""},
            {"text": "Mastitis", "img": ""},
            {"text": "Anthrax", "img": ""}
        ],
        "answer": 2,
        "analisis": "**Mastitis** adalah radang ambing yang bersifat lokal dan non-epidemik (bukan penyakit menular wabah masal/zoonosis berstatus karantina negara seperti Flu Burung, Hog Cholera/CSF, atau Anthrax).",
        "opt_note": ["Flu Burung: penyakit menular unggas", "Kolera Babi: penyakit menular babi", "Mastitis: kunci tepat (radang ambing lokal)", "Anthrax: penyakit infeksi zoonosis menular"],
        "trans": "Klasifikasi penyakit ternak menular dan non-menular."
    },
    {
        "no": 11,
        "title": "Lingkungan yang panas akibat musim panas tidak memberikan pengaruh buruk pada babi. Pernyataan ini adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 1,
        "analisis": "Babi tidak memiliki kelenjar keringat yang berkembang baik dan memiliki lapisan lemak tebal di bawah kulit, sehingga sangat rentan terhadap stres panas (heat stress). Musim panas menurunkan nafsu makan dan menurunkan reproduksi babi.",
        "opt_note": ["Benar: keliru", "Salah: kunci tepat (babi sangat rentan stres panas)"],
        "trans": "Dampak temperatur lingkungan tinggi terhadap fisiologi babi."
    },
    {
        "no": 12,
        "title": "Pada pakan campuran untuk ayam dewasa, kandungan jagung atau mylo (sorgum) adalah sekitar...",
        "options": [
            {"text": "40%", "img": ""},
            {"text": "50%", "img": ""},
            {"text": "60%", "img": ""},
            {"text": "70%", "img": ""}
        ],
        "answer": 2,
        "analisis": "Pakan konsentrat ayam petelur maupun pedaging dewasa didominasi oleh sumber energi biji-bijian (jagung kuning atau mylo/sorgum) dengan proporsi sekitar **60%** dari total formulasi pakan.",
        "opt_note": ["40%: terlalu rendah untuk ayam dewasa", "50%: kurang mencukupi kebutuhan energi", "60%: proporsi ideal standar pakan ayam dewasa", "70%: terlalu dominan"],
        "trans": "Komposisi biji-bijian sumber energi pada ransum pakan unggas."
    },
    {
        "no": 13,
        "title": "Volume produksi susu sapi perah akan mencapai jumlah tertinggi (puncak laktasi) pada minggu ke...",
        "options": [
            {"text": "3-5", "img": ""},
            {"text": "5-7", "img": ""},
            {"text": "7-9", "img": ""},
            {"text": "9-11", "img": ""}
        ],
        "answer": 1,
        "analisis": "Setelah melahirkan, kurva laktasi sapi perah meningkat tajam dan mencapai puncak produksi susu (peak milk production) pada **minggu ke-5 hingga ke-7** pascapartus.",
        "opt_note": ["3-5 minggu: masa peningkatan awal", "5-7 minggu: kunci tepat puncak laktasi", "7-9 minggu: awal kurva mulai mendatar", "9-11 minggu: mulai fase penurunan bertahap"],
        "trans": "Kurva produksi susu puncak pada sapi perah."
    },
    {
        "no": 14,
        "title": "Rerumputan yang fase tuainya lebih lambat memiliki nilai nutrisi yang lebih tinggi. Pernyataan ini adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 1,
        "analisis": "Semakin tua fase pertumbuhan rumput saat dipanen, kandungan serat kasarnya (lignin dan selulosa) meningkat sehingga kecernaan dan nilai nutrisinya (protein kasar & TDN) justru semakin menurun. Oleh karena itu pernyataan ini **Salah**.",
        "opt_note": ["Benar: keliru", "Salah: kunci tepat (rumput tua nilai nutrisinya lebih rendah)"],
        "trans": "Pengaruh umur pemotongan rumput terhadap nilai gizi hijauan pakan."
    },
    {
        "no": 15,
        "title": "Perhatikan gambar berikut!\nJenis pakan hijauan fermentasi yang dibungkus rapat kedap udara ini disebut...",
        "image": "assets/ssw_peternakan_q15_silase.png",
        "img": "assets/ssw_peternakan_q15_silase.png",
        "options": [
            {"text": "Silase (Silage)", "img": ""},
            {"text": "Hay (Rumput Kering)", "img": ""},
            {"text": "Konsentrat Biji-bijian", "img": ""},
            {"text": "Pellet", "img": ""}
        ],
        "answer": 0,
        "analisis": "Gambar memperlihatkan silase gulung (bale silage) yang dibungkus plastik rapat untuk menciptakan kondisi anaerobik (kedap udara) agar bakteri asam laktat memfermentasi hijauan pakan ternak.",
        "opt_note": ["Silase: kunci tepat", "Hay: rumput kering tanpa fermentasi", "Konsentrat: pakan olahan biji", "Pellet: pakan butiran padat"],
        "trans": "Identifikasi bentuk pakan fermentasi silase pada gambar."
    },
    {
        "no": 16,
        "title": "Perhatikan gambar berikut!\nFasilitas penyimpanan pakan konsentrat peternakan pada gambar di atas adalah...",
        "image": "assets/ssw_peternakan_q16_tangki.png",
        "img": "assets/ssw_peternakan_q16_tangki.png",
        "options": [
            {"text": "Tangki Pakan Campur / Silo Pakan", "img": ""},
            {"text": "Tangki Pengolahan Air Limbah", "img": ""},
            {"text": "Tangki Pendingin Susu (Milk Cooler)", "img": ""},
            {"text": "Inkubator Penetasan Telur", "img": ""}
        ],
        "answer": 0,
        "analisis": "Gambar memperlihatkan tangki silo penyimpanan pakan campuran curah (feed bin / bulk feed tank) yang digunakan di peternakan modern untuk menjaga pakan tetap kering dan terlindung dari cuaca serta hama.",
        "opt_note": ["Tangki Pakan Campur / Silo: kunci tepat", "Tangki Limbah: bentuk terbuka/berbeda", "Pendingin Susu: tangki stainless di ruang perah", "Inkubator: mesin penetasan"],
        "trans": "Identifikasi silo tangki pakan campuran pada peternakan."
    },
    {
        "no": 17,
        "title": "Apa yang dimaksud dengan silase dalam manajemen pakan ternak?",
        "options": [
            {"text": "Pakan kering yang disimpan dalam karung goni", "img": ""},
            {"text": "Pakan yang dibuat dengan memfermentasikan bahan hijauan dalam lingkungan tanpa oksigen (anaerobik)", "img": ""},
            {"text": "Pakan yang hanya terdiri dari campuran biji-bijian murni", "img": ""},
            {"text": "Pakan rumput segar yang langsung diberikan tanpa pengolahan", "img": ""}
        ],
        "answer": 1,
        "analisis": "Silase adalah pakan ternak yang diawetkan melalui proses fermentasi asam laktat berkadar air tinggi di bawah kondisi anaerobik (tanpa oksigen/kedap udara) di dalam silo atau bungkus plastik kedap.",
        "opt_note": ["Pakan kering: itu adalah hay", "Pakan fermentasi anaerobik: kunci tepat definisi silase", "Campuran biji murni: konsentrat", "Rumput segar langsung: pakan segar"],
        "trans": "Definisi ilmiah dan praktis mengenai pembuatan silase."
    },
    {
        "no": 18,
        "title": "Jika Anda perlu mengencerkan cairan disinfektan konsentrat menjadi larutan berkonsentrasi 500 kali lipat sebanyak 500 ml, berapa ml disinfektan pekat yang diperlukan?",
        "options": [
            {"text": "1 ml", "img": ""},
            {"text": "10 ml", "img": ""},
            {"text": "50 ml", "img": ""},
            {"text": "100 ml", "img": ""}
        ],
        "answer": 0,
        "analisis": "Untuk membuat 500 ml larutan dengan pengenceran 500 kali (1:500), volume disinfektan yang dibutuhkan adalah 500 ml ÷ 500 = **1 ml** cairan disinfektan murni, kemudian dilarutkan ke dalam air hingga mencapai volume 500 ml.",
        "opt_note": ["1 ml: 500 ml / 500 = 1 ml (kunci tepat)", "10 ml: itu pengenceran 50 kali", "50 ml: itu pengenceran 10 kali", "100 ml: itu pengenceran 5 kali"],
        "trans": "Perhitungan dosis pengenceran cairan disinfektan kandang."
    },
    {
        "no": 19,
        "title": "Seberapa sering pemeriksaan mutu air susu (milk testing) secara rutin dilakukan dalam kawanan sapi perah?",
        "options": [
            {"text": "Setiap minggu", "img": ""},
            {"text": "Setiap bulan", "img": ""},
            {"text": "Setiap tahun", "img": ""},
            {"text": "Setiap hari", "img": ""}
        ],
        "answer": 1,
        "analisis": "Pemeriksaan mutu susu sapi perah individu dalam suatu kawanan (dairy herd milk recording / tes uji mutu susu) umumnya dijadwalkan secara berkala **setiap bulan** untuk memantau kadar lemak, protein, sel somatik, dan performa produksi masing-masing sapi.",
        "opt_note": ["Setiap minggu: terlalu sering untuk herd testing menyeluruh", "Setiap bulan: interval uji berkala resmi", "Setiap tahun: terlalu jarang", "Setiap hari: hanya uji suhu tangki"],
        "trans": "Frekuensi uji kontrol kualitas susu kawanan sapi perah."
    },
    {
        "no": 20,
        "title": "Apa tujuan utama dilakukannya inseminasi buatan (IB / Jinkou Jusei) pada sapi ternak?",
        "options": [
            {"text": "Untuk menunjukkan cara pemberian pakan secara otomatis", "img": ""},
            {"text": "Untuk menunjukkan proses perkawinan sapi secara alami di padang rumput", "img": ""},
            {"text": "Untuk menerapkan teknik reproduksi buatan guna memperbaiki mutu genetik sapi tanpa pejantan langsung", "img": ""},
            {"text": "Untuk menunjukkan cara pemeriksaan fisik penyakit kulit sapi", "img": ""}
        ],
        "answer": 2,
        "analisis": "Inseminasi Buatan (IB) bertujuan untuk memasukkan sperma pejantan unggul pilihan ke dalam saluran reproduksi sapi betina menggunakan alat pipet/gun IB demi perbaikan mutu genetik, pencegahan penularan penyakit seksual, dan efisiensi biaya reproduksi.",
        "opt_note": ["Pemberian pakan: tidak tepat", "Perkawinan alami: bukan perkawinan alami", "Teknik reproduksi buatan mutu genetik: kunci tepat", "Pemeriksaan kulit: bukan tujuannya"],
        "trans": "Tujuan dan manfaat penerapan teknologi inseminasi buatan."
    },
    {
        "no": 21,
        "title": "Apa fungsi utama dari penggunaan Calf Hatch (kandang individu berbentuk kubah kecil) dalam pemeliharaan pedet sapi?",
        "options": [
            {"text": "Menyimpan stok pakan rumput kering", "img": ""},
            {"text": "Menjaga kehangatan dan kesehatan pedet dengan mencegah infeksi silang", "img": ""},
            {"text": "Menyediakan tempat bertelur bagi hewan", "img": ""},
            {"text": "Menyediakan tempat istirahat dan perlindungan higienis bagi pedet", "img": ""}
        ],
        "answer": 3,
        "analisis": "Calf hatch berfungsi sebagai hunian individual pedet yang menyediakan tempat beristirahat, ventilasi udara segar yang baik, perlindungan dari terpaan angin dan hujan, serta mencegah penularan penyakit menular antar pedet.",
        "opt_note": ["Simpan pakan: bukan fungsinya", "Menjaga kesehatan (opsi b mendekati)", "Tempat bertelur: untuk unggas", "Tempat istirahat & perlindungan higienis: kunci tepat"],
        "trans": "Fungsi fasilitas kandang individual calf hatch untuk pedet."
    },
    {
        "no": 22,
        "title": "Dalam pengelolaan limbah kotoran ternak, istilah Slurry adalah...",
        "options": [
            {"text": "Campuran kotoran padat dengan air hujan", "img": ""},
            {"text": "Campuran kotoran padat (feses) dengan urine (air seni)", "img": ""},
            {"text": "Campuran kotoran ternak dengan sisa pakan", "img": ""},
            {"text": "Campuran kotoran dengan jerami alas kandang", "img": ""}
        ],
        "answer": 1,
        "analisis": "Slurry (スラリー) dalam istilah peternakan Jepang merujuk pada campuran kotoran padat (feses) dan cairan air seni (urine) ternak yang berbentuk cair semi-kental, biasanya ditampung di tangki bawah tanah sebelum diproses.",
        "opt_note": ["Kotoran + air: bukan definisi resmi", "Kotoran + urine: kunci tepat definisi slurry", "Kotoran + sisa pakan: limbah padat", "Kotoran + jerami: kompos padat (manure)"],
        "trans": "Definisi istilah limbah slurry peternakan."
    },
    {
        "no": 23,
        "title": "Berapakah suhu ideal yang harus dicapai dalam tumpukan bahan selama proses pengomposan kotoran ternak?",
        "options": [
            {"text": "50-60°C", "img": ""},
            {"text": "60-70°C", "img": ""},
            {"text": "70-80°C", "img": ""},
            {"text": "80-90°C", "img": ""}
        ],
        "answer": 2,
        "analisis": "Proses fermentasi aerobik pengomposan kotoran ternak yang baik menghasilkan panas hingga **70-80°C**, yang sangat efektif untuk membunuh bakteri patogen, telur parasit cacing, serta mematikan biji-biji gulma.",
        "opt_note": ["50-60°C: fase awal pemanasan", "60-70°C: fase transisi", "70-80°C: suhu puncak optimal sanitasi kompos", "80-90°C: terlalu panas"],
        "trans": "Suhu fermentasi optimal pengomposan kotoran ternak."
    },
    {
        "no": 24,
        "title": "Perhatikan gambar berikut!\nArea pengolahan limbah peternakan dengan tumpukan kotoran yang diaduk pada gambar di atas adalah...",
        "image": "assets/ssw_peternakan_q24_kompos.png",
        "img": "assets/ssw_peternakan_q24_kompos.png",
        "options": [
            {"text": "Area Fasilitas Pengomposan (Compost Facility)", "img": ""},
            {"text": "Kandang Pemeliharaan Sapi Bunting", "img": ""},
            {"text": "Gudang Penyimpanan Bahan Pakan Jadi", "img": ""},
            {"text": "Area Pemerahan Susu Sapi (Milking Parlor)", "img": ""}
        ],
        "answer": 0,
        "analisis": "Gambar memperlihatkan hanggar fasilitas pengomposan kotoran ternak (taikisha / compost barn) dengan tumpukan kompos yang sedang mengalami fermentasi dan proses pembalikan udara.",
        "opt_note": ["Area Pengomposan: kunci tepat", "Kandang Sapi Bunting: tidak ada kotoran menggunung", "Gudang Pakan: lingkungan bersih dan kering", "Area Perah: ruang higienis mesin perah"],
        "trans": "Identifikasi fasilitas pengolahan kompos peternakan."
    },
    {
        "no": 25,
        "title": "Sangat penting bagi peternak untuk tidak melewatkan tanda-tanda estrus (berahi) untuk melakukan inseminasi buatan karena...",
        "options": [
            {"text": "Estrus adalah masa subur di mana sel telur siap dibuahi", "img": ""},
            {"text": "Estrus adalah masa di mana hewan betina tidak subur", "img": ""},
            {"text": "Estrus adalah masa di mana hewan sedang mengalami infeksi penyakit", "img": ""},
            {"text": "Estrus adalah masa istirahat produksi saluran reproduksi", "img": ""}
        ],
        "answer": 0,
        "analisis": "Estrus (berahi) adalah periode waktu di mana hewan betina reseptif secara seksual dan ovulasi terjadi, sehingga inseminasi buatan yang dilakukan tepat waktu pada masa ini menjamin tingkat keberhasilan kebuntingan yang tinggi.",
        "opt_note": ["Masa subur sel telur siap dibuahi: kunci tepat", "Masa tidak subur: keliru", "Masa sakit: keliru", "Masa istirahat: keliru"],
        "trans": "Pentingnya deteksi berahi (estrus) untuk keberhasilan perkawinan."
    },
    {
        "no": 26,
        "title": "Bobot lahir rata-rata pedet yang dilahirkan oleh induk sapi pedaging (Kuroge Washu / Wagyu) adalah sekitar...",
        "options": [
            {"text": "20 kg", "img": ""},
            {"text": "25 kg", "img": ""},
            {"text": "30 kg", "img": ""},
            {"text": "35 kg", "img": ""}
        ],
        "answer": 2,
        "analisis": "Bobot lahir normal pedet sapi potong hitam Jepang (Kuroge Washu) berkisar antara **30 kg** (sekitar 28-32 kg), sedangkan sapi perah Holstein biasanya sedikit lebih berat (sekitar 40 kg).",
        "opt_note": ["20 kg: terlalu ringan (prematur)", "25 kg: batas bawah sapi kecil", "30 kg: bobot standar pedet sapi pedaging Jepang", "35 kg: bobot pedet Holstein"],
        "trans": "Bobot lahir rata-rata pedet sapi pedaging."
    },
    {
        "no": 27,
        "title": "Setelah melahirkan, estrus (berahi) tidak akan muncul selama induk babi masih menyusui anak-anaknya.\nPernyataan ini adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 0,
        "analisis": "Rangsangan hisapan menyusui dari anak babi menekan sekresi hormon gonadotropin (LH dan FSH) melalui efek prolaktin, sehingga siklus estrus berhenti (lactational anestrus). Estrus baru akan muncul kembali sekitar 4-7 hari setelah penyapihan.",
        "opt_note": ["Benar: kunci tepat (anestrus laktasi pada babi)", "Salah: pernyataan pada soal adalah benar"],
        "trans": "Fenomena anestrus masa laktasi pada induk babi."
    },
    {
        "no": 28,
        "title": "Dalam pemeliharaan kawanan anak ayam pedaging/petelur, manakah prinsip yang paling tepat mengenai evaluasi bobot badan?",
        "options": [
            {"text": "Keseragaman bobot badan kawanan lebih penting daripada sekadar bobot individu", "img": ""},
            {"text": "Bobot individu lebih penting daripada keseragaman kawanan", "img": ""},
            {"text": "Keseragaman dan bobot individu sama sekali tidak berpengaruh", "img": ""},
            {"text": "Tidak ada kaitan antara keseragaman ayam dengan efisiensi panen", "img": ""}
        ],
        "answer": 0,
        "analisis": "Dalam manajemen peternakan ayam modern, keseragaman (uniformity) kelompok ayam sangat vital karena memastikan jadwal bertelur yang serentak atau bobot karkas panen yang homogen sesuai standar pasar.",
        "opt_note": ["Keseragaman bobot lebih penting: kunci tepat", "Bobot individu lebih penting: keliru", "Tidak berpengaruh: salah", "Tidak ada kaitan: salah"],
        "trans": "Prinsip keseragaman bobot kelompok pada manajemen unggas."
    },
    {
        "no": 29,
        "title": "Pada ayam petelur, interval waktu yang dibutuhkan dari satu ovulasi hingga ovulasi berikutnya adalah sekitar...",
        "options": [
            {"text": "20 - 22 jam", "img": ""},
            {"text": "25 - 26 jam", "img": ""},
            {"text": "30 - 32 jam", "img": ""},
            {"text": "35 - 36 jam", "img": ""}
        ],
        "answer": 1,
        "analisis": "Pembentukan satu butir telur utuh (dari pelepasan kuning telur di oviduk hingga bertelur) memerlukan waktu sekitar 24-26 jam. Ovulasi berikutnya terjadi sekitar 30 menit setelah sebutir telur dikeluarkan, sehingga siklusnya berkisar **25 - 26 jam**.",
        "opt_note": ["20-22 jam: terlalu singkat", "25-26 jam: siklus ovulasi fisiologis ayam petelur", "30-32 jam: siklus lambat", "35-36 jam: tidak normal"],
        "trans": "Interval waktu siklus ovulasi pada ayam petelur."
    },
    {
        "no": 30,
        "title": "Periodisitas bertelur dan serangkaian telur yang dihasilkan secara berturut-turut setiap harinya disebut 'Clutch'.\nPernyataan ini adalah...",
        "options": [
            {"text": "Benar", "img": ""},
            {"text": "Salah", "img": ""}
        ],
        "answer": 0,
        "analisis": "Clutch (klas / deretan bertelur) adalah istilah untuk sekumpulan butir telur yang dikeluarkan oleh seekor ayam betina secara berurutan hari demi hari tanpa jeda hari libur bertelur.",
        "opt_note": ["Benar: kunci tepat", "Salah: pernyataan definisi adalah benar"],
        "trans": "Istilah clutch dalam produksi telur unggas."
    },
    {
        "no": 31,
        "title": "Bila suhu udara lingkungan kandang meningkat tajam (panas), maka volume konsumsi pakan ternak akan...",
        "options": [
            {"text": "Bertambah", "img": ""},
            {"text": "Berkurang", "img": ""},
            {"text": "Tetap", "img": ""},
            {"text": "Tidak terpengaruh", "img": ""}
        ],
        "answer": 1,
        "analisis": "Saat suhu panas, hewan ternak akan mengalami stres panas (heat stress). Untuk mengurangi beban produksi panas internal dari proses pencernaan metabolisme pakan, ternak secara alami akan **mengurangi konsumsi pakan** dan memperbanyak minum air.",
        "opt_note": ["Bertambah: salah, ternak makan lebih sedikit saat panas", "Berkurang: kunci tepat respon adaptasi panas", "Tetap: salah", "Tidak terpengaruh: salah"],
        "trans": "Pengaruh suhu tinggi terhadap nafsu makan dan konsumsi pakan ternak."
    },
    {
        "no": 32,
        "title": "Pada fase awal induksi produksi telur ayam petelur, program pencahayaan (lighting program) seragam ditingkatkan hingga mencapai berapa jam per hari?",
        "options": [
            {"text": "9 - 10 Jam", "img": ""},
            {"text": "10 - 11 Jam", "img": ""},
            {"text": "11 - 12 Jam", "img": ""},
            {"text": "14 - 15 Jam", "img": ""}
        ],
        "answer": 3,
        "analisis": "Cahaya menstimulasi kelenjar hipofisis anterior untuk memproduksi hormon reproduksi (FSH dan LH). Untuk merangsang dan mempertahankan produksi telur yang stabil, total durasi pencahayaan harian ditingkatkan menjadi **14-15 jam** per hari.",
        "opt_note": ["9-10 jam: fase pertumbuhan pullet", "10-11 jam: fase pemeliharaan awal", "11-12 jam: masa transisi", "14-15 jam: standar pencahayaan fase produksi bertelur"],
        "trans": "Program pencahayaan (lighting program) untuk ayam petelur."
    },
    {
        "no": 33,
        "title": "Gejala fisik ayam: bulu berdiri tegak kasar, sayap terkulai menjuntai, dan bernapas dengan paruh terbuka terengah-engah. Kondisi ini menunjukkan...",
        "options": [
            {"text": "Ayam dalam kondisi prima sehat", "img": ""},
            {"text": "Ayam sedang aktif bermain", "img": ""},
            {"text": "Ayam sedang sakit atau mengalami gangguan pernapasan parah", "img": ""},
            {"text": "Ayam sedang tidur istirahat normal", "img": ""}
        ],
        "answer": 2,
        "analisis": "Bulu kusam dan berdiri (ruffled feathers), sayap menjuntai lemas (drooping wings), serta pernapasan paruh terbuka (mouth breathing) adalah tanda klinis klasik bahwa **ayam sedang sakit** atau mengalami infeksi saluran napas / stres panas akut.",
        "opt_note": ["Sehat: tidak tepat", "Bermain: keliru", "Ayam sakit: kunci tepat gejala klinis abnormalitas ayam", "Tidur normal: bukan postur tidur normal"],
        "trans": "Pengamatan gejala klinis visual pada ayam yang sakit."
    },
    {
        "no": 34,
        "title": "Berikut ini adalah prinsip sanitasi biosekuriti yang paling mendasar dalam mencegah masuknya wabah patogen ke dalam area peternakan, KECUALI...",
        "options": [
            {"text": "Membatasi keluar masuk kendaraan dan orang asing tanpa disinfeksi", "img": ""},
            {"text": "Melakukan vaksinasi berkala sesuai anjuran dinas kesehatan hewan", "img": ""},
            {"text": "Membiarkan burung liar dan tikus bebas masuk ke tempat pakan kandang", "img": ""},
            {"text": "Menyemprotkan disinfektan pada roda kendaraan tamu di pintu gerbang", "img": ""}
        ],
        "answer": 2,
        "analisis": "Burung liar, tikus, dan hewan liar merupakan vektor utama pembawa virus berbahaya (seperti Avian Influenza, ASF, dan Salmonella). Membiarkan hewan liar bebas masuk kandang adalah pelanggaran biosekuriti yang sangat berbahaya.",
        "opt_note": ["Batasi tamu: tindakan biosekuriti benar", "Vaksinasi berkala: tindakan biosekuriti benar", "Membiarkan hewan liar masuk: KECUALI (tindakan berbahaya)", "Disinfeksi roda: tindakan benar"],
        "trans": "Prinsip biosekuriti kandang dan pencegahan vektor penyakit."
    },
    {
        "no": 35,
        "title": "Saat keluar dan masuk kandang ternak, petugas wajib melakukan disinfeksi pada sepatu bot dan pakaian kerja dengan seksama. Tindakan ini bertujuan untuk...",
        "options": [
            {"text": "Meningkatkan kenyamanan pakaian kerja", "img": ""},
            {"text": "Mencegah penyebaran dan penularan bibit penyakit (biosekuriti)", "img": ""},
            {"text": "Menghemat biaya listrik kandang", "img": ""},
            {"text": "Mempercepat proses pembersihan kotoran", "img": ""}
        ],
        "answer": 1,
        "analisis": "Alas kaki dan pakaian kerja dapat menjadi fomit (perantara pembawa kuman). Disinfeksi sebelum masuk dan setelah keluar kandang bertujuan mutlak untuk memutus rantai penularan mikroorganisme patogen antar kandang.",
        "opt_note": ["Kenyamanan: bukan tujuan utama", "Cegah penyebaran penyakit: kunci tepat biosekuriti", "Hemat listrik: tidak berkaitan", "Percepat pembersihan: tidak berkaitan"],
        "trans": "Tujuan disinfeksi alas kaki dan pakaian kerja saat memasuki kandang."
    },
    {
        "no": 36,
        "title": "Bak disinfeksi pijakan kaki (footbath) yang diletakkan di depan pintu masuk kandang berfungsi untuk...",
        "options": [
            {"text": "Menyimpan cadangan air minum ternak", "img": ""},
            {"text": "Membilas debu biasa tanpa cairan kimia", "img": ""},
            {"text": "Mencegah masuknya mikroorganisme dan bakteri patogen yang menempel pada sepatu bot ke dalam kandang", "img": ""},
            {"text": "Menyediakan wadah untuk mencuci tangan pekerja", "img": ""}
        ],
        "answer": 2,
        "analisis": "Footbath berisi larutan disinfektan aktif yang berfungsi untuk membunuh mikroorganisme patogen yang menempel pada telapak dan sisi sepatu bot pekerja sebelum melangkah ke area steril pemeliharaan ternak.",
        "opt_note": ["Air minum: bukan fungsinya", "Membilas debu biasa: harus cairan disinfektan", "Cegah patogen masuk lewat sepatu: kunci tepat", "Cuci tangan: ada wastafel khusus"],
        "trans": "Fungsi bak footbath desinfeksi alas kaki di pintu kandang."
    },
    {
        "no": 37,
        "title": "Penyimpanan bahan kimia dan cairan disinfektan peternakan harus dilakukan dengan cara...",
        "options": [
            {"text": "Diletakkan terbuka di bawah terik sinar matahari langsung", "img": ""},
            {"text": "Disimpan dalam wadah berlabel tertutup rapat di tempat khusus yang sejuk dan aman dari jangkauan pihak tidak berkepentingan", "img": ""},
            {"text": "Diletakkan berdampingan dengan tumpukan pakan ternak", "img": ""},
            {"text": "Dibiarkan di lantai tempat lalu lalang ternak", "img": ""}
        ],
        "answer": 1,
        "analisis": "Bahan kimia disinfektan bersifat korosif atau beracun bila terkonsumsi. Penyimpanan harus tertutup rapat, berlabel jelas, disimpan di ruangan terkunci/aman dari jangkauan anak-anak serta terpisah dari bahan pangan/pakan.",
        "opt_note": ["Terbuka kena matahari: merusak zat aktif kimia", "Tertutup rapat di tempat aman: kunci tepat SOP keselamatan kimia", "Dekat pakan: bahaya kontaminasi racun", "Lantai lalu lalang: bahaya tertendang/bocor"],
        "trans": "Standar operasional prosedur penyimpanan bahan kimia disinfektan."
    },
    {
        "no": 38,
        "title": "Penggunaan Alat Pelindung Diri (APD) dan pakaian kerja khusus yang bersih di lingkungan peternakan bertujuan untuk...",
        "options": [
            {"text": "Meningkatkan gaya penampilan pekerja", "img": ""},
            {"text": "Melindungi pekerja dari paparan bahan kimia, debu biologis, serta mencegah kontaminasi silang penyakit ke ternak", "img": ""},
            {"text": "Mengurangi pemakaian sabun cuci tangan", "img": ""},
            {"text": "Mempercepat jam kerja harian", "img": ""}
        ],
        "answer": 1,
        "analisis": "APD (seperti masker, sarung tangan, kacamata pelindung, dan pakaian coverall) berfungsi ganda: melindungi keselamatan kesehatan pekerja (K3) serta menjaga kebersihan sanitasi ternak dari kontaminasi luar.",
        "opt_note": ["Penampilan: bukan tujuan K3", "Lindungi pekerja & cegah kontaminasi silang: kunci tepat", "Kurangi sabun: keliru", "Percepat jam kerja: keliru"],
        "trans": "Tujuan dan fungsi keselamatan kerja APD di peternakan."
    },
    {
        "no": 39,
        "title": "Alat pra-pemerahan cangkir strip (Strip Cup) pada sapi perah digunakan untuk...",
        "options": [
            {"text": "Mengukur total liter susu harian sapi", "img": ""},
            {"text": "Mendeteksi secara dini adanya radang ambing (mastitis) melalui pengamatan gumpalan pada pancaran susu pertama", "img": ""},
            {"text": "Mencuci puting susu dengan air sabun", "img": ""},
            {"text": "Wadah penyimpanan sementara susu perah", "img": ""}
        ],
        "answer": 1,
        "analisis": "Strip cup memiliki saringan/permukaan piringan hitam di mana 2-3 pancaran pertama susu diperah ke atasnya untuk memeriksa adanya gumpalan lendir, darah, atau flokulasi yang menjadi indikasi awal infeksi mastitis.",
        "opt_note": ["Ukur liter: menggunakan flow meter / weigh jar", "Deteksi dini mastitis: kunci tepat fungsi strip cup", "Mencuci puting: menggunakan kain lap/teat dip", "Wadah penyimpanan: milk bucket/can"],
        "trans": "Fungsi alat strip cup dalam pemeriksaan pra-pemerahan susu."
    },
    {
        "no": 40,
        "title": "Tujuan utama pengelapan ambing sapi sebelum memerah adalah 'memberikan rangsangan hormon oksitosin' dan 'sterilisasi puting'. Pengelapan yang baik dilakukan dengan menggunakan...",
        "options": [
            {"text": "Air es dingin", "img": ""},
            {"text": "Air hangat bersuhu sekitar 40-50°C yang dicampur cairan pembersih/disinfektan khusus", "img": ""},
            {"text": "Sabun deterjen pencuci piring konsentrat", "img": ""},
            {"text": "Minyak urut / balsem panas", "img": ""}
        ],
        "answer": 1,
        "analisis": "Pengelapan menggunakan air hangat bersuhu suam kuku (sekitar 40-50°C) memberikan stimulasi termal dan fisik yang merangsang pelepasan hormon oksitosin untuk pancaran susu alami (milk let-down), sekaligus mendisinfeksi puting.",
        "opt_note": ["Air es dingin: mengecilkan pembuluh dan menghambat let-down", "Air hangat + pembersih khusus: kunci tepat stimulasi & sanitasi", "Deterjen pencuci: merusak kulit puting", "Minyak urut: mencemari susu"],
        "trans": "Prosedur pengelapan puting dan stimulasi sekresi susu sapi."
    },
    {
        "no": 41,
        "title": "Manakah urutan standar operasional yang paling tepat dalam prosedur pemerasan susu sapi perah (milking routine)?",
        "options": [
            {"text": "Pra-pemerahan (Foremilking) → Pengelapan & Pembersihan Ambing → Pasang Teat Cup (Milking) → Pencelupan Puting (Post-dipping)", "img": ""},
            {"text": "Pengelapan Ambing → Pra-pemerahan → Pasang Teat Cup → Pencelupan Puting", "img": ""},
            {"text": "Pasang Teat Cup → Pra-pemerahan → Pengelapan Ambing → Pencelupan Puting", "img": ""},
            {"text": "Pencelupan Puting → Pasang Teat Cup → Pra-pemerahan → Pengelapan Ambing", "img": ""}
        ],
        "answer": 0,
        "analisis": "Urutan pemerasan susu sapi yang benar: (1) Pra-pemerahan strip cup untuk memeriksa mastitis dan membuang susu berpati tinggi kuman, (2) Pembersihan dan pengelapan puting hingga kering, (3) Pemasangan teat cup mesin perah, (4) Pencelupan antiseptik puting (post-dipping) untuk menutup lubang puting.",
        "opt_note": ["Pra-perah → Lap → Pasang Teat Cup → Dipping: urutan standar higienis internasional", "Opsi lain urutannya tidak tepat"],
        "trans": "Standar urutan kerja pemerasan susu sapi yang higienis."
    },
    {
        "no": 42,
        "title": "Kondisi bulu ternak yang tampak kusam, kasar, rontok, dan tidak berkilau umumnya dicurigai sebagai akibat dari...",
        "options": [
            {"text": "Suhu ruangan kandang yang terlalu sejuk", "img": ""},
            {"text": "Nutrisi pakan yang buruk atau kekurangan mineral dan vitamin esensial", "img": ""},
            {"text": "Kebersihan lantai kandang yang terawat sangat baik", "img": ""},
            {"text": "Aktivitas berjalan santai yang cukup", "img": ""}
        ],
        "answer": 1,
        "analisis": "Kondisi mantel bulu mencerminkan status kesehatan internal ternak. Bulu yang kasar, kusam, dan kering menandakan adanya defisiensi nutrisi (seperti kekurangan protein, vitamin A/E, seng, atau tembaga) atau adanya infestasi parasit internal/eksternal.",
        "opt_note": ["Suhu sejuk: merangsang bulu lebih lebat sehat", "Nutrisi buruk / defisiensi pakan: kunci tepat indikator bulu kasar", "Kebersihan baik: bulu justru bersih berkilau", "Aktivitas fisik: menyehatkan"],
        "trans": "Indikasi klinis penampilan bulu terhadap kecukupan nutrisi ternak."
    },
    {
        "no": 43,
        "title": "Pemeliharaan anak babi yang baru lahir (piglet) pada kotak pemanas bersuhu 30 - 32°C bertujuan utama untuk...",
        "options": [
            {"text": "Mencegah dehidrasi cairan tubuh", "img": ""},
            {"text": "Menjaga suhu tubuh anak babi tetap hangat dan mencegah kematian akibat hipotermia", "img": ""},
            {"text": "Mempercepat pertumbuhan taring anak babi", "img": ""},
            {"text": "Mengurangi bobot tubuh anak babi", "img": ""}
        ],
        "answer": 1,
        "analisis": "Anak babi baru lahir memiliki cadangan energi rendah, belum memiliki bulu pelindung, dan sistem termoregulasi tubuhnya belum sempurna, sehingga sangat rentan mati kedinginan (hipotermia) bila tidak diberi penghangat bersuhu 30-32°C.",
        "opt_note": ["Cegah dehidrasi: keliru", "Cegah hipotermia & jaga suhu tubuh optimal: kunci tepat fisiologi anak babi", "Pertumbuhan taring: taring justru dipotong", "Kurangi bobot: keliru"],
        "trans": "Kebutuhan suhu lingkungan pemanas bagi anak babi yang baru lahir."
    },
    {
        "no": 44,
        "title": "Pada saat fase estrus (berahi), apabila petugas melakukan pengujian refleks berdiri (standing reflex) dengan menekan punggung atau pinggul babi betina menggunakan kedua tangan, maka babi betina yang siap kawin akan...",
        "options": [
            {"text": "Menyerang dan menggigit petugas dengan agresif", "img": ""},
            {"text": "Berdiri diam mematung dengan tenang dan kaku (standing reflex)", "img": ""},
            {"text": "Lari ketakutan menjauhi kandang", "img": ""},
            {"text": "Mengeluarkan jeritan keras dan melompat", "img": ""}
        ],
        "answer": 1,
        "analisis": "Respon lordosis / standing reflex: babi betina yang sedang dalam puncak estrus akan bereaksi diam kaku mematung, telinga terangkat tegak, dan siap dinaiki (standing response) saat punggungnya ditekan kuat.",
        "opt_note": ["Agresif: babi tidak dalam estrus", "Berdiri diam tenang / mematung kaku: kunci tepat tanda siap inseminasi", "Lari: tanda babi takut/tidak estrus", "Menjerit melompat: tanda menolak kawin"],
        "trans": "Uji refleks berdiri punggung (standing reflex) pada babi estrus."
    },
    {
        "no": 45,
        "title": "Urutan tahapan alur penanganan pascapanen telur ayam yang paling tepat di peternakan modern adalah...",
        "options": [
            {"text": "Seleksi telur → Pencucian telur → Pengiriman → Inspeksi telur retak", "img": ""},
            {"text": "Pengumpulan telur → Seleksi awal → Pencucian telur → Pengiriman", "img": ""},
            {"text": "Pengumpulan telur → Inspeksi telur retak → Pencucian telur → Pengiriman langsung", "img": ""},
            {"text": "Pengumpulan telur (Shuran) → Seleksi & Sortir → Pencucian & Sanitasi → Inspeksi Mutu Telur (Candling) → Pengemasan & Pengiriman", "img": ""}
        ],
        "answer": 3,
        "analisis": "Alur penanganan telur konsumsi di Jepang: (1) Pengumpulan telur dari kandang baterai/sarang, (2) Sortir awal, (3) Pencucian dengan air hangat berdesinfektan dan pengeringan, (4) Inspeksi candling untuk melihat retak mikro/darah, (5) Grading timbangan dan pengiriman ke pasar.",
        "opt_note": ["Opsi lengkap: Pengumpulan → Seleksi → Pencucian → Inspeksi Mutu → Pengiriman (kunci tepat)", "Opsi lain melewatkan inspeksi atau urutan terbalik"],
        "trans": "Alur kerja standar pengumpulan dan penanganan telur pascapanen."
    }
]

# Tambahkan properti standar kuis
final_questions = []
for q in questions_data:
    ans_idx = q["answer"]
    kunci_text = q["options"][ans_idx]["text"]
    
    item = {
        "no": q["no"],
        "section": "SSW PETERNAKAN",
        "mnn": "SSW Chikusan",
        "title": q["title"],
        "options": q["options"],
        "answer": ans_idx,
        "kunci_id": kunci_text,
        "salah": "Pilihan lain tidak sesuai dengan materi keilmuan dan standar operasional peternakan Jepang.",
        "analisis": q["analisis"],
        "opt_note": q["opt_note"],
        "opt_detail": [
            {
                "kana": opt["text"],
                "rom": "",
                "arti": opt["text"],
                "alasan": "Jawaban yang tepat sesuai materi." if idx == ans_idx else "Pilihan pengecoh."
            }
            for idx, opt in enumerate(q["options"])
        ],
        "trans": q["trans"]
    }
    if "image" in q:
        item["image"] = q["image"]
        item["img"] = q["img"]
        
    final_questions.append(item)

quiz_json_path = os.path.join(target_quiz_dir, "quiz-data.json")
with open(quiz_json_path, "w", encoding="utf-8") as f:
    json.dump(final_questions, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(final_questions)} questions at {quiz_json_path}!")
