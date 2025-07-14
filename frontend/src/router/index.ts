import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/common/MainDashboard.vue'),
  },
  {
    path: '/cart-items',
    name: 'cart-items',
    component: () => import('@/views/OrderManagement/CartItemListView.vue'),
  },
  {
    path: '/cart-items/:id',
    name: 'cart-item-detail',
    component: () => import('@/views/OrderManagement/CartItemDetailView.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrderManagement/OrderListView.vue'),
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderManagement/OrderDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/common/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 