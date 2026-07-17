// 代理 function：把前端同域请求转发到 HTTP 后端
// 配合 vercel.json 的 rewrite 使用：
//   /viewredis/:path*  -> /api/proxy?target=/viewredis/:path*
//   /merchantpay/:path* -> /api/proxy?target=/merchantpay/:path*
// function 从 req.query.target 读取要转发的后端路径。
//
// 为什么不用 api/proxy/[...path].js catch-all：
// Vercel 的 catch-all 在多级路径下会返回 404（路由层拦截，到不了 function），
// 因此改用单文件 + rewrite 传参的方式。

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

  // 从 query 读取目标后端路径
  const targetPath = req.query.target || '/'
  const target = BACKEND + targetPath

  // 手动读取原始请求体（禁用了 bodyParser）
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
