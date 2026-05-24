const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    return;
  }

  const maxRetries = 5;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      const details = [
        `attempt=${attempt}/${maxRetries}`,
        `name=${err?.name || 'UnknownError'}`,
        `message=${err?.message || 'Unknown MongoDB error'}`,
      ];

      if (err?.code) {
        details.push(`code=${err.code}`);
      }

      if (err?.cause?.message) {
        details.push(`cause=${err.cause.message}`);
      }

      console.error(`MongoDB connection error: ${details.join(' | ')}`);

      if (err?.name === 'MongooseServerSelectionError' && uri.startsWith('mongodb+srv://')) {
        console.error(
          'Atlas SRV connection failed. Check the cluster Network Access list, confirm your current IP is allowed, and verify that no VPN, proxy, or TLS inspection software is blocking the connection.'
        );
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  console.error(
    'MongoDB connection failed after retries. If you are using Atlas, add your current IP to the cluster Network Access list and confirm the SRV URI, DNS resolution, and TLS interception settings.'
  );
};

module.exports = connectDB;
