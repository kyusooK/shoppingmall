// Value Object Types
export interface CartItemId {
  cartItemId: number
}

// Enum Types
export enum OrderStatus {
  PLACED = 'PLACED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED'
}

export enum OrderPaymentStatus {
  NOT_REQUESTED = 'NOT_REQUESTED',
  REQUESTED = 'REQUESTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Entity Types
export interface OrderItem {
  productId: number
  size: string
  width: string
  isFlatFooted: boolean
  quantity: number
  price: number
}

export interface OrderHistory {
  status: OrderStatus
  changedAt: Date
}

// Order Aggregate Root
export interface Order {
  orderId: number
  userId: number
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  orderHistory: OrderHistory[]
  createdAt: Date
  updatedAt: Date
  cartItemId: string // Note: metadata shows this as string "N/A"
}

// Commands
export interface PlaceOrderCommand {
  userId: number
  cartItemIds: CartItemId[]
}

export interface RequestOrderPaymentCommand {
  orderId: number
}

export interface UpdateOrderHistoryCommand {
  orderId: number
  status: OrderStatus
}

export interface DisplayOrderHistoryCommand {
  orderId: number
}

export interface RollbackOrderCommand {
  orderId: number
  rollbackReason: string
}

export interface ReadyOrderForShipmentCommand {
  orderId: number
}

// Events
export interface OrderPlaced {
  orderId: number
  userId: number
  items: OrderItem[]
  status: OrderStatus
  createdAt: Date
}

export interface OrderPaymentRequested {
  orderId: number
  userId: number
  items: OrderItem[]
  totalAmount: number
  paymentStatus: OrderPaymentStatus
}

export interface OrderHistoryUpdated {
  orderId: number
  status: OrderStatus
  updatedAt: Date
}

export interface OrderHistoryDisplayed {
  orderId: number
  userId: number
  items: OrderItem[]
  status: OrderStatus
  displayedAt: Date
}

export interface OrderReadyForShipment {
  orderId: number
  items: OrderItem[]
  readyForShipmentAt: Date
}

export interface OrderRolledBack {
  orderId: number
  rollbackReason: string
  rolledBackAt: Date
}

export interface OrderPlacementFailedDueToMissingOption {
  userId: number
  cartItemIds: CartItemId[]
  errorMessage: string
}

// Form Types
export interface OrderForm {
  userId?: number
  cartItemIds: number[]
}

// Query Parameters for ReadModels
export interface OrderDetailsQuery {
  orderId: number
}

export interface OrderHistoryListQuery {
  userId?: number
  status?: OrderStatus
  page?: number
  size?: number
} 