<template>
  <!-- 查询前：仅显示查询按钮 -->
  <div v-if="!queryDone" class="flex-between btn-box">
    <button
      class="flex-center btn btn-green"
      :class="{ 'btn-gray': loading }"
      :disabled="loading"
      @click="$emit('query')"
    >
      {{ loading ? '查询中...' : '查询停车费' }}
    </button>
  </div>

  <!-- 查询后：重置 + 确认支付 -->
  <div v-else class="flex-between btn-box">
    <button class="flex-center btn btn-green" @click="$emit('reset')">重置查询</button>
    <button
      class="flex-center btn btn-blue"
      :class="{ 'btn-gray': loading }"
      :disabled="loading"
      @click="$emit('pay')"
    >
      {{ loading ? '支付中...' : '确认支付' }}
    </button>
  </div>
</template>

<script setup>
// 底部按钮区，根据查询状态切换
defineProps({
  queryDone: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['query', 'reset', 'pay'])
</script>
