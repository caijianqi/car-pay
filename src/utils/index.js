// URL 查询参数解析（替代原 GetQueryString）
export function getQueryParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

// 读取商户配置：优先 URL 参数，缺省回退到原页面隐藏域中的默认值
export function getMerchantConfig() {
  return {
    merchantId: getQueryParam('merchantid') || '01c3f3b471dd4867b03873e80e8fafb2',
    merchantName: getQueryParam('merchant') || '亚朵酒店',
    span: Number(getQueryParam('span') || '0')
  }
}

// 判断字符串是否为单个字母（用于车牌第二位校验）
export function isLetter(ch) {
  return /^[A-Za-z]$/.test(ch)
}
