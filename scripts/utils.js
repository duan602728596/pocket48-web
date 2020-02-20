const path = require('path');
const fse = require('fs-extra');

/* 文件路径 */
const files = {
  server: ['../src/server/**/*.js', '../dist/server'],
  pug: ['../src/template/**/*.pug', '../dist/template'],
  sass: ['../src/statics/style/**/*.sass', '../dist/statics/style'],
  js: ['../src/statics/script/**/*.js', '../dist/statics/script'],
  files: ['../src/statics/files/**/*.js', '../dist/statics/script'],
  image: ['../src/statics/image/**/*.{png,jpg,jpeg,gif,webp,ico}', '../dist/statics/image']
};

/* babel配置 */
const plugins = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-syntax-bigint'
];
const babelNodeConfig = {
  presets: [[
    '@babel/preset-env',
    {
      targets: { browsers: ['node 10'] },
      debug: true,
      modules: 'commonjs',
      useBuiltIns: 'usage'
    }
  ]],
  plugins: [
    ...plugins,
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: { version: 3, proposals: true },
        helpers: true,
        regenerator: true,
        useESModules: true
      }
    ]
  ]
};
const babelConfig = {
  presets: [[
    '@babel/preset-env',
    {
      targets: {
        browsers: [
          'last 2 versions',
          'last 10 Chrome versions',
          'last 1 year',
          'IE 11'
        ]
      },
      debug: true,
      modules: false,
      useBuiltIns: false
    }
  ]],
  plugins
};

function css(id) {
  const file = path.join(__dirname, `../src/statics/style/${ id }.css.json`);
  const modulePath = require.resolve(file);

  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(file), 1);
  }

  delete require.cache[modulePath];

  return require(file);
}

function classNames(...args) {
  return args.join(' ');
}

module.exports = { files, babelNodeConfig, babelConfig, css, classNames };