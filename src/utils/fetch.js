
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
