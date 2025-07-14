<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <v-card v-if="orderStore.currentOrder" class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-clipboard-list" class="mr-2" />
        주문 상세
        <v-spacer />
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              prepend-icon="mdi-cog"
              v-bind="props"
            >
              액션
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="requestPayment">
              <v-list-item-title>결제 요청</v-list-item-title>
            </v-list-item>
            <v-list-item @click="displayHistory">
              <v-list-item-title>이력 노출</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <!-- 기본 정보 -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">기본 정보</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>주문 ID</v-list-item-title>
                      <v-list-item-subtitle>{{ orderStore.currentOrder.orderId }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title>사용자 ID</v-list-item-title>
                      <v-list-item-subtitle>{{ orderStore.currentOrder.userId }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title>주문 상태</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip 
                          :color="getStatusColor(orderStore.currentOrder.status)"
                          size="small"
                        >
                          {{ getStatusText(orderStore.currentOrder.status) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title>결제 상태</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip 
                          :color="getPaymentStatusColor(orderStore.currentOrder.paymentStatus)"
                          size="small"
                          variant="outlined"
                        >
                          {{ getPaymentStatusText(orderStore.currentOrder.paymentStatus) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            
            <!-- 일시 정보 -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">일시 정보</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>주문 생성일</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(orderStore.currentOrder.createdAt) }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title>최종 수정일</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(orderStore.currentOrder.updatedAt) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- 주문 상품 목록 -->
          <v-row>
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">주문 상품 목록</v-card-title>
                <v-card-text>
                  <v-table>
                    <thead>
                      <tr>
                        <th>상품 ID</th>
                        <th>사이즈</th>
                        <th>발볼</th>
                        <th>평발</th>
                        <th>수량</th>
                        <th>가격</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in orderStore.currentOrder.items" :key="item.productId">
                        <td>{{ item.productId }}</td>
                        <td>{{ item.size }}mm</td>
                        <td>{{ item.width }}</td>
                        <td>
                          <v-chip 
                            :color="item.isFlatFooted ? 'orange' : 'green'"
                            size="x-small"
                          >
                            {{ item.isFlatFooted ? '평발' : '일반' }}
                          </v-chip>
                        </td>
                        <td>{{ item.quantity }}개</td>
                        <td>₩{{ item.price.toLocaleString() }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- 주문 이력 -->
          <v-row v-if="orderStore.currentOrder.orderHistory && orderStore.currentOrder.orderHistory.length > 0">
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">주문 이력</v-card-title>
                <v-card-text>
                  <v-timeline align="start">
                    <v-timeline-item
                      v-for="(history, index) in orderStore.currentOrder.orderHistory"
                      :key="index"
                      :dot-color="getStatusColor(history.status)"
                      size="small"
                    >
                      <template v-slot:opposite>
                        <span class="text-caption">{{ formatDate(history.changedAt) }}</span>
                      </template>
                      <div>
                        <div class="text-h6">{{ getStatusText(history.status) }}</div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    
    <!-- Loading State -->
    <v-card v-else-if="orderStore.isLoading" class="d-flex justify-center align-center" style="height: 300px;">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-card>
    
    <!-- Error State -->
    <v-card v-else class="d-flex flex-column justify-center align-center" style="height: 300px;">
      <v-icon icon="mdi-alert-circle-outline" size="64" color="error" class="mb-4" />
      <h3>주문을 찾을 수 없습니다</h3>
      <v-btn color="primary" class="mt-4" to="/orders">
        목록으로 돌아가기
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/OrderManagement/order.store'
import { OrderStatus, OrderPaymentStatus } from '@/types/OrderManagement/order.types'
import { format } from 'date-fns'

// Router
const route = useRoute()
const router = useRouter()

// Store
const orderStore = useOrderStore()

// Breadcrumbs
const breadcrumbs = ref([
  { title: '대시보드', to: '/' },
  { title: '주문 관리', disabled: true },
  { title: '주문 목록', to: '/orders' },
  { title: '상세', disabled: true }
])

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

function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}

async function requestPayment() {
  if (orderStore.currentOrder) {
    try {
      await orderStore.requestOrderPayment({ orderId: orderStore.currentOrder.orderId })
      // Refresh current order
      const orderId = Number(route.params.id)
      orderStore.fetchOrderDetails({ orderId })
    } catch (error) {
      console.error('Payment request failed:', error)
    }
  }
}

async function displayHistory() {
  if (orderStore.currentOrder) {
    try {
      await orderStore.displayOrderHistory({ orderId: orderStore.currentOrder.orderId })
    } catch (error) {
      console.error('Display history failed:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  const orderId = Number(route.params.id)
  if (orderId) {
    orderStore.fetchOrderDetails({ orderId })
  } else {
    router.push('/orders')
  }
})
</script> 