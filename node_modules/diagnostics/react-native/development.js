var create = require('../diagnostics');

/**
 * Create a new diagnostics logger.
 *
 * @param {String} namespace The namespace it should enable.
 * @param {Object} options Additional options.
 * @returns {Function} The logger.
 * @public
 */
var diagnostics = create(function dev(namespace, options) {
  options = options || {};
  options.namespace = namespace;
  options.prod = false;
  options.dev = true;

  //
  // The order of operation is important here, as both yep and nope introduce
  // items to the `options` object, we want `nope` to be last so it sets
  // the debugger as disabled initially until the adapters are resolved.
  //
  const yep = dev.yep(options);
  const nope = dev.nope(options);
  let resolved = false;
  const queue = [];

  dev.enabled(namespace).then(function pinkypromised(enabled) {
    var disabled = !enabled && !(options.force || diagnostics.force);
    resolved = true;

    //
    // Correctly process the options and enabled state of the logger to
    // ensure that all functions such as loggers also see the correct state
    // of the logger.
    //
    options.enabled = diagnostics.enabled = !disabled;

    if (options.enabled) queue.forEach(function process(messages) {
      yep.apply(yep, messages);
    });

    queue.lenght = 0;
  });

  /**
   * Unlike browser and node, we return the same function when it's enabled
   * or disabled. This is because the adapters are resolved async in development
   * mode because we use AsyncStorage. This means that at the time of
   * creation we don't know yet if the logger can be used.
   *
   * @private
   */
  function diagnostics() {
    if (!resolved) return queue.push(Array.prototype.slice.call(arguments, 0));
    if (!diagnostics.enabled) return nope.apply(nope, arguments);

    return yep.apply(yep, arguments);
  }

  return dev.introduce(diagnostics, options);
});

//
// Configure the logger for the given environment.
//
diagnostics.modify(require('../modifiers/namespace'));
diagnostics.use(require('../adapters/asyncstorage'));
diagnostics.set(require('../logger/console'));

//
// Expose the diagnostics logger.
//
module.exports = diagnostics;
