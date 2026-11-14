(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  var HERO_SAMPLES = [
    "今年竞赛获奖 + 学校介绍",
    "有什么社团、宿舍几人一间、怎么报名",
    "计算机网络技术课程 + 实训基地 + 就业"
  ];

  var CHAT_SAMPLES = ["学校有社团吗", "宿舍几个人一间", "学费要交多少", "能考大学吗", "有什么专业", "怎么联系学校"];

  function card(res, q, i) {
    var refs = (res.refs || []).map(function (r) {
      return '<a href="' + r.u + '"' + (r.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(r.t) + "<i>" + esc(r.k) + "</i></a>";
    }).join("");
    var li = (res.b || []).map(function (x) {
      return '<div style="position:relative;padding-left:15px;margin-bottom:5px;font-size:13px;color:var(--text-2);line-height:1.75">' +
        '<span style="position:absolute;left:1px;top:9px;width:5px;height:5px;border-radius:50%;background:var(--blue-2)"></span>' +
        esc(x) + "</div>";
    }).join("");
    return '<div class="card" style="padding:18px 20px;margin-bottom:12px">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">' +
        '<span style="width:22px;height:22px;border-radius:50%;background:#eef4fd;color:var(--blue);font-size:11.5px;display:grid;place-items:center">' + (i + 1) + "</span>" +
        '<b style="font-size:15px;color:var(--ink-700)">' + esc(q) + "</b>" +
        '<span style="margin-left:auto;font-size:11.5px;color:#2f8f57;border:1px solid #cfe8d8;background:#f3fbf6;border-radius:999px;padding:1px 9px">已返回</span>' +
      "</div>" +
      '<p style="margin:0 0 8px;font-size:14px;color:var(--text)">' + esc(res.lead) + "</p>" +
      (li ? '<div style="margin:0 0 8px">' + li + "</div>" : "") +
      (res.tail ? '<p style="margin:0;font-size:12.5px;color:var(--text-3)">' + esc(res.tail) + "</p>" : "") +
      (refs ? '<div class="ans-refs"><span class="rt">出处</span>' + refs + "</div>" : "") +
      "</div>";
  }

  var heroInput = $("#heroInput");
  var heroResult = $("#heroResult");
  var heroList = $("#heroResultList");

  function runHero(text) {
    var tasks = MqBrain.split(text);
    if (!tasks.length) { heroInput.focus(); return; }
    $("#heroResultTitle").textContent = "共 " + tasks.length + " 个任务";
    $("#heroResultMeta").textContent = "分别检索后一次返回，点开链接看原文";
    heroList.innerHTML = "";
    heroResult.style.display = "block";
    tasks.forEach(function (t, i) {
      var res = MqBrain.ask(t);
      heroList.insertAdjacentHTML("beforeend", card(res, t, i));
    });
    heroResult.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if ($("#heroAsk")) {
    $("#heroAsk").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = heroInput.value.trim();
      if (!v) { heroInput.focus(); return; }
      runHero(v);
    });

    var hc = $("#heroChips");
    hc.innerHTML = HERO_SAMPLES.map(function (s) { return '<button type="button">' + esc(s) + "</button>"; }).join("");
    Array.prototype.forEach.call(hc.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () {
        heroInput.value = b.textContent;
        runHero(b.textContent);
      });
    });
  }

  var chatBody = $("#chatBody");
  var chatInput = $("#chatInput");
  var chatCount = $("#chatCount");
  var rounds = 0;

  function push(kind, html) {
    var div = document.createElement("div");
    div.className = "msg " + kind;
    div.innerHTML = '<span class="av">' + (kind === "ai" ? "AI" : "我") + "</span><div class=\"bubble\">" + html + "</div>";
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }

  function askChat(text) {
    var q = String(text || "").trim();
    if (!q) return;
    push("me", esc(q));
    var res = MqBrain.ask(q);
    push("ai", MqBrain.answerHTML(res));
    rounds += 1;
    chatCount.textContent = rounds + " 轮对话";
    chatInput.value = "";
  }

  if (chatBody) {
    push("ai", MqBrain.answerHTML({
      lead: "你好，学校的招生专业、社团宿舍、竞赛就业、联系方式都能问，说一句就行。",
      b: ["一次想问几件事，用加号或顿号隔开，我会分开查。", "答完会给出来源链接，点开可以核对原文。"],
      tail: "",
      refs: [{ t: "任务台", u: "ai.html", k: "站内", ext: 0 }]
    }));

    var cc = $("#chatChips");
    cc.innerHTML = CHAT_SAMPLES.map(function (s) { return '<button type="button">' + esc(s) + "</button>"; }).join("");
    Array.prototype.forEach.call(cc.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () { askChat(b.textContent); });
    });

    $("#chatSend").addEventListener("click", function () { askChat(chatInput.value); });
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); askChat(chatInput.value); }
    });
  }
})();
