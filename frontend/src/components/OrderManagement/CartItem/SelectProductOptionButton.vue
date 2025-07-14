<template>
  <v-btn
    :color="buttonConfig.color"
    :variant="buttonConfig.variant"
    :loading="loading"
    :disabled="disabled"
    @click="openDialog"
  >
    <v-icon start>{{ buttonConfig.icon }}</v-icon>
    {{ buttonConfig.label }}
  </v-btn>

  <!-- Product Option Selection Dialog -->
  <v-dialog v-model="showDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5">상품 옵션 선택</span>
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

              <!-- 상품 ID -->
              <v-col cols="12">
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
              <v-col cols="12">
                <v-checkbox
                  v-model="form.isFlatFooted"
                  label="평발 여부"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">
          취소
        </v-btn>
        <v-btn
          color="primary"
          @click="selectOption"
          :loading="loading"
          :disabled="!formValid"
        >
          옵션 선택
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCartItemStore } from '@/stores/OrderManagement/cartItem.store'
import type { SelectProductOptionCommand } from '@/types/OrderManagement/cartItem.types'

// Props
interface Props {
  disabled?: boolean
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'elevated'
})

// Emits
const emit = defineEmits<{
  success: [command: SelectProductOptionCommand]
  error: [error: Error]
}>()

// Store
const cartItemStore = useCartItemStore()

// State
const showDialog = ref(false)
const formRef = ref()
const formValid = ref(false)
const loading = ref(false)

// Form Data
const form = reactive({
  userId: undefined as number | undefined,
  productId: undefined as number | undefined,
  size: '',
  width: '',
  isFlatFooted: false,
})

// Button Configuration
const buttonConfig = computed(() => ({
  color: 'info',
  icon: 'mdi-tune',
  label: '상품 옵션 선택',
  variant: props.variant
}))

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

// Methods
function openDialog() {
  resetForm()
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  resetForm()
}

function resetForm() {
  Object.assign(form, {
    userId: undefined,
    productId: undefined,
    size: '',
    width: '',
    isFlatFooted: false,
  })
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

async function selectOption() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  
  try {
    const command: SelectProductOptionCommand = {
      userId: form.userId!,
      productId: { productId: form.productId! },
      size: form.size,
      width: form.width,
      isFlatFooted: form.isFlatFooted,
    }
    
    await cartItemStore.selectProductOption(command)
    
    emit('success', command)
    closeDialog()
  } catch (error) {
    console.error('Product option selection failed:', error)
    emit('error', error as Error)
  } finally {
    loading.value = false
  }
}
</script> 