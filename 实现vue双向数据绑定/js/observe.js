// (function() {
  // var data = { name: 'kindeng' };
  // Observe(data);
  // data.name = 'dmq';

  function Observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    this.data = data;
    this.walk(data);
  
    // Object.keys(data).forEach(function(key) {
    //   defineReactive(data, key, data[key]);
    // })
  }

  Observe.prototype = {
    walk: function(data) {
      var that = this;
      Object.keys(data).forEach(function(key) {
        that.convert(key, data[key])
      });
    },
    convert: function(key, val) {
      this.defineReactive(this.data, key, val)
    },
    defineReactive: function(data, key, val) {
      var dep = new Dep();
      var tempObj = observe(val);

      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
          if (Dep.target) {
            dep.depend();
          }
          return val;
        },
        set: function(newVal) {
          if (newVal === val) {
            return;
          }
          val = newVal;
          tempObj = observe(newVal);
          // 通知订阅者
          dep.notify();
        }
      })
    }
  };

  function observe(value, vm) {
    if (!value || typeof value !== 'object') {
      return;
    }
    return new Observe(value);
  }

  var uid = 0;

  function Dep() {
    this.id = uid++;
    this.subs = [];
  }

  Dep.prototype = {
    addSub: function(sub) {
      this.subs.push(sub);
    },
    depend: function() {
      Dep.target.addDep(this);
    },
    removeSub: function(sub) {
      var index = this.subs.indexOf(sub);
      if (index != -1) {
        this.subs.splice(index, 1);
      }
    },
    notify: function() {
      this.subs.forEach(function(sub) {
        sub.update();
      })
    }
  }

  Dep.target = null;
// })()