import fs from 'fs';
import path from 'path';

// Kamus pemetaan Kana -> Kanji resmi & Kana murni
// Untuk merapikan kolom kanji yang masih hiragana, dan kolom kana yang masih berisi kanji/frasa
const KANJI_DICTIONARY = {
  // Kata yang kolom kanjinya masih hiragana
  "あいます": { kanji: "会います", kana: "あいます" },
  "あがります": { kanji: "上がります", kana: "あがります" },
  "あげます": { kanji: "上げます", kana: "あげます" },
  "あし": { kanji: "足", kana: "あし" },
  "あつい": { kanji: "暑い", kana: "あつい" }, // panas cuaca / 熱い
  "あとで": { kanji: "後で", kana: "あとで" },
  "あります": { kanji: "あります", kana: "あります" }, // lazim kana
  "あんないします": { kanji: "案内します", kana: "あんないします" },
  "いそがしい": { kanji: "忙しい", kana: "いそがしい" },
  "いそがしかったです": { kanji: "忙しかったです", kana: "いそがしかったです" },
  "いちば": { kanji: "市場", kana: "いちば" },
  "うた": { kanji: "歌", kana: "うた" },
  "うたいます": { kanji: "歌います", kana: "うたいます" },
  "うみ": { kanji: "海", kana: "うみ" },
  "うれしい": { kanji: "嬉しい", kana: "うれしい" },
  "うれしかったです": { kanji: "嬉しかったです", kana: "うれしかったです" },
  "うんてんします": { kanji: "運転します", kana: "うんてんします" },
  "えき": { kanji: "駅", kana: "えき" },
  "えん": { kanji: "円", kana: "えん" },
  "おおきい": { kanji: "大きい", kana: "おおきい" },
  "おかあさん": { kanji: "お母さん", kana: "おかあさん" },
  "おきます": { kanji: "起きます", kana: "おきます" },
  "おしえます": { kanji: "教えます", kana: "おしえます" },
  "おっと": { kanji: "夫", kana: "おっと" },
  "おとこ": { kanji: "男", kana: "おとこ" },
  "おとします": { kanji: "落とします", kana: "おとします" },
  "おどします": { kanji: "脅します", kana: "おどします" },
  "おもい": { kanji: "重い", kana: "おもい" },
  "おもいます": { kanji: "思います", kana: "おもいます" },
  "おもくて": { kanji: "重くて", kana: "おもくて" },
  "およぎます": { kanji: "泳ぎます", kana: "およぎます" },
  "おります": { kanji: "降ります", kana: "おります" },
  "おわります": { kanji: "終わります", kana: "おわります" },
  "かいがん": { kanji: "海岸", kana: "かいがん" },
  "かえります": { kanji: "帰ります", kana: "かえります" },
  "かかります": { kanji: "掛かります", kana: "かかります" },
  "かき": { kanji: "柿", kana: "かき" },
  "かぎ": { kanji: "鍵", kana: "かぎ" },
  "かきます": { kanji: "書きます", kana: "かきます" },
  "かぞく": { kanji: "家族", kana: "かぞく" },
  "がっこ": { kanji: "学校", kana: "がっこう" },
  "かならず": { kanji: "必ず", kana: "かならず" },
  "かぶります": { kanji: "被ります", kana: "かぶります" },
  "かみ": { kanji: "紙", kana: "かみ" },
  "かむ": { kanji: "噛む", kana: "かむ" },
  "かります": { kanji: "借ります", kana: "かります" },
  "かるい": { kanji: "軽い", kana: "かるい" },
  "かるくて": { kanji: "軽くて", kana: "かるくて" },
  "かんたん": { kanji: "簡単", kana: "かんたん" },
  "きざみます": { kanji: "刻みます", kana: "きざみます" },
  "きせつ": { kanji: "季節", kana: "きせつ" },
  "きたない": { kanji: "汚い", kana: "きたない" },
  "きょうしつ": { kanji: "教室", kana: "きょうしつ" },
  "きります": { kanji: "切ります", kana: "きります" },
  "きれい": { kanji: "綺麗", kana: "きれい" },
  "きをつけます": { kanji: "気をつけます", kana: "きをつけます" },
  "きんじょ": { kanji: "近所", kana: "きんじょ" },
  "くがつ": { kanji: "九月", kana: "くがつ" },
  "くるま": { kanji: "車", kana: "くるま" },
  "けっこん": { kanji: "結婚", kana: "けっこん" },
  "こうえん": { kanji: "公園", kana: "こうえん" },
  "こうずい": { kanji: "洪水", kana: "こうずい" },
  "ごご": { kanji: "午後", kana: "ごご" },
  "ごぜん": { kanji: "午前", kana: "ごぜん" },
  "ごみばこ": { kanji: "ゴミ箱", kana: "ごみばこ" },
  "さきます": { kanji: "咲きます", kana: "さきます" },
  "ざせつ": { kanji: "挫折", kana: "ざせつ" },
  "さだめる": { kanji: "定める", kana: "さだめる" },
  "しあわせ": { kanji: "幸せ", kana: "しあわせ" },
  "しかいします": { kanji: "司会します", kana: "しかいします" },
  "しかります": { kanji: "叱ります", kana: "しかります" },
  "じかん": { kanji: "時間", kana: "じかん" },
  "しけん": { kanji: "試験", kana: "しけん" },
  "しごと": { kanji: "仕事", kana: "しごと" },
  "じしん": { kanji: "地震", kana: "じしん" },
  "しつもん": { kanji: "質問", kana: "しつもん" },
  "しません": { kanji: "しません", kana: "しません" },
  "しめて": { kanji: "閉めて", kana: "しめて" },
  "しゃしん": { kanji: "写真", kana: "しゃしん" },
  "じゅうしょ": { kanji: "住所", kana: "じゅうしょ" },
  "しゅうりします": { kanji: "修理します", kana: "しゅうりします" },
  "しょかいします": { kanji: "紹介します", kana: "しょうかいします" },
  "しょくじ": { kanji: "食事", kana: "しょくじ" },
  "しょっぱい": { kanji: "塩っぱい", kana: "しょっぱい" },
  "しらせます": { kanji: "知らせます", kana: "しらせます" },
  "すきです": { kanji: "好きです", kana: "すきです" },
  "すてきなバッグ": { kanji: "素敵なバッグ", kana: "すてきなバッグ" },
  "すてきなふく": { kanji: "素敵な服", kana: "すてきなふく" },
  "すてきなふくろ": { kanji: "素敵な袋", kana: "すてきなふくろ" },
  "すてます": { kanji: "捨てます", kana: "すてます" },
  "ずぼん": { kanji: "ズボン", kana: "ずぼん" },
  "すわります": { kanji: "座ります", kana: "すわります" },
  "たいふ": { kanji: "台風", kana: "たいふう" },
  "たいふう": { kanji: "台風", kana: "たいふう" },
  "たのしい": { kanji: "楽しい", kana: "たのしい" },
  "たのしかったです": { kanji: "楽しかったです", kana: "たのしかったです" },
  "たばこ": { kanji: "タバコ", kana: "たばこ" },
  "たべる": { kanji: "食べる", kana: "たべる" },
  "たまご": { kanji: "卵", kana: "たまご" },
  "ためす": { kanji: "試す", kana: "ためす" },
  "ちいさい": { kanji: "小さい", kana: "ちいさい" },
  "ちゅうもん": { kanji: "注文", kana: "ちゅうもん" },
  "つくります": { kanji: "作ります", kana: "つくります" },
  "つくる": { kanji: "作る", kana: "つくる" },
  "つま": { kanji: "妻", kana: "つま" },
  "つよくて": { kanji: "強くて", kana: "つよくて" },
  "できます": { kanji: "出来ます", kana: "できます" },
  "でぐち": { kanji: "出口", kana: "でぐち" },
  "てぶくろ": { kanji: "手袋", kana: "てぶくろ" },
  "でんしゃ": { kanji: "電車", kana: "でんしゃ" },
  "ときどき": { kanji: "時々", kana: "ときどき" },
  "とくべつ": { kanji: "特別", kana: "とくべつ" },
  "どこですか": { kanji: "何処ですか", kana: "どこですか" },
  "ととのった": { kanji: "整った", kana: "ととのった" },
  "とめます": { kanji: "止めます", kana: "とめます" },
  "ねむい": { kanji: "眠い", kana: "ねむい" },
  "のります": { kanji: "乗ります", kana: "のります" },
  "はしって": { kanji: "走って", kana: "はしって" },
  "はじめます": { kanji: "始めます", kana: "はじめます" },
  "はたらきます": { kanji: "働きます", kana: "はたらきます" },
  "はな": { kanji: "花", kana: "はな" },
  "はらって": { kanji: "払って", kana: "はらって" },
  "はります": { kanji: "貼ります", kana: "はります" },
  "はん": { kanji: "半", kana: "はん" },
  "ひこうき": { kanji: "飛行機", kana: "ひこうき" },
  "びっくりしました": { kanji: "びっくりしました", kana: "びっくりしました" },
  "びっくりします": { kanji: "びっくりします", kana: "びっくりします" },
  "ひつよう": { kanji: "必要", kana: "ひつよう" },
  "ひろいます": { kanji: "拾います", kana: "ひろいます" },
  "ふきます": { kanji: "吹きます", kana: "ふきます" },
  "ふく": { kanji: "服", kana: "ふく" },
  "ふくざつ": { kanji: "複雑", kana: "ふくざつ" },
  "ぶん": { kanji: "分", kana: "ふん" },
  "ぼうし": { kanji: "帽子", kana: "ぼうし" },
  "まがります": { kanji: "曲がります", kana: "まがります" },
  "まきます": { kanji: "巻きます", kana: "まきます" },
  "まよいます": { kanji: "迷います", kana: "まよいます" },
  "みえます": { kanji: "見えます", kana: "みえます" },
  "みせ": { kanji: "店", kana: "みせ" },
  "みます": { kanji: "見ます", kana: "みます" },
  "みません": { kanji: "見ません", kana: "みません" },
  "みる": { kanji: "見る", kana: "みる" },
  "むきます": { kanji: "剥きます", kana: "むきます" },
  "むずかしい": { kanji: "難しい", kana: "むずかしい" },
  "もどります": { kanji: "戻ります", kana: "もどります" },
  "もどる": { kanji: "戻る", kana: "もどる" },
  "やきます": { kanji: "焼きます", kana: "やきます" },
  "やさい": { kanji: "野菜", kana: "やさい" },
  "やすい": { kanji: "安い", kana: "やすい" },
  "ゆうめいな": { kanji: "有名な", kana: "ゆうめいな" },
  "ゆでます": { kanji: "茹でます", kana: "ゆでます" },
  "よごれます": { kanji: "汚れます", kana: "よごれます" },
  "りょうかん": { kanji: "旅館", kana: "りょうかん" },
  "わたして": { kanji: "渡して", kana: "わたして" },
  "わらいます": { kanji: "笑います", kana: "わらいます" },

  // Pembenahan kolom kana yang masih berisi Kanji / format campuran
  "お腹が痛いんです": { kanji: "お腹が痛いんです", kana: "おなかがいたいんです" },
  "こうえん / 公園": { kanji: "公園", kana: "こうえん" },
  "運動 ・うんどう": { kanji: "運動", kana: "うんどう" },
  "泳がない": { kanji: "泳がない", kana: "およがない" },
  "演じる": { kanji: "演じる", kana: "えんじる" },
  "遠くて": { kanji: "遠くて", kana: "とおくて" },
  "怪我をしています": { kanji: "怪我をしています", kana: "けがをしています" },
  "甘い": { kanji: "甘い", kana: "あまい" },
  "丸い": { kanji: "丸い", kana: "まるい" },
  "牛肉": { kanji: "牛肉", kana: "ぎゅうにく" },
  "牛乳": { kanji: "牛乳", kana: "ぎゅうにゅう" },
  "兄": { kanji: "兄", kana: "あに" },
  "結婚": { kanji: "結婚", kana: "けっこん" },
  "口": { kanji: "口", kana: "くち" },
  "高い": { kanji: "高い", kana: "たかい" },
  "耳": { kanji: "耳", kana: "みみ" },
  "借ります": { kanji: "借ります", kana: "かります" },
  "取ります": { kanji: "取ります", kana: "とります" },
  "集まります": { kanji: "集まります", kana: "あつまります" },
  "暑い": { kanji: "暑い", kana: "あつい" },
  "場所": { kanji: "場所", kana: "ばしょ" },
  "食堂": { kanji: "食堂", kana: "しょくどう" },
  "図書館": { kanji: "図書館", kana: "としょかん" },
  "静かな": { kanji: "静かな", kana: "しずかな" },
  "体が痛いんです": { kanji: "体が痛いんです", kana: "からだがいたいんです" },
  "台風": { kanji: "台風", kana: "たいふう" },
  "中止させます": { kanji: "中止させます", kana: "ちゅうしさせます" },
  "中止されます": { kanji: "中止されます", kana: "ちゅうしされます" },
  "中止します": { kanji: "中止します", kana: "ちゅうしします" },
  "頭が痛いんです": { kanji: "頭が痛いんです", kana: "あたまがいたいんです" },
  "働かない": { kanji: "働かない", kana: "はたらかない" },
  "動かない": { kanji: "動かない", kana: "うごかない" },
  "動物園": { kanji: "動物園", kana: "どうぶつえん" },
  "豚肉": { kanji: "豚肉", kana: "ぶたにく" },
  "入ります": { kanji: "入ります", kana: "はいります" },
  "父": { kanji: "父", kana: "ちち" },
  "風": { kanji: "風", kana: "かぜ" },
  "風邪": { kanji: "風邪", kana: "かぜ" },
  "勉強": { kanji: "勉強", kana: "べんきょう" },
  "母": { kanji: "母", kana: "はは" },
  "万": { kanji: "万", kana: "まん" },
  "面白い": { kanji: "面白い", kana: "おもしろい" },
  "目": { kanji: "目", kana: "め" },
  "話しする": { kanji: "話しする", kana: "はなしする" },
  "話す": { kanji: "話す", kana: "はなす" },
  "話せる": { kanji: "話せる", kana: "はなせる" }
};

export function updateKotobaWithKanji() {
  const jsonPath = path.join('public', 'kotoba-lolosyuk.json');
  const txtPath = path.join('public', 'kotoba-lolosyuk.txt');

  const kotobaList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let kanjiEnriched = 0;
  let kanaCleaned = 0;

  const updatedList = kotobaList.map(item => {
    let kanji = item.kanji;
    let kana = item.kana;

    // 1. Cek kamus berdasarkan kana
    if (KANJI_DICTIONARY[kana]) {
      const mapped = KANJI_DICTIONARY[kana];
      if (mapped.kanji !== kanji) {
        kanji = mapped.kanji;
        kanjiEnriched++;
      }
      if (mapped.kana !== kana) {
        kana = mapped.kana;
        kanaCleaned++;
      }
    } 
    // 2. Cek kamus berdasarkan kanji (untuk kasus kolom kana yang masih berisi kanji)
    else if (KANJI_DICTIONARY[kanji]) {
      const mapped = KANJI_DICTIONARY[kanji];
      kanji = mapped.kanji;
      if (mapped.kana !== kana) {
        kana = mapped.kana;
        kanaCleaned++;
      }
    }

    return {
      kanji,
      kana,
      rom: item.rom,
      arti: item.arti,
      paket: item.paket
    };
  });

  // Urutkan berdasarkan abjad Kana (a-i-u-e-o)
  updatedList.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));

  // Tulis kembali ke JSON dan TXT
  fs.writeFileSync(jsonPath, JSON.stringify(updatedList, null, 2), 'utf8');

  const txtContent = updatedList.map(k => `${k.kanji}\t${k.kana}\t${k.rom}\t${k.arti}\t(${k.paket.join(', ')})`).join('\n');
  fs.writeFileSync(txtPath, txtContent, 'utf8');

  console.log('=== PEMBARUAN KANJI & KANA BERHASIL ===');
  console.log(`Total Kotoba            : ${updatedList.length}`);
  console.log(`Kanji Berhasil Dilengkapi: ${kanjiEnriched}`);
  console.log(`Kana Berhasil Dirapikan  : ${kanaCleaned}`);
}

updateKotobaWithKanji();
