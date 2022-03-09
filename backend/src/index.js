import { start } from './service';

start()
  .then(() => {
    console.info(`Service Ready! Site: http://localhost:${process.env.SERVER_PORT}/docs`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(5);
  });
