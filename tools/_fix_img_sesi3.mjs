import fs from "node:fs";

const path = "d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

// Map no -> correct img (choukai_*.jpg), karena tidak semua gambar kita punya (35,38,41,45,47,48)
const imgMap = {
  35: "images/choukai_35.jpg",
  38: "images/choukai_38.jpg",
  41: "images/choukai_41_toko.jpg",
  43: "images/choukai_43.jpg",
  45: "images/choukai_44.jpg",
  47: "images/choukai_47.jpg",
  48: "images/choukai_48.jpg",
  49: "images/choukai_48.jpg",
};

// Perbaiki hanya yang gapapa (img mengandung 'soal_')
let changed = 0;
for (const q of data) {
  if (q.no >= 35 && q.no <= 51 && q.img && q.img.startsWith("images/soal_")) {
    const key = q.no;
    if (imgMap[key]) {
      q.img = imgMap[key];
      changed++;
    }
  }
}

fs.writeFileSync("public/basu3-quiz/quiz-data.json", JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("perbaikan img: " + changed + " soal");
