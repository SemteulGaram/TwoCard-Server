const Logger = require('./src/logger.js')
Logger.consoleLogLevel = Logger.Level.VERBOSE
const Server = require('./src/server.js')
const configServer = require('./src/config-server.js')

const log = Logger.createLogger('Index')

class TwoCard {
  constructor () {
    this.server = null
    this.config = configServer
  }

  async init () {
    log.i('Server starting...')
    await this.config.load()
    this.server = new Server(this, {
      httpEnable: this.config.get('httpEnable'),
      httpPort: this.config.get('httpPort'),
      httpsEnalbe: this.config.get('httpsEnable'),
      httpsPort: this.config.get('httpsPort'),
      httpsCert: this.config.get('httpsCert'),
      httpsPrivateKey: this.config.get('httpsPrivateKey')
    })
    await this.server.start()
  }
}

const app = new TwoCard()
app.init().then(() => {
  log.d('Main process reach end')
}).catch(err => {
  log.e('UNEXPECTED ERROR OCCUR:', err)
})
