<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <v-card v-if="cartItemStore.currentCartItem" class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-cart-outline" class="mr-2" />
        장바구니 항목 상세
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-pencil"
          @click="editItem"
        >
          수정
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title>장바구니 ID</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.cartItemId }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>사용자 ID</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.userId }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>상품 ID</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.productId.productId }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>수량</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.quantity }}개</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title>신발 사이즈</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.size }}mm</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>발볼</v-list-item-title>
                  <v-list-item-subtitle>{{ cartItemStore.currentCartItem.width }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>평발 여부</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip 
                      :color="cartItemStore.currentCartItem.isFlatFooted ? 'orange' : 'green'"
                      size="small"
                    >
                      {{ cartItemStore.currentCartItem.isFlatFooted ? '평발' : '일반' }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>상태</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip 
                      :color="getStatusColor(cartItemStore.currentCartItem.status)"
                      size="small"
                    >
                      {{ getStatusText(cartItemStore.currentCartItem.status) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-list>
                <v-list-item>
                  <v-list-item-title>생성일</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(cartItemStore.currentCartItem.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>수정일</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(cartItemStore.currentCartItem.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    
    <!-- Loading State -->
    <v-card v-else-if="cartItemStore.isLoading" class="d-flex justify-center align-center" style="height: 300px;">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-card>
    
    <!-- Error State -->
    <v-card v-else class="d-flex flex-column justify-center align-center" style="height: 300px;">
      <v-icon icon="mdi-alert-circle-outline" size="64" color="error" class="mb-4" />
      <h3>장바구니 항목을 찾을 수 없습니다</h3>
      <v-btn color="primary" class="mt-4" to="/cart-items">
        목록으로 돌아가기
      </v-btn>
    </v-card>

    <!-- Edit Dialog -->
    <CartItemForm
      v-model:dialog="showEditDialog"
      :item="cartItemStore.currentCartItem"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartItemStore } from '@/stores/OrderManagement/cartItem.store'
import { CartItemStatus } from '@/types/OrderManagement/cartItem.types'
import { format } from 'date-fns'
import CartItemForm from '@/components/OrderManagement/CartItem/CartItemForm.vue'

// Router
const route = useRoute()
const router = useRouter()

// Store
const cartItemStore = useCartItemStore()

// State
const showEditDialog = ref(false)

// Breadcrumbs
const breadcrumbs = ref([
  { title: '대시보드', to: '/' },
  { title: '주문 관리', disabled: true },
  { title: '장바구니', to: '/cart-items' },
  { title: '상세', disabled: true }
])

// Methods
function getStatusColor(status: CartItemStatus): string {
  switch (status) {
    case CartItemStatus.IN_CART:
      return 'blue'
    case CartItemStatus.ORDERED:
      return 'green'
    case CartItemStatus.CANCELLED:
      return 'red'
    default:
      return 'grey'
  }
}

function getStatusText(status: CartItemStatus): string {
  switch (status) {
    case CartItemStatus.IN_CART:
      return '장바구니'
    case CartItemStatus.ORDERED:
      return '주문됨'
    case CartItemStatus.CANCELLED:
      return '취소됨'
    default:
      return '알 수 없음'
  }
}

function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}

function editItem() {
  showEditDialog.value = true
}

function handleSave() {
  showEditDialog.value = false
  // Refresh current item
  const cartItemId = Number(route.params.id)
  cartItemStore.fetchCartItemById(cartItemId)
}

// Lifecycle
onMounted(() => {
  const cartItemId = Number(route.params.id)
  if (cartItemId) {
    cartItemStore.fetchCartItemById(cartItemId)
  } else {
    router.push('/cart-items')
  }
})
</script> 