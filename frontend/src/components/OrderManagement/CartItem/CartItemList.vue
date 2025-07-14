<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-cart-outline" class="mr-2" />
      장바구니 목록
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        상품 추가
      </v-btn>
    </v-card-title>

    <!-- Filters -->
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="filters.userId"
            label="사용자 ID"
            type="number"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filters.status"
            label="상태"
            :items="statusOptions"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            color="primary"
            @click="applyFilters"
            :loading="cartItemStore.isLoading"
          >
            조회
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="cartItemStore.cartItems"
      :loading="cartItemStore.isLoading"
      :items-per-page="pagination.size"
      :page="pagination.number + 1"
      @update:page="handlePageChange"
    >
      <!-- Status Chip -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ getStatusText(item.status) }}
        </v-chip>
      </template>

      <!-- Shoe Options -->
      <template v-slot:item.options="{ item }">
        <div class="text-caption">
          <div>사이즈: {{ item.size }}</div>
          <div>발볼: {{ item.width }}</div>
          <div>평발: {{ item.isFlatFooted ? 'Y' : 'N' }}</div>
        </div>
      </template>

      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="viewItem(item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editItem(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteItem(item)"
        />
      </template>
    </v-data-table>

    <!-- Pagination -->
    <v-card-actions>
      <v-spacer />
      <v-pagination
        v-model="currentPage"
        :length="cartItemStore.pagination.totalPages"
        @update:model-value="handlePageChange"
      />
    </v-card-actions>
  </v-card>

  <!-- Create/Edit Dialog -->
  <CartItemForm
    v-model:dialog="showFormDialog"
    :item="selectedItem"
    @save="handleSave"
  />

  <!-- Confirm Delete Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title>삭제 확인</v-card-title>
      <v-card-text>
        선택한 장바구니 항목을 삭제하시겠습니까?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="showDeleteDialog = false">취소</v-btn>
        <v-btn
          color="error"
          @click="confirmDelete"
          :loading="cartItemStore.isLoading"
        >
          삭제
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useCartItemStore } from '@/stores/OrderManagement/cartItem.store'
import { CartItemStatus } from '@/types/OrderManagement/cartItem.types'
import type { CartItem } from '@/types/OrderManagement/cartItem.types'
import CartItemForm from './CartItemForm.vue'

// Store
const cartItemStore = useCartItemStore()

// State
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedItem = ref<CartItem | null>(null)
const filters = reactive({
  userId: null as number | null,
  status: null as CartItemStatus | null,
})

// Pagination
const pagination = computed(() => cartItemStore.pagination)
const currentPage = ref(1)

// Table Configuration
const headers = [
  { title: 'ID', key: 'cartItemId', width: '80px' },
  { title: '사용자 ID', key: 'userId', width: '100px' },
  { title: '상품 ID', key: 'productId.productId', width: '100px' },
  { title: '신발 옵션', key: 'options', sortable: false, width: '120px' },
  { title: '수량', key: 'quantity', width: '80px' },
  { title: '상태', key: 'status', width: '100px' },
  { title: '생성일', key: 'createdAt', width: '120px' },
  { title: '액션', key: 'actions', sortable: false, width: '120px' },
]

const statusOptions = [
  { title: '장바구니', value: CartItemStatus.IN_CART },
  { title: '주문됨', value: CartItemStatus.ORDERED },
  { title: '취소됨', value: CartItemStatus.CANCELLED },
]

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

function applyFilters() {
  const query = {
    userId: filters.userId || undefined,
    status: filters.status || undefined,
    page: 0,
    size: pagination.value.size,
  }
  cartItemStore.fetchCartItems(query)
}

function handlePageChange(page: number) {
  const query = {
    userId: filters.userId || undefined,
    status: filters.status || undefined,
    page: page - 1,
    size: pagination.value.size,
  }
  cartItemStore.fetchCartItems(query)
}

function openCreateDialog() {
  selectedItem.value = null
  showFormDialog.value = true
}

function viewItem(item: CartItem) {
  // Navigate to detail view
  console.log('View item:', item)
}

function editItem(item: CartItem) {
  selectedItem.value = item
  showFormDialog.value = true
}

function deleteItem(item: CartItem) {
  selectedItem.value = item
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (selectedItem.value) {
    try {
      await cartItemStore.deleteCartItem(selectedItem.value.cartItemId)
      showDeleteDialog.value = false
      selectedItem.value = null
      applyFilters() // Refresh list
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

function handleSave() {
  showFormDialog.value = false
  selectedItem.value = null
  applyFilters() // Refresh list
}

// Lifecycle
onMounted(() => {
  cartItemStore.fetchCartItems()
})
</script> 