import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

# Bab 1 answers (16 questions)
# Q1: QOL -> a
# Q2: Keputusan sendiri -> c
# Q3: b
# Q4: b
# Q5: Pengabaian perawatan lansia -> c
# Q6: Agar tidak merasa malu -> b
# Q7: b
# Q8: c
# Q9: d (Lansia itu sendiri)
# Q10: c
# Q11: c (Meningkatkan kualitas hidup)
# Q12: c (Melakukan semua aktivitas sehari-hari untuk pengguna)
# Q13: b (memaksa)
# Q14: d (Semua jawaban benar)
# Q15: b (Agar lansia merasa dihargai dan memiliki kendali)
# Q16: c (Mendukung dan mendorong kemandirian lansia)
ans_bab1 = {
    1: 'a', 2: 'c', 3: 'b', 4: 'b', 5: 'c', 6: 'b', 7: 'b', 8: 'c',
    9: 'd', 10: 'c', 11: 'c', 12: 'c', 13: 'b', 14: 'd', 15: 'b', 16: 'c'
}

# Bab 2 answers (20 questions)
# Q1: b (Membedakan pakaian saat bangun dan tidur)
# Q2: a (Membagikan info pasien ke siapa saja)
# Q3: b (Mengatakan hal kasar - psikis)
# Q4: d
# Q5: c (Penilaian - rencana - pelaksanaan - evaluasi)
# Q6: d
# Q7: c (Layanan jalan - yang resmi: Layanan kunjungan, fasilitas, ambulatori/komunitas)
# Q8: d (Terapis okupasi / OT)
# Q9: c (Semua informasi tentang pengguna tanpa kecuali)
# Q10: b (Menghormati lansia sebagai individu yang bermartabat)
# Q11: c (Menurunkan kualitas hidup)
# Q12: c (Menampar)
# Q13: d (Semua jawaban benar)
# Q14: b (Berbicara dan menelan)
# Q15: b (Melakukan perawatan untuk pemulihan kesehatan)
# Q16: b (Perawatan di rumah pengguna / Houmon Kaigo)
# Q17: d (Semua jawaban benar)
# Q18: d (Semua jawaban benar)
# Q19: b (Penilaian / Assessment)
# Q20: c (Melihat apakah rencana perawatan berjalan efektif)
ans_bab2 = {
    1: 'b', 2: 'a', 3: 'b', 4: 'd', 5: 'c', 6: 'd', 7: 'c', 8: 'd',
    9: 'c', 10: 'b', 11: 'c', 12: 'c', 13: 'd', 14: 'b', 15: 'b', 16: 'b',
    17: 'd', 18: 'd', 19: 'b', 20: 'c'
}

# Bab 3 answers (15 questions)
# Q1: c (Dasar pengendalian: memutus inang, jalur, tidak menyebarkan)
# Q2: b (Urutan cuci tangan)
# Q3: d (Ekskreta / penanganan APD)
# Q4: b (Penyakit timbul ketika patogen masuk)
# Q5: b (Penilaian - penyusunan rencana - pelaksanaan - evaluasi)
# Q6: a (Meminumkan obat sesuai dosis bukan pembatasan fisik)
# Q7: c (Keringat bukan sumber infeksi transmisi utama/standar)
# Q8: b (Memperlebar penopang tubuh - ini teknik perawat bukan pencegahan pengguna jatuh)
# Q9: d (Norovirus adalah nama spesifik virus, bukan klasifikasi umum patogen)
# Q10: d (Menggunakan jam tangan adalah langkah yang tidak tepat saat cuci tangan)
# Q11: c (Meminumkan obat psikotropika sesuai dosis)
# Q12: c (Kekerasan sosial media bukan kategori HAM lansia standar)
# Q13: b (Hak asasi manusia)
# Q14: b (Kekerasan psikis)
# Q15: c (Kekerasan ekonomi)
ans_bab3 = {
    1: 'c', 2: 'b', 3: 'd', 4: 'b', 5: 'b', 6: 'a', 7: 'c', 8: 'b',
    9: 'd', 10: 'd', 11: 'c', 12: 'c', 13: 'b', 14: 'b', 15: 'c'
}

# Bab 4 answers (15 questions)
# Q1: c (Tekanan darah sistolik terjadi saat jantung berkontraksi)
# Q2: a (Struktur tubuh bukan tanda vital)
# Q3: b (Mengubah posisi tidur secara periodik / alih baring)
# Q4: a (Lobus frontal mengatur emosi, gerakan sadar, penciuman/kepribadian)
# Q5: b (Saraf parasimpatik)
# Q6: b (Sistem endokrin)
# Q7: b (Ekspresi wajah, sikap, dan kata-kata)
# Q8: c (Emosi dapat berubah tergantung pengalaman hidup)
# Q9: b (Memberikan perawatan sesuai kondisi emosional lansia)
# Q10: c (Proses menyimpan informasi dalam otak)
# Q11: d (Semua jawaban benar)
# Q12: c (5 tingkatan hierarki Maslow)
# Q13: d (Kebutuhan fisiologis)
# Q14: b (Sistem menjaga kondisi tubuh stabil)
# Q15: b (Tubuh akan mengeluarkan keringat)
ans_bab4 = {
    1: 'c', 2: 'a', 3: 'b', 4: 'a', 5: 'b', 6: 'b', 7: 'b', 8: 'c',
    9: 'b', 10: 'c', 11: 'd', 12: 'c', 13: 'd', 14: 'b', 15: 'b'
}

print("Answer keys mapped completely!")

