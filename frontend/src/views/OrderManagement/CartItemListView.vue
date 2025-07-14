<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <CartItemList />
    
    <!-- Command Buttons -->
    <v-row class="mt-4">
      <v-col>
        <v-card>
          <v-card-title>빠른 액션</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="auto">
                <SelectProductOptionButton @success="handleOptionSelected" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CartItemList from '@/components/OrderManagement/CartItem/CartItemList.vue'
import SelectProductOptionButton from '@/components/OrderManagement/CartItem/SelectProductOptionButton.vue'
import type { SelectProductOptionCommand } from '@/types/OrderManagement/cartItem.types'

// Breadcrumbs
const breadcrumbs = ref([
  { title: '대시보드', to: '/' },
  { title: '주문 관리', disabled: true },
  { title: '장바구니', disabled: true }
])

// Event Handlers
function handleOptionSelected(command: SelectProductOptionCommand) {
  console.log('Product option selected:', command)
  // Could show a success message or refresh data
}
</script> 