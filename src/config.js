const fs = require('fs')

const JsonBeautify = require('json-beautify')

const Logger = require('./logger.js')

const fsp = fs.promises

/**
 * Common config manager
 *
 * @since 2019-12-30
 * @class
 */
class Config {
  /**
   * Common config manager
   *
   * @since 2019-12-30
   * @constructor
   * @param {string} name - Name of config
   * @param {string} path - Path of config file
   * @param {object} defaultConfig - Default content of config
   */
  constructor (name, path, defaultConfig) {
    this.log = Logger.createLogger(`Config#${ name }`)
    this.log.v('constructor enter')

    this.name = name
    this.path = path
    this.defaultConfig = defaultConfig
    this.ready = false
    this._v = {}

    this.log.i(`instance created`)
    this.log.v('constructor leave')
  }

  /**
   * Load config
   *
   * @since 2019-12-30
   * @async
   * @return {Promise<void,Error>}
   */
  async load () {
    this.log.v('load enter')
    this.log.i('initializing...')
    try {
      this._v = JSON.parse(await fsp.readFile(this.path, 'utf-8'))
      this.ready = true
    } catch (err) {
      if (err.code === 'ENOENT') {
        try {
          this.log.w('File not found. Create one...')
          await this._createConfig()
          this._v = JSON.parse(await fsp.readFile(this.path, 'utf-8'))
          this.ready = true
        } catch (err2) {
          this.log.e('load fail 2: ', err, err2)
          throw err
        }
      } else {
        this.log.e('load fail: ', err)
        throw err
      }
    }
    this.log.v('load leave')
    return
  }

  /**
   * Get config value
   *
   * @since 2019-12-30
   * @param {Any} key - Key of value
   * @return {Any} Value of key
   * @throw {Error} - (code: ERR_NOT_LOADED) Config muse load before use
   */
  get (key) {
    if (!this.ready) {
      const err = new Error('Config must load before use')
      err.code = 'ERR_NOT_LOADED'
      throw err
    }
    return this._v[key]
  }

  /**
   * Set config value
   *
   * @since 2019-12-30
   * @param {Any} key - Key of value
   * @param {Any} value - Value of key
   */
  set (key, value) {
    this._v[key] = value
  }

  /**
   * Save config to file
   *
   * @since 2019-12-30
   * @async
   * @return {Promise<void,FilesystemError>}
   */
  async save() {
    return await fs.promises.writeFile(this.path,
      JsonBeautify(this._v, null, 2, 80), 'utf-8');
  }

  /**
   * Create new config file to given default config
   *
   * @since 2019-12-30
   * @async
   * @return {Promise<void,FilesystemError>}
   */
  async _createConfig() {
    return await fsp.writeFile(this.path,
      JsonBeautify(this.defaultConfig, null, 2, 80), 'utf-8');
  }
}

module.exports = Config
