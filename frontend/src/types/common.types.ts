// Common API Response Types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Common Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Common Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date'
  required?: boolean
  options?: { value: any; label: string }[]
  validation?: any
}

// Common Status Types
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

// Common ID Types
export interface BaseId {
  [key: string]: number | string
} 