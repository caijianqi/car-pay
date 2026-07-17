// 4 位随机码（密码）输入逻辑
import { reactive } from 'vue'

export function usePassword() {
  const digits = reactive(['', '', '', ''])

  // n 为数字；99 表示删除
  function setNum(n) {
    if (n === 99) {
      if (digits[3] !== '') digits[3] = ''
      else if (digits[2] !== '') digits[2] = ''
      else if (digits[1] !== '') digits[1] = ''
      else if (digits[0] !== '') digits[0] = ''
      return
    }
    if (digits[0] === '') digits[0] = n
    else if (digits[1] === '') digits[1] = n
    else if (digits[2] === '') digits[2] = n
    else if (digits[3] === '') digits[3] = n
  }

  function getNumberStr() {
    return digits.map(String).join('')
  }

  function isComplete() {
    return digits.every((d) => d !== '')
  }

  function reset() {
    digits[0] = ''
    digits[1] = ''
    digits[2] = ''
    digits[3] = ''
  }

  return { digits, setNum, getNumberStr, isComplete, reset }
}
