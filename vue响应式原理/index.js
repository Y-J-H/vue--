function observe(value, cb) {
  let that = this
  Object.keys(value).forEach((key) => {
    defineReactive.call(that, value, key, value[key], cb)
  })
}

function defineReactive(obj, key, val, cb) {
  let that = this
  let tempVal = val
  console.log(tempVal)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      return tempVal
    },
    set: (newVal) => {
      // console.log(newVal)
      // console.log(val)
      // console.log(that);
      // obj.text = newVal    这种操作会造成栈溢出
      tempVal = newVal
      // console.log(obj)
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
        get: function () {
          return that._data[key]
        },
        set: function (val) {
          that._data[key] = val;         // 这里我理解为并没有赋上值,仅仅是触发了set方法
        }
      })
    })
  }
}

window.Vue = Vue