const path = require('path')

const Config = require('./config');

module.exports = new Config('server-setting',
  path.join(process.cwd(), 'server-setting.json'))
