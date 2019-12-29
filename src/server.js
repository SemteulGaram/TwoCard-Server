const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const KoaLogger = require('koa-logger')
const KoaStatic = require('koa-static')
const SocketIo = require('socket.io')

const Logger = require('./logger.js')

const fsp = fs.promises
const log = Logger.createLogger('Server')

class Server extends EventEmitter {
  constructor (ctx, options = {}) {
    log.v('Server constructor enter')
    this.ctx = ctx

    // options
    this.options = options
    this.options.httpPort = 3000
    this.options.httpEnable = true
    this.options.httpsPort = 3001
    this.options.httpsEnable = false

    // initialize
    this.http = { run: false, server: null }
    this.https = { run: false, server: null }

    // Koa initialize
    this.koa = new Koa()
    that.koa.on('error', err => {
      log.e('Koa Error Occur:', err)
    })

    // socket.io initialize
    this.socketIo = new SocketIo()

    log.v('Server constructor leave')
  }

  async startServer () {
    log.v('startServer enter')
    log.i('Server starintg...')
    this.emit('serverStarting')

    // TODO: copy static file
    //fsp.copyFile('./node_modules/socket.io-client/dist/socket.io.dev.js')

    const that = this
    return new Promise((resolve, reject) => {

      // TODO: start file
      this.emit('serverStart')
    })
    log.v('startServer leave')
  }
}
