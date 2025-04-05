/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Format API response with consistent structure
 * @param message Response message
 * @param data Optional data payload
 * @returns Formatted API response
 */
export function formatResponse<T = any>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Format error response with consistent structure
 * @param message Error message
 * @returns Formatted error response
 */
export function formatError(message: string): ApiResponse {
  return {
    success: false,
    message,
  };
}
