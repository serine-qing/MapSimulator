import './assets/main.css'
import 'element-plus/dist/index.css'
import "@/components/utilities/Interface.ts"

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/vue3-json-viewer.css";
import { createI18n } from 'vue-i18n'
import cn from "@/locales/zh-CN.json"
import jp from "@/locales/jp.json"
import en from "@/locales/en.json"
import kr from "@/locales/kr.json"

const language = localStorage.getItem("currentLang") || "CN";
const i18n = createI18n({
  legacy: false,
  locale: language,
  fallbackLocale: 'CN',
  messages: {
    CN: cn,
    JP: jp,
    EN: en,
    KR: kr,
  },
});

const app = createApp(App);
app.use(i18n);
app.use(JsonViewer);
//导入ElementUI的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus);
app.use(router);

app.mount('#app');
