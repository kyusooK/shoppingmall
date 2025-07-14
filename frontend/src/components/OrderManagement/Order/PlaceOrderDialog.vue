<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="updateDialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">주문 생성</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="formValid">
          <v-container>
            <v-row>
              <!-- 사용자 ID -->
              <v-col cols="12">
                <v-text-field
                  v-model.number="form.userId"
                  label="사용자 ID *"
                  type="number"
                  :rules="userIdRules"
                  required
                />
              </v-col>

              <!-- 장바구니 항목 IDs -->
              <v-col cols="12">
                <v-combobox
                  v-model="form.cartItemIds"
                  label="장바구니 항목 IDs *"
                  :rules="cartItemIdsRules"
                  multiple
                  chips
                  type="number"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">
          취소
        </v-btn>
        <v-btn
          color="primary"
          @click="placeOrder"
          :loading="loading"
          :disabled="!formValid"
        >
          주문 생성
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useOrderStore } from '@/stores/OrderManagement/order.store'
import type { PlaceOrderCommand } from '@/types/OrderManagement/order.types'

// Props & Emits
interface Props {
  dialog: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:dialog': [value: boolean]
  success: []
}>()

// Store
const orderStore = useOrderStore()

// State
const formRef = ref()
const formValid = ref(false)
const loading = ref(false)

// Form Data
const form = reactive({
  userId: undefined as number | undefined,
  cartItemIds: [] as number[],
})

// Validation Rules
const userIdRules = [
  (v: number) => !!v || '사용자 ID는 필수입니다.',
  (v: number) => v > 0 || '유효한 사용자 ID를 입력하세요.',
]

const cartItemIdsRules = [
  (v: number[]) => v && v.length > 0 || '최소 1개의 장바구니 항목이 필요합니다.',
]

// Methods
function updateDialog(value: boolean) {
  emit('update:dialog', value)
}

function resetForm() {
  Object.assign(form, {
    userId: undefined,
    cartItemIds: [],
  })
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

async function placeOrder() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  
  try {
    const command: PlaceOrderCommand = {
      userId: form.userId!,
      cartItemIds: form.cartItemIds.map(id => ({ cartItemId: id })),
    }
    
    await orderStore.placeOrder(command)
    
    emit('success')
    resetForm()
  } catch (error) {
    console.error('Place order failed:', error)
  } finally {
    loading.value = false
  }
}

function cancel() {
  emit('update:dialog', false)
  resetForm()
}
</script> 