const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

// connect to MongoDB (logs success or error)
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
