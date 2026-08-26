import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/pages/Index.vue"

const routes = [
  {
    path:"/", component: IndexView
  },
  // {
  //   path:"/operators", component: () => import("@/pages/Operators.vue")
  // }
]

const router = createRouter({
  history:createWebHistory(), 
  routes 
})

export default router;