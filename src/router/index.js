import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 导入登录组件
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      //  默认子路由 只能有一个
      { path: '', name: 'home', component: () => import('@/views/home') },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/my') }
    ]

  }
]

const router = new VueRouter({
  routes
})

export default router
