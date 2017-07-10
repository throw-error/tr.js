
// console = null;

// 核心库
// const EError = require('./error');
const Console = require('./console.bak');
// const EPerformance = require('./performance');


// Console.wrapMethod(console, 'log', data => {
//   console.log(data);
// })
const a = new Console()
console.log(a);

// console.log(Console.wrapMethod);

// 兼容宿主环境
const _window = typeof window !== 'undefined' ? window
            : typeof global !== 'undefined' ? global
            : typeof self !== 'undefined' ? self
            : {};

/*
class Errend {

  constructor(options) {
    // console.log('实例化Errend', options);
    this._init(options);
  }

  _init(options) {
    // this.error = new EError();
    // this.console = new Console();
    // this.performance = new EPerformance();
    window.errend = this;
  }

  install(options) {
    window.errend = null;
    window.errend = new Errend(options);
  }
}

// console.log('i am index.js');
// console.log(new Errend());

_window.Errend = _window.Errend || Errend;
*/
module.exports = {};
