function Vue(options) {
  this.$options = options || {};
  var data = this._data = this.$options.data;
  var that = this;

  Object.keys(data).forEach(function(key) {
    that._proxyData(key);
  });

  this._initComputed();
  observe(data, this);
  this.$compile = new Compile(options.el || document.body, this)
}

Vue.prototype = {
  $watch: function(key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxyData: function(key, setter, getter) {
    var that = this;
    setter = setter || 
    Object.defineProperty(that, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return that._data[key]
      },
      set: function proxySetter(newVal) {
        that._data[key] = newVal;
      }
    });
  },

  _initComputed: function() {
    var that = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function(key) {
        Object.defineProperty(that, key, {
          get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
          set: function() {

          }
        });
      });
    }
  }
}

// function observe(value, vm) {
//   if (!value || typeof value !== 'object') {
//     return;
//   }
//   return new Observe(value);
// }