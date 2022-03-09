import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';

import swaggerGenerator from 'express-swagger-generator';
import cors from 'cors';

import Routes from './routes';
import swaggerDocs from './docs';

import Database from './services/database';

const app = express();
const services = {};

// Added cors
app.use(cors());

// Add Body Parser Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// Add swagger docs
swaggerGenerator(app)(swaggerDocs);

// All routes
app.use('/', Routes);

/**
 * Return 404 if route does not exist
 */
app.use('*', (req, res) => res.status(404).send('Not found'));

export const start = ({ withDb = true } = {}) => new Promise(
  (resolve, reject) => {
    services.server = app.listen(process.env.SERVER_PORT || 3100, async () => {
      if (withDb) {
        services.database = new Database({
          url: process.env.MONGO_URL,
          user: process.env.MONGO_USER,
          pass: process.env.MONGO_PASSWORD,
          host: process.env.MONGO_HOST,
          database: process.env.MONGO_DATABASE
        });
        try {
          await services.database.connect();
        } catch (err) {
          return reject(err);
        }
      }
      resolve();
    });
    services.server.on('error', reject);
  }
);

export const stop = () => new Promise((resolve, reject) => {
  if (!services.server) return resolve();
  if (!services.database) return reject();
  services.database.disconnect().then(() => {
    services.server.on('error', reject);
    services.server.close(resolve);
  }).catch(reject);
});

// Handle Graceful Shutdown
process.on('SIGTERM', () => {
  if (services.server && services.server.close) {
    services.server.close();
  }
});
