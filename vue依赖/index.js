function observe(value, cb) {
  let that = this
  Object.keys(value).forEach((key) => {
    defineReactive.call(that, value, key, value[key], cb)
  })
}

function defineReactive(obj, key, val, cb) {
  let that = this
  /* 在闭包内存储一个Dep对象 */
  const dep = new Dep();
  let tempVal = val

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return tempVal
    },
    set: (newVal) => {
      // cb.call(that)
      /* 只有之前addSub中的函数才会触发 */
      console.log(newVal)
      dep.notify();
      tempVal = newVal
    }
  })
}

class Vue {
  constructor(options) {
    this._data = options.data
    // 为每个数据添加上get和set方法
    observe.call(this, this._data, options.render)
    // observe(this._data, options.render)
    // 利用代理proxy将data数据绑定到了this实例上, 当改变app.text时从而触发this._data.text改变
    this._proxy(options.data)
    // 收集依赖
    let watcher = new Watcher(this, '', options.render, options);
  }
  _proxy(data) {
    const that = this;
    Object.keys(data).forEach(key => {
      Object.defineProperty(that, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return that._data[key]
        },
        set: function proxySetter (val) {
          console.log(val);
          
          that._data[key] = val;
        }
      })
    })
  }
}

class Dep {
  constructor () {
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i ++) {
      subs[i].update()
    }
  }
}

class Watcher {
  constructor (vm, expOrFn, cb, options) {
    this.cb = cb;
    this.vm = vm;

    Dep.target = this;
    this.cb.call(this.vm);
  }
  update () {
    // console.log(this.vm);
    this.cb.call(this.vm);
  }
}


window.Vue = Vue