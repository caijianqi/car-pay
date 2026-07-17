<template>
  <div class="banner">
    <div class="banner-icon">P</div>
    <div class="banner-title">停车缴费</div>
    <div class="banner-sub">{{ merchantName }} · 便捷代付</div>
  </div>
</template>

<script setup>
// 顶部 banner，替代原页面静态图片 shdf.png
defineProps({
  merchantName: {
    type: String,
    default: ''
  }
})
</script>
