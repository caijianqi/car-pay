// 车牌输入逻辑：管理车牌字符、新能源切换、自定义键盘交互
import { reactive, ref, computed } from 'vue'
import {
  DEFAULT_PROVINCE,
  NORMAL_PLATE_LEN,
  ENERGY_PLATE_LEN
} from '../constants/plate'
import { isLetter } from '../utils'

export function useLicensePlate(message) {
  // 8 位字符数组，第 8 位仅新能源时使用；第 1 位默认省份
  const chars = reactive([DEFAULT_PROVINCE, '', '', '', '', '', '', ''])
  const isEnergy = ref(false)
  const activeIndex = ref(0)
  const keyboardVisible = ref(false)
  // 'province' 省份键盘 | 'alphanumeric' 字母数字键盘
  const keyboardMode = ref('province')

  const expectedLen = computed(() =>
    isEnergy.value ? ENERGY_PLATE_LEN : NORMAL_PLATE_LEN
  )

  const carNo = computed(() => chars.slice(0, expectedLen.value).join(''))

  const isValid = computed(
    () => carNo.value.length >= NORMAL_PLATE_LEN && isLetter(chars[1])
  )

  // 切换新能源
  function toggleEnergy() {
    isEnergy.value = !isEnergy.value
    if (!isEnergy.value) chars[7] = ''
  }

  // 点击某个输入框
  function focusInput(index) {
    activeIndex.value = index
    keyboardVisible.value = true
    if (index === 0 || chars[0] === '') {
      keyboardMode.value = 'province'
    } else {
      keyboardMode.value = 'alphanumeric'
    }
  }

  // 选择省份
  function selectProvince(key) {
    chars[0] = key
    // 选择新省份后清空后续位
    for (let i = 1; i < chars.length; i++) chars[i] = ''
    activeIndex.value = 1
    keyboardMode.value = 'alphanumeric'
  }

  // 选择字母/数字
  function selectAlphanum(key) {
    const idx = activeIndex.value
    chars[idx] = key
    // 第二位必须是字母
    if (idx === 1 && !isLetter(key)) {
      message.showMessage('车牌第二位必须是字母！')
      chars[1] = ''
      activeIndex.value = 1
      return
    }
    // 自动前进到下一位
    const last = expectedLen.value - 1
    if (idx < last) {
      activeIndex.value = idx + 1
    }
  }

  // 删除
  function deleteChar() {
    if (keyboardMode.value === 'province') {
      chars[0] = ''
      return
    }
    const idx = activeIndex.value
    if (chars[idx] !== '') {
      chars[idx] = ''
      return
    }
    if (idx > 0) {
      activeIndex.value = idx - 1
      if (activeIndex.value === 0) {
        // 回到省份位，切换为省份键盘（保留已选省份便于修改）
        keyboardMode.value = 'province'
      } else {
        chars[activeIndex.value] = ''
      }
    }
  }

  function closeKeyboard() {
    keyboardVisible.value = false
  }

  function reset() {
    for (let i = 0; i < chars.length; i++) chars[i] = ''
    chars[0] = DEFAULT_PROVINCE
    isEnergy.value = false
    activeIndex.value = 0
    keyboardVisible.value = false
    keyboardMode.value = 'province'
  }

  return {
    chars,
    isEnergy,
    activeIndex,
    keyboardVisible,
    keyboardMode,
    expectedLen,
    carNo,
    isValid,
    toggleEnergy,
    focusInput,
    selectProvince,
    selectAlphanum,
    deleteChar,
    closeKeyboard,
    reset
  }
}
