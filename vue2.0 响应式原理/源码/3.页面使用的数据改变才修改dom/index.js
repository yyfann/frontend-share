// -------------- 页面使用的数据改变才修改dom --------------

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

// 我们的数据
const data = {
  name: 'yyf',
  age: 18,
  money: 1000,
}

// 控制的页面元素
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
      dep.addSub(setDom)
      return val
    },
    set: function (newVal) {
      val = newVal;
      dep.notify()
    }
  })
}


// 初始化数据到页面
app = document.getElementById('app')
setDom()

setTimeout(() => {
  data.name = 'lijian' // 修改dom
  // data.money = 2000 // 不修改dom

}, 800);

// -------------- 存在问题 --------------
// // 这个例子中, 数据和视图没任何关系, 但是修改数据还是尝试刷新视图了(报错)
// // app = document.getElementById('app')
// // setDom()

// console.log(data.name,'data.name')

// setTimeout(() => {
//   data.name = 'lijian'
// }, 800);
