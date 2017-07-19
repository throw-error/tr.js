'use strict';

// log请求器
function isError(value) {
  switch ({}.toString.call(value)) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return value instanceof Error;
  }
}


module.exports = {
    isObject: isObject,
    isError: isError,
    wrappedCallback: wrappedCallback
};
