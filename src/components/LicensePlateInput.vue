<template>
  <div class="carts-enter">
    <div class="ppay-input">
      <input
        v-for="i in 7"
        :key="i"
        type="text"
        readonly
        :class="{ active: activeIndex === i - 1 }"
        :value="chars[i - 1]"
        @click="focusInput(i - 1)"
      />
      <input
        v-show="isEnergy"
        type="text"
        readonly
        class="energy"
        :class="{ active: activeIndex === 7 }"
        :value="chars[7]"
        @click="focusInput(7)"
      />
    </div>
    <div class="login-checkbox" @click="toggleEnergy">
      <span class="checkbox-icon" :class="{ checked: isEnergy }"></span>
      <div>新能源汽车</div>
    </div>
  </div>
</template>

<script setup>
// 车牌输入框 + 新能源切换
// plate 为 useLicensePlate 返回的组合式对象
const props = defineProps({
  plate: {
    type: Object,
    required: true
  }
})

// 解构出模板需要的状态与方法（顶层 ref/computed 在模板中自动解包）
const {
  chars,
  isEnergy,
  activeIndex,
  focusInput,
  toggleEnergy
} = props.plate
</script>
