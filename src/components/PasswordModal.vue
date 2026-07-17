<template>
  <div class="merchant-modal">
    <div class="merchant-modal-box">
      <div class="merchant-modal-title">请输入密码</div>
      <div class="ppay-input">
        <input
          v-for="i in 4"
          :key="i"
          type="text"
          readonly
          :value="digits[i - 1]"
        />
      </div>
      <div class="flex-between btn-box">
        <button class="flex-center btn btn-green" @click="cancel">取消</button>
        <button class="flex-center btn btn-blue" @click="confirm">确定</button>
      </div>
    </div>

    <!-- 数字键盘 -->
    <div class="num-pad">
      <div class="pad-title">请输入密码</div>
      <div class="pad-grid">
        <button @click="setNum(1)">1</button>
        <button @click="setNum(2)">2</button>
        <button @click="setNum(3)">3</button>
        <button @click="setNum(4)">4</button>
        <button @click="setNum(5)">5</button>
        <button @click="setNum(6)">6</button>
        <button @click="setNum(7)">7</button>
        <button @click="setNum(8)">8</button>
        <button @click="setNum(9)">9</button>
        <button class="delete" @click="setNum(99)">删</button>
        <button @click="setNum(0)">0</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePassword } from '../composables/usePassword'
import { useMessage } from '../composables/useMessage'

const emit = defineEmits(['verify', 'cancel'])

const { digits, setNum, getNumberStr, isComplete, reset } = usePassword()
const { showMessage } = useMessage()

function confirm() {
  if (!isComplete()) {
    showMessage('请输入完整的4位密码')
    return
  }
  emit('verify', getNumberStr())
  reset()
}

function cancel() {
  reset()
  emit('cancel')
}
</script>
