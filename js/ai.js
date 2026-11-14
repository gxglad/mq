(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  var tasks = [];
  var seq = 0;

  var TOPICS = [
    "学校有社团吗", "宿舍几个人一间", "学费要交多少", "军训多久",
    "能考大学吗", "怎么报名", "竞赛获奖情况", "有什么实训基地",
    "学校地址在哪", "师资力量怎么样", "有奖学金吗", "食堂好吃吗"
  ];

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function preview() {
    var input = $("#askInput");
    var box = $("#splitPreview");
    var list = MqBrain.split(input.value);
    if (!list.length) {
      box.innerHTML = '<span class="lb">识别到的任务会显示在这里</span>';
      return;
    }
    box.innerHTML = '<span class="lb">识别到 ' + list.length + " 个任务</span>" +
      list.map(function (t) { return '<span class="tk">' + esc(t) + "</span>"; }).join("");
  }

  async function runTask(task) {
    task.state = "run";
    task.progress = 0;
    task.trace = [];
    task.res = null;
    render();

    await wait(180 + Math.random() * 160);
    task.progress = 35;
    task.trace.push("解析：" + task.text);
    render();

    await wait(200 + Math.random() * 180);
    task.progress = 70;
    var res = MqBrain.ask(task.text);
    task.res = res;
    task.trace.push("匹配：" + (res.kind === "kb" ? "知识库条目" : res.kind === "data" ? "站内相关条目" : "未直接命中"));
    task.trace.push("命中 " + (res.refs ? res.refs.length : 0) + " 条出处");
    render();

    await wait(160 + Math.random() * 140);
    task.progress = 100;
    task.state = "done";
    render();
    checkBatch();
  }

  function taskHTML(task, i) {
    var label = { wait: "排队中", run: "检索中", done: "已返回", fail: "无结果" }[task.state];
    var body = "";

    if (task.state === "run" || task.state === "done") {
      body += '<div class="progress"><i style="width:' + task.progress + '%"></i></div>';
      if (task.trace.length) {
        body += '<div class="trace">' + task.trace.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>";
      }
    }

    var res = task.res;
    if (res) {
      body += '<div class="answer"><p class="ans-lead">' + esc(res.lead) + "</p>";
      if (res.b && res.b.length) {
        body += "<ul>" + res.b.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }
      if (res.tail) body += '<p class="ans-tail">' + esc(res.tail) + "</p>";
      body += "</div>";

      if (res.refs && res.refs.length) {
        body += '<div class="refs"><div class="rt">出处 <em>' + res.refs.length + " 条</em></div>" +
          res.refs.map(function (r, k) {
            return '<a class="ref" href="' + r.u + '"' + (r.ext ? ' target="_blank" rel="noopener"' : "") + ">" +
              '<span class="no">' + (k + 1) + "</span>" +
              '<span class="tx"><b>' + esc(r.t) + "</b><i>" + esc(r.k) + "</i></span>" +
              '<span class="go">打开</span></a>';
          }).join("") + "</div>";
      }
    }

    return '<div class="task">' +
      '<div class="task-hd">' +
        '<span class="idx">' + (i + 1) + "</span>" +
        '<span class="q">' + esc(task.text) + "</span>" +
        '<span class="st ' + task.state + '">' + label + "</span>" +
      "</div>" +
      (body ? '<div class="task-bd">' + body + "</div>" : "") +
      "</div>";
  }

  function render() {
    var list = $("#taskList");
    list.innerHTML = tasks.map(taskHTML).join("");
    var done = tasks.filter(function (t) { return t.state === "done"; }).length;
    $("#doneCount").textContent = done + " / " + tasks.length;
    $("#stTotal").textContent = tasks.length;
    $("#stDone").textContent = done;
    $("#stRefs").textContent = tasks.reduce(function (a, t) {
      return a + (t.res && t.res.refs ? t.res.refs.length : 0);
    }, 0);
  }

  function checkBatch() {
    var box = $("#batchBox");
    var finished = tasks.filter(function (t) { return t.state === "done"; });
    if (tasks.length < 2 || finished.length !== tasks.length) {
      box.innerHTML = "";
      return;
    }
    var rows = tasks.map(function (t, i) {
      var first = t.res && t.res.refs && t.res.refs[0];
      return "<tr><td>" + (i + 1) + ". " + esc(t.text) + "</td>" +
        "<td>" + (t.res && t.res.refs ? t.res.refs.length : 0) + " 条</td>" +
        "<td>" + (first ? '<a href="' + first.u + '"' + (first.ext ? ' target="_blank" rel="noopener"' : "") + ">打开</a>" : "—") + "</td></tr>";
    }).join("");
    box.innerHTML = '<div class="batch">' +
      "<h3>本次共 " + finished.length + " 个任务，全部返回</h3>" +
      "<p>每件事各自查、各自出结果，点开就是对应的页面或原文。</p>" +
      "<table><tbody>" + rows + "</tbody></table></div>";
  }

  function dispatch(text) {
    var list = MqBrain.split(text);
    if (!list.length) return;
    tasks = list.map(function (t) {
      return { id: ++seq, text: t, state: "wait", progress: 0, trace: [], res: null };
    });
    $("#batchBox").innerHTML = "";
    render();
    tasks.forEach(function (t, i) {
      setTimeout(function () { runTask(t); }, i * 220);
    });
  }

  $("#askForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#askInput").value.trim();
    if (!v) { $("#askInput").focus(); return; }
    dispatch(v);
  });

  $("#askInput").addEventListener("input", preview);

  $("#reRun").addEventListener("click", function () {
    if (!tasks.length) return;
    dispatch(tasks.map(function (t) { return t.text; }).join(" + "));
  });

  $("#clearAll").addEventListener("click", function () {
    tasks = [];
    $("#batchBox").innerHTML = "";
    render();
  });

  var topics = $("#topics");
  topics.innerHTML = TOPICS.map(function (t) { return '<button type="button">' + esc(t) + "</button>"; }).join("");
  Array.prototype.forEach.call(topics.querySelectorAll("button"), function (b) {
    b.addEventListener("click", function () {
      var input = $("#askInput");
      var cur = input.value.trim();
      var add = b.textContent;
      if (!cur) input.value = add;
      else if (cur.split(/[+＋、，,；;]/).map(function (s) { return s.trim(); }).indexOf(add) < 0) input.value = cur + " + " + add;
      preview();
      input.focus();
    });
  });

  $("#stKb").textContent = (window.KB || []).length;

  var auto = (function () {
    var m = /[?&]q=([^&]*)/.exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  })();

  if (auto) {
    $("#askInput").value = auto;
    preview();
    dispatch(auto);
  } else {
    $("#askInput").value = "今年竞赛获奖 + 学校介绍";
    preview();
    dispatch("今年竞赛获奖 + 学校介绍");
  }
})();
