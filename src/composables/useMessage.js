// 全局消息提示（替代原页面重写的 window.alert）
// 提供一个共享的响应式消息队列与显示/隐藏控制。

import { reactive } from 'vue'

const state = reactive({
  visible: false,
  text: '',
  timer: null
})

function showMessage(text, duration = 2000) {
  state.text = text
  state.visible = true
  if (state.timer) clearTimeout(state.timer)
  state.timer = setTimeout(() => {
    state.visible = false
  }, duration)
}

export function useMessage() {
  return { message: state, showMessage }
}
