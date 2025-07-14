<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <OrderList />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderList from '@/components/OrderManagement/Order/OrderList.vue'

// Breadcrumbs
const breadcrumbs = ref([
  { title: '대시보드', to: '/' },
  { title: '주문 관리', disabled: true },
  { title: '주문 목록', disabled: true }
])
</script> 