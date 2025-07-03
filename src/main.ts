import './assets/main.css'
import 'element-plus/dist/index.css'
import "@/components/utilities/Interface.ts"

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import { createApp } from 'vue'
import App from './App.vue'

import router from './router'


const app = createApp(App);

//导入ElementUI的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus);
app.use(router);

app.mount('#app');
