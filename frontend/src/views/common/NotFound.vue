<template>
  <v-container class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
    <v-icon icon="mdi-alert-circle-outline" size="120" color="error" class="mb-4" />
    
    <h1 class="text-h2 mb-2">404</h1>
    <h2 class="text-h4 mb-4">페이지를 찾을 수 없습니다</h2>
    
    <p class="text-body-1 mb-6 text-center">
      요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
    </p>
    
    <v-btn
      color="primary"
      size="large"
      prepend-icon="mdi-home"
      to="/"
    >
      홈으로 돌아가기
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
// No script needed for this simple component
</script> 