import { createRouter, createWebHashHistory, type RouteLocationNormalized } from 'vue-router'
import routes from './routes'

// userStore.login()
const router = createRouter({
      history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
      routes,
})

export interface toRouteType extends RouteLocationNormalized {
      meta: {
            title?: string
            noCache?: boolean
      }
}

router.beforeEach((to: toRouteType, from, next) => {
      next()
})

router.afterEach(() => {
      // NProgress.done();
})

export default router
