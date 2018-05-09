function observe(value, cb) {
  let that = this
  Object.keys(value).forEach((key) => {
    defineReactive.call(that, value, key, value[key], cb)
  })
}

function defineReactive(obj, key, val, cb) {
  let that = this
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      // console.log('get方法');
      return val
    },
    set: () => {
      cb.call(that)
    }
  })
}

class Vue {
  constructor(options) {
    console.log(options);
    this._data = options.data
    // 为每个数据添加上get和set方法
    observe.call(this, this._data, options.render)
    // observe(this._data, options.render)
    // 利用代理proxy将data数据绑定到了this实例上, 当改变app.text时从而触发this._data.text改变
    this._proxy(options.data)
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
          console.log(that);
          
          that._data[key] = val;
        }
      })
    })
  }
}

window.Vue = Vue