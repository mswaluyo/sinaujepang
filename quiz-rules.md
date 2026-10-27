# **Hare-quiz: Aturan Membuat Soal**

*File ini berisi panduan singkat untuk membuat soal baru.*

## **Field Wajib Setiap Soal**

| Field | Deskripsi |
|-------|-----------|
| `no` | Nomor soal (unik, berurutan) |
| `section` | Kategori: `"SESI 1 : MOJIGOI"`, `"SESI 2 : HYOUGEN"`, `"SESI 3 : CHOUKAI"`, atau `"SESI 4 : DOKKAI"` |
| `title` | Judul soal/monton dialog |
| `img` | Path gambar (biasanya `""`) |
| `options` | Array 3 opsi |
| `answer` | Indeks jawaban benar (0, 1, atau 2) |
| `score` | Selalu `"0/4"` |
| `trans` | Terjemahan Indonesia |
| `trans_rom` | Terjemahan romaji atau `-` |
| `mnn` | Tipe soal: `"Mojigoi"` (kosakata/gambar), `"Hyougen"` (tata bahasa/ungkapan), `"Choukai"` (mendengarkan), `"Dokkai"` (membaca) |
| `analisis` | Penjelasan dalam Bahasa Indonesia |
| `opt_detail` | Detail per opsi |
| `opt_note` | Catatan pendek per opsi |
| `kunci_id` | Kunci jawaban Jepang |

## **Struktur Options** (3 opsi)

Array `options` berisi 3 objek (`text`, `img`); detail per opsi (`kana`, `rom`, `arti`, `alasan`) serta catatan (`opt_note`) dipisah ke `opt_detail` dan `opt_note`.

- `options` : array 3 objek `{ text, img }`
- `opt_detail` : array 3 objek `{ kana, rom, arti, alasan }`
- `opt_note` : array 3 string

## **Format `analisis`**

Mulai dengan `"[MNN Bab X - Topik] penjelasan...\"`

- `Mojigoi` = SESI 1 (vocabulary/gambar)
- `Hyougen` = SESI 2 (grammar/ungkapan)
- `Choukai` = SESI 3 (mendengarkan/listening)
- `Dokkai` = SESI 4 (membaca/reading)

## **Ceklist Submit Soal**

- [ ] `no` sequential
- [ ] `section` sesuai topik
- [ ] `options` berisi 3 objek
- [ ] `opt_detail` punya 3 objek `{ kana, rom, arti, alasan }`
- [ ] `opt_note` punya 3 string
- [ ] `score` = `"0/4"`
- [ ] `trans` ada
- [ ] `trans_rom` ada atau `-`
- [ ] `mnn` benar
- [ ] `analisis` mulai dengan `[MNN Bab X - Topik]`
- [ ] `opt_detail` punya 3 objek
- [ ] `opt_note` punya 3 string
- [ ] `kunci_id` sesuai `text` opsi benar
## **Tipe Soal (dari hare)**

1. Gambar: `title` kosong/"Gambar berikut.", `img` terisi, `trans_rom` sering "-".
2. Teks: `title` berisi kalimat Jepang/Indonesia, `img` bisa kosong.
3. Percakapan teks: `title` berisi dialog, options berupa respons.
4. Percakapan audio: `link`/audio terisi.
5. Kanji (bertanda): opsi berupa kanji, `kunci_id` berupa kanji.

## **Konsistensi tambahan**
- Deskripsi gambar taruh di `analisis`/`trans`, bukan di `title`.
- `kunci_id` harus cocok dengan opsi yang benar; `answer` index sesuai.
EOF