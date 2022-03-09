module.exports = {
  type: 'react-app',
  npm: {
    esModules: true,
    umd: false
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true
    }
  },
  webpack: {
    html: {
      template: './src/index.ejs',
      inject: false,
      environment: process.env.NODE_ENV,
    }
  }
}
