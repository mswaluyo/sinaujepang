import fs from "node:fs";
const p = "d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
for (const q of d) {
  if (q.no >= 35 && q.no <= 51) {
    console.log(q.no + " | img=" + JSON.stringify(q.img) + " | link=" + JSON.stringify(q.link) + " | ans=" + q.answer);
  }
}
