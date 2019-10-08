import SmoothItem from './SmoothItem'
import { IOGLCanvas } from '../../components/page-loader/OGLCanvas'
import { $scrollTarget } from '../dom-selectors'

class SmoothEtablera extends SmoothItem {
  disabled: boolean = false
  nextOffset: number = 500
  oglCanvas: IOGLCanvas
  shouldScale: boolean

  constructor(el: HTMLElement, current: HTMLElement, shouldScale: boolean) {
    super(el)

    if (!el) return
    this.shouldScale = shouldScale
    this.DOM.current = current
    this.DOM.nextContent = $scrollTarget.resolve()
    this.renderedStyles = {
      fade: {
        previous: 0,
        current: 0,
        ease: 0.2,
        setValue: () => {
          const max = this.nextOffset
          const value = Math.min(Math.max(this.smooth.docScroll / max, 0), 1)

          return value
        },
      },
    }
    this.getSize()
    this.update()
  }

  appendCanvas(canvasEl: HTMLElement, oglCanvas: IOGLCanvas) {
    this.DOM.current = canvasEl
    this.oglCanvas = oglCanvas
    this.shouldScale = false
  }

  getSize() {
    const rect = this.DOM.el.getBoundingClientRect()
    this.props = {
      height: rect.height,
      width: rect.width,
      left: this.smooth.docScroll + rect.left,
      top: this.smooth.docScroll + rect.top,
    }
    if (this.DOM.nextContent) {
      const { height } = this.DOM.nextContent.getBoundingClientRect()
      this.nextOffset = this.smooth.winSize.height / 3 - height / 3
    }
  }

  cleanUp = () => {
    this.oglCanvas && this.oglCanvas.pause()
    if (this.DOM.current) this.DOM.current.style.opacity = '0'
    if (this.DOM.description) {
      this.DOM.description.style.opacity = '0'
    }
  }

  onEnter = () => {
    this.oglCanvas && this.oglCanvas.play()
  }

  appendDescription = (description: HTMLElement) => {
    this.DOM.description = description
  }

  layout = () => {
    if (this.disabled) return
    const opacity = (1 - this.renderedStyles.fade.previous).toFixed(2)
    const scale = 1.65 * this.renderedStyles.fade.previous + 1

    if (this.DOM.current) {
      this.DOM.current.style.opacity = opacity

      if (this.shouldScale) {
        this.DOM.current.style.transform = `translate(-50%, -50%) scale(${scale})`
      } else {
        this.oglCanvas &&
          this.oglCanvas.setScale(0.8 * this.renderedStyles.fade.previous + 1)
      }
    }

    if (this.DOM.description) {
      this.DOM.description.style.opacity = opacity
    }
  }
}

export default SmoothEtablera
