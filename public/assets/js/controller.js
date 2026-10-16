// CONTROLLER bag.1 — tab + render soal (butuh QuizView dasar).
var QuizController = (function (M, V) {
  var C = {};
  C.buildTabs = function () {
    var icons = { sec1: "fa-pen-nib", sec2: "fa-comments", sec3: "fa-headphones", sec4: "fa-book-open" };
    var t = document.getElementById("tabs"); t.innerHTML = "";
    V.SECT.forEach(function (s, i) {
      var c = M.QS.filter(function (q) { return V.SECMAP[q.section] === s; }).length;
      var b = document.createElement("button"); b.id = "tab-" + s;
      b.className = "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all text-slate-600 hover:bg-slate-100";
      b.innerHTML = '<i class="fa-solid ' + icons[s] + '"></i><span>' + (i + 1) + '. ' + V.SECFULL[s] + ' (' + c + ')</span>';
      b.onclick = function () { C.jumpToSection(s); };
      t.appendChild(b);
    });
  };
  C.markTab = function (sec) {
    V.SECT.forEach(function (x) {
      var b = document.getElementById("tab-" + x);
      if (b) b.className = "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all " + (x === sec ? "bg-fuji-50 text-fuji-700 border border-fuji-200" : "text-slate-600 hover:bg-slate-100");
    });
  };
  C.jumpToSection = function (s) {
    for (var i = 0; i < M.order.length; i++) {
      var q = M.byNo(M.order[i]);
      if (V.SECMAP[q.section] === s) { M.cur = i; C.renderOne(); break; }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return C;
})(QuizModel, QuizView);
