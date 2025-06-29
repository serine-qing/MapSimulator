import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/pages/Index.vue"

const routes = [
  {
    path:"/", component: IndexView
  }
]

const router = createRouter({
  history:createWebHistory(), 
  routes 
})

export default router;