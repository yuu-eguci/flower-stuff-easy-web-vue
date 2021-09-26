import Vue from 'vue'
import VueRouter from 'vue-router'
import SignInView from '../views/SignInView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignInView',
    component: SignInView
  },
  {
    path: '/media',
    name: 'MediaView',
    component: () => import(/* webpackChunkName: "media" */ '../views/MediaView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/flower-stuff-easy-web-vue/',
  routes
})

export default router
