import { toast } from "sonner";

export const showToast = (message: string) => {
  toast.success(message)
}

export const showError = (message: string) => {
  toast.error(message)
}

export const showWarning = (message: string) => {
  toast.warning(message)
}