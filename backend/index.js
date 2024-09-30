// // server.js
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import connectDB from './utils/db.js';
// import userRoute from './routes/user.route.js';
// import companyRoute from './routes/company.route.js';
// import jobRoute from './routes/job.route.js';
// import applicationRoute from './routes/application.route.js';
// import adminRoutes from './routes/adminRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import chatHandler from './middlewares/chatHandler.js';
// import path from 'path';

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const PORT = process.env.PORT || 3000;

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(helmet());
// app.use(morgan('dev'));

// // CORS setup
// const corsOptions = {
//   origin: 'http://localhost:5173', // Adjust to match your client URL
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // API Routes
// app.use('/api/v1/user', userRoute);
// app.use('/api/v1/company', companyRoute);
// app.use('/api/v1/job', jobRoute);
// app.use('/api/v1/application', applicationRoute);
// app.use('/api/v1', adminRoutes);
// app.use('/api/v1/chat', chatRoutes);

// // Serve static files for frontend
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
// app.get('*', (_, res) => {
//   res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
// });

// // Socket.IO setup
// const io = new Server(httpServer, {
//   cors: corsOptions,
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   chatHandler(io, socket);
// });

// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   const statusCode = err.status || 500;
//   res.status(statusCode).json({
//     message: err.message || 'Something went wrong!',
//     success: false,
//   });
// });

// // Start server and connect to the database
// const startServer = async () => {
//   try {
//     await connectDB();
//     httpServer.listen(PORT, () => {
//       console.log(`Server running at port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to connect to the database', error);
//     process.exit(1);
//   }
// };

// // Graceful shutdown handling
// const shutdown = (signal) => {
//   console.log(`${signal} signal received: closing HTTP server`);
//   httpServer.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// };

// process.on('SIGTERM', () => shutdown('SIGTERM'));
// process.on('SIGINT', () => shutdown('SIGINT'));

// startServer();




// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import chatHandler from './middlewares/chatHandler.js';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// CORS setup
const corsOptions = {
  origin: 'https://job-portal-u3t0.onrender.com', // Adjust to match your client URL
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationRoute);
app.use('/api/v1', adminRoutes);
app.use('/api/v1/chat', chatRoutes);

// Serve static files for frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

// Socket.IO setup
const io = new Server(httpServer, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('A user connected');
  chatHandler(io, socket);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
    success: false,
  });
});

// Start server and connect to the database
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server`);
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();

