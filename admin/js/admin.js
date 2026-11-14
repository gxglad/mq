(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  Store.init();

  var session = Store.session();
  if (!session) {
    location.replace("index.html");
    return;
  }

  var IMG_LIST = [
    "", "banner-01.jpg", "banner-02.jpg", "news-01.jpg", "news-03.jpg", "news-05.jpg",
    "activity-club.jpg", "news-11.jpg", "news-02.jpg", "news-16.jpg", "news-06.jpg",
    "news-02.jpg", "news-10.jpg", "news-03.jpg", "activity-club.jpg",
    "news-08.jpg", "news-06.jpg"
  ];

  var CATS = ["校园新闻", "部门新闻", "通知公告", "教育新闻"];
  var LEVELS = ["五年一贯制", "五年一贯制 / 3+3", "三年制中专", "三年制中专 / 3+3", "3+3 / 三年制中专"];
  var BASE_LEVELS = ["国家级", "省现代化", "省级", "苏州市公共实训基地", "校级"];
  var MODES = ["项目化", "理实一体", "实训", "案例教学"];
  var ROLES = ["超级管理员", "编辑", "审核"];

  var PAGES = {
    dash: { title: "工作台", crumb: "首页 / 工作台" },
    news: { title: "新闻管理", crumb: "内容维护 / 新闻管理" },
    banners: { title: "首页横幅", crumb: "内容维护 / 首页横幅" },
    majors: { title: "专业设置", crumb: "内容维护 / 专业设置" },
    courses: { title: "课程管理", crumb: "内容维护 / 课程管理" },
    bases: { title: "实训基地", crumb: "内容维护 / 实训基地" },
    ai: { title: "AI 知识条目", crumb: "智能服务 / AI 知识条目" },
    users: { title: "账号管理", crumb: "系统 / 账号管理" },
    logs: { title: "操作日志", crumb: "系统 / 操作日志" },
    settings: { title: "站点设置", crumb: "系统 / 站点设置" }
  };

  var MODULES = {
    news: {
      key: "news",
      label: "新闻",
      filter: { k: "cat", label: "全部栏目", options: CATS },
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "标题", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.title) + "</a>"; } },
        { t: "栏目", w: "104px", r: function (x) { return '<span class="tag">' + esc(x.cat) + "</span>"; } },
        { t: "发布日期", w: "108px", r: function (x) { return esc(x.date); } },
        { t: "阅读", w: "74px", r: function (x) { return esc(x.views); } },
        { t: "状态", w: "88px", r: function (x) {
          return x.status === "已发布" ? '<span class="tag ok">已发布</span>' : '<span class="tag off">草稿</span>';
        } }
      ],
      fields: [
        { k: "title", label: "标题", type: "text", full: true, req: true },
        { k: "cat", label: "所属栏目", type: "select", options: CATS },
        { k: "date", label: "发布日期", type: "date" },
        { k: "author", label: "发布单位", type: "text" },
        { k: "views", label: "阅读数", type: "number" },
        { k: "cover", label: "封面图", type: "select", options: IMG_LIST },
        { k: "status", label: "状态", type: "select", options: ["已发布", "草稿"] },
        { k: "top", label: "置顶", type: "select", options: [["0", "否"], ["1", "是"]] },
        { k: "body", label: "正文", type: "textarea", full: true },
        { k: "src", label: "官网原文地址", type: "text", full: true, hint: "选填，前台详情页会显示“查看官网原文”按钮" }
      ],
      defaults: function () {
        return {
          title: "", cat: "校园新闻", date: new Date().toISOString().slice(0, 10),
          author: "信息中心", views: 0, cover: "", status: "已发布", top: 0, body: "", src: ""
        };
      },
      keyword: function (x) { return x.title + x.cat + x.author; }
    },

    banners: {
      key: "banners",
      label: "横幅",
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "主标题", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.title) + "</a>"; } },
        { t: "副标题", r: function (x) { return esc(x.sub); } },
        { t: "图片", w: "180px", r: function (x) { return esc(x.img); } },
        { t: "排序", w: "66px", r: function (x) { return esc(x.sort); } },
        { t: "状态", w: "80px", r: function (x) {
          return x.status === "启用" ? '<span class="tag ok">启用</span>' : '<span class="tag off">停用</span>';
        } }
      ],
      fields: [
        { k: "title", label: "主标题", type: "text", req: true },
        { k: "sub", label: "副标题", type: "text" },
        { k: "img", label: "图片", type: "select", options: IMG_LIST },
        { k: "href", label: "跳转地址", type: "text" },
        { k: "sort", label: "排序号", type: "number" },
        { k: "status", label: "状态", type: "select", options: ["启用", "停用"] }
      ],
      defaults: function () {
        return { title: "", sub: "", img: "banner-01.jpg", href: "index.html", sort: 1, status: "启用" };
      },
      keyword: function (x) { return x.title + x.sub; }
    },

    majors: {
      key: "majors",
      label: "专业",
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "专业名称", w: "220px", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.name) + "</a>"; } },
        { t: "办学层次", w: "180px", r: function (x) { return esc(x.level); } },
        { t: "标志成果", w: "200px", r: function (x) { return '<span class="tag gold">' + esc(x.tag) + "</span>"; } },
        { t: "简介", r: function (x) { return esc(x.intro); } }
      ],
      fields: [
        { k: "name", label: "专业名称", type: "text", req: true },
        { k: "level", label: "办学层次", type: "select", options: LEVELS },
        { k: "tag", label: "标志成果", type: "text" },
        { k: "intro", label: "专业简介", type: "textarea", full: true }
      ],
      defaults: function () { return { name: "", level: LEVELS[0], tag: "", intro: "" }; },
      keyword: function (x) { return x.name + x.level + x.tag + x.intro; }
    },

    courses: {
      key: "courses",
      label: "课程",
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "课程名称", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.name) + "</a>"; } },
        { t: "所属专业", w: "220px", r: function (x) { return esc(x.major); } },
        { t: "学时", w: "80px", r: function (x) { return esc(x.hours); } },
        { t: "教学模式", w: "120px", r: function (x) { return '<span class="tag">' + esc(x.mode) + "</span>"; } }
      ],
      fields: [
        { k: "name", label: "课程名称", type: "text", req: true },
        { k: "major", label: "所属专业", type: "text" },
        { k: "hours", label: "学时", type: "number" },
        { k: "mode", label: "教学模式", type: "select", options: MODES }
      ],
      defaults: function () { return { name: "", major: "", hours: 64, mode: MODES[0] }; },
      keyword: function (x) { return x.name + x.major + x.mode; }
    },

    bases: {
      key: "bases",
      label: "实训基地",
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "基地名称", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.name) + "</a>"; } },
        { t: "级别", w: "180px", r: function (x) { return '<span class="tag gold">' + esc(x.level) + "</span>"; } },
        { t: "说明", r: function (x) { return esc(x.intro); } }
      ],
      fields: [
        { k: "name", label: "基地名称", type: "text", req: true },
        { k: "level", label: "级别", type: "select", options: BASE_LEVELS },
        { k: "intro", label: "说明", type: "textarea", full: true }
      ],
      defaults: function () { return { name: "", level: BASE_LEVELS[0], intro: "" }; },
      keyword: function (x) { return x.name + x.level + x.intro; }
    },

    ai: {
      key: "know",
      label: "知识条目",
      filter: { k: "status", label: "全部状态", options: ["启用", "停用"] },
      cols: [
        { t: "编号", w: "70px", r: function (x) { return "#" + x.id; } },
        { t: "问题", w: "260px", r: function (x) { return '<a href="javascript:;" data-act="edit" data-id="' + x.id + '">' + esc(x.q) + "</a>"; } },
        { t: "答复", r: function (x) { return esc(x.a); } },
        { t: "标签", w: "90px", r: function (x) { return '<span class="tag">' + esc(x.tag) + "</span>"; } },
        { t: "状态", w: "80px", r: function (x) {
          return x.status === "启用" ? '<span class="tag ok">启用</span>' : '<span class="tag off">停用</span>';
        } }
      ],
      fields: [
        { k: "q", label: "问题（检索关键词）", type: "text", full: true, req: true },
        { k: "tag", label: "标签", type: "text" },
        { k: "status", label: "状态", type: "select", options: ["启用", "停用"] },
        { k: "a", label: "标准答复", type: "textarea", full: true }
      ],
      defaults: function () { return { q: "", tag: "", status: "启用", a: "" }; },
      keyword: function (x) { return x.q + x.a + x.tag; }
    }
  };

  var state = {
    page: "dash",
    kw: "",
    filterVal: "",
    pageNo: 1,
    size: 8
  };

  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove("on"); }, 2000);
  }

  function today() { return new Date().toISOString().slice(0, 10); }

  function fmtOption(o) {
    return Array.isArray(o) ? { v: o[0], t: o[1] } : { v: o, t: o };
  }

  function openForm(cfg) {
    var dlg = $("#mask");
    $("#dlgTitle").textContent = cfg.title;
    var data = cfg.data || {};
    var fields = cfg.fields;
    var html = '<div class="form-grid">';
    fields.forEach(function (f) {
      var v = data[f.k] == null ? "" : data[f.k];
      var req = f.req ? ' <span style="color:#b04a3f">*</span>' : "";
      html += '<div class="form-row" style="' + (f.full ? "grid-column:1 / -1" : "") + '">';
      html += '<label for="f_' + f.k + '">' + esc(f.label) + req + "</label>";
      if (f.type === "textarea") {
        html += '<textarea id="f_' + f.k + '" data-k="' + f.k + '">' + esc(v) + "</textarea>";
      } else if (f.type === "select") {
        html += '<select id="f_' + f.k + '" data-k="' + f.k + '">';
        f.options.forEach(function (o) {
          var op = fmtOption(o);
          html += '<option value="' + esc(op.v) + '"' + (String(op.v) === String(v) ? " selected" : "") + ">" + esc(op.t || "（空）") + "</option>";
        });
        html += "</select>";
      } else {
        html += '<input id="f_' + f.k + '" data-k="' + f.k + '" type="' + (f.type || "text") + '" value="' + esc(v) + '">';
      }
      if (f.hint) html += '<div class="hint">' + esc(f.hint) + "</div>";
      html += "</div>";
    });
    html += "</div>";
    $("#dlgBody").innerHTML = html;

    $("#dlgOk").onclick = function () {
      var out = {};
      var bad = null;
      fields.forEach(function (f) {
        var node = $('[data-k="' + f.k + '"]', $("#dlgBody"));
        var val = node.value;
        if (f.type === "number") val = val === "" ? 0 : Number(val);
        if (f.req && String(val).trim() === "" && !bad) bad = f.label;
        out[f.k] = val;
      });
      if (bad) { toast("请填写：" + bad); return; }
      if (data.id) out.id = data.id;
      cfg.onOk(out);
      dlg.classList.remove("on");
    };
    dlg.classList.add("on");
  }

  function closeDialog() { $("#mask").classList.remove("on"); }

  function gridRows(mod, rows) {
    return rows.map(function (x) {
      return "<tr>" + mod.cols.map(function (c) {
        return '<td style="' + (c.w ? "width:" + c.w + ";" : "") + '">' + c.r(x) + "</td>";
      }).join("") +
        '<td style="width:120px"><div class="acts">' +
        '<button class="btn btn-line btn-sm" type="button" data-act="edit" data-id="' + x.id + '">编辑</button>' +
        '<button class="btn btn-drop btn-sm" type="button" data-act="del" data-id="' + x.id + '">删除</button>' +
        "</div></td></tr>";
    }).join("");
  }

  function modHead(mod) {
    var extra = "";
    if (mod.filter) {
      extra = '<select id="filterSel"><option value="">' + esc(mod.filter.label) + "</option>" +
        mod.filter.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") +
        "</select>";
    }
    return '<div class="panel">' +
      '<div class="panel-hd"><h3>' + esc(mod.label) + "列表</h3>" +
        '<div class="right">' +
          '<button class="btn btn-gold btn-sm" type="button" id="btnNew">+ 新增' + esc(mod.label) + "</button>" +
        "</div></div>" +
      '<div class="panel-bd">' +
        '<div class="toolbar">' +
          '<input type="search" id="kwInput" placeholder="搜索' + esc(mod.label) + '…" value="' + esc(state.kw) + '">' +
          extra +
          '<button class="btn btn-line btn-sm" type="button" id="btnReset">重置</button>' +
          '<div class="space"></div>' +
          '<span style="font-size:12.5px;color:#7b8698" id="rowInfo"></span>' +
        "</div>" +
        '<div id="tableBox"></div>' +
      "</div></div>";
  }

  function renderModule(key) {
    var mod = MODULES[key];
    state.pageNo = 1;
    state.kw = "";
    state.filterVal = "";
    $("#view").innerHTML = modHead(mod);

    function rows() {
      var list = Store.list(mod.key);
      var kw = state.kw.trim().toLowerCase();
      if (kw) {
        list = list.filter(function (x) {
          return String(mod.keyword(x)).toLowerCase().indexOf(kw) > -1;
        });
      }
      if (mod.filter && state.filterVal) {
        list = list.filter(function (x) { return String(x[mod.filter.k]) === state.filterVal; });
      }
      return list;
    }

    function paint() {
      var list = rows();
      var total = Math.max(1, Math.ceil(list.length / state.size));
      if (state.pageNo > total) state.pageNo = total;
      var page = list.slice((state.pageNo - 1) * state.size, state.pageNo * state.size);

      $("#rowInfo").textContent = "共 " + list.length + " 条，第 " + state.pageNo + " / " + total + " 页";

      var box = $("#tableBox");
      if (!list.length) {
        box.innerHTML = '<div class="empty">没有匹配的记录，换个关键词试试，或者点右上角新增。</div>';
        return;
      }
      box.innerHTML = '<table class="grid"><thead><tr>' +
        mod.cols.map(function (c) { return '<th style="' + (c.w ? "width:" + c.w + ";" : "") + '">' + esc(c.t) + "</th>"; }).join("") +
        "<th>操作</th></tr></thead><tbody>" + gridRows(mod, page) + "</tbody></table>" +
        '<div class="pager">' +
        Array.from({ length: total }, function (_, i) {
          var n = i + 1;
          return '<button type="button" data-pg="' + n + '"' + (n === state.pageNo ? ' class="on"' : "") + ">" + n + "</button>";
        }).join("") + "</div>";

      $$("[data-pg]", box).forEach(function (b) {
        b.onclick = function () { state.pageNo = Number(b.getAttribute("data-pg")); paint(); };
      });
      $$("[data-act]", box).forEach(function (b) {
        b.onclick = function () {
          var id = Number(b.getAttribute("data-id"));
          var act = b.getAttribute("data-act");
          var item = Store.list(mod.key).filter(function (x) { return x.id === id; })[0];
          if (!item) return;
          if (act === "del") {
            if (!confirm("确定删除这条记录？删除后不可恢复。")) return;
            Store.remove(mod.key, id);
            Store.log("删除", mod.label + " #" + id + " " + (item.title || item.name || item.q || ""));
            toast("已删除");
            paint();
            return;
          }
          openForm({
            title: "编辑" + mod.label,
            fields: mod.fields,
            data: item,
            onOk: function (out) {
              Store.save(mod.key, out);
              Store.log("修改", mod.label + " #" + out.id);
              toast("已保存");
              paint();
            }
          });
        };
      });
    }

    $("#kwInput").addEventListener("input", function () {
      state.kw = this.value;
      state.pageNo = 1;
      paint();
    });
    var fs = $("#filterSel");
    if (fs) {
      fs.addEventListener("change", function () {
        state.filterVal = this.value;
        state.pageNo = 1;
        paint();
      });
    }
    $("#btnReset").addEventListener("click", function () {
      state.kw = "";
      state.filterVal = "";
      state.pageNo = 1;
      $("#kwInput").value = "";
      if (fs) fs.value = "";
      paint();
    });
    $("#btnNew").addEventListener("click", function () {
      openForm({
        title: "新增" + mod.label,
        fields: mod.fields,
        data: mod.defaults(),
        onOk: function (out) {
          var id = Store.save(mod.key, out);
          Store.log("新增", mod.label + " #" + id + " " + (out.title || out.name || out.q || ""));
          toast("已新增");
          state.pageNo = 1;
          paint();
        }
      });
    });

    paint();
  }

  function renderDash() {
    var news = Store.list("news");
    var majors = Store.list("majors");
    var courses = Store.list("courses");
    var bases = Store.list("bases");
    var know = Store.list("know");
    var logs = Store.list("logs");
    var published = news.filter(function (x) { return x.status === "已发布"; }).length;
    var draft = news.length - published;
    var views = news.reduce(function (a, x) { return a + (Number(x.views) || 0); }, 0);

    var recent = news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 6);

    $("#view").innerHTML =
      '<div class="cards">' +
        '<div class="stat"><span>新闻总数</span><b>' + news.length + "</b><em>已发布 " + published + " 条</em></div>" +
        '<div class="stat"><span>待发布草稿</span><b>' + draft + "</b><em>需编辑确认</em></div>" +
        '<div class="stat"><span>内容条目</span><b>' + (majors.length + courses.length + bases.length) + "</b><em>专业 / 课程 / 基地</em></div>" +
        '<div class="stat"><span>累计阅读</span><b>' + views + "</b><em>AI 知识 " + know.length + " 条</em></div>" +
      "</div>" +
      '<div class="panel"><div class="panel-hd"><h3>最近发布的新闻</h3>' +
        '<div class="right"><a class="btn btn-line btn-sm" href="javascript:;" data-go="news">进入新闻管理</a></div></div>' +
        '<div class="panel-bd">' +
          '<table class="grid"><thead><tr><th style="width:110px">日期</th><th>标题</th><th style="width:100px">栏目</th><th style="width:80px">状态</th></tr></thead><tbody>' +
          recent.map(function (x) {
            return "<tr><td>" + esc(x.date) + "</td><td>" + esc(x.title) + "</td><td>" + esc(x.cat) + "</td><td>" +
              (x.status === "已发布" ? '<span class="tag ok">已发布</span>' : '<span class="tag off">草稿</span>') + "</td></tr>";
          }).join("") +
          "</tbody></table></div></div>" +
      '<div class="panel"><div class="panel-hd"><h3>最近操作</h3>' +
        '<div class="right"><a class="btn btn-line btn-sm" href="javascript:;" data-go="logs">全部日志</a></div></div>' +
        '<div class="panel-bd">' +
          (logs.length
            ? '<ul class="log-list">' + logs.slice(0, 6).map(function (l) {
                return '<li><span class="tm">' + esc(l.time) + '</span><span class="ac">' + esc(l.action) + '</span>' +
                  '<span class="dt2">' + esc(l.user) + " · " + esc(l.detail) + "</span></li>";
              }).join("") + "</ul>"
            : '<div class="empty">暂无操作记录</div>') +
        "</div></div>";

    $$("[data-go]").forEach(function (a) {
      a.onclick = function () { go(a.getAttribute("data-go")); };
    });
  }

  function renderUsers() {
    var list = Store.list("accounts");
    $("#view").innerHTML =
      '<div class="panel"><div class="panel-hd"><h3>后台账号</h3>' +
        '<div class="right"><button class="btn btn-gold btn-sm" type="button" id="btnUserNew">+ 新增账号</button></div></div>' +
      '<div class="panel-bd"><table class="grid"><thead><tr><th style="width:110px">账号</th><th style="width:130px">姓名</th>' +
        '<th style="width:130px">角色</th><th style="width:150px">所属部门</th><th>密码</th><th style="width:120px">操作</th></tr></thead><tbody>' +
        list.map(function (u) {
          return "<tr><td><b>" + esc(u.u) + "</b></td><td>" + esc(u.n) + '</td><td><span class="tag">' + esc(u.r) + "</span></td><td>" +
            esc(u.d || "") + '</td><td><span class="tag off">' + esc(u.p.replace(/./g, "•")) + "</span></td>" +
            '<td><div class="acts"><button class="btn btn-line btn-sm" data-uedit="' + esc(u.u) + '">编辑</button>' +
            '<button class="btn btn-drop btn-sm" data-udel="' + esc(u.u) + '">删除</button></div></td></tr>';
        }).join("") + "</tbody></table></div></div>";

    function form(u) {
      openForm({
        title: u ? "编辑账号" : "新增账号",
        fields: [
          { k: "u", label: "登录账号", type: "text", req: !u },
          { k: "n", label: "姓名", type: "text", req: true },
          { k: "r", label: "角色", type: "select", options: ROLES },
          { k: "d", label: "所属部门", type: "text" },
          { k: "p", label: "密码", type: "text", req: true }
        ],
        data: u || { u: "", n: "", r: "编辑", d: "", p: "" },
        onOk: function (out) {
          var arr = Store.list("accounts");
          if (u) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].u === u.u) { arr[i] = Object.assign({}, arr[i], out, { u: u.u }); break; }
            }
          } else {
            if (arr.some(function (x) { return x.u === out.u; })) { toast("账号已存在"); return; }
            arr.push(out);
          }
          Store.log("账号", (u ? "修改" : "新增") + "账号 " + (u ? u.u : out.u));
          localStorage.setItem("mq_admin_accounts", JSON.stringify(arr));
          toast("已保存，重新登录后生效");
          renderUsers();
        }
      });
    }

    $("#btnUserNew").onclick = function () { form(null); };
    $$("[data-uedit]").forEach(function (b) {
      b.onclick = function () {
        var u = Store.list("accounts").filter(function (x) { return x.u === b.getAttribute("data-uedit"); })[0];
        if (u) form(u);
      };
    });
    $$("[data-udel]").forEach(function (b) {
      b.onclick = function () {
        var name = b.getAttribute("data-udel");
        if (session && name === session.u) { toast("不能删除当前登录账号"); return; }
        if (!confirm("确定删除账号 " + name + "？")) return;
        var arr = Store.list("accounts").filter(function (x) { return x.u !== name; });
        localStorage.setItem("mq_admin_accounts", JSON.stringify(arr));
        Store.log("账号", "删除账号 " + name);
        toast("已删除");
        renderUsers();
      };
    });
  }

  function renderLogs() {
    var list = Store.list("logs");
    $("#view").innerHTML =
      '<div class="panel"><div class="panel-hd"><h3>操作日志</h3><div class="right">' +
        '<button class="btn btn-line btn-sm" type="button" id="btnClearLog">清空日志</button></div></div>' +
      '<div class="panel-bd">' +
        (list.length
          ? '<table class="grid"><thead><tr><th style="width:180px">时间</th><th style="width:120px">操作人</th>' +
            '<th style="width:90px">动作</th><th>内容</th></tr></thead><tbody>' +
            list.map(function (l) {
              return "<tr><td>" + esc(l.time) + "</td><td>" + esc(l.user) + '</td><td><span class="tag">' +
                esc(l.action) + "</span></td><td>" + esc(l.detail) + "</td></tr>";
            }).join("") + "</tbody></table>"
          : '<div class="empty">暂无日志，编辑内容后会自动记录。</div>') +
      "</div></div>";

    $("#btnClearLog").onclick = function () {
      if (!confirm("清空全部操作日志？")) return;
      localStorage.setItem("mq_logs", JSON.stringify([]));
      toast("已清空");
      renderLogs();
    };
  }

  function renderSettings() {
    var s = Store.settings();
    $("#view").innerHTML =
      '<div class="panel"><div class="panel-hd"><h3>站点基本设置</h3></div><div class="panel-bd">' +
        '<div class="form-grid">' +
          '<div class="form-row"><label>学校名称</label><input id="s_siteName" value="' + esc(s.siteName) + '"></div>' +
          '<div class="form-row"><label>挂牌名称</label><input id="s_subName" value="' + esc(s.subName) + '"></div>' +
          '<div class="form-row" style="grid-column:1/-1"><label>宣传语</label><input id="s_slogan" value="' + esc(s.slogan) + '"></div>' +
          '<div class="form-row"><label>学校地址</label><input id="s_address" value="' + esc(s.address) + '"></div>' +
          '<div class="form-row"><label>校长信箱</label><input id="s_mail" value="' + esc(s.mail) + '"></div>' +
          '<div class="form-row"><label>备案号</label><input id="s_icp" value="' + esc(s.icp) + '"></div>' +
          '<div class="form-row"><label>AI 任务台</label><select id="s_aiSwitch">' +
            '<option' + (s.aiSwitch === "开启" ? " selected" : "") + '>开启</option>' +
            '<option' + (s.aiSwitch === "关闭" ? " selected" : "") + '>关闭</option>' +
          "</select></div>" +
          '<div class="form-row" style="grid-column:1/-1"><label>AI 答复口径说明</label>' +
            '<textarea id="s_aiReply">' + esc(s.aiReply) + "</textarea></div>" +
        "</div>" +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
          '<button class="btn btn-line" type="button" id="btnExport">导出内容为 JS</button>' +
          '<button class="btn btn-primary" type="button" id="btnSaveSet">保存设置</button>' +
        "</div>" +
      "</div></div>";

    $("#btnSaveSet").onclick = function () {
      Store.saveSettings({
        siteName: $("#s_siteName").value,
        subName: $("#s_subName").value,
        slogan: $("#s_slogan").value,
        address: $("#s_address").value,
        mail: $("#s_mail").value,
        icp: $("#s_icp").value,
        aiSwitch: $("#s_aiSwitch").value,
        aiReply: $("#s_aiReply").value
      });
      Store.log("设置", "更新站点设置");
      toast("设置已保存");
    };

    $("#btnExport").onclick = function () {
      var news = Store.list("news").map(function (x) {
        return {
          id: x.id, c: x.cat, t: x.title, d: x.date, v: Number(x.views) || 0,
          img: x.cover || "", hot: Number(x.top) ? 1 : 0, src: x.src || (x.id < 125 ? "/xwzx/xyxw/content_" + (252700 + x.id) : "")
        };
      });
      var majors = Store.list("majors").map(function (x) {
        return { n: x.name, lv: x.level, tag: x.tag, d: x.intro, icon: "code" };
      });
      var bases = Store.list("bases").map(function (x) {
        return { n: x.name, lv: x.level, d: x.intro };
      });
      var courses = Store.list("courses").map(function (x) {
        return { n: x.name, t: x.major, h: String(x.hours), m: x.mode };
      });
      var out = "window.ADMIN_EXPORT = {\n" +
        "  NEWS: " + JSON.stringify(news) + ",\n" +
        "  MAJORS: " + JSON.stringify(majors) + ",\n" +
        "  BASES: " + JSON.stringify(bases) + ",\n" +
        "  COURSES: " + JSON.stringify(courses) + "\n};\n";
      var blob = new Blob([out], { type: "text/javascript;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "导出数据.js";
      a.click();
      Store.log("导出", "导出内容为 JS 数据文件");
      toast("已导出，可替换前端 data.js 中的对应数组");
    };
  }

  function go(page) {
    if (!PAGES[page]) page = "dash";
    state.page = page;
    $("#pageTitle").textContent = PAGES[page].title;
    $("#pageCrumb").textContent = PAGES[page].crumb;
    $$(".side .item").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("data-page") === page);
    });
    history.replaceState(null, "", "#" + page);
    if (page === "dash") return renderDash();
    if (page === "users") return renderUsers();
    if (page === "logs") return renderLogs();
    if (page === "settings") return renderSettings();
    renderModule(page);
  }

  $$(".side .item").forEach(function (a) {
    a.onclick = function () { go(a.getAttribute("data-page")); };
  });

  $("#dlgClose").onclick = closeDialog;
  $("#dlgCancel").onclick = closeDialog;
  $("#mask").addEventListener("click", function (e) { if (e.target === this) closeDialog(); });

  $("#btnLogout").onclick = function () {
    if (!confirm("确定退出登录？")) return;
    Store.log("登录", "退出后台");
    Store.logout();
  };

  if (session) {
    $("#whoName").textContent = session.n || "管理员";
    $("#roleBadge").textContent = session.r || "管理员";
    $("#sideTime").textContent = new Date(session.at || Date.now()).toLocaleString("zh-CN", { hour12: false });
  }

  var start = (location.hash || "").replace("#", "");
  go(PAGES[start] ? start : "dash");
})();
