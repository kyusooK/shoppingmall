import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderService } from '@/services/OrderManagement/order.service'
import type { 
  Order, 
  OrderForm, 
  OrderDetailsQuery,
  OrderHistoryListQuery,
  PlaceOrderCommand,
  RequestOrderPaymentCommand,
  UpdateOrderHistoryCommand,
  DisplayOrderHistoryCommand,
  RollbackOrderCommand,
  ReadyOrderForShipmentCommand,
  OrderStatus 
} from '@/types/OrderManagement/order.types'
import type { LoadingStatus, PaginatedResponse } from '@/types/common.types'

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
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
  const getOrderById = computed(() => {
    return (id: number) => orders.value.find(order => order.orderId === id)
  })

  const getOrdersByStatus = computed(() => {
    return (status: OrderStatus) => orders.value.filter(order => order.status === status)
  })

  const getOrdersByUser = computed(() => {
    return (userId: number) => orders.value.filter(order => order.userId === userId)
  })

  const isLoading = computed(() => loading.value === 'loading')

  // Actions
  async function fetchOrderDetails(query: OrderDetailsQuery) {
    try {
      loading.value = 'loading'
      error.value = null
      
      currentOrder.value = await orderService.getOrderDetails(query)
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
    }
  }

  async function fetchOrderHistoryList(query: OrderHistoryListQuery = {}) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const response: PaginatedResponse<Order> = await orderService.getOrderHistoryList(query)
      
      orders.value = response.content
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

  async function fetchOrderById(id: number) {
    try {
      loading.value = 'loading'
      error.value = null
      
      currentOrder.value = await orderService.getOrderById(id)
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
    }
  }

  async function createOrder(data: OrderForm) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const newOrder = await orderService.createOrder(data)
      orders.value.push(newOrder)
      
      loading.value = 'success'
      return newOrder
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function updateOrder(id: number, data: Partial<OrderForm>) {
    try {
      loading.value = 'loading'
      error.value = null
      
      const updatedOrder = await orderService.updateOrder(id, data)
      
      const index = orders.value.findIndex(order => order.orderId === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
      
      if (currentOrder.value?.orderId === id) {
        currentOrder.value = updatedOrder
      }
      
      loading.value = 'success'
      return updatedOrder
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function deleteOrder(id: number) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.deleteOrder(id)
      
      orders.value = orders.value.filter(order => order.orderId !== id)
      
      if (currentOrder.value?.orderId === id) {
        currentOrder.value = null
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  // Custom Commands
  async function placeOrder(command: PlaceOrderCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.placeOrder(command)
      
      // Refresh orders after placing
      await fetchOrderHistoryList({ userId: command.userId })
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function requestOrderPayment(command: RequestOrderPaymentCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.requestOrderPayment(command)
      
      // Refresh current order if it matches
      if (currentOrder.value?.orderId === command.orderId) {
        await fetchOrderById(command.orderId)
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function updateOrderHistory(command: UpdateOrderHistoryCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.updateOrderHistory(command)
      
      // Refresh current order if it matches
      if (currentOrder.value?.orderId === command.orderId) {
        await fetchOrderById(command.orderId)
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function displayOrderHistory(command: DisplayOrderHistoryCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.displayOrderHistory(command)
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function rollbackOrder(command: RollbackOrderCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.rollbackOrder(command)
      
      // Refresh current order if it matches
      if (currentOrder.value?.orderId === command.orderId) {
        await fetchOrderById(command.orderId)
      }
      
      loading.value = 'success'
    } catch (err) {
      loading.value = 'error'
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    }
  }

  async function readyOrderForShipment(command: ReadyOrderForShipmentCommand) {
    try {
      loading.value = 'loading'
      error.value = null
      
      await orderService.readyOrderForShipment(command)
      
      // Refresh current order if it matches
      if (currentOrder.value?.orderId === command.orderId) {
        await fetchOrderById(command.orderId)
      }
      
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
    orders.value = []
    currentOrder.value = null
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
    orders,
    currentOrder,
    pagination,
    loading,
    error,
    
    // Getters
    getOrderById,
    getOrdersByStatus,
    getOrdersByUser,
    isLoading,
    
    // Actions
    fetchOrderDetails,
    fetchOrderHistoryList,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    placeOrder,
    requestOrderPayment,
    updateOrderHistory,
    displayOrderHistory,
    rollbackOrder,
    readyOrderForShipment,
    clearError,
    resetStore,
  }
}) 