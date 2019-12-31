const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const Koa = require('koa')
const KoaLogger = require('koa-logger')
const KoaStatic = require('koa-static')
const SocketIo = require('socket.io')

const Logger = require('./logger.js')

const fsp = fs.promises
const log = Logger.createLogger('Server')

class Server extends EventEmitter {
  constructor (ctx, options = {}) {
    log.v('constructor enter')
    super()
    this.ctx = ctx

    // options
    this.options = Object.assign({
      httpPort: 3000,
      httpEnable: true,
      httpsPort: 3001,
      httpsEnable: false
    }, options)

    // initialize
    this.http = { run: false, server: null }
    this.https = { run: false, server: null }

    // Koa initialize
    this.koa = new Koa()
    this.koa.on('error', err => {
      log.e('Koa Error Occur:', err)
    })

    this.koa.use(KoaLogger())
    this.koa.use(KoaStatic(path.resolve(__dirname, '../client/')))

    // socket.io initialize
    this.socketIo = new SocketIo()
    this._socketIoHandle()

    log.v('constructor leave')
  }

  async start () {
    log.v('start enter')
    log.i('Server starting...')
    this.emit('starting')

    //await fsp.copyFile('./node_modules/socket.io-client/dist/socket.io.dev.js')

    log.v('start leave')
    const that = this
    return new Promise(async (resolve, reject) => {
      const promiseList = []

      if (this.options.httpEnable) {
        promiseList.push(new Promise((resolve, reject) => {
          this.http.server = http.createServer(this._httpCallback())
          this.http.server.on('listening', () => {
            log.i(`http server start on port ${ this.options.httpPort }`)
            resolve()
          })
          this.http.server.on('error', err => { reject(err) })
          this.http.server.listen(this.options.httpPort)
          this.socketIo.attach(this.http.server)
          this.http.run = true
        }))
      }

      if (this.options.httpsEnables) {
        promiseList.push(new Promise(async (resolve, reject) => {
          this.https.server = https.createServer({
            cert: await fsp.readFile(this.options.httpsCert),
            key: await fsp.readFile(this.options.httpsPrivateKey)
          }, this._httpCallback())
          this.https.server.on('listening', () => {
            log.i(`https server start on port ${ this.options.httpsPort }`)
            resolve()
          })
          this.https.server.on('error', err => { reject(err) })
          this.https.server.listen(this.options.httpsPort)
          this.socketIo.attach(this.https.server)
          this.https.run = true
        }))
      }

      await Promise.all(promiseList)
      this.emit('started')
    })
  }

  _httpCallback () {
    return this.koa.callback()
  }

  _socketIoHandle () {
    this.socketIo.on('connection', socket => {
      console.log('connection')
    })
  }
}

module.exports = Server
