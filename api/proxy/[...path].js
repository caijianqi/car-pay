// Vercel Serverless Function 代理
// 作用：把前端同域请求（/api/proxy/viewredis/...、/api/proxy/merchantpay/...）
// 转发到 HTTP 后端 http://parking.yilufa.net:10889。
//
// 为什么需要它：
// Vercel 的 rewrites 直接反代「外部 HTTP 目标」会失败（ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR），
// 因为 Vercel Edge Network 只能连接 HTTPS 外部目标。而 serverless function 运行在完整
// Node.js 运行时，可自由发起 HTTP 请求，不受此限制。
//
// 路由：vercel.json 把 /viewredis/:path* 与 /merchantpay/:path* 重写到 /api/proxy/...，
// 由本 catch-all function 处理。

// 禁用 Vercel 自动解析 body，改为手动读取原始流，保证表单编码原样转发
export const config = {
  api: { bodyParser: false }
}

const BACKEND = 'http://parking.yilufa.net:10889'

export default async function handler(req, res) {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
    return
  }

  // req.url 形如 /api/proxy/viewredis/haveCoupon?xxx
  // 去掉 /api/proxy 前缀，得到 /viewredis/haveCoupon
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const path = reqUrl.pathname.replace(/^\/api\/proxy/, '')
  const target = BACKEND + path + (reqUrl.search || '')

  // 手动读取原始请求体
  let body
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    body = chunks.length ? Buffer.concat(chunks) : undefined
  }

  try {
    const resp = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded'
      },
      body
    })

    res.status(resp.status)
    const ct = resp.headers.get('content-type')
    if (ct) res.setHeader('Content-Type', ct)
    res.setHeader('Access-Control-Allow-Origin', '*')

    const text = await resp.text()
    res.send(text)
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', message: err.message })
  }
}
