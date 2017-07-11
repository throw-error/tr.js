
/*
* Console.js
*/

class Console {

  constructor(options = {}) {

    // default options
    if (!options.levels || !options.levels.length) {
      options.levels = ['log', 'info', 'warn', 'debug', 'error'];
    }

    // class options
    this.options = options;
    this.extra = {};

    // init or destroy
    if (this.options.disabled) {
      this.destroy();
    } else {
      this.init();
    }
  }

  init() {

    // window._console backup
    window._console = window._console || {}
    this.options.levels.forEach(level => {
      if (level in window.console) {
        window._console[level] = window.console[level];
      }
    })

    // mock console
    this.mock();
  }

  mock() {
    const _this = this;
    this.options.levels.forEach(level => {
      window.console[level] = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        Function.prototype.apply.call(window._console[level], window.console, arguments);

        // 防止无限递归，在回调函数中找到相关语句并不执行
        if (_this.options.callback) {
          const levelReg = `console.${level}`;
          const cbFunString = Function.prototype.toString.call(_this.options.callback);
          if (cbFunString.includes(levelReg)) {

            // 不应该修改用户信息
            // cbFunString = cbFunString.replace(levelReg, `// ${levelReg}`);
            // console.info('递归', cbFunString);
          } else {
            _this.options.callback({
              level,
              message,
              arguments: args,
              extra: _this.extra
            });
          }
        }
      }
    })
  }

  destroy() {
    if (window._console && this.options.levels.length) {
      this.options.levels.forEach(level => {
        if (level in window._console) {
          window.console[level] = window._console[level];
        }
      })
    }
  }

  disable() {
    this.options.disabled = true;
    this.destroy();
  }

  enable() {
    this.options.disabled = false;
    this.init();
  }

  // 设置额外附带信息
  setExtra(extra) {
    const _this = this;
    _this.extra = Object.assign(_this.extra, extra);
  }

  get console() {
    return window._console
  }
}

  
module.exports = Console;
