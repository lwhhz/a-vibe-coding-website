import { createRouter, createWebHistory } from 'vue-router'
import ContactFormList from './views/ContactFormList.vue'
import ContactFormDetail from './views/ContactFormDetail.vue'

const routes = [
  {
    path: '/',
    name: 'ContactFormList',
    component: ContactFormList
  },
  {
    path: '/form/:id',
    name: 'ContactFormDetail',
    component: ContactFormDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router