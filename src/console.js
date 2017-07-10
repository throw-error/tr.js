const wrapMethod = function(console, level, callback) {
  const originalConsoleLevel = console[level];
  const originalConsole = console;

  if (!(level in console)) {
    return;
  }

  const sentryLevel = level === 'warn' ? 'warning' : level;


  console[level] = function () {
    const args = [].slice.call(arguments);
    const msg = '' + args.join(' ');
    const data = {level: sentryLevel, logger: 'console', extra: {'arguments': args}};
    callback && callback(msg, data);

    // this fails for some browsers. :(
    if (originalConsoleLevel) {
      // IE9 doesn't allow calling apply on console functions directly
      // See: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
      Function.prototype.apply.call(originalConsoleLevel, originalConsole, args);
    }
  };
};

module.exports = {
  wrapMethod: wrapMethod
};
