export class LoadingState {
  private element: HTMLElement | null = null
  private overlay: HTMLElement | null = null

  show(message = 'Loading...') {
    this.hide() // Remove any existing loading state

    this.overlay = document.createElement('div')
    this.overlay.className = 'modal-overlay'

    this.element = document.createElement('div')
    this.element.className = 'modal-content flex flex-col items-center gap-4'
    this.element.innerHTML = `
      <div class="spinner"></div>
      <p class="text-white text-lg">${message}</p>
    `

    this.overlay.appendChild(this.element)
    document.body.appendChild(this.overlay)
  }

  hide() {
    if (this.overlay) {
      this.overlay.remove()
      this.overlay = null
      this.element = null
    }
  }

  update(message: string) {
    if (this.element) {
      const textElement = this.element.querySelector('p')
      if (textElement) {
        textElement.textContent = message
      }
    }
  }
}

export const loadingState = new LoadingState()
