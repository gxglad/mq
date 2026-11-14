(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var IW = 1778, IH = 810;
  var SCALE = 0.42;

  var NODES = {
    w1: [0.055, 0.20], w2: [0.210, 0.20], w3: [0.330, 0.20], w4: [0.390, 0.20],
    w5: [0.055, 0.47], w6: [0.210, 0.47], w7: [0.330, 0.47], w8: [0.390, 0.47],
    w9: [0.055, 0.79], w10: [0.210, 0.79], w11: [0.330, 0.79], w12: [0.390, 0.79],
    w13: [0.210, 0.93], w14: [0.330, 0.93],
    gz1: [0.400, 0.215], gz2: [0.436, 0.215],
    m1: [0.415, 0.93],
    e1: [0.448, 0.26], e2: [0.545, 0.26], e3: [0.735, 0.26], e4: [0.860, 0.26],
    e5: [0.448, 0.55], e6: [0.533, 0.495], e7: [0.716, 0.495], e8: [0.860, 0.55],
    e9: [0.448, 0.82], e10: [0.533, 0.82], e11: [0.716, 0.82], e12: [0.860, 0.82],
    e13: [0.962, 0.55], e14: [0.962, 0.82]
  };

  var EDGES = [
    ["w1", "w2"], ["w2", "w3"], ["w3", "w4"],
    ["w5", "w6"], ["w6", "w7"], ["w7", "w8"],
    ["w9", "w10"], ["w10", "w11"], ["w11", "w12"],
    ["w1", "w5"], ["w5", "w9"],
    ["w2", "w6"], ["w6", "w10"], ["w10", "w13"],
    ["w3", "w7"], ["w7", "w11"], ["w11", "w14"],
    ["w4", "w8"], ["w8", "w12"],
    ["w4", "gz1"], ["gz1", "gz2"], ["gz2", "e1"],
    ["e1", "e2"], ["e2", "e3"], ["e3", "e4"],
    ["e5", "e6"], ["e6", "e7"], ["e7", "e8"],
    ["e9", "e10"], ["e10", "e11"], ["e11", "e12"],
    ["e1", "e5"], ["e5", "e9"],
    ["e2", "e6"], ["e6", "e10"],
    ["e3", "e7"], ["e7", "e11"],
    ["e4", "e8"], ["e8", "e12"],
    ["e8", "e13"], ["e13", "e14"], ["e14", "e12"],
    ["m1", "e9"]
  ];

  var ZONES = { all: "全部", west: "实训区", east: "教学区" };

  function px(u, v) { return { x: u * IW, y: v * IH }; }

  var G = {};
  Object.keys(NODES).forEach(function (k) {
    G[k] = { x: NODES[k][0] * IW, y: NODES[k][1] * IH, adj: [] };
  });
  EDGES.forEach(function (e) {
    var a = G[e[0]], b = G[e[1]];
    if (!a || !b) return;
    var d = Math.hypot(a.x - b.x, a.y - b.y);
    a.adj.push({ to: e[1], d: d });
    b.adj.push({ to: e[0], d: d });
  });

  function nearestNode(b) {
    var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    var best = null, bd = Infinity;
    Object.keys(G).forEach(function (k) {
      var n = G[k];
      var d = Math.hypot(n.x - cx, n.y - cy);
      if (d < bd) { bd = d; best = k; }
    });
    return best;
  }

  function shortest(a, b) {
    var dist = {}, prev = {}, done = {};
    Object.keys(G).forEach(function (k) { dist[k] = Infinity; });
    dist[a] = 0;
    for (;;) {
      var u = null, ud = Infinity;
      for (var k in dist) if (!done[k] && dist[k] < ud) { ud = dist[k]; u = k; }
      if (u === null || u === b) break;
      done[u] = 1;
      G[u].adj.forEach(function (e) {
        var nd = dist[u] + e.d;
        if (nd < dist[e.to]) { dist[e.to] = nd; prev[e.to] = u; }
      });
    }
    if (dist[b] === Infinity) return null;
    var out = [b], c = b;
    while (prev[c]) { c = prev[c]; out.unshift(c); }
    return out;
  }

  function r(u1, v1, u2, v2) {
    return { x: Math.round(u1 * IW), y: Math.round(v1 * IH), w: Math.round((u2 - u1) * IW), h: Math.round((v2 - v1) * IH) };
  }
  function mk(id, name, sub, cat, box, floors, dept, time, desc, tags) {
    return { id: id, name: name, sub: sub, c: cat, x: box.x, y: box.y, w: box.w, h: box.h, f: floors, dept: dept, time: time, d: desc, t: tags };
  }

  var B = [
    mk("s4", "S4", "实训区 · 北", "lab", r(0.055, 0.075, 0.300, 0.450), "4 层", "实训中心", "08:00 - 20:00", "实训区北侧主体实训楼，承载机械加工、数控与设备装调类实训项目。", ["数控", "机械加工", "设备装调"]),
    mk("canteen1", "实训区食堂", "实训区 · 北", "life", r(0.233, 0.130, 0.302, 0.250), "2 层", "后勤服务处", "06:30 - 19:30", "实训区独立食堂，方便在实训楼上课的学生就近就餐。", ["三餐", "就近就餐"]),
    mk("s3", "S3", "实训区 · 西南", "lab", r(0.045, 0.490, 0.205, 0.750), "3 层", "实训中心", "08:00 - 20:00", "实训区西南侧大型实训车间，焊接、装配与普通加工在此进行。", ["焊接", "装配", "普车"]),
    mk("s6", "S6", "实训区 · 中部", "lab", r(0.195, 0.490, 0.300, 0.585), "2 层", "信息中心", "08:00 - 21:00", "电子阅览与数字资源检索区，也可作为实训区学生的自习空间。", ["电子阅览", "自习", "数据库"]),
    mk("s2", "S2", "实训区 · 南", "lab", r(0.030, 0.810, 0.200, 0.940), "3 层", "实训中心", "08:00 - 17:30", "面向企业的技术交流与联合实训场地，也承接社会培训项目。", ["企业培训", "技术交流"]),
    mk("s7", "S7", "实训区 · 南", "lab", r(0.245, 0.810, 0.355, 0.940), "3 层", "经济贸易系", "08:00 - 20:00", "会计、电商、物流等现代服务类专业的实训场地。", ["会计", "电商直播", "物流沙盘"]),
    mk("gate2", "实训区门卫", "实训区 · 南门", "admin", r(0.195, 0.950, 0.245, 0.995), "1 层", "后勤服务处", "全天", "实训区出入口与访客登记处。", ["门禁", "访客登记"]),
    mk("gate1", "东北门", "平安路侧", "admin", r(0.360, 0.195, 0.390, 0.245), "1 层", "后勤服务处", "06:00 - 22:00", "连接平安路的次入口，上下学高峰开放。", ["次入口"]),

    mk("park", "停车场", "主校区 · 北", "admin", r(0.555, 0.205, 0.780, 0.300), "地面", "后勤服务处", "全天", "教职工与访客车辆停放区，进出需登记。", ["访客登记", "非机动车棚"]),
    mk("canteen2", "1-2-3 食堂", "主校区 · 西北", "life", r(0.432, 0.280, 0.492, 0.405), "2 层", "后勤服务处", "06:30 - 19:30", "主校区食堂，一楼与二楼由不同餐饮公司经营，设风味窗口与低价套餐。", ["三餐", "风味窗口", "清真"]),
    mk("logi", "后勤楼", "主校区 · 西", "admin", r(0.438, 0.440, 0.492, 0.530), "2 层", "后勤服务处", "08:00 - 17:00", "后勤服务处办公与维修班组驻地，报修可到这里。", ["报修", "物业"]),

    mk("t1", "1 号教学楼", "主校区 · 北", "teach", r(0.575, 0.315, 0.665, 0.395), "4 层", "信息工程系", "07:40 - 20:30", "信息工程系、智能控制系理论教学区，含多媒体教室与专业机房。", ["多媒体教室", "机房"]),
    mk("t2", "2 号教学楼", "主校区 · 北", "teach", r(0.685, 0.315, 0.775, 0.395), "4 层", "机械与汽车工程系", "07:40 - 20:30", "机械与汽车工程系、能源材料系专业课教室。", ["多媒体教室", "制图室"]),
    mk("t3", "3 号教学楼", "主校区 · 中", "teach", r(0.575, 0.425, 0.665, 0.505), "4 层", "经济贸易系", "07:40 - 20:30", "经济贸易系与公共基础课教学区。", ["多媒体教室", "阶梯教室"]),
    mk("t4", "4 号教学楼", "主校区 · 中", "teach", r(0.685, 0.425, 0.775, 0.505), "4 层", "公共教学", "07:40 - 20:30", "公共基础课与选修课教室，晚自习主要使用这栋。", ["多媒体教室", "晚自习"]),

    mk("d1", "男生宿舍", "主校区 · 东北", "life", r(0.845, 0.315, 0.895, 0.395), "6 层", "后勤服务处", "门禁 22:30", "六人间学生公寓，配空调、独立卫浴与阳台。", ["六人间", "空调", "洗衣房"]),
    mk("d2", "女生宿舍", "主校区 · 东北", "life", r(0.912, 0.315, 0.975, 0.395), "6 层", "后勤服务处", "门禁 22:30", "六人间学生公寓，宿舍区设门禁与值班室。", ["六人间", "空调", "门禁"]),

    mk("lib", "图书馆", "主校区 · 东南", "teach", r(0.715, 0.525, 0.795, 0.690), "4 层", "教辅机构", "08:00 - 21:00", "专业书库、文学书库与电子阅览区，凭校园卡借阅。", ["借阅", "自习", "电子阅览"]),

    mk("hall", "行政楼", "主校区 · 南", "admin", r(0.435, 0.835, 0.525, 0.945), "5 层", "行政部门", "08:00 - 17:00", "校长办公室、教务处、学生工作处、招生就业处集中办公，一楼设招生咨询窗口。", ["招生咨询", "学籍办理", "校长信箱"]),
    mk("gym", "体育馆", "主校区 · 东南", "sport", r(0.600, 0.835, 0.745, 0.950), "2 层", "学生工作处", "07:00 - 21:00", "室内篮球、羽毛球与体质健康测试区，雨天体育课在此进行。", ["篮球", "羽毛球", "体测"]),
    mk("court", "篮球场", "主校区 · 东南", "sport", r(0.775, 0.835, 0.865, 0.940), "室外", "学生工作处", "全天开放", "室外篮球场，课后与周末供班级联赛和社团活动使用。", ["篮球", "班级联赛"]),
    mk("track", "操场", "主校区 · 东", "sport", r(0.862, 0.445, 0.985, 0.815), "400 米", "学生工作处", "06:00 - 21:30", "标准 400 米环形跑道与足球场，承担体育课、校运动会与晨跑。", ["400 米", "足球场", "校运会"]),

    mk("lake", "匠心湖", "主校区 · 中部", "water", r(0.545, 0.525, 0.695, 0.790), "—", "后勤服务处", "全天", "校区中部的水景与绿地，周边设步道，是课间休息的主要去处。", ["水景", "步道", "绿地"]),

    mk("road", "平安路", "校区分界线", "admin", r(0.395, 0.055, 0.425, 0.985), "—", "—", "全天通行", "贯穿南北的城市道路，把校区分为西侧实训区与东侧主校区。", ["城市道路", "分界"]),
    mk("gate0", "学校主入口", "主校区 · 南", "admin", r(0.400, 0.960, 0.470, 0.998), "—", "保卫处", "06:00 - 22:00", "学校正门，设门卫室与访客登记，上下学高峰开放。", ["正门", "访客登记"])
  ];

  var CAT = {
    teach: { name: "教学", fill: "#cfdcec", edge: "#7f9cbd", text: "#1f3552" },
    lab: { name: "实训", fill: "#cbd6cd", edge: "#7f9a86", text: "#22392c" },
    life: { name: "生活", fill: "#e8dcc6", edge: "#bda98a", text: "#4a3f2c" },
    sport: { name: "体育", fill: "#cfe3d4", edge: "#8fb79c", text: "#254233" },
    admin: { name: "行政", fill: "#d6dce8", edge: "#9aa6bd", text: "#2b3448" },
    water: { name: "水域", fill: "#b9dff2", edge: "#6fa9c9", text: "#1e4a63" }
  };

  var view = { x: 0, y: 0, w: IW, h: IH };
  var filter = "all";
  var all = B;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function es(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var svg = document.getElementById("campusSvg");
  var canvas = document.getElementById("mapCanvas");
  var tip = document.getElementById("mapTip");

  function drawPaths(g) {
    EDGES.forEach(function (e) {
      var a = G[e[0]], b = G[e[1]];
      el("line", {
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        stroke: "#ffffff", "stroke-width": 5, "stroke-opacity": "0.5", "stroke-linecap": "round"
      }, g);
    });
  }

  function build() {
    var g0 = document.getElementById("layerGround");
    var g2 = document.getElementById("layerBuildings");

    var img = el("image", { x: 0, y: 0, width: IW, height: IH }, g0);
    img.setAttribute("href", "assets/images/campus-plan.jpg");
    img.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/images/campus-plan.jpg");

    var gz = document.getElementById("layerAreas");
    el("rect", {
      x: 0, y: 0, width: IW * 0.405, height: IH,
      fill: "#7f9a86", "fill-opacity": "0.10", "pointer-events": "none"
    }, gz);
    el("rect", {
      x: IW * 0.425, y: 0, width: IW * 0.575, height: IH,
      fill: "#7f9cbd", "fill-opacity": "0.10", "pointer-events": "none"
    }, gz);
    el("line", {
      x1: IW * 0.408, y1: 0, x2: IW * 0.408, y2: IH,
      stroke: "#c0392b", "stroke-width": 3, "stroke-dasharray": "12 10", "stroke-opacity": "0.55",
      "pointer-events": "none"
    }, gz);

    var lt = el("text", {
      x: IW * 0.20, y: IH * 0.075, "text-anchor": "middle",
      "font-size": 26, "font-weight": 700, fill: "#3d6b52", "fill-opacity": "0.55",
      "letter-spacing": 8, "pointer-events": "none"
    }, gz);
    lt.textContent = "实训区";
    var rt = el("text", {
      x: IW * 0.72, y: IH * 0.075, "text-anchor": "middle",
      "font-size": 26, "font-weight": 700, fill: "#2d5680", "fill-opacity": "0.55",
      "letter-spacing": 8, "pointer-events": "none"
    }, gz);
    rt.textContent = "教学区";

    var gt = el("g", { "pointer-events": "none" }, gz);
    el("circle", {
      cx: IW * 0.412, cy: IH * 0.215, r: 13,
      fill: "#fff", stroke: "#c0392b", "stroke-width": 3
    }, gt);
    var gtx = el("text", {
      x: IW * 0.412, y: IH * 0.215 + 36, "text-anchor": "middle",
      "font-size": 12, "font-weight": 700, fill: "#c0392b"
    }, gt);
    gtx.textContent = "东北门";

    all.forEach(function (b, idx) {
      var c = CAT[b.c] || CAT.admin;
      var grp = el("g", { "class": "bldg", "data-id": b.id }, g2);

      el("rect", {
        "class": "patch", x: b.x, y: b.y, width: b.w, height: b.h, rx: 6,
        fill: c.fill, "fill-opacity": "0.10", stroke: c.edge, "stroke-width": "2",
        "stroke-opacity": "0.85", "stroke-dasharray": "6 4"
      }, grp);

      el("rect", {
        "class": "glow", x: b.x, y: b.y, width: b.w, height: b.h, rx: 6,
        fill: c.fill, "fill-opacity": "0.22", stroke: c.edge, "stroke-width": 3.5, opacity: "0"
      }, grp);

      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      var num = el("g", { "class": "num" }, grp);
      el("circle", { cx: cx, cy: cy, r: 11, fill: c.edge, stroke: "#fff", "stroke-width": 2 }, num);
      var t1 = el("text", {
        x: cx, y: cy + 4.2, "text-anchor": "middle", "font-size": "11.5",
        "font-weight": "700", fill: "#fff", "pointer-events": "none"
      }, num);
      t1.textContent = idx + 1;

      grp.addEventListener("mouseenter", function (e) {
        tip.textContent = b.name;
        tip.classList.add("on");
        moveTip(e);
        grp.querySelector(".glow").setAttribute("opacity", "0.9");
      });
      grp.addEventListener("mousemove", moveTip);
      grp.addEventListener("mouseleave", function () {
        tip.classList.remove("on");
        grp.querySelector(".glow").setAttribute("opacity", grp.classList.contains("sel") ? "0.9" : "0");
      });
      grp.addEventListener("click", function (e) {
        e.stopPropagation();
        select(b.id);
      });

      b._el = grp;
      b._idx = idx + 1;
      b._node = nearestNode(b);
      b.zone = (b.x + b.w / 2) < IW * 0.405 ? "west" : "east";
    });
  }

  function moveTip(e) {
    var r = canvas.getBoundingClientRect();
    tip.style.left = (e.clientX - r.left) + "px";
    tip.style.top = (e.clientY - r.top) + "px";
  }

  function select(id, opt) {
    var b = all.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    all.forEach(function (x) {
      x._el.classList.toggle("sel", x.id === id);
      x._el.querySelector(".glow").setAttribute("opacity", x.id === id ? "0.9" : "0");
    });
    document.querySelectorAll(".list-item").forEach(function (li) {
      li.classList.toggle("on", li.getAttribute("data-id") === id);
    });
    renderDetail(b);
    if (opt && opt.focus) focusOn(b);
  }

  function renderDetail(b) {
    var c = CAT[b.c] || CAT.admin;
    document.getElementById("detailCard").innerHTML =
      '<div class="detail-hd">' +
        '<span class="cat" style="background:' + c.fill + ';color:' + c.text + '">' + b._idx + " · " + c.name + "</span>" +
        "<h3>" + es(b.name) + "</h3></div>" +
      '<div class="detail-bd">' +
        '<div class="row"><span>分区</span><b>' + (b.zone === "west" ? "实训区（西侧）" : "教学区（东侧）") + "</b></div>" +
        '<div class="row"><span>位置</span><b>' + es(b.sub) + "</b></div>" +
        '<div class="row"><span>规模</span><b>' + es(b.f) + "</b></div>" +
        (b.dept !== "—" ? '<div class="row"><span>所属</span><b>' + es(b.dept) + "</b></div>" : "") +
        (b.time ? '<div class="row"><span>开放</span><b>' + es(b.time) + "</b></div>" : "") +
        '<p class="desc">' + es(b.d) + "</p>" +
        '<div class="tags">' + b.t.map(function (x) { return "<i>" + es(x) + "</i>"; }).join("") + "</div></div>" +
      '<div class="detail-ft">' +
        '<button type="button" class="btn-mini" id="btnFrom">设为起点</button>' +
        '<button type="button" class="btn-mini primary" id="btnTo">设为终点</button></div>';
    document.getElementById("btnFrom").onclick = function () { document.getElementById("fromSel").value = b.id; onRoute(); };
    document.getElementById("btnTo").onclick = function () { document.getElementById("toSel").value = b.id; onRoute(); };
  }

  function applyView() { svg.setAttribute("viewBox", view.x + " " + view.y + " " + view.w + " " + view.h); }
  function clampView() {
    view.x = Math.max(Math.min(view.x, IW - view.w), 0);
    view.y = Math.max(Math.min(view.y, IH - view.h), 0);
  }
  function zoomAt(f, cx, cy) {
    var nw = view.w * f, nh = view.h * f;
    if (nw < 200 || nw > IW) return;
    var px1 = (cx - view.x) / view.w, py1 = (cy - view.y) / view.h;
    view.x = cx - px1 * nw; view.y = cy - py1 * nh;
    view.w = nw; view.h = nh;
    clampView(); applyView();
  }
  function focusOn(b) {
    var pad = 90;
    var w = Math.max(b.w + pad * 2, 420), h = Math.max(b.h + pad * 2, 260);
    view.w = w; view.h = h;
    view.x = b.x + b.w / 2 - w / 2;
    view.y = b.y + b.h / 2 - h / 2;
    clampView(); applyView();
  }
  function toSvg(cx, cy) {
    var r = svg.getBoundingClientRect();
    var va = view.w / view.h, ba = r.width / r.height;
    var dw, dh, ox = 0, oy = 0;
    if (ba > va) { dh = r.height; dw = dh * va; ox = (r.width - dw) / 2; }
    else { dw = r.width; dh = dw / va; oy = (r.height - dh) / 2; }
    return { x: view.x + (cx - r.left - ox) / dw * view.w, y: view.y + (cy - r.top - oy) / dh * view.h };
  }

  function initPanZoom() {
    var drag = false, sx = 0, sy = 0, sv = null;
    canvas.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      drag = true; sx = e.clientX; sy = e.clientY;
      sv = { x: view.x, y: view.y };
      canvas.classList.add("dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!drag) return;
      var r = svg.getBoundingClientRect();
      view.x = sv.x - (e.clientX - sx) / r.width * view.w;
      view.y = sv.y - (e.clientY - sy) / r.height * view.h;
      clampView(); applyView();
    });
    window.addEventListener("mouseup", function () { drag = false; canvas.classList.remove("dragging"); });
    canvas.addEventListener("wheel", function (e) {
      e.preventDefault();
      var p = toSvg(e.clientX, e.clientY);
      zoomAt(e.deltaY > 0 ? 1.12 : 0.89, p.x, p.y);
    }, { passive: false });

    document.getElementById("zoomIn").onclick = function () { zoomAt(0.8, view.x + view.w / 2, view.y + view.h / 2); };
    document.getElementById("zoomOut").onclick = function () { zoomAt(1.25, view.x + view.w / 2, view.y + view.h / 2); };
    document.getElementById("zoomReset").onclick = function () { view = { x: 0, y: 0, w: IW, h: IH }; applyView(); };
    document.getElementById("fullBtn").onclick = function () {
      var m = document.querySelector(".map-main");
      if (!document.fullscreenElement) { if (m.requestFullscreen) m.requestFullscreen().catch(function () {}); }
      else document.exitFullscreen();
    };
  }

  function renderChips() {
    var box = document.getElementById("catChips");
    var items = [
      { k: "all", n: "全部" },
      { k: "west", n: "实训区（西）" },
      { k: "east", n: "教学区（东）" }
    ];
    box.innerHTML = items.map(function (it) {
      return '<button type="button" data-k="' + it.k + '"' + (it.k === filter ? ' class="on"' : "") + ">" + it.n + "</button>";
    }).join("");
    box.querySelectorAll("button").forEach(function (btn) {
      btn.onclick = function () {
        filter = btn.getAttribute("data-k");
        renderChips(); renderList();
        all.forEach(function (x) {
          x._el.classList.toggle("dim", filter !== "all" && x.zone !== filter);
        });
      };
    });
  }

  function renderList() {
    var box = document.getElementById("buildList");
    var list = all.filter(function (x) { return filter === "all" || x.zone === filter; });
    document.getElementById("listCount").textContent = list.length + " 处";

    var groups = [{ k: "west", n: "实训区（西侧）" }, { k: "east", n: "教学区（东侧）" }];
    var html = "";
    groups.forEach(function (g) {
      var sub = list.filter(function (x) { return x.zone === g.k; });
      if (!sub.length) return;
      html += '<div class="list-group">' + g.n + "<em>" + sub.length + "</em></div>";
      html += sub.map(function (b) {
        var c = CAT[b.c] || CAT.admin;
        return '<div class="list-item" data-id="' + b.id + '">' +
          '<i style="background:' + c.fill + ';border:1px solid ' + c.edge + '"></i>' +
          "<span>" + b._idx + ". " + es(b.name) + "</span></div>";
      }).join("");
    });
    box.innerHTML = html;

    box.querySelectorAll(".list-item").forEach(function (li) {
      li.onclick = function () { select(li.getAttribute("data-id"), { focus: true }); };
    });
  }

  function initSearch() {
    var input = document.getElementById("mapSearch");
    input.addEventListener("input", function () {
      var kw = this.value.trim().toLowerCase();
      if (!kw) { all.forEach(function (b) { b._el.classList.remove("dim"); }); return; }
      var first = null;
      all.forEach(function (b) {
        var hit = (b.name + b.d + b.t.join("")).toLowerCase().indexOf(kw) > -1;
        b._el.classList.toggle("dim", !hit);
        if (hit && !first) first = b;
      });
      if (first) select(first.id, { focus: true });
    });
  }

  function onRoute() {
    var fid = document.getElementById("fromSel").value;
    var tid = document.getElementById("toSel").value;
    var a = all.filter(function (x) { return x.id === fid; })[0];
    var b = all.filter(function (x) { return x.id === tid; })[0];
    var g = document.getElementById("layerRoute");
    var info = document.getElementById("routeInfo");
    g.innerHTML = "";
    if (!a || !b) { info.textContent = "请选择起点和终点"; return; }
    if (a.id === b.id) { info.textContent = "起点和终点相同"; return; }

    var path = shortest(a._node, b._node);
    if (!path) { info.textContent = "两处之间没有连通的步行道路"; return; }

    var pts = [];
    var ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    var bx = b.x + b.w / 2, by = b.y + b.h / 2;
    pts.push({ x: ax, y: ay });
    pts.push({ x: G[a._node].x, y: G[a._node].y });
    for (var i = 1; i < path.length; i++) {
      var p = G[path[i]];
      pts.push({ x: p.x, y: p.y });
    }
    pts.push({ x: bx, y: by });

    var d = "", total = 0;
    pts.forEach(function (p, i) {
      if (i === 0) d = "M " + p.x + " " + p.y;
      else { d += " L " + p.x + " " + p.y; total += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y); }
    });

    el("path", { d: d, fill: "none", stroke: "#fff", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".95" }, g);
    el("path", { d: d, fill: "none", stroke: "#2f6bd8", "stroke-width": 4.2, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": "12 8" }, g);
    [pts[0], pts[pts.length - 1]].forEach(function (p, i) {
      el("circle", { cx: p.x, cy: p.y, r: 7, fill: i === 0 ? "#2bc4d8" : "#c99a4e", stroke: "#fff", "stroke-width": 2 }, g);
    });

    var m = Math.round(total * SCALE);
    info.textContent = "约 " + m + " 米 · 步行 " + Math.max(1, Math.round(m / 70)) + " 分钟";
  }

  function initRoute() {
    var from = document.getElementById("fromSel");
    var to = document.getElementById("toSel");
    var opts = '<option value="">请选择</option>' + all.map(function (b) {
      return '<option value="' + b.id + '">' + b._idx + ". " + es(b.name) + "</option>";
    }).join("");
    from.innerHTML = opts;
    to.innerHTML = opts;
    document.getElementById("routeBtn").onclick = onRoute;
    document.getElementById("routeClear").onclick = function () {
      document.getElementById("layerRoute").innerHTML = "";
      document.getElementById("routeInfo").textContent = "";
      from.value = ""; to.value = "";
    };
  }

  build();
  initPanZoom();
  renderChips();
  renderList();
  initSearch();
  initRoute();
  applyView();
})();
