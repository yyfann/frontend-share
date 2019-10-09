// -------------- 响应式原理 --------------
const data = {
  name: 'yyf',
}

let val = data.name
Object.defineProperty(data, 'name', {
  get: function () {
    console.log('get')
    return val
  },
  set: function (newVal) {
    console.log('set')
    val = newVal;
  }
})

data.name

data.name = 'lijian'
