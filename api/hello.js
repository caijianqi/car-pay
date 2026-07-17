// 测试 function：验证 Vercel serverless function 部署是否正常
// 访问 https://car-pay-five.vercel.app/api/hello 应返回 JSON
export default function handler(req, res) {
  res.status(200).json({
    message: 'hello from vercel function',
    time: new Date().toISOString(),
    method: req.method,
    url: req.url
  })
}
