const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./src/configs/database');
const movieRoutes = require('./src/routes/movieRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', movieRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Movie API',
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();