import 'amfe-flexible'
import { createApp } from 'vue'
import { useUserInfo } from '@/store/modules/UserInfo'
import { store } from './store'
import 'normalize.css/normalize.css'
import './styles/index.less'
import './styles/tailwind.css'
import 'virtual:svg-icons-register'
import api from '@/services/index'
import { showNotify } from 'vant'
import 'vant/lib/index.css'

import { loadInterceptors } from '@/utils/request'
import interceptors from '@/utils/axios-interceptors'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(store)
app.config.globalProperties.$api = api
const info = useUserInfo()
loadInterceptors(interceptors, { message: showNotify, store: info, router })

app.use(router)
app.mount('#app')
