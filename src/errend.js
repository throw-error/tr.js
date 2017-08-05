
// polyfill & shim
require('es5-shim');
require('es6-promise').polyfill();

// common lib
let config = require('./config');
let Service = require('./utils/service');

// es6 module
config = config.default || config;
Service = Service.default || Service;

// network service
const service = new Service({
  api: config.api
});

// console.log('config', config, 'service', service);

// 核心库
// const Errorjs = require('./error');
const Consolejs = require('./console');
// const Performancejs = require('./performance');

const consolejs = new Consolejs({
  // disabled: true,
  levels: ['log', 'error', 'warn'],
  callback(stackLog) {
    // console.info('发送回调信息给服务端', stackLog);
    service.sendLog(stackLog).then(res => {
      // console.info('日志发送成功', res);
    }).catch(err => {
      console.debug('日志发送失败', err);
    })
  }
})

// console.log('consolejs', window.console.log);

// consolejs.enable();

// console.log('consolejs', window.console.log);

// consolejs.disable();

consolejs.setExtra({ user: 'surmon' });

// console.log('test1');

// consolejs.enable();

// console.log('console test log');

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
    // this.console = new Consolejs();
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
