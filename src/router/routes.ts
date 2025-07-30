import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
      {
            path: '/',
            name: 'root',
            component: Layout,
            redirect: 'home',
            children: [
                  {
                        path: 'home',
                        name: 'home',
                        component: () => import('@/views/home/index.vue'),
                        meta: {
                              title: '首页',
                              noCache: true,
                        },
                  },
            ],
      },
      {
            path: '/403',
            name: '403',
            component: () => import('@/views/403.vue'),
            meta: {
                  title: '无权限',
                  noCache: true,
            },
      },
      {
            path: '/qrcode',
            name: 'qrcode',
            component: () => import('@/views/qrcode/index.vue'),
            meta: {
                  title: '二维码',
                  noCache: true,
            },
      },
]

export default routes
