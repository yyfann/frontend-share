import axios from "axios";
import Vue from 'vue'

// -------------- 定位到元素 --------------
// -------------- 打开编辑器的函数
function launchEditor(filePath) {
  if (!filePath) return

  console.log(filePath, 'filePath')

  const devServerPort = 8700

  axios
    .get(`http://localhost:${devServerPort}/code`, {
      params: {
        filePath: `-g ${filePath}`
      }
    })
}

// 点击元素打开源码 (定位到行列)
function openSourceCode(e) {
  if (e.ctrlKey) {
    console.log(e.target, 'e.target')

    e.preventDefault()
    // 找到标签
    let targetTag = e.target

    // 跳转源码
    const filePath = targetTag.getAttribute('source-code-location')
    launchEditor(filePath)
  }
}

document.addEventListener('click', openSourceCode)

// // -------------- 定位到组件 --------------
// function launchEditor(filePath) {
//   if (!filePath) return
//   const devServerPort = 8700

//   axios
//     .get(`http://localhost:${devServerPort}/code`, {
//       params: {
//         filePath: `-g ${filePath}`
//       }
//     })
// }
// const openComponentPlugin = {
//   install(Vue) {
//     Vue.mixin({
//       mounted() {
//         this.__injectedFn = (e) => {
//           if (e.altKey) {
//             e.preventDefault()
//             let filePath = this.$options.__file

//             if (filePath) {
//               e.stopPropagation()
//               launchEditor(filePath)
//             }
//           }
//         }
//         this.$el.addEventListener('click', this.__injectedFn)
//       },


//       destroyed() {
//         // --------------  
//         this.$el.removeEventListener('click', this.__injectedFn)
//       }
//     });
//   }
// };
// Vue.use(openComponentPlugin);

