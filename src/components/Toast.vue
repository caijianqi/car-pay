<template>
  <Transition name="toast">
    <div v-if="message.visible" class="toast-mask">
      <div class="toast-box">{{ message.text }}</div>
    </div>
  </Transition>
</template>

<script setup>
// 全局提示，替代原页面重写的 window.alert
import { useMessage } from '../composables/useMessage'

const { message } = useMessage()
</script>
