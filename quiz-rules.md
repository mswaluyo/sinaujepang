# **Hare-quiz: Aturan Membuat Soal**

*File ini berisi panduan singkat untuk membuat soal baru.*

## **Field Wajib Setiap Soal**

| Field | Deskripsi |
|-------|-----------|
| `no` | Nomor soal (unik, berurutan) |
| `section` | Kategori: `"SESI 1 : MOJIGOI"` atau `"SESI 2 : HYOUGEN"` |
| `title` | Judul soal/monton dialog |
| `img` | Path gambar (biasanya `""`) |
| `options` | Array 3 opsi |
| `answer` | Indeks jawaban benar (0, 1, atau 2) |
| `score` | Selalu `"0/4"` |
| `trans` | Terjemahan Indonesia |
| `trans_rom` | Terjemahan romaji atau `-` |
| `mnn` | `"Mojigoi"` atau `"Hyougen"` |
| `analisis` | Penjelasan dalam Bahasa Indonesia |
| `opt_detail` | Detail per opsi |
| `opt_note` | Catatan pendek per opsi |
| `kunci_id` | Kunci jawaban Jepang |

## **Struktur Options** (3 opsi)

Setiap opsi harus punya: `text`, `img`, `kana`, `rom`, `arti`, `alasan`.

## **Format `analisis`**

Mulai dengan `"[MNN Bab X - Topik] penjelasan...\"`

- `Mojigoi` = SESI 1 (vocabulary/gambar)
- `Hyougen` = SESI 2 (grammar/ungkapan)

## **Ceklist Submit Soal**

- [ ] `no` sequential
- [ ] `section` sesuai topik
- [ ] `options` berisi 3 objek
- [ ] Setiap option: `text`, `kana`, `rom`, `arti`, `alasan`
- [ ] `answer` = 0, 1, atau 2
- [ ] `score` = `"0/4"`
- [ ] `trans` ada
- [ ] `trans_rom` ada atau `-`
- [ ] `mnn` benar
- [ ] `analisis` mulai dengan `[MNN Bab X - Topik]`
- [ ] `opt_detail` punya 3 objek
- [ ] `opt_note` punya 3 string
- [ ] `kunci_id` sesuai `text` opsi benar