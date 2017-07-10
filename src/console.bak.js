
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

    // init or destroy
    if (this.options.disabled) {
      this.destroy();
    } else {
      this.init();
    }
  }

  init() {

    // window._console bak
    window._console = window._console || {}
    for (let key in window.console) {
      if (this.options.levels.includes(key)) {
        window._console[key] = window.console[key]
      }
    }

    // mock console
    this.mock();
  }

  mock() {
    this.options.levels.forEach(level => {
      console.log(level);
      window.console[level] = () => {
        const args = Array.prototype.slice.apply(arguments);
        const msg = args.join(' ');
        
        // todo
        // window._console[level]();
        Function.prototype.apply.call(window._console[level], window.console, args);
        // callback && callback(args);
      }
    })
  }

  destroy() {
    window.console = window._console || window.console;
  }

  get console() {
    return window._console
  }
}
  
module.exports = Console;
