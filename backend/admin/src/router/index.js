import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductList.vue')
  },
  {
    path: '/products/create',
    name: 'CreateProduct',
    component: () => import('../views/ProductForm.vue')
  },
  {
    path: '/products/edit/:id',
    name: 'EditProduct',
    component: () => import('../views/ProductForm.vue')
  },
  {
    path: '/cases',
    name: 'Cases',
    component: () => import('../views/CaseList.vue')
  },
  {
    path: '/cases/create',
    name: 'CreateCase',
    component: () => import('../views/CaseForm.vue')
  },
  {
    path: '/cases/edit/:id',
    name: 'EditCase',
    component: () => import('../views/CaseForm.vue')
  },
  {
    path: '/location',
    name: 'Location',
    component: () => import('../views/Location.vue')
  },
  {
    path: '/other-info',
    name: 'OtherInfo',
    component: () => import('../views/OtherInfo.vue')
  },
  {
    path: '/banners',
    name: 'Banners',
    component: () => import('../views/BannerList.vue')
  },
  {
    path: '/banners/create',
    name: 'CreateBanner',
    component: () => import('../views/BannerForm.vue')
  },
  {
    path: '/banners/edit/:id',
    name: 'EditBanner',
    component: () => import('../views/BannerForm.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router