!function($window) {

  /**
   * 获取某数据项
   * @param {Object} obj
   * @param {string} key
   * @param {Function} callback
   * @return {undefined}
   */
  function addEvent(obj, key, callback) {
    const val = obj[key];
    obj[key] = callback(val);
  }

  /**
   * 验证函数 + 注入？
   * @param {Function} fn
   * @return {?}
   */
  function isFunction(fn) {
    return "function" != typeof fn ? fn : (fn.__injected__ || (fn.__injected__ = function() {
      try {
        return fn.apply(this, arguments);
      } catch (fmt) {
        throw runTest(fmt), v = true, fmt;
      }
    }), fn.__injected__);
  }

  /**
   * 验证64位的数字+字母组合
   * @param {string} value
   * @return {?}
   */
  function iterator(value) {
    /** @type {RegExp} */
    return!(!value || !value.match(/^[0-9a-z]{64}$/i));
  }

  /**
   * 日志构造器
   * @param {Object} err
   * @return {?}
   */
  function log(err) {
    return err ? {
      name : err && err.name,
      message : err && err.message,
      fileName : err && err.fileName || err && err.sourceURL,
      lineNumber : err && err.lineNumber || err && err.line,
      columnNumber : err && err.columnNumber || err && err.column
    } : null;
  }

  /**
   * 生成一个空的错误堆栈
   * @return {?}
   */
  function clean() {
    let stack;
    try {
      throw new Error('');
    } catch (e) {
      stack = e.stack;
    }
    if (stack) {
      stack = stack.replace(/(.*?)fundebug(.*?)\.js(.*)\n?/gm, '')
      stack = stack.replace(/^Error\n/g, '')
      stack = "generated-stack:\n" + stack;
      return stack
    }
  }

  /**
   * 
   * @return {?}
   */
  function wrap() {
    let copies;
  
    /** @type {Array} */
    const out = [];
  
    /** @type {(Function|null)} */
    var currentFunction = arguments.callee.caller.caller;
    for (;currentFunction && out.length < 10;) {
    
      /** @type {(Array.<string>|null)} */
      var units = currentFunction.toString().match(/function\s*([\w\_$]+)?\s*\(/i);
    
      /** @type {string} */
      copies = units && units[1] || "[anonymous]";
      out.push(copies);
    
      /** @type {(Function|null)} */
      currentFunction = currentFunction.caller;
    }
    return "generated-stack:\n" + out.join("\n");
  }

  /**
   * @param {?} err
   * @return {undefined}
   */
  function runTest(err) {
    if (err) {
      var stack = err.stack;
      stack = stack.replace(/(.*?)fundebug(.*?)\.js(.*)\n?/gm, '');
      var errEvent = log(err);
      eventFilter({
        name : errEvent.name || "uncaught error",
        message : errEvent.message,
        fileName : errEvent.fileName,
        lineNumber : errEvent.lineNumber,
        columnNumber : errEvent.columnNumber,
        stacktrace : stack,
        severity : "error",
        type : "uncaught"
      });
    }
  }

  /**
   * @param {Object} prop
   * @return {?}
   */
  function filter(prop) {
  
    /** @type {Array} */
    var assigns = [];
    var key;
    for (key in prop) {
      if (prop.hasOwnProperty(key)) {
      
        /** @type {string} */
        var item = '"' + key + '":';
        var value = prop[key];
        if (value) {
          if ("object" == typeof value) {
            item += filter(value);
          } else {
            if ("number" == typeof value) {
              item += value;
            } else {
            
              /** @type {string} */
              item = item + '"' + value.replace(/\n/g, "\\n") + '"';
            }
          }
          assigns.push(item);
        }
      }
    }
    return "{" + assigns.join(",") + "}";
  }

  /**
   * @param {Node} element
   * @return {?}
   */
  function walk(element) {
  
    /** @type {Array} */
    var paths = [];
    for (;element && element.nodeType == Node.ELEMENT_NODE;element = element.parentNode) {
      var node;
    
      /** @type {number} */
      var data = 0;
    
      /** @type {boolean} */
      var layout = false;
      node = element.previousSibling;
      for (;node;node = node.previousSibling) {
        if (node.nodeType != Node.DOCUMENT_TYPE_NODE) {
          if (node.nodeName == element.nodeName) {
            ++data;
          }
        }
      }
      node = element.nextSibling;
      for (;node && !layout;node = node.nextSibling) {
        if (node.nodeName == element.nodeName) {
        
          /** @type {boolean} */
          layout = true;
        }
      }
    
      /** @type {string} */
      var tagName = (element.prefix ? element.prefix + ":" : '') + element.localName;
    
      /** @type {string} */
      var pathIndex = data || layout ? "[" + (data + 1) + "]" : '';
      paths.splice(0, 0, tagName + pathIndex);
    }
    return paths.length ? "/" + paths.join("/") : null;
  }

  /**
   * @param {Node} node
   * @return {?}
   */
  function buildSelector(node) {
  
    /** @type {Array} */
    var selectors = [];
    for (;node.parentNode;) {
      if (node.id) {
        selectors.unshift("#" + node.id);
        break;
      }
      if (node == node.ownerDocument.documentElement) {
        selectors.unshift(node.tagName);
      } else {
      
        /** @type {number} */
        var r = 1;
      
        /** @type {Node} */
        var prev = node;
        for (;prev.previousElementSibling;prev = prev.previousElementSibling, r++) {
        }
        selectors.unshift(node.tagName + ":nth-child(" + r + ")");
      }
      node = node.parentNode;
    }
    return selectors.join(" > ");
  }

  /**
   * @param {?} chunk
   * @return {undefined}
   */
  function callback(chunk) {
    arr.push(chunk);
    if (arr.length > 20) {
      arr.shift();
    }
  }

  /**
   * @param {Event} event
   * @return {undefined}
   */
  function handler(event) {
    var node;
    var models = (node = event.target ? event.target : event.srcElement) && node.outerHTML;
    if (models) {
      if (models.length > 200) {
        models = models.slice(0, 200);
      }
    }
    callback({
      type : "click",
      page : {
        url : $window.location.href,
        title : document.title
      },
      detail : {
        outerHTML : models,
        tagName : node && node.tagName,
        id : node && node.id,
        className : node && node.className,
        name : node && node.name
      },
      time : (new Date).getTime()
    });
  }

  /**
   * @param {string} source
   * @param {?} b
   * @return {undefined}
   */
  function extend(source, b) {
    data = b;
    callback({
      type : "navigation",
      detail : {
        from : source,
        to : b
      },
      time : (new Date).getTime()
    });
  }

  /**
   * 事件过滤器
   * @param {Object} data
   * @return {undefined}
   */
  function eventFilter(data) {
    if (iterator(userAgentElement.getAttribute("apikey") || errend.apikey) && (errend.maxEventNumber && !errend.silent)) {
      errend.maxEventNumber -= 1;
      var req = {
        notifierVersion : "0.1.6",
        userAgent : $window.navigator.userAgent,
        locale : $window.navigator.language || $window.navigator.userLanguage,
        url : $window.location.href,
        title : document.title,
        appVersion : userAgentElement.getAttribute("appversion") || errend.appversion,
        apiKey : userAgentElement.getAttribute("apikey") || errend.apikey,
        releaseStage : userAgentElement.getAttribute("releasestage") || errend.releasestage,
        metaData : data.metaData || errend.metaData,
        user : data.user || errend.user,
        name : data.name,
        time : (new Date).getTime(),
        message : data.message,
        fileName : data.fileName,
        lineNumber : data.lineNumber,
        columnNumber : data.columnNumber,
        stacktrace : data.stacktrace,
        type : data.type,
        severity : data.severity,
        target : data.target,
        req : data.req,
        res : data.res,
        breadcrumbs : arr
      };
      if (!(req.userAgent && req.userAgent.match(/Googlebot/))) {
        eventRequest(req);
      }
    }
  }

  /**
   * 事件请求器
   * @param {Object} req
   * @return {undefined}
   */
  function eventRequest(req) {
    var payload;
    if (payload = "undefined" == typeof JSON ? filter(req) : JSON.stringify(req), $window.XMLHttpRequest && $window.atob) {
    
      /** @type {XMLHttpRequest} */
      var r = new XMLHttpRequest;
    
      /** @type {boolean} */
      r.Fundebug = true;
      r.open("POST", "https://fundebug.com/javascript/");
      r.setRequestHeader("Content-Type", "application/json");
      r.send(payload);
    } else {
    
      /** @type {string} */
      (new Image).src = "https://fundebug.com/javascript?event=" + encodeURIComponent(payload);
    }
  }
  var errend = {};
  $window.fundebug = errend;

  /** @type {boolean} */
  var v = false;
  var userAgentElement = function() {
    var node = document.currentScript;
    if (!node) {
      var scripts = document.scripts;
      node = scripts[scripts.length - 1];
    }
    return node;
  }();
  errend.silent = userAgentElement.getAttribute("silent") || false;
  errend.maxEventNumber = userAgentElement.getAttribute("maxEventNumber") || 10;
  errend.silentResource = userAgentElement.getAttribute("silentResource") || false;
  errend.silentHttp = userAgentElement.getAttribute("silentHttp") || false;
  addEvent($window, "onerror", function() {
    return function(output, src, lineNumber, columnNumber, err) {
      if (v) {
      
        /** @type {boolean} */
        v = false;
      } else {
        if (void 0 === columnNumber) {
          if ($window.event) {
            columnNumber = $window.event.errorCharacter;
          }
        }
        var clone;
        clone = src && src !== $window.location.href ? src : null;
        var info = log(err);
        eventFilter({
          message : output,
          lineNumber : lineNumber,
          columnNumber : columnNumber,
          fileName : clone || info && info.fileName,
          name : info && info.name || "uncaught error",
          stacktrace : err && err.stack || wrap(),
          severity : "error",
          type : "uncaught"
        });
      }
    };
  });

  /** @type {boolean} */
  var notSupportBase64 = true;
  if ($window.atob) {
    if ($window.ErrorEvent) {
      try {
        if ($window.ErrorEvent.prototype.hasOwnProperty("error")) {
        
          /** @type {boolean} */
          notSupportBase64 = false;
        }
      } catch (e) {
      }
    }
  } else {
  
    /** @type {boolean} */
    notSupportBase64 = false;
  }
  "EventTarget Window Node ApplicationCache AudioTrackList ChannelMergerNode CryptoOperation EventSource FileReader HTMLUnknownElement IDBDatabase IDBRequest IDBTransaction KeyOperation MediaController MessagePort ModalWindow Notification SVGElementInstance Screen TextTrack TextTrackCue TextTrackList WebSocket WebSocketWorker Worker XMLHttpRequest XMLHttpRequestEventTarget XMLHttpRequestUpload".replace(/\w+/g, function(key) {
    if (notSupportBase64) {
      var win = $window[key] && $window[key].prototype;
      if (win) {
        if (win.hasOwnProperty) {
          if (win.hasOwnProperty("addEventListener")) {
            addEvent(win, "addEventListener", function(callback) {
              return function(operation, value, array, list) {
                return value && (value.handleEvent && (value.handleEvent = isFunction(value.handleEvent))), callback.call(this, operation, isFunction(value), array, list);
              };
            });
            addEvent(win, "removeEventListener", function(callback) {
              return function(operation, value, array) {
                return callback.call(this, operation, value, array), callback.call(this, operation, isFunction(value), array);
              };
            });
          }
        }
      }
    }
  });

  /**
   * @param {string} name
   * @param {(Document|string)} message
   * @param {Object} opts
   * @return {?}
   */
  errend.notify = function(name, message, opts) {
    if (name) {
      return eventFilter({
        name : name || opts && opts.name,
        message : message || opts && opts.message,
        severity : opts && opts.message || "warning",
        stacktrace : clean(),
        type : "notification",
        user : opts && opts.user,
        metaData : opts && opts.metaData
      }), "fundebug.com" === location.host ? "\u6d5c\u8be7\u7d1d\u6d93\u5d88\ue6e6\u9366\u2035undebug\u7f03\u6220\u73ef\u5a34\u5b2d\u762f\u935d\ufe3c\u7d31\u7487\u5cf0\u76a2Fundebug\u93bb\u638d\u6b22\u95c6\u55d8\u579a\u9352\u7248\u504d\u9428\u52ed\u7d89\u7ed4\u6b19\u7d1d\u9412\u8dfa\u6097\u6769\u6d9c\ue511\u5a34\u5b2d\u762f!" : "\u7487\u950b\u7161\u942a\u5b2e\u5056\u7ee0\u53d8\u4e92\u9359\u5946undebug\u93ba\u0443\u57d7\u9359\ufffd!";
    }
  };

  /**
   * @param {?} err
   * @param {Object} error
   * @return {undefined}
   */
  errend.notifyError = function(err, error) {
    if (err) {
      var e = log(err);
      eventFilter({
        name : e.name || (error && error.name || "caught error"),
        message : e.message || error && error.message,
        stacktrace : err.stack,
        fileName : e.fileName,
        lineNumber : e.lineNumber,
        columnNumber : e.columnNumber,
        severity : error && error.severity || "error",
        type : "caught",
        user : error && error.user,
        metaData : error && error.metaData
      });
    }
  };

  /**
   * @param {Object} request
   * @param {Object} thenable
   * @param {string} options
   * @return {undefined}
   */
  errend.notifyHttpError = function(request, thenable, options) {
    eventFilter({
      type : "httpError",
      req : request,
      res : thenable,
      user : options && options.user,
      metaData : options && options.metaData
    });
  };
  if ($window.addEventListener) {
    $window.addEventListener("unhandledrejection", function(event) {
      errend.notifyError(event.reason);
    });
  }
  if ($window.addEventListener) {
    $window.addEventListener("error", function(event) {
      if (!errend.silentResource && !event.message) {
        var node;
        var models = (node = event.target ? event.target : event.srcElement) && node.outerHTML;
        if (models) {
          if (models.length > 200) {
            models = models.slice(0, 200);
          }
        }
        var info = {
          type : "resourceError",
          target : {
            outerHTML : models,
            src : node && node.src,
            tagName : node && node.tagName,
            id : node && node.id,
            className : node && node.className,
            name : node && node.name,
            type : node && node.type,
            XPath : walk(node),
            selector : buildSelector(node)
          }
        };
        if (node.src !== $window.location.href && ((!node.src || (!node.src.match(/.*\/(.*)$/) || node.src.match(/.*\/(.*)$/)[1])) && (info.target.src && $window.XMLHttpRequest))) {
        
          /** @type {XMLHttpRequest} */
          var http = new XMLHttpRequest;
        
          /** @type {boolean} */
          http.Fundebug = true;
          http.open("HEAD", info.target.src);
          http.send();
        
          /**
           * @param {Event} e
           * @return {undefined}
           */
          http.onload = function(e) {
            if (200 !== e.target.status) {
              info.target.status = e.target.status;
              info.target.statusText = e.target.statusText;
            }
            eventFilter(info);
          };
        }
      }
    }, true);
  }

  /** @type {Array} */
  var arr = [];
  if ($window.addEventListener) {
    $window.addEventListener("click", handler, true);
  } else {
    document.attachEvent("onclick", handler);
  }
  var data = {
    url : $window.location.href
  };
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
      data = {
        url : $window.location.href,
        title : document.title
      };
    });
  } else {
    document.attachEvent("onreadystatechange", function() {
      data = {
        url : $window.location.href,
        title : document.title
      };
    });
  }

  /** @type {function (): ?} */
  var matcherFunction = $window.onpopstate;

  /**
   * @return {?}
   */
  $window.onpopstate = function() {
    var settings = {
      url : $window.location.href
    };
    if (data.title || (data.title = document.title), data.url !== settings.url && extend(data, settings), matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
  };

  /** @type {function (): ?} */
  var __method = $window.history.pushState;

  /**
   * @return {?}
   */
  $window.history.pushState = function() {
    data = {
      url : $window.location.href,
      title : document.title
    };
    var settings = {};
    if (3 === arguments.length && (settings.url = arguments[2]), data.url !== settings.url && extend(data, settings), __method) {
      return __method.apply(this, arguments);
    }
  };
  var old = $window.onhashchange;
  if ($window.onhashchange = function() {
    var params = {
      url : $window.location.href,
      title : document.title
    };
    if (data.url !== params.url && extend(data, params), old) {
      return old.apply(this, arguments);
    }
  }, $window.XMLHttpRequest) {
    var xhrRequest = XMLHttpRequest.prototype;
    if (!xhrRequest) {
      return;
    }
    var method;
    var url;
  
    /** @type {function (this:XMLHttpRequest, string, string, (boolean|null)=, (null|string)=, (null|string)=): undefined} */
    var xhrOpen = xhrRequest.open;
  
    /** @type {function (this:XMLHttpRequest, (ArrayBuffer|ArrayBufferView|Blob|Document|FormData|null|string)=): undefined} */
    var xhrSend = xhrRequest.send;
  
    /**
     * @param {string} method
     * @param {?} url
     * @return {?}
     */
    xhrRequest.open = function(method, url) {
      return method = method, url = url, xhrOpen.apply(this, arguments);
    };
  
    /**
     * @return {?}
     */
    xhrRequest.send = function() {
      var xhr = this;
    
      /**
       * @param {?} er
       * @return {undefined}
       */
      xhr.onerror = function(er) {
      };
    
      /** @type {function (): undefined} */
      var matcherFunction = xhr.onreadystatechange;
      return xhr.onreadystatechange = function() {
        if (4 === xhr.readyState && !xhr.Fundebug) {
          var data = {
            type : "XMLHttpRequest",
            page : {
              url : $window.location.href
            },
            detail : {
              method : method,
              url : xhr.responseURL || url,
              status : xhr.status,
              statusText : xhr.statusText
            },
            time : (new Date).getTime()
          };
          if (!errend.silentHttp && 2 !== parseInt(xhr.status / 100)) {
            var req = {
              method : data.detail.method,
              url : data.detail.url
            };
            var error = {
              status : xhr.status,
              statusText : xhr.statusText,
              response : xhr.response
            };
            errend.notifyHttpError(req, error);
          }
          callback(data);
        }
        if (matcherFunction) {
          matcherFunction.apply(this, arguments);
        }
      }, xhrSend.apply(this, arguments);
    };
  }
  if ($window.fetch) {
    var _fetch = $window.fetch;
  
    /**
     * @param {?} pool
     * @param {Object} method
     * @return {?}
     */
    $window.fetch = function(pool, method) {
      return _fetch.apply(this, arguments).then(function(req) {
        var data = {
          type : "fetch",
          page : {
            url : $window.location.href,
            title : document.title
          },
          detail : {
            method : method && method.method || "GET",
            url : req.url,
            status : req.status,
            statusText : req.statusText
          },
          time : (new Date).getTime()
        };
        if (!errend.silentHttp && 2 !== parseInt(req.status / 100)) {
          var request = {
            method : data.detail.method,
            url : data.detail.url
          };
          var error = {
            status : req.status,
            statusText : req.statusText
          };
          errend.notifyHttpError(request, error);
        }
        return callback(data), req;
      });
    };
  }

  /** @type {boolean} */
  var isDefine = "function" == typeof define;
  var isModule = "undefined" != typeof module && module.exports;
  if (isDefine) {
    define(errend);
  } else {
    if (isModule) {
      module.exports = errend;
    }
  }
}(window);
