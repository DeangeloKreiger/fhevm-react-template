export type ToastType = 'success' | 'error' | 'info'

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast')
  if (existingToast) {
    existingToast.remove()
  }

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, duration)
}

export function showError(message: string) {
  showToast(message, 'error', 4000)
}

export function showSuccess(message: string) {
  showToast(message, 'success', 3000)
}

export function showInfo(message: string) {
  showToast(message, 'info', 3000)
}
