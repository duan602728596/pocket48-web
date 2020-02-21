const path = require('path');

module.exports = {
  apps: [
    {
      name: 'pocket48-web',
      script: 'dist/server/index.js',
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      env: {
        NODE_ENV: 'production'
      },
      env_https: {
        NODE_ENV: 'production',
        KEY: 'server.key',
        CERT: 'server.crt'
      }
    }
  ]
};