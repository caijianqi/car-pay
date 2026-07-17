<template>
  <div class="carts-list">
    <div class="flex-between">
      <span>入场时间</span>
      <span class="carts-price">{{ order.time || '--' }}</span>
    </div>
    <div class="flex-between">
      <span>停车时长</span>
      <span class="carts-price">{{ order.hoursec || '--' }}</span>
    </div>
    <div class="flex-between">
      <span>停车费用</span>
      <span class="carts-price price">{{ order.price }}元</span>
    </div>
    <div class="flex-between">
      <span>停车场地</span>
      <span class="carts-price">{{ order.company || '--' }}</span>
    </div>
  </div>
</template>

<script setup>
// 订单信息展示
defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>
