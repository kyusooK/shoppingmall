import apiClient from '@/services/api/client'
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
  ReadyOrderForShipmentCommand
} from '@/types/OrderManagement/order.types'
import type { ApiResponse, PaginatedResponse } from '@/types/common.types'

export class OrderService {
  private readonly baseUrl = '/orders'

  // ReadModel: 주문 상세 조회 (OrderDetails)
  async getOrderDetails(query: OrderDetailsQuery): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`${this.baseUrl}/${query.orderId}`)
    return response.data.data
  }

  // ReadModel: 주문 이력 목록 조회 (OrderHistoryList)
  async getOrderHistoryList(query: OrderHistoryListQuery = {}): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams()
    
    if (query.userId) params.append('userId', query.userId.toString())
    if (query.status) params.append('status', query.status)
    if (query.page) params.append('page', query.page.toString())
    if (query.size) params.append('size', query.size.toString())

    const response = await apiClient.get<PaginatedResponse<Order>>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  // Standard CRUD: Get by ID
  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  // Standard CRUD: Create
  async createOrder(data: OrderForm): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(this.baseUrl, data)
    return response.data.data
  }

  // Standard CRUD: Update
  async updateOrder(id: number, data: Partial<OrderForm>): Promise<Order> {
    const response = await apiClient.put<ApiResponse<Order>>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  // Standard CRUD: Delete
  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Custom Command: 주문 생성 (PlaceOrder)
  async placeOrder(command: PlaceOrderCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/placeorder`, command)
  }

  // Custom Command: 주문 결제 요청 (RequestOrderPayment)
  async requestOrderPayment(command: RequestOrderPaymentCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/requestorderpayment`, command)
  }

  // Custom Command: 주문 이력 갱신 (UpdateOrderHistory)
  async updateOrderHistory(command: UpdateOrderHistoryCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/updateorderhistory`, command)
  }

  // Custom Command: 주문 이력 노출 (DisplayOrderHistory)
  async displayOrderHistory(command: DisplayOrderHistoryCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/displayorderhistory`, command)
  }

  // Custom Command: 주문 롤백 (RollbackOrder)
  async rollbackOrder(command: RollbackOrderCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/rollbackorder`, command)
  }

  // Custom Command: 주문 출고 준비 (ReadyOrderForShipment)
  async readyOrderForShipment(command: ReadyOrderForShipmentCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/readyorderforshipment`, command)
  }
}

export const orderService = new OrderService() 