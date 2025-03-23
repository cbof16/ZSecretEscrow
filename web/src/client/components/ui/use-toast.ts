// Re-export from the toast component
import { useToast as useToastHook, type Toast, type ToastVariant } from "./toast"

export { ToastContainer } from "./toast"

export const useToast = useToastHook

export type { Toast, ToastVariant } 