// -------------- 确保页面挂载才执行后续逻辑: watcher版本 --------------

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

/**
 * 首次实例化, 和后续更新时, 都需要设置Dep.target = this, 好可以添加进数据的dep
 * 同时使用后要及时清空Dep.target 避免全局污染
 */
class Watcher {
  constructor(renderFn) {
    this.getter = renderFn;
    this.get();
  }

  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }

  update() {
    this.get();
  }
}

// 数据
const data = {
  name: 'yyf',
  age: 18,
  money: 1000,
}

// dom元素
let app = null

// 根据最新数据渲染dom
let setDom = function () {
  console.log('setDom')
  app.innerHTML = `
    <div>${data.name}</div>
    <div>${data.age}</div>
  `
}

// 监听数据改变修改页面
for (const key in data) {
  defineReactive(data, key, data[key])
}
function defineReactive(obj, key, val) {
  const dep = new Dep();

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

// 数据和页面关联(挂载)
function mount(selector) {
  app = document.querySelector(selector)
  new Watcher(setDom)
}
mount('#app')


setTimeout(() => {
  // 没有mount的时候, 即使对数据有读取, 也不会给其添加setDom
  // console.log(data.name, 'data.name')
  data.name = 'lijian'

}, 800);

// -------------- 存在问题 --------------