import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/pages/Index.vue"

const routes = [
  {
    path:"/",
    component: IndexView,
    children: [
      {
        path: "",
        component: () => import("@/pages/Home.vue")
      },
      {
        path: "sponsor",
        component: () => import("@/pages/Sponsor.vue")
      }
    ]
  }
]

const router = createRouter({
  history:createWebHistory(), 
  routes 
})

export default router;