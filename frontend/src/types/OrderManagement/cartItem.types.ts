// Value Object Types
export interface ProductId {
  productId: number
}

export interface InventoryStockId {
  inventoryStockId: number
}

// Enum Types
export enum CartItemStatus {
  IN_CART = 'IN_CART',
  ORDERED = 'ORDERED',
  CANCELLED = 'CANCELLED'
}

// CartItem Aggregate Root
export interface CartItem {
  cartItemId: number
  userId: number
  size: string
  width: string
  isFlatFooted: boolean
  quantity: number
  status: CartItemStatus
  createdAt: Date
  updatedAt: Date
  productId: ProductId
  inventoryStockId: InventoryStockId
}

// Commands
export interface SelectProductOptionCommand {
  userId: number
  productId: ProductId
  size: string
  width: string
  isFlatFooted: boolean
}

export interface AddCartItemCommand {
  userId: number
  productId: ProductId
  size: string
  width: string
  isFlatFooted: boolean
  quantity: number
  inventoryStockId: InventoryStockId
}

// Events
export interface CartItemAdded {
  cartItemId: number
  userId: number
  productId: ProductId
  size: string
  width: string
  isFlatFooted: boolean
  quantity: number
  inventoryStockId: InventoryStockId
  addedAt: Date
}

export interface ProductOptionSelected {
  userId: number
  productId: ProductId
  size: string
  width: string
  isFlatFooted: boolean
  optionSelectedAt: Date
}

// Form Types
export interface CartItemForm {
  userId?: number
  productId?: number
  size: string
  width: string
  isFlatFooted: boolean
  quantity: number
  inventoryStockId?: number
}

// Query Parameters for ReadModels
export interface CartItemListQuery {
  userId?: number
  status?: CartItemStatus
  page?: number
  size?: number
} 