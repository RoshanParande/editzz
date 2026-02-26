const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  if (!env.MONGO_URI || !/^mongodb(\+srv)?:\/\//.test(env.MONGO_URI)) {
    throw new Error('MONGO_URI must be a valid mongodb:// or mongodb+srv:// URI');
  }

  try {
    await mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DB_NAME, family: 4 });
  } catch (err) {
    const msg = String(err?.message || '');
    const canFallback = /^mongodb:\/\//.test(env.MONGO_URI_FALLBACK);
    const isSrvDnsIssue =
      msg.includes('querySrv') || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED');

    if (!canFallback || !isSrvDnsIssue) {
      throw err;
    }

    console.warn(`Primary Mongo SRV connection failed: ${msg}`);
    console.warn('Trying MONGO_URI_FALLBACK (non-SRV mongodb://)...');
    await mongoose.connect(env.MONGO_URI_FALLBACK, { dbName: env.MONGO_DB_NAME, family: 4 });
  }
}

module.exports = { connectDatabase };

