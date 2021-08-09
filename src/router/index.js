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
  },
  {
    path: '/prediction',
    name: 'PredictionView',
    component: () => import(/* webpackChunkName: "prediction" */ '../views/PredictionView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/flower-stuff-lab-easy-web/',
  routes
})

export default router
