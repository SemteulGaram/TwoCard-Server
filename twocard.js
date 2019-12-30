const Logger = require('./src/logger.js')
const Server = require('./src/server.js')
const configServer = require('./src/config-server.js')

const log = Logger.createLogger('Index')

class TwoCard {
  constructor () {
    this.server = new Server()
    this.config = configServer
  }

  async init () {
    log.i('Server starting...')
    await this.config.load()
    await this.server.start()
  }
}
// TODO
//const app = new Server()
