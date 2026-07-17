<template>
  <div class="keyboard-mask" @click="onClose"></div>
  <div class="key">
    <div class="key-title">
      <span>请输入您的车牌</span>
      <button @click="onClose">关闭</button>
    </div>

    <!-- 省份键盘 -->
    <template v-if="mode === 'province'">
      <div v-for="(row, r) in provinceRows" :key="'p' + r" class="key-center">
        <button
          v-for="key in row"
          :key="key"
          class="bt"
          @click="onProvince(key)"
        >
          {{ key }}
        </button>
      </div>
      <div class="key-center">
        <button class="bt special delete" @click="onDelete">删</button>
      </div>
    </template>

    <!-- 字母数字键盘 -->
    <template v-else>
      <div v-for="(row, r) in alphanumRows" :key="'a' + r" class="key-center">
        <button
          v-for="key in row"
          :key="key"
          class="bt1"
          @click="onAlphanum(key)"
        >
          {{ key }}
        </button>
      </div>
      <div class="key-center">
        <button class="bt1 special delete" @click="onDelete">删</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  PROVINCE_ROWS as provinceRows,
  ALPHANUM_ROWS as alphanumRows
} from '../constants/plate'

const props = defineProps({
  mode: {
    type: String,
    default: 'province' // 'province' | 'alphanumeric'
  },
  plate: {
    type: Object,
    required: true
  }
})

// 通过 props.plate 访问，避免解构丢失响应性
const onProvince = (key) => props.plate.selectProvince(key)
const onAlphanum = (key) => props.plate.selectAlphanum(key)
const onDelete = () => props.plate.deleteChar()
const onClose = () => props.plate.closeKeyboard()
</script>
