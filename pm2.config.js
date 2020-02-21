module.exports = {
  app: [
    {
      name: 'pocket48-web',
      script: 'dist/server/index.js',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log'
    }
  ]
};