// -------------- 可以支持多个数据, 多个html元素的使用 --------------

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
  // 这里val是一个局部变量
  Object.defineProperty(obj, key, {
    get: function () {
      return val
    },
    set: function (newVal) {
      val = newVal;
      setDom()
    }
  })
}

app = document.getElementById('app')
// 初始化数据到页面
setDom()

setTimeout(() => {
  data.name = 'lijian'

  // -------------- 存在问题 --------------
  // 1 修改页面没有用到的数据, 也会操作dom
  // data.money = 2000
}, 800);
