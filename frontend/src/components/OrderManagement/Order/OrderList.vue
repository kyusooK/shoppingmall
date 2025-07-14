<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-clipboard-list" class="mr-2" />
      주문 목록
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        주문 생성
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
            label="주문 상태"
            :items="statusOptions"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            color="primary"
            @click="applyFilters"
            :loading="orderStore.isLoading"
          >
            조회
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="orderStore.orders"
      :loading="orderStore.isLoading"
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

      <!-- Payment Status -->
      <template v-slot:item.paymentStatus="{ item }">
        <v-chip
          :color="getPaymentStatusColor(item.paymentStatus)"
          size="small"
          variant="outlined"
        >
          {{ getPaymentStatusText(item.paymentStatus) }}
        </v-chip>
      </template>

      <!-- Items Count -->
      <template v-slot:item.itemsCount="{ item }">
        <v-badge
          :content="item.items.length"
          color="primary"
        >
          <v-icon>mdi-package-variant</v-icon>
        </v-badge>
      </template>

      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="viewOrder(item)"
        />
        
        <!-- Custom Command Buttons -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
              v-bind="props"
            />
          </template>
          <v-list>
            <v-list-item @click="requestPayment(item)">
              <v-list-item-title>결제 요청</v-list-item-title>
            </v-list-item>
            <v-list-item @click="updateHistory(item)">
              <v-list-item-title>이력 갱신</v-list-item-title>
            </v-list-item>
            <v-list-item @click="displayHistory(item)">
              <v-list-item-title>이력 노출</v-list-item-title>
            </v-list-item>
            <v-list-item @click="readyForShipment(item)">
              <v-list-item-title>출고 준비</v-list-item-title>
            </v-list-item>
            <v-list-item @click="rollbackOrder(item)">
              <v-list-item-title>주문 롤백</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <v-card-actions>
      <v-spacer />
      <v-pagination
        v-model="currentPage"
        :length="orderStore.pagination.totalPages"
        @update:model-value="handlePageChange"
      />
    </v-card-actions>
  </v-card>

  <!-- Place Order Dialog -->
  <PlaceOrderDialog
    v-model:dialog="showPlaceOrderDialog"
    @success="handleOrderPlaced"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/OrderManagement/order.store'
import { OrderStatus, OrderPaymentStatus } from '@/types/OrderManagement/order.types'
import type { Order } from '@/types/OrderManagement/order.types'
import PlaceOrderDialog from './PlaceOrderDialog.vue'

// Store
const orderStore = useOrderStore()

// State
const showPlaceOrderDialog = ref(false)
const filters = reactive({
  userId: null as number | null,
  status: null as OrderStatus | null,
})

// Pagination
const pagination = computed(() => orderStore.pagination)
const currentPage = ref(1)

// Table Configuration
const headers = [
  { title: 'ID', key: 'orderId', width: '80px' },
  { title: '사용자 ID', key: 'userId', width: '100px' },
  { title: '상품 개수', key: 'itemsCount', sortable: false, width: '100px' },
  { title: '주문 상태', key: 'status', width: '120px' },
  { title: '결제 상태', key: 'paymentStatus', width: '120px' },
  { title: '생성일', key: 'createdAt', width: '150px' },
  { title: '액션', key: 'actions', sortable: false, width: '120px' },
]

const statusOptions = [
  { title: '주문됨', value: OrderStatus.PLACED },
  { title: '결제됨', value: OrderStatus.PAID },
  { title: '배송됨', value: OrderStatus.SHIPPED },
  { title: '배송완료', value: OrderStatus.DELIVERED },
  { title: '취소됨', value: OrderStatus.CANCELLED },
  { title: '결제실패', value: OrderStatus.PAYMENT_FAILED },
]

// Methods
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PLACED:
      return 'blue'
    case OrderStatus.PAID:
      return 'green'
    case OrderStatus.SHIPPED:
      return 'orange'
    case OrderStatus.DELIVERED:
      return 'success'
    case OrderStatus.CANCELLED:
      return 'red'
    case OrderStatus.PAYMENT_FAILED:
      return 'error'
    default:
      return 'grey'
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PLACED:
      return '주문됨'
    case OrderStatus.PAID:
      return '결제됨'
    case OrderStatus.SHIPPED:
      return '배송됨'
    case OrderStatus.DELIVERED:
      return '배송완료'
    case OrderStatus.CANCELLED:
      return '취소됨'
    case OrderStatus.PAYMENT_FAILED:
      return '결제실패'
    default:
      return '알 수 없음'
  }
}

function getPaymentStatusColor(status: OrderPaymentStatus): string {
  switch (status) {
    case OrderPaymentStatus.NOT_REQUESTED:
      return 'grey'
    case OrderPaymentStatus.REQUESTED:
      return 'orange'
    case OrderPaymentStatus.COMPLETED:
      return 'green'
    case OrderPaymentStatus.FAILED:
      return 'red'
    default:
      return 'grey'
  }
}

function getPaymentStatusText(status: OrderPaymentStatus): string {
  switch (status) {
    case OrderPaymentStatus.NOT_REQUESTED:
      return '미요청'
    case OrderPaymentStatus.REQUESTED:
      return '요청됨'
    case OrderPaymentStatus.COMPLETED:
      return '완료됨'
    case OrderPaymentStatus.FAILED:
      return '실패됨'
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
  orderStore.fetchOrderHistoryList(query)
}

function handlePageChange(page: number) {
  const query = {
    userId: filters.userId || undefined,
    status: filters.status || undefined,
    page: page - 1,
    size: pagination.value.size,
  }
  orderStore.fetchOrderHistoryList(query)
}

function openCreateDialog() {
  showPlaceOrderDialog.value = true
}

function viewOrder(order: Order) {
  // Navigate to order detail
  console.log('View order:', order)
}

// Custom Command Actions
async function requestPayment(order: Order) {
  try {
    await orderStore.requestOrderPayment({ orderId: order.orderId })
    applyFilters() // Refresh list
  } catch (error) {
    console.error('Payment request failed:', error)
  }
}

async function updateHistory(order: Order) {
  // This would typically open a dialog to select new status
  try {
    await orderStore.updateOrderHistory({ 
      orderId: order.orderId, 
      status: OrderStatus.SHIPPED // Example status
    })
    applyFilters()
  } catch (error) {
    console.error('Update history failed:', error)
  }
}

async function displayHistory(order: Order) {
  try {
    await orderStore.displayOrderHistory({ orderId: order.orderId })
  } catch (error) {
    console.error('Display history failed:', error)
  }
}

async function readyForShipment(order: Order) {
  try {
    await orderStore.readyOrderForShipment({ orderId: order.orderId })
    applyFilters()
  } catch (error) {
    console.error('Ready for shipment failed:', error)
  }
}

async function rollbackOrder(order: Order) {
  try {
    await orderStore.rollbackOrder({ 
      orderId: order.orderId, 
      rollbackReason: '사용자 요청' 
    })
    applyFilters()
  } catch (error) {
    console.error('Rollback failed:', error)
  }
}

function handleOrderPlaced() {
  showPlaceOrderDialog.value = false
  applyFilters() // Refresh list
}

// Lifecycle
onMounted(() => {
  orderStore.fetchOrderHistoryList()
})
</script> 