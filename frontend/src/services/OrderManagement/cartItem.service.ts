import apiClient from '@/services/api/client'
import type { 
  CartItem, 
  CartItemForm, 
  CartItemListQuery,
  SelectProductOptionCommand,
  AddCartItemCommand 
} from '@/types/OrderManagement/cartItem.types'
import type { ApiResponse, PaginatedResponse } from '@/types/common.types'

export class CartItemService {
  private readonly baseUrl = '/cartItems'

  // ReadModel: 장바구니 내역 조회 (CartItemList)
  async getCartItems(query: CartItemListQuery = {}): Promise<PaginatedResponse<CartItem>> {
    const params = new URLSearchParams()
    
    if (query.userId) params.append('userId', query.userId.toString())
    if (query.status) params.append('status', query.status)
    if (query.page) params.append('page', query.page.toString())
    if (query.size) params.append('size', query.size.toString())

    const response = await apiClient.get<PaginatedResponse<CartItem>>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  // Standard CRUD: Get by ID
  async getCartItemById(id: number): Promise<CartItem> {
    const response = await apiClient.get<ApiResponse<CartItem>>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  // Standard CRUD: Create
  async createCartItem(data: CartItemForm): Promise<CartItem> {
    const response = await apiClient.post<ApiResponse<CartItem>>(this.baseUrl, data)
    return response.data.data
  }

  // Standard CRUD: Update
  async updateCartItem(id: number, data: Partial<CartItemForm>): Promise<CartItem> {
    const response = await apiClient.put<ApiResponse<CartItem>>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  // Standard CRUD: Delete
  async deleteCartItem(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Custom Command: 상품 옵션 선택 (SelectProductOption)
  async selectProductOption(command: SelectProductOptionCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/selectproductoption`, command)
  }

  // Custom Command: 장바구니에 상품 추가 (AddCartItem)
  async addCartItem(command: AddCartItemCommand): Promise<void> {
    await apiClient.post(`${this.baseUrl}/addcartitem`, command)
  }
}

export const cartItemService = new CartItemService() 