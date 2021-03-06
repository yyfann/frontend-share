// -------------- util --------------
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}


class Dep {
  constructor() {
    this.watchers = [];
  }

  addSub(watcher) {
    const targetWatcher = this.watchers.find(_watcher => {
      return _watcher.id === watcher.id
    })
    if (!targetWatcher) this.watchers.push(watcher);
  }

  notify() {
    this.watchers.forEach((watcher) => {
      // 这里改成了调用update方法 ~
      watcher.update()
    })
  }
}


let watcherId = 0
class Watcher {
  constructor(vm, renderFn) {
    this.id = ++watcherId
    this.vm = vm;
    this.getter = renderFn;
    this.get();
  }

  get() {
    console.log(this.id,'this.id')
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }

  update() {
    queueWatcher(this)
  }
}


// -------------- 数组原型重写 --------------
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

methodsToPatch.forEach(function (method) {
  def(arrayMethods, method, function () {
    // 修改数组, 获取返回值
    var result = arrayProto[method].apply(this, arguments);
    // 用最新数据派发更新
    this.__ob__.dep.notify();
    return result
  });
});

// -------------- 观察数据 --------------
function observe(value) {
  // 观测一个对象/数组, 不是对象/数组就返回
  if (typeof value !== 'object') return
  return new Observer(value)
}

class Observer {
  constructor(value) {
    this.dep = new Dep();
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value);
    } else {
      this.observeObj(value);
    }
  }

  observeArray(items) {
    items.forEach((item) => {
      observe(item);
    })
  }

  observeObj(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function defineReactive(obj, key, val) {
  var dep = new Dep();
  const ob = observe(val)
  Object.defineProperty(obj, key, {
    get: function () {
      const watcher = Dep.target
      if (watcher) {
        // 收集key的dep
        dep.addSub(watcher)
        if (ob) {
          // 收集value的dep
          ob.dep.addSub(watcher)
        }
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify();
    }
  })
}


class Vue {
  constructor(options) {
    this.$options = options;

    this.initData();
  }

  initData() {
    this.$data = this.$options.data;
    observe(this.$data)
  }

  mount(el) {
    this.$el = document.querySelector(el)
    new Watcher(this, this.render)
  }

  render() {
    console.log('更新视图啦!')
    this.$el.innerHTML = `
    <div>${this.$data.obj.label}</div>
    <div>${this.$data.obj.label}</div>
    <div>${this.$data.obj.name}</div>
  `
  }
}

Vue.set = function (target, key, val) {
  // 处理数组
  if (Array.isArray(target)) {
    // 如果key是当前不存在的下标, 要通过设置length的方式填充empty
    target.length = Math.max(target.length, key)
    // 通过splice方法, 即设置了元素的值, 又触发了更新
    target.splice(key, 1, val)
    return val
  }

  // 处理对象
  // 将新属性设置为响应式
  defineReactive(target, key, val);
  // 触发observer下的dep, 
  // tip: 只要render函数中有 this.info的写法, this.info对应的__ob__就会收集依赖, 就可以派发更新
  //      不论this.info.age此时是否有值
  target.__ob__.dep.notify();
  return val
}

Vue.delete = function (target, key) {
  if (Array.isArray(target)) {  // 数组
    target.splice(key, 1)  // 移除指定下表
    return
  }

  delete target[key]  // 删除对象指定key

  target.__ob__.dep.notify()  // 手动派发更新
}

const vm = new Vue({
  el: '#app',
  data: {
    name: 'yyf',
    age: 18,
    list: [11,22,33],
    obj: {label: 'aa'},
    money: 1000,
  }
})

vm.mount('#app')








// -------------- 新增内容 --------------

// 要执行的一些函数
var callbacks = [];


// 保存watcher的数组
var queue = [];

// 将watcher添加进队列，并在下个事件循环执行队列内容
function queueWatcher(watcher) {
  const targetWatcher = queue.find(_watcher => {
    return _watcher.id === watcher.id
  })
  if (!targetWatcher) {
    queue.push(watcher);

    nextTick(flushSchedulerQueue);
  }
}

// 执行watcher队列的watcher
function flushSchedulerQueue() {
  queue.forEach((watcher) => {
    watcher.get()
  })
  queue = []
}

var p = Promise.resolve();

function nextTick(cb) {
  callbacks.push(cb);

  p.then(flushCallbacks);
}

// 执行所有回调
function flushCallbacks() {
  callbacks.forEach(cb => {
    cb()
  });
  callbacks = [];
}

setTimeout(() => {
  vm.$data.obj.label = 'bb'
  vm.$data.obj.name = 'yyf'
  vm.$data.obj.label = 'aa'
  // vm.$data.obj.label = 'cc'
}, 800);