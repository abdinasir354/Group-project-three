const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const AdminRoutes = require('./routes/AdminRoutes');
const StudentRoutes = require('./routes/StudentRoutes');

// Middleware
const corsOptions = {
  origin: [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Extra safety: always attach CORS headers for local frontend during development
app.use((req, res, next) => {
  const allowedOrigins = corsOptions.origin;
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// Routes
app.use('/api/admin', AdminRoutes.router);
app.use('/api/student', StudentRoutes);

app.get('/api', (req, res) => {
  res.send('Quiz Master API is Running');
});

// Database Connection
mongoose.set('bufferCommands', false);

const primaryMongoUrl = process.env.MONGO_URL;
const fallbackMongoUrl = process.env.MONGO_FALLBACK_URL || 'mongodb://127.0.0.1:27017/quizmaster';
const mongoConnectOptions = { serverSelectionTimeoutMS: 5000 };

const connectDatabase = async () => {
  if (primaryMongoUrl) {
    try {
      await mongoose.connect(primaryMongoUrl, mongoConnectOptions);
      console.log('✅ Database Connected (primary)');
      return;
    } catch (primaryErr) {
      console.error('❌ Primary database connection error:', primaryErr.message);
    }
  } else {
    console.error('❌ MONGO_URL is not set in backend/.env');
  }

  try {
    await mongoose.connect(fallbackMongoUrl, mongoConnectOptions);
    console.log('✅ Database Connected (fallback/local)');
  } catch (fallbackErr) {
    console.error('❌ Fallback database connection error:', fallbackErr.message);
    console.error('❌ Registration/Login will fail until database is reachable.');
  }
};

connectDatabase();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
