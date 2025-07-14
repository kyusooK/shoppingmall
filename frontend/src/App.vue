<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="대시보드"
          to="/"
        />
        
        <v-list-group value="order-management">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-cart"
              title="주문 관리"
            />
          </template>
          
          <v-list-item
            title="장바구니"
            to="/cart-items"
            prepend-icon="mdi-cart-outline"
          />
          <v-list-item
            title="주문 목록"
            to="/orders"
            prepend-icon="mdi-clipboard-list"
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      
      <!-- User Menu -->
      <v-btn icon="mdi-account-circle" size="large" />
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Global Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const drawer = ref(true)
const title = ref('ShoppingMall')

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
})
</script> 