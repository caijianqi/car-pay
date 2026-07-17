// 停车缴费 API 服务
// 原页面通过相对路径调用后端接口（jQuery $.ajax，默认表单编码）。
// 这里使用 fetch + URLSearchParams 保持相同的请求格式。
// 开发环境通过 vite.config.js 中的 proxy 转发到真实后端。

const BASE_URL = import.meta.env.VITE_API_BASE || ''

/**
 * 以表单编码方式发起 POST 请求
 * @param {string} url 接口路径
 * @param {Record<string, any>} data 请求参数
 * @returns {Promise<any>} 响应 JSON
 */
function post(url, data = {}) {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    params.append(key, data[key] === undefined || data[key] === null ? '' : String(data[key]))
  })
  return fetch(BASE_URL + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  }).then((res) => res.json())
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
