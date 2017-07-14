!function(e) {

	// 位置
	function t(e, t, r) {
		var n = e[t];
		e[t] = r(n)
	}

	// 原声事件发起
	function r(e) {
		return "function" != typeof e ? e : (e.__injected__ || (e.__injected__ = function() {
			try {
				return e.apply(this, arguments)
			} catch (e) {
				throw o(e), g = !0, e
			}
		}), e.__injected__)
	}

	// 好像是判断是否包含数字
	function n(e) {
		var t = /^[0-9a-z]{64}$/i;
		return !(!e || !e.match(t))
	}

	// ErrStack数据构造
	function a(e) {
		return e ? {
			// 错误名称
			name: e && e.name,
			// 错误堆栈信息
			message: e && e.message,
			// 文件名字
			fileName: e && e.fileName || e && e.sourceURL,
			// 所在行
			lineNumber: e && e.lineNumber || e && e.line,
			// 所在列
			columnNumber: e && e.columnNumber || e && e.column
		} : null
	}

	// 测试方法
	function i() {
		var e;
		try {
			throw new Error("")
		} catch (t) {
			e = t.stack
		}
		if (e) return e = e.replace(/(.*?)fundebug(.*?)\.js(.*)\n?/gm, ""), e = e.replace(/^Error\n/g, ""), e = "generated-stack:\n" + e
	}

	// 生成堆栈信息
	function u() {
		for (var e, t = [], r = arguments.callee.caller.caller; r && t.length < 10;) {
			var n = r.toString().match(/function\s*([\w\_$]+)?\s*\(/i);
			e = n && n[1] || "[anonymous]", t.push(e), r = r.caller
		}
		return "generated-stack:\n" + t.join("\n")
	}

	// 不知道做什么
	function o(event) {
		if (event) {
			var target = event.stack;
			target = t.replace(/(.*?)fundebug(.*?)\.js(.*)\n?/gm, "");
			var r = a(event);
			f({
				name: r.name || "uncaught error",
				message: r.message,
				fileName: r.fileName,
				lineNumber: r.lineNumber,
				columnNumber: r.columnNumber,
				stacktrace: target,
				severity: "error",
				type: "uncaught"
			})
		}
	}

	// 好像是对Object的处理
	function s(e) {
		var t = [];
		for (var r in e) if (e.hasOwnProperty(r)) {
			var n = '"' + r + '":',
				a = e[r];
			a && ("object" == typeof a ? n += s(a) : "number" == typeof a ? n += a : n = n + '"' + a.replace(/\n/g, "\\n") + '"', t.push(n))
		}
		return "{" + t.join(",") + "}"
	}

	// 如果超出队列长度，则出战入栈
	function c(e) {
		y.push(e), y.length > 20 && y.shift()
	}

	// 用户事件捕获
	function l(t) {
		var r, n = (r = t.target ? t.target : t.srcElement) && r.outerHTML;
		n && n.length > 200 && (n = n.slice(0, 200)), c({
			type: "click",
			page: {
				url: e.location.href,
				title: document.title
			},
			detail: {
				outerHTML: n,
				tagName: r && r.tagName,
				id: r && r.id,
				className: r && r.className,
				name: r && r.name
			},
			time: (new Date).getTime()
		})
	}

	// 从哪到哪？
	function m(e, t) {
		b = t, c({
			type: "navigation",
			detail: {
				from: e,
				to: t
			},
			time: (new Date).getTime()
		})
	}

	// 好像是综合的日志信息
	function f(t) {
		if (n(h.getAttribute("apikey") || d.apikey) && d.maxEventNumber && !d.silent) {
			d.maxEventNumber -= 1;
			var r = {
				notifierVersion: "0.1.5",
				userAgent: e.navigator.userAgent,
				locale: e.navigator.language || e.navigator.userLanguage,
				url: e.location.href,
				title: document.title,
				appVersion: h.getAttribute("appversion") || d.appversion,
				apiKey: h.getAttribute("apikey") || d.apikey,
				releaseStage: h.getAttribute("releasestage") || d.releasestage,
				metaData: t.metaData || d.metaData,
				user: t.user || d.user,
				name: t.name,
				time: (new Date).getTime(),
				message: t.message,
				fileName: t.fileName,
				lineNumber: t.lineNumber,
				columnNumber: t.columnNumber,
				stacktrace: t.stacktrace,
				type: t.type,
				severity: t.severity,
				target: t.target,
				req: t.req,
				res: t.res,
				breadcrumbs: y
			};
			r.userAgent && r.userAgent.match(/Googlebot/) || p(r)
		}
	}

	// 不知道是啥
	function p(t) {
		var r;
		if (r = "undefined" == typeof JSON ? s(t) : JSON.stringify(t), e.XMLHttpRequest && e.atob) {
			var n = new XMLHttpRequest;
			n.Fundebug = !0, n.open("POST", "https://fundebug.com/javascript/"), n.setRequestHeader("Content-Type", "application/json"), n.send(r)
		} else(new Image).src = "https://fundebug.com/javascript?event=" + encodeURIComponent(r)
	}

	// D应该是构造函数
	var d = {};
	e.fundebug = d;
	var g = !1,
		h = function() {
			var e = document.currentScript;
			if (!e) {
				var t = document.scripts;
				e = t[t.length - 1]
			}
			return e
		}();
	d.silent = h.getAttribute("silent") || !1, d.maxEventNumber = h.getAttribute("maxEventNumber") || 10, d.silentResource = h.getAttribute("silentResource") || !1, d.silentHttp = h.getAttribute("silentHttp") || !1, t(e, "onerror", function() {
		return function(t, r, n, i, o) {
			if (g) g = !1;
			else {
				void 0 === i && e.event && (i = e.event.errorCharacter);
				var s;
				s = r && r !== e.location.href ? r : null;
				var c = a(o);
				f({
					message: t,
					lineNumber: n,
					columnNumber: i,
					fileName: s || c && c.fileName,
					name: c && c.name || "uncaught error",
					stacktrace: o && o.stack || u(),
					severity: "error",
					type: "uncaught"
				})
			}
		}
	});
	var v = !0;
	if (e.atob) {
		if (e.ErrorEvent) try {
			e.ErrorEvent.prototype.hasOwnProperty("error") && (v = !1)
		} catch (e) {}
	} else v = !1;
	"EventTarget Window Node ApplicationCache AudioTrackList ChannelMergerNode CryptoOperation EventSource FileReader HTMLUnknownElement IDBDatabase IDBRequest IDBTransaction KeyOperation MediaController MessagePort ModalWindow Notification SVGElementInstance Screen TextTrack TextTrackCue TextTrackList WebSocket WebSocketWorker Worker XMLHttpRequest XMLHttpRequestEventTarget XMLHttpRequestUpload".replace(/\w+/g, function(n) {
		if (v) {
			var a = e[n] && e[n].prototype;
			a && a.hasOwnProperty && a.hasOwnProperty("addEventListener") && (t(a, "addEventListener", function(e) {
				return function(t, n, a, i) {
					return n && n.handleEvent && (n.handleEvent = r(n.handleEvent)), e.call(this, t, r(n), a, i)
				}
			}), t(a, "removeEventListener", function(e) {
				return function(t, n, a) {
					return e.call(this, t, n, a), e.call(this, t, r(n), a)
				}
			}))
		}
	}), d.notify = function(e, t, r) {
		if (e) return f({
			name: e || r && r.name,
			message: t || r && r.message,
			severity: r && r.message || "warning",
			stacktrace: i(),
			type: "notification",
			user: r && r.user,
			metaData: r && r.metaData
		}), "fundebug.com" === location.host ? "浜诧紝涓嶈鍦‵undebug缃戠珯娴嬭瘯鍝︼紱璇峰皢Fundebug鎻掍欢闆嗘垚鍒版偍鐨勭綉绔欙紝鐒跺悗杩涜娴嬭瘯!" : "璇锋煡鐪嬮偖绠变互鍙奆undebug鎺у埗鍙�!"
	}, d.notifyError = function(e, t) {
		if (e) {
			var r = a(e);
			f({
				name: r.name || t && t.name || "caught error",
				message: r.message || t && t.message,
				stacktrace: e.stack,
				fileName: r.fileName,
				lineNumber: r.lineNumber,
				columnNumber: r.columnNumber,
				severity: t && t.severity || "error",
				type: "caught",
				user: t && t.user,
				metaData: t && t.metaData
			})
		}
	}, d.notifyHttpError = function(e, t, r) {
		f({
			type: "httpError",
			req: e,
			res: t,
			user: r && r.user,
			metaData: r && r.metaData
		})
	}, e.addEventListener && e.addEventListener("unhandledrejection", function(e) {
		d.notifyError(e.reason)
	}), e.addEventListener && e.addEventListener("error", function(t) {
		if (!d.silentResource && !t.message) {
			var r, n = (r = t.target ? t.target : t.srcElement) && r.outerHTML;
			n && n.length > 200 && (n = n.slice(0, 200));
			var a = {
				type: "resourceError",
				target: {
					outerHTML: n,
					src: r && r.src,
					tagName: r && r.tagName,
					id: r && r.id,
					className: r && r.className,
					name: r && r.name,
					type: r && r.type
				}
			};
			if (r.src !== e.location.href && (!r.src || !r.src.match(/.*\/(.*)$/) || r.src.match(/.*\/(.*)$/)[1]) && a.target.src && e.XMLHttpRequest) {
				var i = new XMLHttpRequest;
				i.Fundebug = !0, i.open("HEAD", a.target.src), i.send(), i.onload = function(e) {
					200 !== e.target.status && (a.target.status = e.target.status, a.target.statusText = e.target.statusText), f(a)
				}
			}
		}
	}, !0);
	var y = [];
	e.addEventListener ? e.addEventListener("click", l, !0) : document.attachEvent("onclick", l);
	var b = {
		url: e.location.href
	};
	document.addEventListener ? document.addEventListener("DOMContentLoaded", function() {
		b = {
			url: e.location.href,
			title: document.title
		}
	}) : document.attachEvent("onreadystatechange", function() {
		b = {
			url: e.location.href,
			title: document.title
		}
	});
	var N = e.onpopstate;
	e.onpopstate = function() {
		var t = {
			url: e.location.href
		};
		if (b.title || (b.title = document.title), b.url !== t.url && m(b, t), N) return N.apply(this, arguments)
	};
	var E = e.history.pushState;
	e.history.pushState = function() {
		b = {
			url: e.location.href,
			title: document.title
		};
		var t = {};
		if (3 === arguments.length && (t.url = arguments[2]), b.url !== t.url && m(b, t), E) return E.apply(this, arguments)
	};
	var T = e.onhashchange;
	if (e.onhashchange = function() {
		var t = {
			url: e.location.href,
			title: document.title
		};
		if (b.url !== t.url && m(b, t), T) return T.apply(this, arguments)
	}, e.XMLHttpRequest) {
		var L = XMLHttpRequest.prototype;
		if (!L) return;
		var k, H, w = L.open,
			D = L.send;
		L.open = function(e, t) {
			return k = e, H = t, w.apply(this, arguments)
		}, L.send = function() {
			var t = this;
			t.onerror = function(e) {};
			var r = t.onreadystatechange;
			return t.onreadystatechange = function() {
				if (4 === t.readyState && !t.Fundebug) {
					var n = {
						type: "XMLHttpRequest",
						page: {
							url: e.location.href
						},
						detail: {
							method: k,
							url: t.responseURL || H,
							status: t.status,
							statusText: t.statusText
						},
						time: (new Date).getTime()
					};
					if (!d.silentHttp && 2 !== parseInt(t.status / 100)) {
						var a = {
							method: n.detail.method,
							url: n.detail.url
						},
							i = {
								status: t.status,
								statusText: t.statusText,
								response: t.response
							};
						d.notifyHttpError(a, i)
					}
					c(n)
				}
				r && r.apply(this, arguments)
			}, D.apply(this, arguments)
		}
	}
	if (e.fetch) {
		var M = e.fetch;
		e.fetch = function(t, r) {
			return M.apply(this, arguments).then(function(t) {
				var n = {
					type: "fetch",
					page: {
						url: e.location.href,
						title: document.title
					},
					detail: {
						method: r && r.method || "GET",
						url: t.url,
						status: t.status,
						statusText: t.statusText
					},
					time: (new Date).getTime()
				};
				if (!d.silentHttp && 2 !== parseInt(t.status / 100)) {
					var a = {
						method: n.detail.method,
						url: n.detail.url
					},
						i = {
							status: t.status,
							statusText: t.statusText
						};
					d.notifyHttpError(a, i)
				}
				return c(n), t
			})
		}
	}
	var x = "function" == typeof define,
		R = "undefined" != typeof module && module.exports;
	x ? define(d) : R && (module.exports = d)
}(window);
