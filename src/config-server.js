const path = require('path')

const Config = require('./config');

module.exports = new Config('server-setting',
  path.join(process.cwd(), 'server-setting.json'), {
    httpEnable: true,
    httpPort: 7150,
    httpsEnable: false,
    httpsPort: 7151,
    httpsCert: '[cert path]',
    httpsPrivateKey: '[private key path]'
  }
)
