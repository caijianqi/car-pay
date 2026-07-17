// 省份键盘布局（按行分组）
export const PROVINCE_ROWS = [
  ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀', '豫'],
  ['川', '渝', '辽', '吉', '黑', '皖', '鄂', '津', '贵'],
  ['云', '桂', '琼', '青', '新', '藏', '蒙', '宁'],
  ['甘', '陕', '闽', '赣', '湘', '使']
]

// 字母数字键盘布局（按行分组）
export const ALPHANUM_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
  ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
  ['W', 'X', 'Y', 'Z', '港', '澳', '学', '警', '领']
]

// 默认省份（原页面 txt1 默认值 "闽"）
export const DEFAULT_PROVINCE = '闽'

// 普通车牌长度 7 位，新能源 8 位
export const NORMAL_PLATE_LEN = 7
export const ENERGY_PLATE_LEN = 8

// 二维码状态：2 表示已超时
export const SPAN_EXPIRED = 2
