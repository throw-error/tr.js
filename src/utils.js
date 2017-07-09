'use strict';

function isObject(what) {
    return typeof what === 'object' && what !== null;
}

// 是否为错误
function isError(value) {
  switch ({}.toString.call(value)) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return value instanceof Error;
  }
}

// 回调容器包装
function wrappedCallback(callback) {
    function dataCallback(data, original) {
      const normalizedData = callback(data) || data;
      if (original) {
          return original(normalizedData) || normalizedData;
      }
      return normalizedData;
    }

    return dataCallback;
}

module.exports = {
    isObject: isObject,
    isError: isError,
    wrappedCallback: wrappedCallback
};
