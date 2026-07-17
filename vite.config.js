import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 后端服务地址：原页面通过相对路径调用 /viewredis、/merchantpay 接口，
// 开发时通过 Vite 代理转发到真实后端。可通过环境变量 VITE_API_TARGET 覆盖。
const API_TARGET = process.env.VITE_API_TARGET || 'http://parking.yilufa.net:10889'

// 构建产物的基础路径：
// - Vercel/Netlify 等根路径部署：默认 '/' 即可
// - GitHub Pages 项目页面（https://<user>.github.io/<repo>/）：构建时设 VITE_BASE_PATH=/car-pay/
// 开发模式始终用根路径，避免 dev server 路径异常。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_BASE_PATH || '/') : '/',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5190,
    strictPort: false,
    proxy: {
      '/viewredis': {
        target: API_TARGET,
        changeOrigin: true
      },
      '/merchantpay': {
        target: API_TARGET,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}))
