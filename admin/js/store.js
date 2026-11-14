(function () {
  "use strict";

  var P = "mq_";

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(P + key);
      if (raw == null) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, val) {
    try {
      localStorage.setItem(P + key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  var SEED_NEWS = [
    { id: 101, title: "聚焦学考谋全局，锚定目标创一流——我校召开2026年省中职学业水平考试技能考试专题会议", cat: "校园新闻", date: "2026-11-10", views: 61, author: "教务处", cover: "news-01.jpg", status: "已发布", top: 1, hot: 1, body: "会议通报了本年度省中职学业水平考试技能考试的时间安排与考务要求，明确了各专业集训进度与考务分工。教务处、各系部教学主任参加会议。" },
    { id: 102, title: "深化产教融合，共筑化工人才高地——2027届应用化工技术专业专场招聘会成功举办", cat: "校园新闻", date: "2026-11-06", views: 78, author: "招生就业处", cover: "news-02.jpg", status: "已发布", top: 0, hot: 1, body: "本次招聘会邀请保税区化工园多家企业进校，提供岗位 120 余个，2027届应用化工技术专业学生全部到场对接。" },
    { id: 103, title: "开题启新程，研思促成长——我校召开江苏联合职业技术学院2026年度立项研究课题开题论证与指导会", cat: "校园新闻", date: "2026-11-03", views: 125, author: "教科室", cover: "news-03.jpg", status: "已发布", top: 0, hot: 0, body: "会议邀请校外专家对 6 项立项课题进行开题论证，逐项提出修改建议，明确了下一阶段的研究任务与时间节点。" },
    { id: 104, title: "校企同心 筑梦远航——我校成功举办27届五年制大专毕业生企业宣讲会", cat: "校园新闻", date: "2026-10-29", views: 127, author: "招生就业处", cover: "news-04.jpg", status: "已发布", top: 0, hot: 0, body: "宣讲会共有 18 家企业参与，覆盖机电、计算机、商贸等专业方向，现场达成初步意向 200 余人次。" },
    { id: 105, title: "青春聚力，新时代青年在祖国统一进程中的使命与担当——五年制班级《形势与政策》专题讲座", cat: "校园新闻", date: "2026-10-28", views: 111, author: "学生工作处", cover: "news-05.jpg", status: "已发布", top: 0, hot: 0, body: "讲座由思政教研组主讲，结合时事与职业教育实际，引导学生树立正确的国家观与职业观。" },
    { id: 106, title: "喜报", cat: "校园新闻", date: "2026-10-27", views: 127, author: "教务处", cover: "news-06.jpg", status: "已发布", top: 0, hot: 1, body: "2026 年江苏省职业院校技能大赛成绩公布，我校参赛队在中职组多个赛项中取得优异成绩，学校再次被表彰为江苏省职业学校技能大赛先进学校。" },
    { id: 107, title: "课程思政润课堂，产教融合促提升——我校成功承办江苏联院生物与化工专指委课程思政交流暨产教融合培训活动", cat: "校园新闻", date: "2026-10-25", views: 123, author: "能源材料系", cover: "news-07.jpg", status: "已发布", top: 0, hot: 0, body: "活动围绕课程思政示范课、产教融合案例分享展开，来自省内多所联院分院的教师参加。" },
    { id: 108, title: "匠心育英才 实干启新途——机械与汽车工程系举行2026-2027学年第一学期开学典礼", cat: "部门新闻", date: "2026-09-12", views: 167, author: "机械与汽车工程系", cover: "news-10.jpg", status: "已发布", top: 0, hot: 0, body: "典礼上表彰了上一学年技能竞赛获奖学生与优秀班主任，系主任对新学期教学安排作了说明。" },
    { id: 109, title: "奋楫数字蓝海　共绘智匠新篇——信息工程系举行2026-2027学年第一学期开学典礼", cat: "部门新闻", date: "2026-09-10", views: 203, author: "信息工程系", cover: "news-11.jpg", status: "已发布", top: 0, hot: 1, body: "信息工程系在开学典礼上发布了本学年技能竞赛集训计划与实训基地开放安排。" },
    { id: 110, title: "砥砺前行正当时 乘风破浪再出发——经济贸易系举行2026-2027学年第一学期开学典礼", cat: "部门新闻", date: "2026-09-09", views: 131, author: "经济贸易系", cover: "news-12.jpg", status: "已发布", top: 0, hot: 0, body: "经济贸易系结合专业特点，安排了会计技能、电商直播等方向的学期任务。" },
    { id: 111, title: "匠心筑梦启新程　砺技笃行向未来——能源材料系举行2026-2027学年第一学期开学典礼", cat: "部门新闻", date: "2026-09-08", views: 189, author: "能源材料系", cover: "news-13.jpg", status: "已发布", top: 0, hot: 0, body: "能源材料系重点介绍了化工实训安全规范与新学期实训课程安排。" },
    { id: 112, title: "锚定产业需求深化产教融合——智能控制系开展专业结构与产业结构吻合度专项调研", cat: "部门新闻", date: "2026-06-30", views: 130, author: "智能控制系", cover: "news-14.jpg", status: "已发布", top: 0, hot: 0, body: "调研组走访了本地 8 家自动化企业，形成专业结构调整建议，为下一轮人才培养方案修订提供依据。" },
    { id: 113, title: "锚定产业需求 深化产教融合——经济贸易系开展专业结构与产业结构吻合度专项调研", cat: "部门新闻", date: "2026-06-12", views: 188, author: "经济贸易系", cover: "news-15.jpg", status: "已发布", top: 0, hot: 0, body: "调研覆盖电子商务、会计事务、物流服务与管理三个专业方向，形成了岗位能力对照表。" },
    { id: 114, title: "走访企业深调研 产教融合促发展——能源材料系开展专业结构与产业吻合度专题调研", cat: "部门新闻", date: "2026-06-11", views: 124, author: "能源材料系", cover: "news-16.jpg", status: "已发布", top: 0, hot: 0, body: "调研组与化工园区企业就实训项目、技能等级证书对接等事项进行了交流。" },
    { id: 115, title: "江苏省张家港中等专业学校采购张中专音乐教室改造项目邀请采购公告", cat: "通知公告", date: "2026-11-12", views: 42, author: "后勤服务处", cover: "", status: "已发布", top: 1, hot: 0, body: "现就张中专音乐教室改造项目进行邀请采购，欢迎符合条件的供应商参加。报名截止时间见公告原文。" },
    { id: 116, title: "关于开展市名师工作室第二年度考核工作的函", cat: "通知公告", date: "2026-11-09", views: 66, author: "校长办公室", cover: "", status: "已发布", top: 0, hot: 0, body: "根据市名师工作室建设要求，现开展第二年度考核工作，请各工作室按要求报送材料。" },
    { id: 117, title: "江苏省张家港中等专业学校中专校采购宿舍循环泵项目公开采购公告", cat: "通知公告", date: "2026-11-05", views: 58, author: "后勤服务处", cover: "", status: "已发布", top: 0, hot: 0, body: "本项目采用公开采购方式，供应商资格要求与报价要求详见公告附件。" },
    { id: 118, title: "江苏省张家港中等专业学校采购2026-2027年计算机一级MSOFFICE题库项目公开采购公告", cat: "通知公告", date: "2026-11-05", views: 74, author: "信息中心", cover: "", status: "已发布", top: 0, hot: 0, body: "采购内容为计算机一级 MSOFFICE 题库及配套服务，服务周期一年。" },
    { id: 119, title: "关于组织2026年张家港市中小学（幼儿园）远程非学历培训的通知", cat: "通知公告", date: "2026-11-05", views: 91, author: "校长办公室", cover: "", status: "已发布", top: 0, hot: 0, body: "培训采用远程方式开展，参训教师需在规定时间内完成课程学习与考核。" },
    { id: 120, title: "关于组织参加2027年张家港市职业院校教学能力比赛的通知", cat: "通知公告", date: "2026-11-04", views: 103, author: "教务处", cover: "", status: "已发布", top: 0, hot: 0, body: "比赛分公共基础课程组、专业课程组，请各系部于规定时间前完成报名与材料提交。" },
    { id: 121, title: "关于举办张家港市职业院校第十届“读写结合”作文大赛的通知", cat: "通知公告", date: "2026-10-28", views: 118, author: "教务处", cover: "", status: "已发布", top: 0, hot: 0, body: "大赛面向全市职业院校学生，分初赛与决赛两个阶段进行。" },
    { id: 122, title: "江苏联合职业技术学院专家组来校开展五年制高职办学水平调研", cat: "教育新闻", date: "2026-10-20", views: 96, author: "校长办公室", cover: "", status: "已发布", top: 0, hot: 0, body: "专家组通过听课、座谈、查阅资料等方式了解学校五年制高职办学情况，并给出反馈意见。" },
    { id: 123, title: "苏州市职业教育学会部署2026年度职业教育研究课题申报工作", cat: "教育新闻", date: "2026-10-15", views: 88, author: "教科室", cover: "", status: "已发布", top: 0, hot: 0, body: "课题申报围绕产教融合、专业建设、课堂教学改革等方向展开。" },
    { id: 124, title: "全省中等职业学校学业水平考试工作安排发布", cat: "教育新闻", date: "2026-10-08", views: 142, author: "教务处", cover: "", status: "已发布", top: 0, hot: 0, body: "省教育考试院发布本年度学业水平考试工作安排，明确了考试科目与时间。" },
    { id: 125, title: "信息工程系开展计算机网络技术专业现代学徒制企业实践", cat: "部门新闻", date: "2026-11-13", views: 12, author: "信息工程系", cover: "news-16.jpg", status: "草稿", top: 0, hot: 0, body: "学生进入合作企业开展为期两周的岗位实践，企业导师与校内教师共同指导。" }
  ];

  var SEED_MAJORS = [
    { id: 1, name: "计算机应用技术", level: "五年一贯制", tag: "省现代化专业群", intro: "面向软件开发、网络运维与数字媒体方向，配套软件与信息服务省现代化实训基地。" },
    { id: 2, name: "计算机网络技术", level: "五年一贯制 / 3+3", tag: "省示范专业", intro: "网络组建与运维、网站开发与信息安全，对接网络安全运维岗位群。" },
    { id: 3, name: "软件与信息服务", level: "五年一贯制", tag: "省现代化实训基地", intro: "Web 前端、移动应用、数据库与软件测试，校企联合项目化教学。" },
    { id: 4, name: "数控技术应用", level: "三年制中专 / 3+3", tag: "国家级实训基地", intro: "数控车铣加工、多轴加工与工艺编程，实训基地为国家级基地。" },
    { id: 5, name: "机电一体化技术", level: "五年一贯制", tag: "省现代化实训基地", intro: "电气控制、自动化生产线安装调试与设备维护。" },
    { id: 6, name: "汽车运用与维修", level: "三年制中专", tag: "省级实训基地", intro: "汽车检测维修、新能源汽车三电系统与售后服务管理。" },
    { id: 7, name: "新能源汽车技术", level: "五年一贯制", tag: "重点建设专业", intro: "动力电池、驱动电机与控制系统的检修与维护。" },
    { id: 8, name: "会计事务", level: "五年一贯制", tag: "省品牌专业", intro: "财务会计、智能财税、会计信息系统应用。" },
    { id: 9, name: "应用化工技术", level: "五年一贯制", tag: "省现代化专业群", intro: "化工工艺、分析检验与安全环保，与保税区化工园深度合作。" },
    { id: 10, name: "电子商务", level: "3+3 / 三年制中专", tag: "校重点专业", intro: "网店运营、直播电商、视觉设计与客服管理。" },
    { id: 11, name: "服装设计与工艺", level: "三年制中专", tag: "传统优势专业", intro: "服装制版、工艺制作与服装陈列设计。" },
    { id: 12, name: "物流服务与管理", level: "三年制中专", tag: "校企共建", intro: "仓储配送、供应链管理与物流信息技术。" }
  ];

  var SEED_COURSES = [
    { id: 1, name: "网络组建与维护", major: "计算机网络技术", hours: 72, mode: "项目化" },
    { id: 2, name: "Web 前端开发", major: "软件与信息服务", hours: 96, mode: "项目化" },
    { id: 3, name: "数据库应用技术", major: "计算机应用技术", hours: 64, mode: "理实一体" },
    { id: 4, name: "数控加工工艺", major: "数控技术应用", hours: 88, mode: "实训" },
    { id: 5, name: "电气控制与 PLC", major: "机电一体化技术", hours: 80, mode: "理实一体" },
    { id: 6, name: "新能源汽车构造", major: "新能源汽车技术", hours: 72, mode: "实训" },
    { id: 7, name: "智能财税实务", major: "会计事务", hours: 64, mode: "案例教学" },
    { id: 8, name: "化工单元操作", major: "应用化工技术", hours: 96, mode: "实训" }
  ];

  var SEED_BASES = [
    { id: 1, name: "数控技术应用实训基地", level: "国家级", intro: "面向数控加工、模具制造与多轴加工方向，承担技能大赛集训任务。" },
    { id: 2, name: "机电一体化技术实训基地", level: "省现代化", intro: "自动化生产线、电气控制与工业机器人综合实训。" },
    { id: 3, name: "软件与信息服务实训基地", level: "省现代化", intro: "软件开发、网络工程、信息安全与数字媒体实训。" },
    { id: 4, name: "加工制造技术实训基地", level: "省现代化", intro: "普通加工、焊接、装配与检测一体化实训。" },
    { id: 5, name: "汽车运用与维修实训基地", level: "省级", intro: "整车检修、新能源汽车三电系统与钣喷实训。" },
    { id: 6, name: "财贸实训基地", level: "省级", intro: "会计手工与信息化、电商直播与物流沙盘实训。" },
    { id: 7, name: "自动化控制技术实训基地", level: "苏州市公共实训基地", intro: "面向区域企业提供自动化控制技术公共实训服务。" },
    { id: 8, name: "光机电制造与维修实训基地", level: "省级", intro: "光机电设备装调、维护与检测实训。" }
  ];

  var SEED_BANNERS = [
    { id: 1, title: "德技双馨", sub: "1984 年建校，28 个中高职专业，6200 余名在校学生", img: "banner-01.jpg", href: "school.html", sort: 1, status: "启用" },
    { id: 2, title: "赛训融合", sub: "数控技术应用为国家级实训基地，全国职业院校技能大赛累计 78 金", img: "news-03.jpg", href: "teach.html", sort: 2, status: "启用" },
    { id: 3, title: "产教融通", sub: "牵头组建江苏扬子江职业教育集团，42 所院校与 45 家骨干企业", img: "news-02.jpg", href: "admit.html", sort: 3, status: "启用" }
  ];

  var SEED_KNOW = [
    { id: 1, q: "今年竞赛获奖情况", tag: "竞赛", status: "启用", a: "全国职业院校技能大赛累计 78 金 26 银 5 铜；连续二十三届获张家港市技能竞赛金杯；2026 年省赛斩获多个赛项奖项。" },
    { id: 2, q: "学校介绍", tag: "概况", status: "启用", a: "1980 年办班、1984 年建校，2015 年升格为江苏联合职业技术学院张家港分院，2020 年获批江苏省领航学校建设单位。占地 360 亩，在校学生 6200 余人。" },
    { id: 3, q: "计算机网络技术专业课程", tag: "专业", status: "启用", a: "核心课程包括网络组建与维护、路由交换技术、网络安全、Web 前端开发、数据库应用技术，配套软件与信息服务省现代化实训基地。" },
    { id: 4, q: "招生层次", tag: "招生", status: "启用", a: "设有 3+3 分段培养、五年一贯制、职教高考、三年制中专 4 个办学层次。" },
    { id: 5, q: "就业率", tag: "就业", status: "启用", a: "毕业生对口就业率 90% 以上，用人单位满意度 95% 以上，中级工获证率 99% 以上。" },
    { id: 6, q: "学校地址和联系方式", tag: "联系", status: "启用", a: "江苏省张家港市福新路 2 号；校长信箱 zjgzdzyxx@163.com。" }
  ];

  var SEED_SETTINGS = {
    siteName: "江苏省张家港中等专业学校",
    subName: "江苏联合职业技术学院张家港分院",
    slogan: "德技双馨 · 成功就是成为最好的自己",
    address: "江苏省张家港市福新路2号",
    mail: "zjgzdzyxx@163.com",
    icp: "苏ICP备10212518号",
    aiSwitch: "开启",
    aiReply: "任务台优先检索站内收录的学校公开资料，再补充官网链接。"
  };

  function ensure(key, seed) {
    var v = read(key, null);
    if (v == null) {
      write(key, seed);
      return seed;
    }
    return v;
  }

  var Store = {
    init: function () {
      ensure("news", SEED_NEWS);
      ensure("majors", SEED_MAJORS);
      ensure("courses", SEED_COURSES);
      ensure("bases", SEED_BASES);
      ensure("banners", SEED_BANNERS);
      ensure("know", SEED_KNOW);
      ensure("settings", SEED_SETTINGS);
      ensure("logs", []);
      if (read("accounts", null) == null) {
        write("accounts", [
          { u: "admin", p: "admin123", n: "系统管理员", r: "超级管理员", d: "信息中心" },
          { u: "editor", p: "editor123", n: "内容编辑", r: "编辑", d: "信息工程系" }
        ]);
      }
    },

    list: function (k) { return read(k, []); },

    save: function (k, obj) {
      var arr = read(k, []);
      if (obj.id) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === obj.id) { arr[i] = Object.assign({}, arr[i], obj); break; }
        }
      } else {
        obj.id = arr.reduce(function (m, x) { return Math.max(m, x.id || 0); }, 0) + 1;
        arr.unshift(obj);
      }
      write(k, arr);
      return obj.id;
    },

    remove: function (k, id) {
      var arr = read(k, []).filter(function (x) { return x.id !== id; });
      write(k, arr);
    },

    settings: function () { return read("settings", SEED_SETTINGS); },
    saveSettings: function (obj) { write("settings", Object.assign(Store.settings(), obj)); },

    session: function () {
      try { return JSON.parse(localStorage.getItem("mq_admin_session") || "null"); }
      catch (e) { return null; }
    },

    logout: function () {
      try {
        localStorage.removeItem("mq_admin_session");
        sessionStorage.removeItem("mq_admin_session_tmp");
      } catch (e) {}
      location.replace("index.html");
    },

    log: function (action, detail) {
      var s = Store.session();
      var arr = read("logs", []);
      arr.unshift({
        id: Date.now(),
        time: new Date().toLocaleString("zh-CN", { hour12: false }),
        user: s ? s.n : "未知",
        action: action,
        detail: detail || ""
      });
      write("logs", arr.slice(0, 300));
    }
  };

  window.Store = Store;
  window.SEED_SETTINGS = SEED_SETTINGS;
})();
