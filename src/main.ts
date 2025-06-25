import './assets/main.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import { createApp } from 'vue'
import App from './App.vue'
import "@/components/utilities/Interface.ts"

const app = createApp(App);
app.use(ElementPlus);

app.mount('#app');
