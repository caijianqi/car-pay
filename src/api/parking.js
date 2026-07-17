// 停车缴费 API 服务
// 原页面通过相对路径调用后端接口（jQuery $.ajax，默认表单编码）。
// 这里使用 fetch + URLSearchParams 保持相同的请求格式。
//
// 部署说明：
// - 开发环境：BASE_URL 留空，请求走相对路径，由 vite.config.js 的 proxy 转发到真实后端。
// - 生产环境（部署到 GitHub Pages 等静态托管）：必须通过环境变量 VITE_API_BASE
//   配置真实后端地址（如 https://parking.yilufa.net:10889），否则请求会打到静态服务器，
//   返回 405 / HTML 错误页。
// - 注意：跨域调用后端时，后端必须开启 CORS（允许 github.io 域名），且需提供 HTTPS 入口
//   （GitHub Pages 是 HTTPS，调用 HTTP 后端会被浏览器作为"混合内容"拦截）。

const BASE_URL = import.meta.env.VITE_API_BASE || ''

/**
 * 以表单编码方式发起 POST 请求
 * @param {string} url 接口路径
 * @param {Record<string, any>} data 请求参数
 * @returns {Promise<any>} 响应 JSON
 */
async function post(url, data = {}) {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    params.append(key, data[key] === undefined || data[key] === null ? '' : String(data[key]))
  })

  let res
  try {
    res = await fetch(BASE_URL + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
  } catch (e) {
    // 网络错误 / CORS 被拦截 / 混合内容被拦截
    throw new Error('网络请求失败，请检查网络或后端地址')
  }

  const contentType = res.headers.get('content-type') || ''
  // 静态托管返回 HTML 错误页（405/404）时，避免 .json() 解析崩溃
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text().catch(() => '')
    throw new Error(`请求失败(${res.status})：${text.slice(0, 120)}`)
  }
  return res.json()
}

// 校验是否已领取优惠券（已领取则不能代付）
export function haveCoupon({ merchantid, carNum }) {
  return post('/viewredis/haveCoupon', { comid: '', merchantid, carNum })
}

// 查询停车费用
// 返回字段：wait_price（-1 商户不存在 / -2 未绑定停车场 / 其它为费用金额）、id、car_number、company、create_time、time
export function getMoney({ merchantid, carNumber }) {
  return post('/viewredis/getmoney', { comid: '', merchantid, car_number: carNumber })
}

// 查询商户是否需要弹窗输入密码（data >= 1 表示需要）
export function findMerPassword({ merchantid }) {
  return post('/merchantpay/findMerPassword', { merchantid })
}

// 校验商户随机码（密码）是否正确
export function findMerPassWordUser({ orderid, numberpass, merchantid }) {
  return post('/merchantpay/findMerPassWordUser', { orderid, numberpass, merchantid })
}

// 确认代付时间窗口
// data：2 余额不足 / 3 未绑定停车场 / 4 商户不存在 / 其它可继续代付
export function payConfirmTime({ timese, orderid, merchantid }) {
  return post('/merchantpay/payconfimtime', { timese, orderid, merchantid })
}

// 获取代付后免费离场时长（分钟）
export function getMerFreemin({ orderid, merchantid }) {
  return post('/merchantpay/getMerFreemin', { orderid, merchantid })
}
