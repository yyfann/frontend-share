// -------------- 最简核心原理 --------------

// 我们的数据
const data = {
  name: 'yyf',
}

// dom元素
let app = null

// 监听数据改变修改页面
let val = data.name
Object.defineProperty(data, 'name', {
  get: function () {
    return val
  },
  set: function (newVal) {
    val = newVal;
    app.innerHTML = val
  }
})

app = document.getElementById('app')
// 初始化数据到页面
app.innerHTML = data.name


setTimeout(() => {
  data.name = 'lijian'
}, 800);


// -------------- 存在问题 --------------
// 1 不支持多数据
