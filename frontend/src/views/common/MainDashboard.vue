<template>
  <v-container fluid>
    <!-- Header -->
    <v-row>
      <v-col>
        <h1 class="text-h3 mb-4">ShoppingMall 대시보드</h1>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row>
      <v-col v-for="stat in statistics" :key="stat.title" cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon :color="stat.color" size="48" class="mr-4">
                {{ stat.icon }}
              </v-icon>
              <div>
                <p class="text-caption mb-1">{{ stat.title }}</p>
                <p class="text-h5 font-weight-bold">{{ stat.value }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- OrderManagement Domain -->
    <v-row class="mt-4">
      <v-col>
        <h2 class="text-h4 mb-4">주문 관리 시스템</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card hover class="h-100" to="/cart-items">
          <v-card-title>
            <v-icon icon="mdi-cart-outline" class="mr-2" />
            장바구니 관리
          </v-card-title>
          
          <v-card-subtitle>
            CartItem Aggregate
          </v-card-subtitle>
          
          <v-card-text>
            <p class="mb-2">사용자의 장바구니 항목을 관리합니다.</p>
            <v-chip-group>
              <v-chip size="small" variant="outlined">상품 옵션 선택</v-chip>
              <v-chip size="small" variant="outlined">장바구니 추가</v-chip>
              <v-chip size="small" variant="outlined">수량 관리</v-chip>
            </v-chip-group>
          </v-card-text>
          
          <v-card-actions>
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
              관리하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card hover class="h-100" to="/orders">
          <v-card-title>
            <v-icon icon="mdi-clipboard-list" class="mr-2" />
            주문 관리
          </v-card-title>
          
          <v-card-subtitle>
            Order Aggregate
          </v-card-subtitle>
          
          <v-card-text>
            <p class="mb-2">주문 생성부터 배송까지 전체 프로세스를 관리합니다.</p>
            <v-chip-group>
              <v-chip size="small" variant="outlined">주문 생성</v-chip>
              <v-chip size="small" variant="outlined">결제 처리</v-chip>
              <v-chip size="small" variant="outlined">배송 관리</v-chip>
              <v-chip size="small" variant="outlined">이력 추적</v-chip>
            </v-chip-group>
          </v-card-text>
          
          <v-card-actions>
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
              관리하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activities -->
    <v-row class="mt-4">
      <v-col>
        <h2 class="text-h4 mb-4">최근 활동</h2>
        <v-card>
          <v-list lines="two">
            <v-list-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :subtitle="activity.description"
            >
              <template v-slot:prepend>
                <v-icon :icon="activity.icon" :color="activity.color" />
              </template>
              <template v-slot:title>
                {{ activity.title }}
                <v-chip size="x-small" class="ml-2">{{ activity.context }}</v-chip>
              </template>
              <template v-slot:append>
                <span class="text-caption">{{ formatTime(activity.timestamp) }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'

// Statistics Data
const statistics = ref([
  { title: '총 주문', value: '1,234', icon: 'mdi-cart', color: 'primary' },
  { title: '오늘 매출', value: '₩3,456K', icon: 'mdi-currency-usd', color: 'success' },
  { title: '활성 사용자', value: '567', icon: 'mdi-account-group', color: 'info' },
  { title: '대기 처리', value: '89', icon: 'mdi-clock-alert', color: 'warning' }
])

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    title: '새로운 주문이 생성되었습니다',
    description: '사용자 ID 1001이 신발 2켤레를 주문했습니다',
    icon: 'mdi-plus-circle',
    color: 'success',
    context: 'Order',
    timestamp: new Date()
  },
  {
    id: 2,
    title: '상품 옵션이 선택되었습니다',
    description: '사이즈 270, 발볼 D, 평발 여부: 아니오',
    icon: 'mdi-tune',
    color: 'info',
    context: 'CartItem',
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: 3,
    title: '결제가 완료되었습니다',
    description: '주문 ID 2001의 결제가 성공적으로 처리되었습니다',
    icon: 'mdi-credit-card-check',
    color: 'success',
    context: 'Order',
    timestamp: new Date(Date.now() - 60000)
  }
])

// Methods
function formatTime(timestamp: Date): string {
  return format(timestamp, 'HH:mm')
}
</script> 