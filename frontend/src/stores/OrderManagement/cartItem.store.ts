import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartItemService } from '@/services/OrderManagement/cartItem.service'
import type { 
  CartItem, 
  CartItemForm, 
  CartItemListQuery,
  SelectProductOptionCommand,
  AddCartItemCommand,
  CartItemStatus 
} from '@/types/OrderManagement/cartItem.types'
import type { LoadingStatus, PaginatedResponse } from '@/types/common.types'

export const useCartItemStore = defineStore('cartItem', () => {
  // State
  const cartItems = ref<CartItem[]>([])
  const currentCartItem = ref<CartItem | null>(null)
  const pagination = ref({
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: false,
  })
  const loading = ref<LoadingStatus>('idle')
  const error = ref<string | null>(null)

  // Getters
  const getCartItemById = computed(() => {
    return (id: number) => cartItems.value.find(item => item.cartItemId === id)
  })

  const getCartItemsByStatus = computed(() => {
    return (status: CartItemStatus) => cartItems.value.filter(item => item.status === status)
  })

  const isLoading = computed(() => loading.value === 'loading')

  // Actions
  async function fetchCartItems(query: CartItemListQuery = {}) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const response: PaginatedResponse<CartItem> = await cartItemService.getCartItems(query)
      
      cartItems.value = response.content
      pagination.value = {
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.first,
        last: response.last,
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
    }
  }

  async function fetchCartItemById(id: number) {
    try {
      loading.value = 'loading'
      error.value = null
      
      currentCartItem.value = await cartItemService.getCartItemById(id)
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
    }
  }

  async function createCartItem(data: CartItemForm) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const newCartItem = await cartItemService.createCartItem(data)
      cartItems.value.push(newCartItem)
      
      loading.value = 'success'
      return newCartItem
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function updateCartItem(id: number, data: Partial<CartItemForm>) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const updatedCartItem = await cartItemService.updateCartItem(id, data)
      
      const index = cartItems.value.findIndex(item => item.cartItemId === id)
      if (index !== -1) {
        cartItems.value[index] = updatedCartItem
      }
      
      if (currentCartItem.value?.cartItemId === id) {
        currentCartItem.value = updatedCartItem
      }
      
      loading.value = 'success'
      return updatedCartItem
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function deleteCartItem(id: number) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await cartItemService.deleteCartItem(id)
      
      cartItems.value = cartItems.value.filter(item => item.cartItemId !== id)
      
      if (currentCartItem.value?.cartItemId === id) {
        currentCartItem.value = null
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  // Custom Commands
  async function selectProductOption(command: SelectProductOptionCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await cartItemService.selectProductOption(command)
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function addCartItem(command: AddCartItemCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await cartItemService.addCartItem(command)
      
      // Refresh cart items after adding
      await fetchCartItems({ userId: command.userId })
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    cartItems.value = []
    currentCartItem.value = null
    pagination.value = {
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0,
      first: true,
      last: false,
    }
    loading.value = 'idle'
    error.value = null
  }

  return {
    // State
    cartItems,
    currentCartItem,
    pagination,
    loading,
    error,
    
    // Getters
    getCartItemById,
    getCartItemsByStatus,
    isLoading,
    
    // Actions
    fetchCartItems,
    fetchCartItemById,
    createCartItem,
    updateCartItem,
    deleteCartItem,
    selectProductOption,
    addCartItem,
    clearError,
    resetStore,
  }
}) 