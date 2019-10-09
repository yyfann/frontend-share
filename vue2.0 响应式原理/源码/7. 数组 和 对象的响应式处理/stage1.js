// -------------- 递归观测数组和对象 --------------
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach((sub) => {
      // 这里改成了调用update方法 ~
      sub.update()
    })
  }
}

class Watcher {
  constructor(vm, renderFn) {
    this.vm = vm;
    this.getter = renderFn;
    this.get();
  }

  get() {
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }

  update() {
    this.get();
  }
}


function defineReactive(obj, key, val) {
  const dep = new Dep();

  // 递归观测
  observe(val)

  Object.defineProperty(obj, key, {
    get: function () {
      const watcher = Dep.target
      if (watcher) {
        dep.addSub(watcher)
      }
      return val
    },
    set: function (newVal) {
      val = newVal;
      dep.notify()
    }
  })
}

function observe(value) {
  if (typeof value !== 'object') return

  for (const key in value) {
    defineReactive(value, key, value[key])
  }
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
    // console.log('更新视图啦!')
    this.$el.innerHTML = `
    <div>${this.$data.name}</div>
    <div>${this.$data.list[0]}</div>
    <div>${this.$data.obj.label}</div>
    <div>${this.$data.age}</div>
  `
  }
}

const vm = new Vue({
  el: '#app',
  data: {
    name: 'yyf',
    age: 18,
    list: [11, 22, 33],
    obj: { label: 'aa' },
    money: 1000,
  }
})

vm.mount('#app')

setTimeout(() => {
  vm.$data.name = 'lijian'
  vm.$data.list[0] = 44
  vm.$data.obj.label = 'bb'
  // vm.$data.list = [44,55]
  // vm.$data.money = 2000
}, 800);

// -------------- 存在问题 --------------
// vue中并不监听数组的元素改变