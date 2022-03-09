import mongoose from 'mongoose';

let attempts = 0;

class Database {
  constructor({
    url, user, pass, host, database
  }) {
    this.url = url || `mongodb://${user}:${pass}@${host}/${database}`;
  }

  connect() {
    return mongoose.connect(this.url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: process.env.NODE_ENV === 'development'
    })
      .then(() => {
        console.info('Database is initialized');
      })
      .catch((err) => {
        console.error(`Database connection error [${attempts}]`, err);
        setTimeout(() => {
          if (attempts > 10) {
            throw err;
          }
          attempts++;
          this.connect();
        }, 2000);
      });
  }

  disconnect() {
    return mongoose.disconnect(this.url)
      .then(() => {
        console.info('Database is disconnected');
      });
  }
}

export default Database;
