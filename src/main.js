import './assets/main.css'
import directives from '@/directives/index'
import mitt from 'mitt'
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
const Mit = mitt()

//Vue3挂载全局API
app.config.globalProperties.$bus = Mit
app.use(directives)
app.mount('#app')
