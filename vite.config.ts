import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '',  // 使用空字符串
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
}) 