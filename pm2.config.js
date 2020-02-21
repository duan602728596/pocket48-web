module.exports = {
  apps: [
    {
      name: 'pocket48-web',
      script: 'npm',
      args: 'run start:https',
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log'
    }
  ]
};