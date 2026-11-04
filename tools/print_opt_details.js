const fs = require('fs');
const list = JSON.parse(fs.readFileSync('tools/shimemasu2_raw_opt_details.json', 'utf8'));

list.forEach(q => {
  console.log(`Q${q.no} [Ans=${q.ans_idx} : ${q.ans_text}]`);
  if (q.opt_detail) {
    q.opt_detail.forEach((o, i) => {
      console.log(`  opt${i}: kana='${o.kana}' arti='${o.arti}' rom='${o.rom}' alasan='${o.alasan}'`);
    });
  }
});

