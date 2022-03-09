import path from 'path';
import packageJson from '../../package.json';

export default {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: packageJson.name,
      description: 'API Documentation'
    },
    basePath: '/',
    schemes: ['http', 'https'],
    produces: ['application/json'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Enter in format: `Bearer {access_token}`'
      }
    },
    basedir: path.join(__dirname, '..')
  },
  route: {
    url: '/docs',
    docs: '/docs.json'
  },
  files: [path.join(__dirname, '../routes/*.js')]
};
