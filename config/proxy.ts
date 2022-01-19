/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

import config from './amsConfig';

// 设置数据库地址
const { system } = config;

// const proxyIP = system === 'asset' ? '10.10.38.240' : '10.10.38.229';
const proxyIP = system === 'asset' ? '127.0.0.1' : '10.10.38.229';

export default {
  dev: {
    '/account/': {
      target: `http://${proxyIP}:8901/`,
      changeOrigin: true,
      pathRewrite: { '^/account': '' },
    },
    '/location/': {
      target: `http://${proxyIP}:8961/`,
      changeOrigin: true,
      pathRewrite: { '^/location': '' },
    },
    '/location_wafer/': {
      target: `http://${proxyIP}:8970/`,
      changeOrigin: true,
      pathRewrite: { '^/location_wafer': '' },
    },
    '/map/': {
      target: `http://${proxyIP}:8931/`,
      changeOrigin: true,
      pathRewrite: { '^/map': '' },
    },
    '/analysis/': {
      target: `http://${proxyIP}:8907/`,
      changeOrigin: true,
      pathRewrite: { '^/analysis': '' },
    },
    '/device/': {
      target: `http://${proxyIP}:8902/`,
      changeOrigin: true,
      pathRewrite: { '^/device': '' },
    },
    '/motor/': {
      target: `http://${proxyIP}:9012/`,
      changeOrigin: true,
      pathRewrite: { '^/motor': '' },
    },
    '/asset/': {
      target: `http://${proxyIP}:8905/`,
      changeOrigin: true,
      pathRewrite: { '^/asset': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
