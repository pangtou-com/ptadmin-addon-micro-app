import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 微应用模板默认使用固定端口，方便直接填入 frontend.json 的 wujie.url。
 * 如果项目内已有端口冲突，再同步修改 package.json、README 和 frontend.json。
 */
export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0',
        port: 5182,
        strictPort: true,
    },
    preview: {
        host: '0.0.0.0',
        port: 5182,
        strictPort: true,
    },
    build: {
        target: 'esnext',
    },
})

