(function () {
  "use strict";

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  function norm(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/[\s，。、；：？！""''（）()【】\[\],.;:?!"'`~@#$%^&*+=|\\/<>_-]/g, "");
  }

  var SYN = [
    [/住宿|寝室|宿舍楼|住宿舍|住校/g, "宿舍"],
    [/伙食|饭菜|吃饭|餐厅|打饭|餐/g, "食堂"],
    [/无线网|上网|联网/g, "wifi 网络"],
    [/学费|要交钱|收费|交多少钱|费用|多少钱/g, "学费 收费"],
    [/助学金|补助|困难|低保|资助/g, "资助 助学金"],
    [/奖学金|奖励|评优/g, "奖学金"],
    [/社团|社联|兴趣小组|俱乐部/g, "社团"],
    [/文凭|毕业证|证书/g, "毕业 证书"],
    [/考大学|升学|专升本|职教高考|对口升学/g, "升学 职教高考"],
    [/实习|顶岗|下厂/g, "实习"],
    [/工作|就业|找工作|上岗/g, "就业"],
    [/老师|教师|师资/g, "老师 师资"],
    [/操场|体育|运动|球场/g, "体育 操场"],
    [/看病|医务|生病|医院/g, "医务室"],
    [/心理|压力|情绪|焦虑/g, "心理"],
    [/电话|联系方式|咨询|邮箱|怎么联系/g, "联系 电话"],
    [/地址|在哪儿|怎么走|交通|公交|地铁/g, "地址 交通"],
    [/报名|报考|录取|分数线|多少分/g, "招生 报名"],
    [/军训|国防教育/g, "军训"],
    [/校服|着装/g, "校服"],
    [/手机|电子产品/g, "手机"],
    [/请假|销假/g, "请假"],
    [/违纪|处分|开除|警告/g, "违纪 处分"],
    [/快递|包裹|驿站/g, "快递"],
    [/校园卡|饭卡|一卡通/g, "校园卡"],
    [/图书馆|借书|自习/g, "图书馆"],
    [/竞赛|比赛|大赛|获奖|金牌/g, "竞赛 大赛"]
  ];

  function expand(q) {
    var s = String(q);
    SYN.forEach(function (r) { s = s.replace(r[0], r[1]); });
    return s;
  }

  function grams(s) {
    s = norm(s);
    var g = [];
    if (!s.length) return g;
    if (s.length <= 2) { g.push(s); return g; }
    for (var i = 0; i < s.length - 1; i++) g.push(s.substr(i, 2));
    return g;
  }

  var PREFIX = /^(请|麻烦|帮我|帮忙|我想|我要|我需要|我想知道|想知道|请问|给我|替我|另外|然后|还有|以及|并且|同时|顺便|再)+/;
  var ASK = /^(找出|找到|查找|查询|查一下|查查|查|搜索一下|搜索|搜一下|搜|看看|看一下|列出|列一下|列|整理一下|整理|汇总|汇总一下|获取|告诉我|说说|讲一下|来一份|来点|找|要|介绍介绍|介绍一下|介绍)+/;

  function clean(t) {
    t = String(t).trim().replace(/^[：:\s]+/, "").replace(/[。；;！!？?\s]+$/, "");
    var guard = 0;
    while (guard++ < 8) {
      var before = t;
      t = t.replace(PREFIX, "").replace(ASK, "");
      if (t === before) break;
    }
    return t.trim();
  }

  function split(text) {
    var raw = String(text || "").replace(/\r/g, "");
    var parts = raw.split(/[\n＋+；;、，,｜|]+|\s+以及\s+|\s+还有\s+|\s*／\s*|\s*\/\s*/);
    var out = [];
    parts.forEach(function (p) {
      p = clean(p);
      if (p.length >= 2) out.push(p);
    });
    return out;
  }

  function scoreEntry(q, e) {
    var qq = norm(expand(q));
    var canon = norm(expand(e.q[0] || ""));
    var keys = String(e.k).split(/\s+/).filter(Boolean);
    var hit = 0, matched = 0;
    keys.forEach(function (k) {
      var nk = norm(k);
      if (nk && qq.indexOf(nk) > -1) { hit += 1 + Math.min(2, nk.length / 3); matched += 1; }
    });

    var text = norm(expand(e.q.join(" ") + " " + e.k + " " + e.lead));
    var g = grams(q);
    var overlap = 0;
    g.forEach(function (x) { if (text.indexOf(x) > -1) overlap += 1; });
    var ratio = g.length ? overlap / g.length : 0;

    var canonBonus;
    if (!canon) canonBonus = 0;
    else if (qq === canon) canonBonus = 8;
    else if (qq.indexOf(canon) > -1 || canon.indexOf(qq) > -1) canonBonus = 5;
    else {
      var cg = grams(canon), co = 0;
      cg.forEach(function (x) { if (qq.indexOf(x) > -1) co += 1; });
      canonBonus = cg.length ? (co / cg.length) * 4 : 0;
    }

    return hit * 2 + ratio * 2 + canonBonus + matched * 0.2;
  }

  function bestEntry(q) {
    var best = null;
    var bestScore = 0;
    (window.KB || []).forEach(function (e) {
      var s = scoreEntry(q, e);
      if (s > bestScore) { bestScore = s; best = e; }
    });
    return { e: best, s: bestScore };
  }

  function corpus() {
    var out = [];
    (window.NEWS || []).forEach(function (n) {
      out.push({ t: n.t, u: "news.html?id=" + n.id, k: n.c, d: n.d });
    });
    (window.MAJORS || []).forEach(function (m) {
      out.push({ t: m.n, u: "teach.html#zhuanye", k: "专业", d: m.lv + " · " + m.tag });
    });
    (window.BASES || []).forEach(function (b) {
      out.push({ t: b.n, u: "teach.html#shixun", k: "实训基地", d: b.lv });
    });
    (window.HONORS || []).forEach(function (h) {
      out.push({ t: h, u: "school.html#rongyu", k: "学校荣誉", d: "荣誉一览" });
    });
    (window.COURSES || []).forEach(function (c) {
      out.push({ t: c.n + "（" + c.t + "）", u: "teach.html#kecheng", k: "课程", d: c.h + " 学时 · " + c.m });
    });
    (window.ORG || []).forEach(function (o) {
      o.c.forEach(function (c) { out.push({ t: c, u: "school.html#jigou", k: "机构", d: o.n }); });
    });
    (window.TEACHERS || []).forEach(function (t) {
      out.push({ t: t.n, u: "teacher.html#shizi", k: "师资", d: t.r });
    });
    return out;
  }

  function retrieve(q, limit) {
    var g = grams(q);
    if (!g.length) return [];
    var seen = {};
    var scored = corpus().map(function (e) {
      var text = norm(e.t + e.k + e.d);
      var hit = 0;
      g.forEach(function (x) { if (text.indexOf(x) > -1) hit += 1; });
      var s = hit / g.length;
      if (norm(e.t).indexOf(norm(q)) > -1) s += 0.7;
      return { e: e, s: s };
    }).filter(function (x) { return x.s > 0.42; });

    scored.sort(function (a, b) { return b.s - a.s; });
    var out = [];
    scored.forEach(function (x) {
      if (out.length >= limit || seen[x.e.u]) return;
      seen[x.e.u] = 1;
      out.push(x.e);
    });
    return out;
  }

  function refsOf(list) {
    return (list || []).map(function (r) {
      return { t: r[0], u: r[1], k: r[2] || "站内", ext: /^https?:/.test(r[1]) ? 1 : 0 };
    });
  }

  function mergeRefs(a, b, limit) {
    var out = [];
    var seen = {};
    a.concat(b).forEach(function (r) {
      if (!r || seen[r.u]) return;
      seen[r.u] = 1;
      out.push(r);
    });
    return out.slice(0, limit || 5);
  }

  var EXTRA = {
    club: ["学生工作", "student.html", "站内"],
    union: ["学生工作 · 共青团之窗", "student.html#gongqing", "站内"],
    dorm: ["通知公告", "news.html?c=通知公告", "站内"],
    canteen: ["校园公告 · 采购", "news.html?c=通知公告", "站内"],
    time: ["教学日历（官网）", "https://zjgzzx.zjgedu.cn/dblj/jxrl", "官网"],
    calendar: ["新闻中心", "news.html", "站内"],
    military: ["新闻中心 · 部门新闻", "news.html?c=部门新闻", "站内"],
    uniform: ["学生工作 · 政策文件", "student.html#zhengce", "站内"],
    fee: ["招生信息（官网）", "https://zjgzzx.zjgedu.cn/zsjy/zsxx", "官网"],
    aid: ["通知公告", "news.html?c=通知公告", "站内"],
    scholarship: ["师生园地 · 优秀学子", "teacher.html#xuezi", "站内"],
    card: ["校园公告", "news.html?c=通知公告", "站内"],
    network: ["信息化建设（官网）", "https://zjgzzx.zjgedu.cn/ddpg/xxyd111", "官网"],
    doctor: ["学生工作", "student.html", "站内"],
    mind: ["学生工作 · 思政教育", "student.html#sizheng", "站内"],
    safe: ["学生工作 · 政策文件", "student.html#zhengce", "站内"],
    address: ["到校路线（官网）", "https://zjgzzx.zjgedu.cn/", "官网"],
    library: ["图书馆（官网）", "https://zjgzzx.zjgedu.cn/tsg", "官网"],
    sport: ["学生工作 · 文体美育", "student.html#wenti", "站内"],
    competition: ["学校荣誉（官网）", "https://zjgzzx.zjgedu.cn/xxjs/xxry", "官网"],
    honor: ["学校荣誉（官网）", "https://zjgzzx.zjgedu.cn/xxjs/xxry", "官网"],
    intro: ["学校简介（官网）", "https://zjgzzx.zjgedu.cn/xxjs/xxgk", "官网"],
    motto: ["办学理念", "school.html#linian", "站内"],
    leader: ["领导介绍（官网）", "https://zjgzzx.zjgedu.cn/xxjs/ldjs", "官网"],
    org: ["组织机构（官网）", "https://zjgzzx.zjgedu.cn/xxjs/zzjg", "官网"],
    major_all: ["专业介绍（官网）", "https://zjgzzx.zjgedu.cn/zsjy/zyjs", "官网"],
    m_net: ["信息工程系", "teach.html#xi", "站内"],
    m_app: ["课程改革", "teach.html#kecheng", "站内"],
    m_soft: ["课程改革", "teach.html#kecheng", "站内"],
    m_cnc: ["实训基地", "teach.html#shixun", "站内"],
    m_mech: ["实训基地", "teach.html#shixun", "站内"],
    m_car: ["实训基地", "teach.html#shixun", "站内"],
    m_acc: ["课程改革", "teach.html#kecheng", "站内"],
    m_chem: ["产教融合新闻", "news.html?id=102", "站内"],
    m_ecom: ["学生工作 · 社团", "student.html#gongqing", "站内"],
    m_cloth: ["学生工作 · 文体美育", "student.html#wenti", "站内"],
    m_logi: ["专业建设", "teach.html#zhuanye", "站内"],
    course: ["专业建设", "teach.html#zhuanye", "站内"],
    base: ["实训基地（官网）", "https://zjgzzx.zjgedu.cn/ztwz/sxjd", "官网"],
    cert: ["学校概况", "school.html#gaikuang", "站内"],
    upgrade: ["招生信息（官网）", "https://zjgzzx.zjgedu.cn/zsjy/zsxx", "官网"],
    five: ["专业建设", "teach.html#zhuanye", "站内"],
    three: ["专业建设", "teach.html#zhuanye", "站内"],
    admit: ["招生信息（官网）", "https://zjgzzx.zjgedu.cn/zsjy/zsxx", "官网"],
    material: ["招生就业", "admit.html", "站内"],
    intern: ["实习就业（官网）", "https://zjgzzx.zjgedu.cn/zsjy/sxjy", "官网"],
    job: ["就业质量", "admit.html#jiuye", "站内"],
    coop: ["中外合作（官网）", "https://zjgzzx.zjgedu.cn/dwjl/zwhz", "官网"],
    abroad: ["合作办学", "admit.html#hezuo", "站内"],
    teacher: ["名师工作室（官网）", "https://zjgzzx.zjgedu.cn/msgzs", "官网"],
    scale: ["学校概况（官网）", "https://zjgzzx.zjgedu.cn/xxjs/xxgk", "官网"],
    exam: ["通知公告", "news.html?c=通知公告", "站内"],
    retake: ["新闻中心", "news.html", "站内"],
    change: ["招生就业", "admit.html", "站内"],
    leave: ["学生工作", "student.html", "站内"],
    phone: ["学生工作 · 政策文件", "student.html#zhengce", "站内"],
    punish: ["学生工作 · 政策文件", "student.html#zhengce", "站内"],
    award: ["师生园地", "teacher.html", "站内"],
    graduate: ["招生就业 · 办学层次", "admit.html#cengci", "站内"],
    activity: ["新闻中心", "news.html", "站内"],
    volunteer: ["党建工作 · 阳光义站", "party.html#yizhan", "站内"],
    party: ["党建新闻（官网）", "https://zjgzzx.zjgedu.cn/dj", "官网"],
    news: ["新闻中心（官网）", "https://zjgzzx.zjgedu.cn/xwzx", "官网"],
    contact: ["招生就业 · 咨询方式", "admit.html#lianxi", "站内"],
    site: ["后台管理", "admin/index.html", "站内"],
    who: ["AI 快速任务台", "ai.html", "站内"],
    hello: ["新闻中心", "news.html", "站内"],
    express: ["学生工作", "student.html", "站内"],
    park: ["招生就业", "admit.html", "站内"],
    map: ["校园地图（首页）", "index.html#campus", "站内"]
  };

  function ask(q) {
    var question = clean(q) || String(q || "").trim();
    var hit = bestEntry(question);

    if (hit.e && hit.s >= 3.4) {
      var baseRefs = hit.e.r || [];
      var extra = retrieve(question, 3).filter(function (r) {
        return !baseRefs.some(function (x) { return x[1] === r.u; });
      }).map(function (r) { return [r.t, r.u, r.k]; });

      var tail = hit.e.tail || "";
      if (EXTRA[hit.e.id]) extra.push(EXTRA[hit.e.id]);

      return {
        kind: "kb",
        tag: hit.e.q[0],
        lead: hit.e.lead,
        b: (hit.e.b || []).slice(),
        tail: tail,
        refs: mergeRefs(refsOf(baseRefs), refsOf(extra), 4),
        score: hit.s
      };
    }

    var found = retrieve(question, 4);
    if (found.length) {
      return {
        kind: "data",
        tag: "站内检索",
        lead: "站内没有完全对应的现成说法，先把最相关的几条按相关度列出来。",
        b: found.map(function (r) { return "「" + r.t + "」　" + r.k + " · " + r.d; }),
        tail: "如果不太对，把关键词说得更具体一点，比如加上专业名、年份或者部门。",
        refs: refsOf(found.map(function (r) { return [r.t, r.u, r.k]; })),
        score: hit.s
      };
    }

    var guesses = (window.KB || [])
      .map(function (e) { return { e: e, s: scoreEntry(question, e) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 3)
      .map(function (x) { return "「" + x.e.q[0] + "」"; });

    return {
      kind: "none",
      tag: "换个说法",
      lead: "这个问题在现有资料里没有直接答案，我不想编一个给你。",
      b: [
        "能换一种问法，或者把范围缩小到专业、部门、时间。",
        "也可能是问得比较具体，站内资料暂时还没覆盖到。",
        "可以直接打招生就业处或校长信箱问，联系方式见下方链接。"
      ],
      tail: "我猜你想问的是：" + guesses.join("、") + "。",
      refs: refsOf([
        ["咨询方式与地址", "admit.html#lianxi", "站内"],
        ["新闻中心", "news.html", "站内"],
        ["AI 快速任务台", "ai.html", "站内"]
      ]),
      score: hit.s
    };
  }

  function answerHTML(res) {
    var h = '<div class="ans">';
    h += '<p class="ans-lead">' + esc(res.lead) + "</p>";
    if (res.b && res.b.length) {
      h += "<ul>" + res.b.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    if (res.tail) h += '<p class="ans-tail">' + esc(res.tail) + "</p>";
    if (res.refs && res.refs.length) {
      h += '<div class="ans-refs"><span class="rt">出处</span>';
      h += res.refs.map(function (r) {
        return '<a href="' + r.u + '"' + (r.ext ? ' target="_blank" rel="noopener"' : "") + ">" +
          esc(r.t) + '<i>' + esc(r.k) + "</i></a>";
      }).join("");
      h += "</div>";
    }
    h += "</div>";
    return h;
  }

  function suggest(n) {
    var pool = (window.KB || []).filter(function (e) {
      return ["hello", "who", "site"].indexOf(e.id) < 0;
    });
    var out = [];
    var step = Math.max(1, Math.floor(pool.length / (n || 4)));
    for (var i = 0; i < (n || 4) && i * step < pool.length; i++) {
      out.push(pool[i * step].q[0]);
    }
    return out;
  }

  window.MqBrain = {
    ask: ask,
    split: split,
    clean: clean,
    norm: norm,
    retrieve: retrieve,
    answerHTML: answerHTML,
    suggest: suggest
  };
})();
