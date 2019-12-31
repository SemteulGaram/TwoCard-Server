(function () {
  class TwoCardClient {
    constructor () {
      this.canvas = null
      this.canvasCtx = null
      this.io = null
      this.socket = null

      window.addEventListener('load', event => { this._onLoad() })
    }

    _onResize () {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerheight
    }

    _onLoad () {
      this.canvas = document.querySelector('#app')
      this.canvasCtx = this.canvas.getContext('2d')

      this.io = io()
      this.io.on('connect', socket => {
        this.socket = socket
        console.log('connect')
      })
      this.io.on('reconnect', socket => {
        this.socket = socket
        console.log('reconnect')
      })
      this.io.on('disconnect', () => {
        this.socket = null
        console.log('disconnect')
      })

      window.addEventListener('resize', event => { this._onResize() })
      this._onResize()
    }
  }

  const app = new TwoCardClient()
  window.tmp = app
})()
