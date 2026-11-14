(function () {
  "use strict";

  var P = "mq_";
  var WATCH = ["news", "majors", "courses", "bases", "banners", "settings", "stamp"];

  function read(key) {
    try {
      var raw = localStorage.getItem(P + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isArr(v) { return Object.prototype.toString.call(v) === "[object Array]"; }

  var ICON_BY_NAME = [
    [/计算机应用|软件/, "app"],
    [/网络/, "net"],
    [/数控|加工|机械/, "gear"],
    [/机电|自动化|机器人/, "robot"],
    [/汽车|新能源/, "car"],
    [/会计|财务/, "money"],
    [/化工|材料/, "flask"],
    [/电商|商务|物流/, "cart"],
    [/服装|设计/, "shirt"],
    [/物流/, "box"]
  ];

  function iconOf(name) {
    for (var i = 0; i < ICON_BY_NAME.length; i++) {
      if (ICON_BY_NAME[i][0].test(name)) return ICON_BY_NAME[i][1];
    }
    return "code";
  }

  function apply() {
    var touched = [];

    var news = read("news");
    if (isArr(news) && news.length) {
      var published = news.filter(function (n) { return n.status === "已发布"; });
      published.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
      var bodies = {};
      window.NEWS = published.map(function (n) {
        if (n.body) {
          bodies[n.id] = String(n.body).split(/\n+/).filter(function (s) { return s.trim(); });
        }
        return {
          id: n.id,
          c: n.cat,
          t: n.title,
          d: n.date,
          v: Number(n.views) || 0,
          img: n.cover || "",
          hot: Number(n.hot || 0) || (n.title && n.title.length < 6 ? 1 : 0),
          top: Number(n.top) || 0,
          src: n.src || ""
        };
      });
      window.NEWS_BODY = bodies;
      touched.push("news");
    }

    var majors = read("majors");
    if (isArr(majors) && majors.length) {
      window.MAJORS = majors.map(function (m) {
        return { n: m.name, lv: m.level, tag: m.tag, d: m.intro, icon: iconOf(m.name) };
      });
      touched.push("majors");
    }

    var courses = read("courses");
    if (isArr(courses) && courses.length) {
      window.COURSES = courses.map(function (c) {
        return { n: c.name, t: c.major, h: String(c.hours), m: c.mode };
      });
      touched.push("courses");
    }

    var bases = read("bases");
    if (isArr(bases) && bases.length) {
      window.BASES = bases.map(function (b) {
        return { n: b.name, lv: b.level, d: b.intro };
      });
      touched.push("bases");
    }

    var banners = read("banners");
    if (isArr(banners) && banners.length) {
      var live = banners.filter(function (b) { return b.status !== "停用"; });
      live.sort(function (a, b) { return (Number(a.sort) || 0) - (Number(b.sort) || 0); });
      if (live.length) {
        window.BANNERS = live.map(function (b) {
          return { title: b.title, sub: b.sub, img: b.img, href: b.href };
        });
        touched.push("banners");
      }
    }

    var st = read("settings");
    if (st && window.SCHOOL) {
      if (st.siteName) window.SCHOOL.name = st.siteName;
      if (st.subName) window.SCHOOL.branch = st.subName;
      if (st.address) window.SCHOOL.address = st.address;
      if (st.mail) window.SCHOOL.mail = st.mail;
      if (st.icp) window.SCHOOL.icp = st.icp;
      touched.push("settings");
    }

    if (touched.length) rebuildIndex();
    return touched;
  }

  function rebuildIndex() {
    var out = [];
    (window.NEWS || []).forEach(function (n) {
      out.push({ t: n.t, u: "news.html?id=" + n.id, k: n.c, d: n.d });
    });
    (window.MAJORS || []).forEach(function (m) {
      out.push({ t: m.n, u: "teach.html#zhuanye", k: "专业", d: m.lv });
    });
    (window.BASES || []).forEach(function (b) {
      out.push({ t: b.n, u: "teach.html#shixun", k: "实训基地", d: b.lv });
    });
    (window.TEACHERS || []).forEach(function (t) {
      out.push({ t: t.n + "（" + t.r + "）", u: "teacher.html", k: "师资", d: "师生园地" });
    });
    (window.ORG || []).forEach(function (o) {
      o.c.forEach(function (c) { out.push({ t: c, u: "school.html#jigou", k: "机构", d: o.n }); });
    });
    out.push({ t: "学校概况", u: "school.html#gaikuang", k: "学校介绍", d: "学校简介" });
    out.push({ t: "发展记事", u: "school.html#dashiji", k: "学校介绍", d: "1980—2024" });
    out.push({ t: "办学理念", u: "school.html#linian", k: "学校介绍", d: "德技双馨" });
    out.push({ t: "学校荣誉", u: "school.html#rongyu", k: "学校介绍", d: "荣誉一览" });
    out.push({ t: "招生层次与就业情况", u: "admit.html", k: "招生就业", d: "3+3 / 五年一贯制" });
    out.push({ t: "校园 AI 检索台", u: "ai.html", k: "AI 助手", d: "多任务并行检索" });
    window.SEARCH_INDEX = out;
  }

  var applied = apply();

  window.MqSync = {
    apply: apply,
    active: applied.length > 0,
    keys: applied
  };

  if (applied.length && window.console) {
    console.log("[数据同步] 已从后台载入：" + applied.join("、"));
  }

  var reloading = false;
  window.addEventListener("storage", function (e) {
    if (!e.key || e.key.indexOf(P) !== 0) return;
    var k = e.key.slice(P.length);
    if (WATCH.indexOf(k) < 0) return;
    if (reloading) return;
    reloading = true;
    var hasData = apply();
    if (hasData.length) {
      try { location.reload(); } catch (err) {}
    }
  });
})();
