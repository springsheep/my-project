import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import legacy from '@vitejs/plugin-legacy'
// 当前工作目录路径
const root: string = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ mode }: any) => {
      // 环境变量
      const env = loadEnv(mode, root, '')
      return {
            base: env.VITE_PUBLIC_PATH || '/',
            plugins: [
                  legacy({
                        targets: ['Chrome 64', 'ios 11'],
                        modernPolyfills: true,
                  }),
                  AutoImport({
                        imports: ['vue', 'vue-router'],
                        dts: './auto-import.d.ts',
                        eslintrc: {
                              enabled: true, // 1、改为true用于生成eslint配置。2、生成后改回false，避免重复生成消耗
                        },
                  }),
                  vue(),
                  vueJsx(),
                  mockDevServerPlugin(),
                  // vant 组件自动按需引入
                  Components({
                        resolvers: [VantResolver()],
                  }),
                  // svg icon
                  createSvgIconsPlugin({
                        // 指定图标文件夹
                        iconDirs: [path.resolve(root, 'src/icons/svg')],
                        // 指定 symbolId 格式
                        symbolId: 'icon-[dir]-[name]',
                  }),
                  // 允许 setup 语法糖上添加组件名属性
                  vueSetupExtend(),
                  // 生产环境 gzip 压缩资源
                  viteCompression(),
                  // 注入模板数据
                  createHtmlPlugin({
                        inject: {
                              data: {
                                    ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || 'false',
                                    ENV: env.VITE_ENV || 'development',
                              },
                        },
                  }),
            ],
            resolve: {
                  alias: {
                        '@': fileURLToPath(new URL('./src', import.meta.url)),
                  },
            },
            server: {
                  hmr: {
                        overlay: false,
                  },
                  host: '0.0.0.0',
                  port: 8000,
                  // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
                  // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
                  proxy: {
                        '/api': {
                              target: 'https://lcs-t.zt1356.com/api/',
                              changeOrigin: true,
                              rewrite: path => path.replace(/^\/api/, ''),
                        },
                  },
            },
            build: {
                  rollupOptions: {
                        output: {
                              chunkFileNames: 'static/js/[name]-[hash].js',
                              entryFileNames: 'static/js/[name]-[hash].js',
                              assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                        },
                  },
            },
      }
})
