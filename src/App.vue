<template>
  <TopBanner :merchant-name="merchant.merchantName" />

  <div class="container">
    <div class="carts">
      <LicensePlateInput :plate="plate" />
      <ParkingInfo v-if="orderVisible" :order="order" />
    </div>

    <ProcessFlow />
    <NoticeBoard />

    <ActionBar
      v-if="!expired"
      :query-done="queryDone"
      :loading="loading"
      @query="parking.query"
      @reset="onReset"
      @pay="parking.pay"
    />
  </div>

  <!-- 车牌自定义键盘 -->
  <PlateKeyboard
    v-if="keyboardVisible"
    :mode="keyboardMode"
    :plate="plate"
  />

  <!-- 商户随机码弹窗 -->
  <PasswordModal
    v-if="showPasswordModal"
    @verify="onVerify"
    @cancel="onCancel"
  />

  <!-- 全局提示 -->
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import TopBanner from './components/TopBanner.vue'
import LicensePlateInput from './components/LicensePlateInput.vue'
import ParkingInfo from './components/ParkingInfo.vue'
import ProcessFlow from './components/ProcessFlow.vue'
import NoticeBoard from './components/NoticeBoard.vue'
import ActionBar from './components/ActionBar.vue'
import PlateKeyboard from './components/PlateKeyboard.vue'
import PasswordModal from './components/PasswordModal.vue'
import Toast from './components/Toast.vue'
import { useMessage } from './composables/useMessage'
import { useLicensePlate } from './composables/useLicensePlate'
import { useParking } from './composables/useParking'
import { getMerchantConfig } from './utils'

// 商户配置（原页面隐藏域：merchantid / merchant / span）
const merchant = getMerchantConfig()
const expired = merchant.span === 2 // 二维码超时

const message = useMessage()
const plate = useLicensePlate(message)
const parking = useParking({ plate, message, merchant })

// 解构出模板需要的响应式状态（顶层 ref 在模板中自动解包）
const { keyboardVisible, keyboardMode } = plate
const { order, orderVisible, queryDone, showPasswordModal, loading } = parking
const { showMessage } = message

function onVerify(numberStr) {
  parking.verifyPassword(numberStr)
}

function onCancel() {
  // 取消密码输入：关闭弹窗并回到查询前状态（保留已输入车牌）
  parking.showPasswordModal.value = false
  parking.queryDone.value = false
  parking.orderVisible.value = false
}

function onReset() {
  parking.resetQuery()
}

onMounted(() => {
  if (expired) {
    showMessage('二维码已经超时，无法使用')
  }

  // 禁止双击放大 / 手势缩放（沿用原页面行为）
  let lastTouchEnd = 0
  document.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length > 1) event.preventDefault()
    },
    { passive: false }
  )
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) event.preventDefault()
      lastTouchEnd = now
    },
    { passive: false }
  )
  document.addEventListener(
    'gesturestart',
    (event) => event.preventDefault(),
    { passive: false }
  )
  document.addEventListener(
    'dblclick',
    (event) => event.preventDefault(),
    { passive: false }
  )
})
</script>
