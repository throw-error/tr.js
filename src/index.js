/**
 * Enforces a single instance of the Errend client, and the
 * main entry point for Errend. If you are a consumer of the
 * Errend library, you SHOULD load this file (vs raven.js).
 **/

// 核心库
// const ErrendConstructor = require('./error');

// 兼容宿主环境
const _window = typeof window !== 'undefined' ? window
            : typeof global !== 'undefined' ? global
            : typeof self !== 'undefined' ? self
            : {};

// const _Errend = _window.Errend;

const Errend = {}

console.log('i am index.js2');

/*
 * Allow multiple versions of Errend to be installed.
 * Strip Errend from the global context and returns the instance.
 *
 * @return {Errend}
 */
// Errend.noConflict = function () {
// 	_window.Errend = _Errend;
// 	return Errend;
// };

// Errend.afterLoad();

module.exports = Errend;
