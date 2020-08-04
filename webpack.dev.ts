import os from 'os';
import merge from 'webpack-merge';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import common, { BUILD_RESOURCE_NAME, isWindows, PUBLIC_PATH } from './webpack.common';

// Network
const exportPort = Number(process.env.PORT) || 8001;
const ips = os.networkInterfaces();
const availableIpv4 = Object.values(ips)
  .map(item => item!.filter(addr => addr.family === 'IPv4' && !addr.internal)) // 只输出外网地址
  .reduce((acc, item) => acc.concat(item), [])
  .map(item => item.address);

const devServer = {
  disableHostCheck: true,
  historyApiFallback: {
    rewrites: [{ from: new RegExp(`^${PUBLIC_PATH}(?!${BUILD_RESOURCE_NAME})`), to: PUBLIC_PATH }],
  },
  hot: true,
  compress: true,
  quiet: true,
  overlay: true,
  host: isWindows ? availableIpv4[0] || '127.0.0.1' : '0.0.0.0',
  port: exportPort,
  proxy: {
    [`${PUBLIC_PATH}api`]: {
      target: 'http://localhost',
      secure: false,
      changeOrigin: true,
    },
  },
};

export default merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer,
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Server is running: http://${availableIpv4[0]}:${devServer.port}${PUBLIC_PATH}`],
      },
      clearConsole: true,
    }),
  ],
});
