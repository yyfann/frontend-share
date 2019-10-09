// -------------- 确保页面挂载才执行后续逻辑: low 版本 --------------

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach((sub) => {
      sub()
    })
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

let isMount = false

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
      if (isMount) {
        dep.addSub(setDom)
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
  isMount = true
  setDom()
}
mount('#app')


setTimeout(() => {
  // 没有mount的时候, 即使对数据有读取, 也不会给其添加setDom
  // console.log(data.name, 'data.name')
  data.name = 'lijian'

}, 800);

// -------------- 存在问题 --------------
// 1 添加了辅助变量太乱了