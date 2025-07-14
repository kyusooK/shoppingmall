<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="updateDialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">
          {{ isEdit ? '장바구니 항목 수정' : '장바구니 항목 추가' }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="formValid">
          <v-container>
            <v-row>
              <!-- 사용자 ID -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.userId"
                  label="사용자 ID *"
                  type="number"
                  :rules="userIdRules"
                  required
                />
              </v-col>

              <!-- 상품 ID -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.productId"
                  label="상품 ID *"
                  type="number"
                  :rules="productIdRules"
                  required
                />
              </v-col>

              <!-- 신발 사이즈 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.size"
                  label="사이즈 *"
                  :items="sizeOptions"
                  :rules="sizeRules"
                  required
                />
              </v-col>

              <!-- 발볼 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.width"
                  label="발볼 *"
                  :items="widthOptions"
                  :rules="widthRules"
                  required
                />
              </v-col>

              <!-- 평발 여부 -->
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="form.isFlatFooted"
                  label="평발 여부"
                />
              </v-col>

              <!-- 수량 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.quantity"
                  label="수량 *"
                  type="number"
                  min="1"
                  :rules="quantityRules"
                  required
                />
              </v-col>

              <!-- 재고 ID (편집 시만 표시) -->
              <v-col v-if="isEdit" cols="12" md="6">
                <v-text-field
                  v-model.number="form.inventoryStockId"
                  label="재고 ID"
                  type="number"
                  readonly
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
          @click="save"
          :loading="loading"
          :disabled="!formValid"
        >
          {{ isEdit ? '수정' : '추가' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useCartItemStore } from '@/stores/OrderManagement/cartItem.store'
import type { CartItem, CartItemForm } from '@/types/OrderManagement/cartItem.types'

// Props & Emits
interface Props {
  dialog: boolean
  item?: CartItem | null
}

const props = withDefaults(defineProps<Props>(), {
  item: null
})

const emit = defineEmits<{
  'update:dialog': [value: boolean]
  save: []
}>()

// Store
const cartItemStore = useCartItemStore()

// State
const formRef = ref()
const formValid = ref(false)
const loading = ref(false)

// Form Data
const form = reactive<CartItemForm>({
  userId: undefined,
  productId: undefined,
  size: '',
  width: '',
  isFlatFooted: false,
  quantity: 1,
  inventoryStockId: undefined,
})

// Computed
const isEdit = computed(() => !!props.item)

// Form Options
const sizeOptions = [
  '230', '235', '240', '245', '250', '255', 
  '260', '265', '270', '275', '280', '285', '290'
]

const widthOptions = [
  { title: 'A (좁음)', value: 'A' },
  { title: 'B (약간 좁음)', value: 'B' },
  { title: 'C (보통)', value: 'C' },
  { title: 'D (약간 넓음)', value: 'D' },
  { title: 'E (넓음)', value: 'E' },
  { title: 'F (매우 넓음)', value: 'F' }
]

// Validation Rules
const userIdRules = [
  (v: number) => !!v || '사용자 ID는 필수입니다.',
  (v: number) => v > 0 || '유효한 사용자 ID를 입력하세요.',
]

const productIdRules = [
  (v: number) => !!v || '상품 ID는 필수입니다.',
  (v: number) => v > 0 || '유효한 상품 ID를 입력하세요.',
]

const sizeRules = [
  (v: string) => !!v || '사이즈는 필수입니다.',
]

const widthRules = [
  (v: string) => !!v || '발볼은 필수입니다.',
]

const quantityRules = [
  (v: number) => !!v || '수량은 필수입니다.',
  (v: number) => v > 0 || '수량은 1개 이상이어야 합니다.',
]

// Methods
function updateDialog(value: boolean) {
  emit('update:dialog', value)
}

function resetForm() {
  Object.assign(form, {
    userId: undefined,
    productId: undefined,
    size: '',
    width: '',
    isFlatFooted: false,
    quantity: 1,
    inventoryStockId: undefined,
  })
  
  nextTick(() => {
    formRef.value?.resetValidation()
  })
}

function loadItemData() {
  if (props.item) {
    Object.assign(form, {
      userId: props.item.userId,
      productId: props.item.productId.productId,
      size: props.item.size,
      width: props.item.width,
      isFlatFooted: props.item.isFlatFooted,
      quantity: props.item.quantity,
      inventoryStockId: props.item.inventoryStockId.inventoryStockId,
    })
  }
}

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  
  try {
    if (isEdit.value && props.item) {
      // Update existing item
      await cartItemStore.updateCartItem(props.item.cartItemId, form)
    } else {
      // Create new item (using AddCartItem command)
      await cartItemStore.addCartItem({
        userId: form.userId!,
        productId: { productId: form.productId! },
        size: form.size,
        width: form.width,
        isFlatFooted: form.isFlatFooted,
        quantity: form.quantity,
        inventoryStockId: { inventoryStockId: form.inventoryStockId || 1 }, // Default inventory
      })
    }
    
    emit('save')
    resetForm()
  } catch (error) {
    console.error('Save failed:', error)
  } finally {
    loading.value = false
  }
}

function cancel() {
  emit('update:dialog', false)
  resetForm()
}

// Watchers
watch(() => props.dialog, (newVal) => {
  if (newVal) {
    if (props.item) {
      loadItemData()
    } else {
      resetForm()
    }
  }
})
</script> 