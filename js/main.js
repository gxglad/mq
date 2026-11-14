(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var norm = function (s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/[\s，。、；：？！""''（）()【】\[\],.;:?!"'`~@#$%^&*+=|\\/<>_-]/g, "");
  };
  var PAGE = document.body.getAttribute("data-page") || "home";
  var ASSET = "assets/";
  var PIC = ASSET + "images/";

  function q(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  function srcSite(src) {
    if (!src) return "https://zjgzzx.zjgedu.cn/";
    return "https://zjgzzx.zjgedu.cn" + src;
  }

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function buildHeader() {
    var top = $("[data-shell=top]");
    if (top) {
      top.innerHTML =
        '<div class="wrap">' +
          '<div class="topbar-l">' +
            '<span>' + esc(SCHOOL.name) + '</span>' +
            '<span class="sep">|</span>' +
            '<span>' + esc(SCHOOL.branch) + '</span>' +
          '</div>' +
          '<div class="topbar-r">' +
            '<a href="admin/index.html">后台管理入口</a>' +
            '<span class="sep">|</span>' +
            '<a href="https://zjgzzx.zjgedu.cn/" target="_blank" rel="noopener">原站首页</a>' +
            '<span class="sep">|</span>' +
            '<a href="school.html#jigou">组织机构</a>' +
          '</div>' +
        '</div>';
    }

    var head = $("[data-shell=masthead]");
    if (head) {
      head.innerHTML =
        '<div class="wrap">' +
          '<a class="brand" href="index.html">' +
            '<img src="' + ASSET + 'icons/emblem.png" alt="校徽">' +
            '<span>' +
              '<span class="brand-t">江苏省张家港中等专业学校</span>' +
              '<span class="brand-s">ZHANGJIAGANG SECONDARY SPECIALIZED SCHOOL · 信息工程系</span>' +
            '</span>' +
          '</a>' +
          '<div class="masthead-r">' +
            '<form class="search-box" action="search.html" method="get">' +
              '<input type="search" name="q" placeholder="站内检索" aria-label="站内检索">' +
              '<button type="submit" aria-label="搜索">搜</button>' +
            '</form>' +
            '<a class="btn-ai" href="ai.html"><i></i>校园 AI</a>' +
          '</div>' +
        '</div>';
    }

    var nav = $("[data-shell=nav]");
    if (nav) {
      var items = NAV.map(function (n) {
        var cls = "nav-item" + (n.id === PAGE ? " on" : "") + (n.hot ? " nav-hot" : "");
        var drop = n.sub
          ? '<div class="nav-drop">' + n.sub.map(function (s) {
              return '<a href="' + s.href + '">' + esc(s.text) + '</a>';
            }).join("") + '</div>'
          : "";
        return '<div class="' + cls + '">' +
          '<a href="' + n.href + '">' + esc(n.text) + (n.sub ? '<span class="caret">▾</span>' : "") + '</a>' +
          drop + '</div>';
      }).join("");
      nav.innerHTML = '<div class="wrap"><button class="nav-toggle" type="button">栏目导航 ☰</button>' + items + '</div>';
      $(".nav-toggle", nav).addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }
  }

  function buildFooter() {
    var f = $("[data-shell=footer]");
    if (f) {
      f.innerHTML =
        '<div class="wrap">' +
          '<div class="footer-top">' +
            '<div>' +
              '<div class="footer-brand">' +
                '<img src="' + ASSET + 'icons/emblem.png" alt="">' +
                '<span><b>江苏省张家港中等专业学校</b><span>江苏联合职业技术学院张家港分院</span></span>' +
              '</div>' +
              '<p style="margin:0;line-height:1.9">地址：' + esc(SCHOOL.address) + '<br>校长信箱：' + esc(SCHOOL.mail) + '<br>电话区号：0512</p>' +
            '</div>' +
            '<div><h4>快速通道</h4>' +
              QUICK.slice(0, 5).map(function (x) { return '<a href="' + srcSite(x.u) + '" target="_blank" rel="noopener">' + esc(x.n) + '</a>'; }).join("") +
            '</div>' +
            '<div><h4>常用栏目</h4>' +
              '<a href="school.html">学校介绍</a><a href="news.html">新闻中心</a><a href="teach.html">教学管理</a><a href="admit.html">招生就业</a><a href="ai.html">校园 AI</a>' +
            '</div>' +
            '<div><h4>友情链接</h4>' +
              LINKS.slice(0, 5).map(function (x) { return '<a href="' + x.u + '" target="_blank" rel="noopener">' + esc(x.n) + '</a>'; }).join("") +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>版权所有 © 江苏省张家港中等专业学校　计算机223网络技术-穆清</span>' +
            '<span>' + esc(SCHOOL.icp) + ' · ' + esc(SCHOOL.police) + '</span>' +
            '<span>本站为 2022 级毕业设计作品，数据整理自学校官网</span>' +
          '</div>' +
        '</div>';
    }
    var toTop = el('<button class="to-top" type="button" aria-label="回到顶部">↑</button>');
    document.body.appendChild(toTop);
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("on", window.scrollY > 520);
    }, { passive: true });
  }

  function initTicker() {
    var box = $("[data-ticker]");
    if (!box) return;
    var list = $(".ticker-list", box);
    list.innerHTML = NOTICES_SCROLL.map(function (t) {
      return '<li><a href="news.html?c=通知公告">' + esc(t) + '</a></li>';
    }).join("");
    var i = 0;
    setInterval(function () {
      i = (i + 1) % NOTICES_SCROLL.length;
      list.style.transform = "translateY(-" + i * 22 + "px)";
    }, 4200);
  }

  function initBanner() {
    var box = $("[data-hero]");
    if (!box) return;
    var data;
    if (window.BANNERS && window.BANNERS.length) {
      data = window.BANNERS.map(function (b) {
        return {
          img: PIC + b.img,
          kicker: window.SCHOOL.name,
          title: b.title,
          sub: b.sub,
          a: "查看详情",
          ah: b.href || "index.html",
          b: "校园 AI",
          bh: "ai.html"
        };
      });
    } else {
      data = [
        { img: PIC + "banner-01.jpg", kicker: "江苏省领航学校建设单位", title: "德技双馨", sub: "1984 年建校，28 个中高职专业，6200 余名在校学生", a: "了解学校", ah: "school.html", b: "校园 AI", bh: "ai.html" },
        { img: PIC + "banner-02.jpg", kicker: "国家级实训基地", title: "赛训融合", sub: "全国职业院校技能大赛累计 78 金 26 银 5 铜", a: "查看专业", ah: "teach.html", b: "实训基地", bh: "teach.html#shixun" },
        { img: PIC + "news-02.jpg", kicker: "校企合作", title: "产教融通", sub: "牵头组建江苏扬子江职业教育集团，42 所院校与 45 家骨干企业", a: "招生就业", ah: "admit.html", b: "合作办学", bh: "admit.html#hezuo" }
      ];
    }
    box.innerHTML =
      '<div class="hero-slides">' +
        data.map(function (d, i) {
          return '<div class="hero-slide' + (i === 0 ? " on" : "") + '" style="background-image:url(' + d.img + ')"></div>';
        }).join("") +
      '</div>' +
      '<div class="hero-inner" style="position:absolute;inset:0">' +
        '<div class="wrap">' +
          '<p class="hero-kicker" data-hk>' + esc(data[0].kicker) + '</p>' +
          '<h1 class="hero-title" data-ht>' + esc(data[0].title) + '</h1>' +
          '<div class="hero-line"></div>' +
          '<p class="hero-sub" data-hs>' + esc(data[0].sub) + '</p>' +
          '<div class="hero-btns" style="margin-top:16px">' +
            '<a class="btn btn-gold" data-ha href="' + data[0].ah + '">' + data[0].a + '</a>' +
            '<a class="btn btn-light" data-hb href="' + data[0].bh + '">' + data[0].b + '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="hero-dots"></div>';

    var slides = $$(".hero-slide", box);
    var dots = $(".hero-dots", box);
    dots.innerHTML = data.map(function (_, i) {
      return '<button type="button" class="' + (i === 0 ? "on" : "") + '" aria-label="第 ' + (i + 1) + ' 张"></button>';
    }).join("");
    var dotBtns = $$("button", dots);
    var cur = 0, timer = null;

    function go(i) {
      cur = (i + data.length) % data.length;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
      dotBtns.forEach(function (d, k) { d.classList.toggle("on", k === cur); });
      var d = data[cur];
      $("[data-hk]", box).textContent = d.kicker;
      $("[data-ht]", box).textContent = d.title;
      $("[data-hs]", box).textContent = d.sub;
      var ha = $("[data-ha]", box), hb = $("[data-hb]", box);
      ha.textContent = d.a; ha.href = d.ah;
      hb.textContent = d.b; hb.href = d.bh;
    }
    function play() { stop(); timer = setInterval(function () { go(cur + 1); }, 6000); }
    function stop() { if (timer) clearInterval(timer); }
    dotBtns.forEach(function (b, i) { b.addEventListener("click", function () { go(i); play(); }); });
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", play);
    play();
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (i) { io.observe(i); });
  }

  function counter() {
    $$("[data-count]").forEach(function (n) {
      var target = parseFloat(n.getAttribute("data-count"));
      var suffix = n.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;
      var start = null;
      function step(t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / 1100);
        n.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  function newsList(list, opt) {
    opt = opt || {};
    return '<ul class="news-list">' + (list || []).map(function (n) {
      var flag = n.top ? '<span class="top">置顶</span>' : (n.hot && opt.hot ? '<span class="hot">热点</span>' : "");
      return '<li><span class="dt">' + n.d.slice(5) + '</span>' +
        '<a class="tt" href="news.html?id=' + n.id + '" title="' + esc(n.t) + '">' + esc(n.t) + '</a>' + flag + '</li>';
    }).join("") + "</ul>";
  }

  var NEWS_TABS = ["校园新闻", "部门新闻", "通知公告"];

  function renderHome() {
    var f = $("[data-facts]");
    if (f) {
      f.innerHTML = FACTS.map(function (x) {
        var num = parseFloat(x.k);
        var plain = /^\d+$/.test(x.k) && !x.nc;
        return '<div class="fact">' +
          '<b' + (plain ? ' data-count="' + num + '" data-suffix="' + x.k.replace(/^\d+/, "") + '"' : '') + '>' + x.k + '</b>' +
          '<span>' + esc(x.v) + '</span><em>' + esc(x.d) + '</em></div>';
      }).join("");
    }

    var nBox = $("[data-home-news]");
    if (nBox) {
      var first = NEWS[0];
      var body = NEWS_BODY[first.id];
      nBox.innerHTML =
        '<div class="news-lead">' +
          '<a class="pic" href="news.html?id=' + first.id + '"><img src="' + PIC + first.img + '" alt=""></a>' +
          '<div>' +
            '<h3><a href="news.html?id=' + first.id + '">' + esc(first.t) + '</a></h3>' +
            '<p>' + esc(body ? body[0].slice(0, 100) + "…" : "学校近期重点工作与校园动态，点击查看详情。") + '</p>' +
            '<div class="meta"><span>' + esc(first.c) + '</span><span>' + first.d + '</span><span>阅读 ' + first.v + '</span></div>' +
          '</div>' +
        '</div>';
    }

    var tabsBox = $("[data-news-tabs]");
    if (tabsBox) {
      var listBox = $("[data-news-list]");
      var tbar = tabsBox.classList.contains("tabs") ? tabsBox : $(".tabs", tabsBox);
      var pool = {};
      NEWS_TABS.forEach(function (c) { pool[c] = NEWS.filter(function (n) { return n.c === c; }).slice(0, 6); });
      function paint(c) { if (listBox) listBox.innerHTML = newsList(pool[c], { hot: true }); }
      if (tbar && listBox) {
        $$("button", tbar).forEach(function (b) {
          b.addEventListener("click", function () {
            $$("button", tbar).forEach(function (x) { x.classList.remove("on"); });
            b.classList.add("on");
            paint(b.getAttribute("data-c"));
          });
        });
        paint(NEWS_TABS[0]);
      }
    }

    var mBox = $("[data-home-majors]");
    if (mBox) {
      mBox.innerHTML = MAJORS.slice(0, 8).map(function (m) {
        return '<a class="major reveal" href="teach.html#zhuanye">' +
          '<div class="ic">' + icon(m.icon) + '</div>' +
          '<h4>' + esc(m.n) + '</h4>' +
          '<div class="lv">' + esc(m.lv) + '</div>' +
          '<p>' + esc(m.d) + '</p></a>';
      }).join("");
    }

    var gBox = $("[data-home-gallery]");
    if (gBox) {
      var shots = [
        ["news-10.jpg", "新校区 · 福新路 2 号"],
        ["news-16.jpg", "省现代化实训基地"],
        ["news-06.jpg", "技能大赛集训现场"],
        ["activity-club.jpg", "学生社团活动"]
      ];
      gBox.innerHTML = shots.map(function (s) {
        return '<figure><img src="' + PIC + s[0] + '" alt="' + esc(s[1]) + '"><figcaption>' + esc(s[1]) + '</figcaption></figure>';
      }).join("");
    }

    var rBox = $("[data-home-road]");
    if (rBox) {
      rBox.innerHTML = TIMELINE.slice(-6).map(function (t) {
        return '<li><b>' + esc(t.y) + '</b>' + esc(t.t) + '</li>';
      }).join("");
    }

    counter();
  }

  function renderSchool() {
    var box = $("[data-intro]");
    if (box) {
      box.innerHTML = '<h2>' + esc(INTRO.title) + '</h2><div class="meta">' +
        '<span>学校介绍</span><span>更新：2026-11</span><span>来源：学校官网</span></div>' +
        INTRO.paras.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    }
    var t = $("[data-timeline]");
    if (t) {
      t.innerHTML = TIMELINE.map(function (x) {
        return "<li><b>" + esc(x.y) + "</b>" + esc(x.t) + "</li>";
      }).join("");
    }
    var h = $("[data-honors]");
    if (h) {
      h.innerHTML = HONORS.map(function (x, i) {
        return '<li><b>' + String(i + 1).padStart(2, "0") + '</b>' + esc(x) + "</li>";
      }).join("");
    }
    var o = $("[data-org]");
    if (o) {
      o.innerHTML = ORG.map(function (g) {
        return '<div class="block"><h3>' + esc(g.n) + '</h3><div class="tag-list">' +
          g.c.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</div></div>";
      }).join("");
    }
    var i = $("[data-idea]");
    if (i) {
      i.innerHTML =
        '<table class="table"><tbody>' +
        '<tr><th style="width:130px">校训</th><td>' + esc(IDEA.motto) + '</td></tr>' +
        '<tr><th>成才观</th><td>' + esc(IDEA.goal) + '</td></tr>' +
        '<tr><th>办学理念</th><td>' + esc(IDEA.aim) + '</td></tr>' +
        '<tr><th>办学特色</th><td>' + IDEA.features.join(" · ") + '</td></tr>' +
        '</tbody></table>';
    }
    var c = $("[data-champion]");
    if (c) {
      c.innerHTML = '<div class="quote">在全国职业院校技能大赛中累计获得 <b>78 金 26 银 5 铜</b>；连续二十三届获得张家港市技能竞赛金杯，连续 10 年被表彰为江苏省职业学校技能大赛先进学校。' +
        '连续两年承办全国职业院校技能大赛“制冷与空调设备组装与调试”赛项（中职组）并获优秀组织奖。</div>';
    }
  }

  function renderNews() {
    var box = $("[data-news-page]");
    if (!box) return;
    var cat = q("c") || "全部";
    var id = q("id");
    var side = $("[data-news-side]");
    if (side) {
      var cats = ["全部", "校园新闻", "部门新闻", "通知公告", "教育新闻"];
      side.innerHTML = '<h3>新闻分类</h3>' + cats.map(function (c) {
        return '<a href="news.html' + (c === "全部" ? "" : "?c=" + encodeURIComponent(c)) + '" class="' + (c === cat ? "on" : "") + '">' + esc(c) + "</a>";
      }).join("") + '<div class="contact">投稿邮箱：<br>' + esc(SCHOOL.mail) + '</div>';
    }

    if (id) {
      var item = NEWS.filter(function (n) { return String(n.id) === id; })[0];
      if (!item) { box.innerHTML = "<p>未找到该条内容。</p>"; return; }
      var body = NEWS_BODY[item.id] || [item.t, "本条内容已在站内归档，完整稿件请前往学校官网新闻中心查阅。", "来源：" + item.c + "　发布于 " + item.d + "。"];
      box.innerHTML =
        "<h2>" + esc(item.t) + "</h2>" +
        '<div class="meta"><span>' + esc(item.c) + '</span><span>' + item.d + '</span><span>阅读 ' + item.v + '</span></div>' +
        body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        '<p class="no-indent" style="margin-top:24px"><a class="btn btn-line" href="' + srcSite(item.src) + '" target="_blank" rel="noopener">查看官网原文</a>　<a class="btn btn-line" href="news.html">返回列表</a></p>';
      return;
    }

    var list = cat === "全部" ? NEWS : NEWS.filter(function (n) { return n.c === cat; });
    var page = Math.max(1, parseInt(q("p") || "1", 10));
    var size = 10;
    var total = Math.ceil(list.length / size) || 1;
    page = Math.min(page, total);
    var rows = list.slice((page - 1) * size, page * size);
    box.innerHTML =
      '<div class="filter">' + ["全部", "校园新闻", "部门新闻", "通知公告", "教育新闻"].map(function (c) {
        return '<a class="' + (c === cat ? "on" : "") + '" href="news.html' + (c === "全部" ? "" : "?c=" + encodeURIComponent(c)) + '">' + esc(c) + "</a>";
      }).join("") + "</div>" +
      '<table class="table"><thead><tr><th style="width:110px">日期</th><th>标题</th><th style="width:110px">栏目</th><th style="width:70px">阅读</th></tr></thead><tbody>' +
      rows.map(function (n) {
        return '<tr><td>' + n.d + '</td><td><a href="news.html?id=' + n.id + '">' + esc(n.t) + '</a></td><td>' + esc(n.c) + '</td><td>' + n.v + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<div class="pager">' + Array.from({ length: total }, function (_, i) {
        var p = i + 1;
        return '<a href="news.html?c=' + encodeURIComponent(cat) + "&p=" + p + '"><button class="' + (p === page ? "on" : "") + '">' + p + "</button></a>";
      }).join("") + "</div>";
  }

  function renderTeach() {
    var t = $("[data-majors]");
    if (t) {
      t.innerHTML = '<table class="table"><thead><tr><th style="width:200px">专业名称</th><th style="width:180px">办学层次</th><th>专业说明</th><th style="width:170px">标志性成果</th></tr></thead><tbody>' +
        MAJORS.map(function (m) {
          return "<tr><td><b>" + esc(m.n) + "</b></td><td>" + esc(m.lv) + "</td><td>" + esc(m.d) + "</td><td>" + esc(m.tag) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    var c = $("[data-courses]");
    if (c) {
      c.innerHTML = '<table class="table"><thead><tr><th>课程名称</th><th>所属专业</th><th style="width:90px">学时</th><th style="width:110px">教学模式</th></tr></thead><tbody>' +
        COURSES.map(function (x) {
          return "<tr><td>" + esc(x.n) + "</td><td>" + esc(x.t) + "</td><td>" + esc(x.h) + "</td><td>" + esc(x.m) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    var b = $("[data-bases]");
    if (b) {
      b.innerHTML = BASES.map(function (x) {
        return '<div class="card" style="padding:16px"><h4 style="font-size:15px">' + esc(x.n) + '</h4>' +
          '<div style="font-size:12px;color:var(--gold);margin:4px 0 7px">' + esc(x.lv) + "</div>" +
          '<p style="margin:0;font-size:13px;color:var(--text-2)">' + esc(x.d) + "</p></div>";
      }).join("");
    }
    var d = $("[data-dept]");
    if (d) {
      d.innerHTML = '<div class="block"><h3>信息工程系</h3><p style="color:var(--text-2)">' + esc(INFO_DEPT.desc) + "</p></div>" +
        '<div class="tag-list">' + INFO_DEPT.focus.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</div>";
    }
  }

  function renderTeacher() {
    var t = $("[data-teachers]");
    if (t) {
      t.innerHTML = TEACHERS.map(function (x) {
        return '<div class="card" style="padding:16px"><div style="font-size:12px;color:var(--gold)">' + esc(x.r) + "</div>" +
          '<h4 style="margin:5px 0 7px;font-size:15px">' + esc(x.n) + "</h4>" +
          '<p style="margin:0;font-size:13px;color:var(--text-2)">' + esc(x.d) + "</p></div>";
      }).join("");
    }
    var s = $("[data-stars]");
    if (s) {
      s.innerHTML = STARS.map(function (x, i) {
        return '<div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px dashed var(--line)">' +
          '<img src="' + ASSET + 'avatars/student-0' + ((i % 8) + 1) + '.jpg" alt="" style="width:52px;height:52px;border-radius:10px;flex:none">' +
          '<div><b>' + esc(x.n) + '</b><span style="color:var(--text-3);font-size:12.5px;margin-left:10px">' + esc(x.m) + "</span>" +
          '<p style="margin:5px 0 0;font-size:13px;color:var(--text-2)">' + esc(x.d) + "</p></div></div>";
      }).join("");
    }
  }

  function renderAdmit() {
    var a = $("[data-levels]");
    if (a) {
      a.innerHTML = ADMIT.levels.map(function (x) {
        return '<div class="card" style="padding:18px"><h4 style="font-size:15px;color:var(--ink-700)">' + esc(x.n) + "</h4>" +
          '<p style="margin:7px 0 0;font-size:13px;color:var(--text-2)">' + esc(x.d) + "</p></div>";
      }).join("");
    }
    var n = $("[data-numbers]");
    if (n) {
      n.innerHTML = ADMIT.numbers.map(function (x) {
        return '<div class="fact" style="border:1px solid var(--line);border-radius:10px;background:#fff"><b>' + esc(x.k) + "</b><span>" + esc(x.v) + "</span></div>";
      }).join("");
    }
    var p = $("[data-partners]");
    if (p) {
      p.innerHTML = ADMIT.partners.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    }
  }

  function renderSearch() {
    var box = $("[data-search-result]");
    if (!box) return;
    var kw = (q("q") || "").trim();
    var input = $("#searchPageInput");
    if (input) input.value = kw;
    var count = $("#searchCount");
    if (!kw) {
      box.innerHTML = '<p style="color:var(--text-3)">输入关键词检索站内新闻、专业、机构与栏目。要一次问好几件事，用 <a href="ai.html" style="color:var(--blue)">校园 AI</a>。</p>';
      if (count) count.textContent = "";
      return;
    }
    var low = norm(kw);
    var gs = [];
    if (low.length <= 2) { gs.push(low); }
    else { for (var gi = 0; gi < low.length - 1; gi++) gs.push(low.substr(gi, 2)); }

    var hitList = SEARCH_INDEX.map(function (x) {
      var text = norm(x.t + x.k + x.d);
      var hit = 0;
      gs.forEach(function (g) { if (text.indexOf(g) > -1) hit += 1; });
      var direct = norm(x.t).indexOf(low) > -1 ? 2.5 : 0;
      return { x: x, s: hit + direct };
    }).filter(function (o) { return o.s > 0.9; });

    hitList.sort(function (a, b) { return b.s - a.s; });
    var hits = hitList.map(function (o) { return o.x; });

    if (count) count.textContent = "共找到 " + hits.length + " 条与“" + kw + "”相关的内容";
    if (!hits.length) {
      box.innerHTML = '<p style="color:var(--text-3)">没有匹配结果，试试 <a href="ai.html?q=' + encodeURIComponent(kw) + '" style="color:var(--blue)">交给校园 AI</a>，它一次能查多个来源。</p>';
      return;
    }
    box.innerHTML = hits.map(function (x) {
      return '<div style="padding:13px 0;border-bottom:1px dashed var(--line)">' +
        '<a href="' + x.u + '" style="font-size:15px;color:var(--ink-700)">' + esc(x.t) + "</a>" +
        '<div style="font-size:12.5px;color:var(--text-3);margin-top:3px">' + esc(x.k) + " · " + esc(x.d) + "</div></div>";
    }).join("");
  }

  function icon(name) {
    var p = {
      code: '<path d="M8 6 3 12l5 6M16 6l5 6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      net: '<circle cx="12" cy="5" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="5" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5v5M12 12.5 5.8 16M12 12.5l6.2 3.5" stroke="currentColor" stroke-width="2"/>',
      app: '<rect x="4" y="3" width="16" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      gear: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      robot: '<rect x="4" y="7" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="13" r="1.4" fill="currentColor"/><circle cx="15" cy="13" r="1.4" fill="currentColor"/><path d="M12 3v4M7 19v2M17 19v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      car: '<path d="M4 16h16M5.5 16 7 9h10l1.5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8" cy="18" r="1.6" fill="currentColor"/><circle cx="16" cy="18" r="1.6" fill="currentColor"/>',
      bolt: '<path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
      money: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M9.5 9.5h4.2a2 2 0 0 1 0 4H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      flask: '<path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
      cart: '<circle cx="9" cy="19" r="1.6" fill="currentColor"/><circle cx="17" cy="19" r="1.6" fill="currentColor"/><path d="M3 4h2.2l2.3 10h10.2L20 7H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      shirt: '<path d="M9 3 5 6l2 4 2-1v12h6V9l2 1 2-4-4-3-3 2-3-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
      box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" stroke-width="2"/>'
    };
    return '<svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">' + (p[name] || p.code) + "</svg>";
  }

  buildHeader();
  buildFooter();
  initTicker();
  initBanner();

  if (PAGE === "home") renderHome();
  if (PAGE === "school") renderSchool();
  if (PAGE === "news") renderNews();
  if (PAGE === "teach") renderTeach();
  if (PAGE === "teacher") renderTeacher();
  if (PAGE === "admit") renderAdmit();
  if (PAGE === "search") renderSearch();

  initReveal();
})();
