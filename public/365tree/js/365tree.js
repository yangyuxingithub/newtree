/*
 * @Author: Yangyuxin 
 * @Date: 2019-11-05 16:58:46 
 * @Last Modified by: Yangyuxin
 * @Last Modified time: 2019-11-29 10:17:12
 */
; "use strict";

function Mtree() {
    this.a = '',
    this.b = [],
    this.parentsArray = [],
    this.isdown = 0;
    this.ismove = 0;
    ndl = '.nodeList',
    spi = '.spreadIcon',
    allsp = '.allspread',
    ndc = '.nodeCheck',
    ndr = '.nodeRadio',
    ndt = '.nodeTop',
    ndm = '.nodeMenu',
    chdl = '.childrenList',
    ndro = 'nodeRadioOn',
    ndco = 'nodeCheckOn',
    ndcho = 'nodeCheckHalfOn',
    spo = 'spreadIconOn',
    ndmo = 'nodeMenuOn',
    this.config = {
        ele: '',
        data: [],
        showCheckbox: !1,
        showRadio: !1,
        spread: !1,
        allspread: !1,
        rightClick: !1,
        drag: !1,

        accordion: !1,
        onlyIconControl: !1,
        isJump: !1,
        edit: !1,
        text: {
            defaultNodeName: "未命名",
            none: "无数据"
        }
    },
    this.render = function (e) {
        let s = this;
        let c = s.config;
        c.ele = e.elem;
        c.data = e.data;
        c.showCheckbox = e.showCheckbox ? e.showCheckbox : !1;
        c.showRadio = e.showRadio ? e.showRadio : !1;
        c.spread = e.spread ? e.spread : !1;
        c.allspread = e.allspread ? e.allspread : !1;
        c.rightClick = e.rightClick ? e.rightClick : !1;
        c.drag = e.drag ? e.drag : !1;
        c.accordion = e.accordion ? e.accordion : !1;
        c.onlyIconControl = e.onlyIconControl ? e.onlyIconControl : !1;
        c.isJump = e.isJump ? e.isJump : !1;
        c.edit = e.edit ? e.edit : !1;
        c.nodeClick = e.nodeClick;
        c.text = {
            defaultNodeName: "未命名",
            none: "无数据"
        };

        var d = e.data;
        if (d && d.length > 0) {
            var n = $(c.ele);
            $(c.ele).css({ "position": "relative", "overflow": "hidden" });
            $(c.ele).html('');
            this.renderTree(n, d);
            if (c.allspread) {
                let treeHtml = '';
                treeHtml += '<div class="mtree-option-line">';
                treeHtml += '<div class="option-line-left">';
                treeHtml += '<i class="option-all-icon allspreadIcon allspread"></i>';
                treeHtml += '<span class="option-all-text">展开/折叠</span>';
                treeHtml += '</div>';
                treeHtml += '<div class="option-line-right">';
                treeHtml += '</div>';
                treeHtml += '</div>';
                $(c.ele).prevAll().remove();
                $(c.ele).before(treeHtml);
            }
        } else {
            let treeHtml = '<div class="nodeList ac">' + c.text.none + '</div>';
            $(c.ele).html(treeHtml);
        }

        s.allspread()
        s.spread()
        s.setClick()
        // s.dragNode()
    },
    this.renderTree = function (a, r) {
        let s = this, t = s.config;
        $.each(r, function (j, r) {
            var l = r.children && r.children.length > 0,
                o = $('<div class="childrenList" ' + (t.spread ? 'style="display: block;"' : "") + '></div>'),
                h = $('<div class="nodeList" nodeId="' + r.id +'" '+
                    (r.level ? ' nodeLevel="' + r.level + '" ' : r.level == 0 ? 'nodeLevel=0' : '') +
                    (r.combineCode ? ' nodeCombineCode="' + r.combineCode + '" ' : '') +
                    (r.parentId ? ' nodeParentId="' + r.parentId + '" ' : r.parentId == 0 ? 'nodeParentId=0' : '') +
                    (r.href ? ' nodeHref="' + r.href + '" >' : '>') +
                    (l ? '<i class="nodeIcon spreadIcon' + (t.spread ? 'spreadIconOn' : '') + '" ' + (t.spread ? 'spread="on"' : 'spread="off"') + '></i>' : ' <i class="nodeIcon"></i>') +
                    '<div class="nodeTop">' +
                    (t.showCheckbox ? '<i class="nodeIcon nodeCheck" nodecheck="off"></i>' : '') +
                    (t.showRadio ? '<i class="nodeIcon nodeRadio" noderadio="off"></i>' : '') +
                    '<span class="nodeMenu">' + r.title +
                    '</div>' +
                    '</span></div>');
            l && (h.append(o), s.renderTree(o, r.children)),
                a.append(h)
        })
    },
    this.spread = function () { // 展开或者折叠事件
        let s = this, t = s.config;
        let ele = t.ele;
        let p = $(ele).find(spi);
        var d = $(ele).prev(".mtree-option-line").find(allsp);
        if (!d[0]) {
            d = $(ele).parent().parent().children(".user-defined-option-line").children(".option-line-left").find(allsp);
        }
        p.bind("click", function () {
            let o = $(this);
            let s = o.attr("spread");

            var ochildren = o.next().next(chdl);
            if (ochildren) {
                if (s == 'off') {
                    o.addClass(spo);
                    o.attr({ "spread": "on" });
                    d.addClass(spo)
                    d.attr({ "spread": "on" });
                    ochildren.slideDown(200);
                } else if (s == 'on') {
                    o.removeClass(spo);
                    o.attr({ "spread": "off" });
                    ochildren.slideUp(200);
                }
            }
            $(p).each(function () {
                if ($(this).hasClass(spo)) {
                    d.addClass(spo)
                    d.attr({ "spread": "on" });
                    return false;
                } else {
                    d.removeClass(spo)
                    d.attr({ "spread": "off" });
                }
            });

        });
    },
    this.allspread = function () { // 全部展开或收起
        let s = this, t = s.config;
        let ele = t.ele;
        let alls, si, ochildren;
        if (t.allspread) {
            alls = $(ele).parent().find(".allspread");
            si = $(ele).find(spi);
            ochildren = $(ele).find(chdl);
        } else {
            alls = $(ele).parent().parent().children(".user-defined-option-line").find(allsp);
            // alls = $(ele).parent().parent().find(".allspread");
            si = $(ele).find(spi);
            ochildren = $(ele).find(chdl)
        }
        alls.attr({ "spread": "off" });
        if (t.spread) {
            alls.attr({ "spread": "on" });
            alls.addClass(spo);
        }
        alls.unbind("click");
        alls.click(function () {
            let o = $(this);
            let s = o.attr("spread");
            if (s == 'off') {
                o.addClass(spo);
                si.addClass(spo);
                o.attr({ "spread": "on" });
                si.attr({ "spread": "on" });
                ochildren.slideDown(200);
            } else if (s == 'on') {
                o.removeClass(spo);
                si.removeClass(spo);
                o.attr({ "spread": "off" });
                si.attr({ "spread": "off" });
                ochildren.slideUp(200);
            }
        });
    },
    this.setClick = function () { // 节点点击事件
        let n = this, t = n.config;
        let ele = t.ele;
        let nodeRadio = $(ele).find(ndr);
        

        // 阻止右击时系统默认的弹出框
        if (t.rightClick) {
            $(ele).off("contextmenu", ndt);
            $(ele).on("contextmenu", ndt, function (e) {
                e.preventDefault();
            })
        }else{
            $(ele).off("contextmenu", ndt);
        }
        
        // 解绑再重新绑定
        $(ele).off('mousedown', ndt);
        $(ele).on("mousedown", ndt, function (e) {
            if (!e) e = window.event;
            if (3 == e.which) { // 右击
                if (t.rightClick) {
                    let o = $(this);
                    let che = o.find(ndc).attr("nodecheck");
                    // 渲染选中状态
                    if (t.showCheckbox) {
                        if (che == 'off') {
                            if (o.parent().children(chdl).length > 0) {
                                o.find(ndc).addClass(ndcho);
                            } else {
                                o.find(ndc).addClass(ndco);
                            }
                            o.find(ndc).attr({ "nodecheck": "on" });
                            // 父级节点添加半全选状态
                            o.parent().parent().prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                            // 根据当前节点判断是否给父级节点渲染选中状态
                            o.parents(chdl).prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                            let list = o.parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                            n.setCheckbox(list);
                        } else if (che == 'on') {
                            o.find(ndc).removeClass(ndco);
                            o.find(ndc).removeClass(ndcho);
                            o.find(ndc).attr({ "nodecheck": "off" });
                            o.next(chdl).find(ndc).removeClass(ndco);
                            o.next(chdl).find(ndc).removeClass(ndcho);
                            o.next(chdl).find(ndc).attr({ "nodecheck": "off" });
                            // 父级节点添加半全选状态
                            o.parent().parent().prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                            o.parents(chdl).prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                            let list = o.parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                            n.cacelCheckbox(list);
                        }
                    }
                    // 获取选中数据的ID
                    let cd = n.getCheckbox();
                    let d = o.parent().attr("nodeid");
                    let l = o.parent().attr("nodelevel");
                    l ? l = l : l = '';
                    let p = o.parent().attr("nodeparentid");
                    p ? p = p : p = '';
                    let h = o.parent().attr("nodehref");
                    h ? h = h : h = '';
                    t.nodeClick && t.nodeClick({
                        elem: o,
                        checked: cd,
                        data: {
                            "nodeid": d,
                            "nodelevel": l,
                            "nodeparentid": p,
                            "nodehref": h
                        }
                    });
                }
            } else if (1 == e.which) { // 左击
                let o = $(this);
                let rad = o.find(ndr).attr("noderadio");
                let che = o.find(ndc).attr("nodecheck");
                // 渲染选中状态
                if (t.showRadio) {
                    if (rad == 'off') {
                        nodeRadio.removeClass(ndro);
                        o.find(ndr).addClass(ndro);
                        nodeRadio.attr({ "noderadio": "off" });
                        o.find(ndr).attr({ "noderadio": "on" });
                    } else if (rad == 'on') {
                        nodeRadio.removeClass(ndro);
                        nodeRadio.attr({ "noderadio": "off" });
                    }
                } else if (t.showCheckbox) {
                    if (che == 'off') {
                        o.find(ndc).addClass(ndco);
                        o.find(ndc).attr({ "nodecheck": "on" });
                        // 父级节点添加半全选状态
                        o.parent().parent().prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                        // 子节点添加选中状态
                        o.next(chdl).find(ndc).addClass(ndco);
                        o.next(chdl).find(ndc).attr({ "nodecheck": "on" });
                        o.parents(chdl).prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                        let list = o.parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                        n.setCheckbox(list);
                    } else if (che == 'on') {
                        o.find(ndc).removeClass(ndco);
                        o.find(ndc).removeClass(ndcho);
                        o.find(ndc).attr({ "nodecheck": "off" });
                        o.next(chdl).find(ndc).removeClass(ndco);
                        o.next(chdl).find(ndc).removeClass(ndcho);
                        o.next(chdl).find(ndc).attr({ "nodecheck": "off" });
                        // 父级节点添加半全选状态
                        o.parent().parent().prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                        o.parents(chdl).prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                        let list = o.parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                        n.cacelCheckbox(list);
                        n.b = [];
                    }
                }
                // 获取选中数据的ID
                let cd = n.getCheckbox();
                let d = o.parent().attr("nodeid");
                let l = o.parent().attr("nodelevel");
                l ? l = l : l = '';
                let p = o.parent().attr("nodeparentid");
                p ? p = p : p = '';
                let h = o.parent().attr("nodehref");
                h ? h = h : h = '';
                t.nodeClick && t.nodeClick({
                    elem: o,
                    checked: cd,
                    data: {
                        "nodeid": d,
                        "nodelevel": l,
                        "nodeparentid": p,
                        "nodehref": h
                    }
                });
            }
        })


    },
    this.dragNode = function (e) {
        let n = this, t = n.config;
        let ele = t.ele;
        let _this, distanceX, omouseNode;
        if (t.drag) {
            $(ele).on("mousedown", ndl, function (ev) {
                console.log(1)
                _this = $(this);
                n.isdown = 1;
                let oevent = ev || event;
                distanceX = oevent.clientX - this.offsetLeft;
                
                
                
                return false;
            });
            // document.onmousemove = function (ev) {
            $(ele).on("mousemove.namespace", ndl, function (ev) {
                console.log(2)
                let oevent = ev || event;
                let x = oevent.clientX - distanceX;
                // 判断鼠标是否移动
                if (x % 15 == 0) {
                    return;
                }
                if (n.isdown) {
                    n.ismove = 1;
                    //鼠标拖动事件执行函数
                    let ohtml = '';
                    // ohtml = _this.html();
                    ohtml += _this.children(".nodeIcon").prop("outerHTML");
                    ohtml += _this.children(".nodeTop").prop("outerHTML");
                    omouseNode = ohtml;
                    $('#mouseNode').remove();
                    let mouseNode = '<div id="mouseNode">' + ohtml + '</div>';
                    // $('body').append(mouseNode);
                    $(ele).append(mouseNode);
                    let owidth = $(_this).children(".nodeTop").width() + 22;
                    $('#mouseNode').css({ 'background': 'rgba(255,255,255,.9)', 'position': 'absolute', 'height': '30px', 'width': owidth });
                    $('#mouseNode').css({ 'top': event.pageY - 124, 'left': event.pageX - 8 });
                    
                    
                    // $(ele).on("mouseover.namespace", ndl, function () {
                        $(this).before(_this.prop("outerHTML"));
                        _this.remove();
                        console.log(777)
                        // $(ele).off('.namespace',ndl);
                    // });
                }
            });
            
            // document.onmouseup = function () {
            $(ele).on("mouseup", ndl, function () {
                console.log(3)
                n.isdown = 0;
                $('#mouseNode').remove();
                // $(ndl).off('mousemove');
                $(ele).off('.namespace',ndl);
                document.onmousemove = null;
                return false;
            })
            
        }
    },
    this.setCheckbox = function (e) {
        let n = this;
        var i = 0;
        $(e).each(function (p, q) {
            if ($(this).hasClass(ndco)) {
                i++;
                if (i == e.length) {
                    $(this).parent().parent().parent().prev(ndt).children(ndc).removeClass(ndcho).addClass(ndco).attr({ "nodecheck": "on" });
                    if (e.parents(ndl)[0]) {
                        var ep = $(this).parent().parent().parent().parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                        n.setCheckbox(ep);
                    }
                }
            }
        });
    },
    this.clickSetCheckbox = function (a, o, t, ic) {
        let n = this, nc = n.config;
        let e = $(a).find(ndl);
        $.each(o, function (m, i) {
            $(e).each(function () {
                if (!t) {
                    t = "nodeid";
                }
                if ($(this).attr(t) == i) {
                    let ndi = $(this).children(ndt).find(".nodeIcon");
                    if (ndi.hasClass("nodeCheck")) {
                        // 匹配节点渲染选中状态
                        ndi.addClass(ndco);
                        ndi.attr({ "nodecheck": "on" });
                        // 判断是否级联
                        if(ic){
                            // 匹配节点的后代节点渲染选中状态
                            $(this).children(chdl).find(ndc).addClass(ndco);
                            $(this).children(chdl).find(ndc).attr({ "nodecheck": "on" });
                        }

                        // 根据当前节点渲染祖父节点的选中状态
                        $(this).parents(chdl).prev(ndt).find(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                        let ondc = $(this).parent(chdl).children(ndl).children(ndt).children(ndc);
                        n.setCheckbox(ondc);

                    } else if (ndi.hasClass("nodeRadio")) {
                        // 匹配节点渲染选中状态
                        ndi.addClass(ndro);
                        ndi.attr({ "noderadio": "on" });

                        let p = $(this).children(".nodeIcon");
                        n.searchHighlightedParent(p);

                        return false;
                    }
                }
            });
        });
    },
    this.cacelCheckbox = function (e) {
        let n = this;
        var i = 0;
        $(e).each(function () {
            if ($(this).attr("nodecheck") == 'off') {
                i++;
                $(this).parent().parent().parent().prev(ndt).children(ndc).removeClass(ndco).addClass(ndcho).attr({ "nodecheck": "on" });
                if (i == e.length) {
                    $(this).parent().parent().parent().prev(ndt).find(ndc).removeClass(ndco).removeClass(ndcho).attr({ "nodecheck": "off" });
                    if (e.parents(ndl)[0]) {
                        var ep = $(this).parent().parent().parent().parent().parent(chdl).children(ndl).children(ndt).children(ndc);
                        n.cacelCheckbox(ep);
                    }
                }
            }
        });
    },
    this.getCheckbox = function (e) {
        let n = this, t = n.config, b = n.b;
        let c, nl, tit, combineCode, parentId, child, parentsId, ele;
        if (e) { // getChecked方法调用
            ele = e;
            b = [];
            $(ele).find(".nodeIcon").each(function () {
                if ($(this).attr("noderadio") == "on") {
                    let oNdl = $(this).parent().parent();
                    b = [];
                    c = oNdl.attr("nodeid");
                    nl = oNdl.attr("nodelevel");
                    combineCode = oNdl.attr("nodeCombineCode");
                    tit = $(this).next(".nodeMenu").text();
                    parentId = oNdl.attr("nodeparentid");
                    // 获取后代所有元素
                    child = $(this).parent().next(chdl).children(ndl);
                    let chnlArray = n.getChildrenNodes(child);

                    // 获取选中节点的所有父级元素
                    if (c) {
                        parentsId = n.getParentsIds(oNdl);
                    } else {
                        if (c == 0) {
                            parentsId = n.getParentsIds(oNdl);
                        }
                    }

                    let d = {};
                    d["id"] = c;
                    d["title"] = tit;
                    d["level"] = nl;
                    d["parentId"] = parentId ? parentId : parentId == 0 ? 0 : "";
                    d["children"] = chnlArray;
                    d["parentsId"] = parentsId;
                    if (combineCode) {
                        d["combineCode"] = combineCode;
                    }
                    b.push(d);
                    return false;
                }
                if ($(this).attr("nodecheck") == "on") {
                    let oNdl = $(this).parent().parent();
                    
                    c = oNdl.attr("nodeid");
                    nl = oNdl.attr("nodelevel");
                    combineCode = oNdl.attr("nodeCombineCode");
                    tit = $(this).next(".nodeMenu").text();
                    parentId = oNdl.attr("nodeparentid");
                    // 获取后代所有元素
                    child = $(this).parent().next(chdl).children(ndl);
                    let chnlArray = n.getChildrenNodes(child);

                    let d = {};
                    d["id"] = c;
                    d["title"] = tit;
                    d["level"] = nl;
                    d["parentId"] = parentId ? parentId : parentId == 0 ? 0 : "";
                    d["children"] = chnlArray;
                    if (combineCode) {
                        d["combineCode"] = combineCode;
                    }  
                    b.push(d);
                    b = Array.from(new Set(b));
                }
            });
        } else { // click方法调用 
            ele = t.ele;
            b = [];
            $(ele).find(".nodeIcon").each(function () {
                if (t.showRadio) {
                    if ($(this).attr("noderadio") == "on") {
                        let oNdl = $(this).parent().parent();
                        b = [];
                        c = oNdl.attr("nodeid");
                        nl = oNdl.attr("nodelevel");
                        combineCode = oNdl.attr("nodeCombineCode");
                        tit = $(this).next(".nodeMenu").text();
                        parentId = oNdl.attr("nodeparentid");
                        // 获取后代所有元素
                        child = $(this).parent().next(chdl).children(ndl);
                        let chnlArray = n.getChildrenNodes(child);

                        // 获取选中节点的所有父级元素
                        if (c) {
                            parentsId = n.getParentsIds(oNdl);
                        } else {
                            if (c == 0) {
                                parentsId = n.getParentsIds(oNdl);
                            }
                        }

                        let d = {};
                        d["id"] = c;
                        d["title"] = tit;
                        d["level"] = nl;
                        d["parentId"] = parentId ? parentId : parentId == 0 ? 0 : "";
                        d["children"] = chnlArray;
                        d["parentsId"] = parentsId;
                        if (combineCode) {
                            d["combineCode"] = combineCode;
                        }
                        b.push(d);
                        return false;
                    }
                } else if (t.showCheckbox) {
                    if ($(this).attr("nodecheck") == "on") {
                        let oNdl = $(this).parent().parent();
                        
                        c = oNdl.attr("nodeid");
                        nl = oNdl.attr("nodelevel");
                        combineCode = oNdl.attr("nodeCombineCode");
                        tit = $(this).next(".nodeMenu").text();
                        parentId = oNdl.attr("nodeparentid");
                        // 获取后代所有元素
                        child = $(this).parent().next(chdl).children(ndl);
                        let chnlArray = n.getChildrenNodes(child);

                        let d = {};
                        d["id"] = c;
                        d["title"] = tit;
                        d["level"] = nl;
                        d["parentId"] = parentId ? parentId : parentId == 0 ? 0 : "";
                        d["children"] = chnlArray;
                        if (combineCode) {
                            d["combineCode"] = combineCode;
                        }
                        b.push(d);
                        b = Array.from(new Set(b));
                    }
                }
            });
        }

        return b;
    },
    this.setChecked = function (e, i, a, isCascade) {
        let n = this;
        n.nodeIconReload(e);
        if (i && i.length > 0) {
            return n.clickSetCheckbox(e, i, a, isCascade)
        }
    },
    this.getChecked = function (e) {
        let n = this;
        return n.getCheckbox(e)
    },
    this.allCheckBox = function () { // 全选点击事件
        let n = this, t = n.config;
    },
    this.searchHighlighted = function (e, a) {
        let n = this;
        let m = a.val;
        $(e).find(".nodeMenu").css({ "color": "#6a7374" });
        if (m) {
            $(e).find(".nodeMenu").each(function (i, o) {
                let t = $(this).text();
                if (t.indexOf(m) != -1) {
                    $(this).css({ "color": "#0097ff" });
                    // 头部展开折叠按钮状态设置
                    $(e).prev(".mtree-option-line").find(allsp).attr({"spread":"on"});
                    $(e).prev(".mtree-option-line").find(allsp).addClass(spo);
                    var p = $(o).parent().prev();
                    n.searchHighlightedParent(p);
                }
            });
        }
    },
    this.searchHighlightedParent = function (e) {
        let n = this;
        if (e.parent().parent().prev().prev().hasClass("spreadIcon")) {
            e.parent().parent().prev().prev(spi).addClass(spo);
            e.parent().parent().prev().prev(spi).attr({ "spread": "on" });
            e.parent().parent(chdl).slideDown(200);
            let ep = e.parent().parent().parent().children(spi);
            n.searchHighlightedParent(ep);
        }
    },
    this.nodeIconReload = function (e) {
        $(e).find(".nodeIcon").each(function () {
            if ($(this).hasClass("nodeCheck")) {
                $(this).removeClass(ndco);
                $(this).removeClass(ndcho);
                $(this).attr({ "nodecheck": "off" });
            } else if ($(this).hasClass("nodeRadio")) {
                $(this).removeClass(ndro);
                $(this).attr({ "noderadio": "off" });
            }
        });
    },
    this.getParentsIds = function (e) {
        let n = this;
        let parentsArray = n.parentsArray;
        $(e).each(function (i, o) {
            let parentId = $(o).attr("nodeid");
            parentsArray.push(parentId);
            let parents = $(o).parent().parent(ndl);
            if (parents[0]) {
                n.getParentsIds(parents);
            } else {
                parentsArray.push(0);
            }
        });
        return parentsArray;
    },
    this.getChildrenNodes = function (e) {
        let n = this;
        let chnlArray = [];
        $(e).each(function (i, o) {
            let ch = {};
            ch["id"] = $(o).attr("nodeid");
            ch["title"] = $(o).children(ndt).children(ndm).text();
            ch["parentId"] = $(o).attr("nodeparentid");
            let child = $(o).children(chdl).children(ndl);
            ch["children"] = n.getChildrenNodes(child);
            chnlArray.push(ch);
        });
        return chnlArray;
    },
    this.reload = function (e) {
        // console.log(e);
    }
}