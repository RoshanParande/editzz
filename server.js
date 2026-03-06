const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDatabase()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error('Server is still running, but DB-backed routes may fail.');
  });

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
  } finally {
    process.exit(0);
  }
});
