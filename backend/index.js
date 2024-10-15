// // Import necessary modules
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
// import blogRoute from './routes/blog.route.js';
// import pageRoutes from './routes/pageRoutes.js';
// import path from 'path';
// import productRoute from './routes/productRoutes.js';
// // Load environment variables 
// dotenv.config();

// // Initialize Express app and create HTTP server
// const app = express();
// const httpServer = createServer(app);
// const PORT = process.env.PORT || 3000;

// // Set up middleware
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// app.use(cookieParser()); // Parse cookies
// app.use(helmet()); // Set security-related HTTP headers
// app.use(morgan('dev')); // HTTP request logger

// // Set up CORS
// const corsOptions = {
//   origin: 'http://localhost:5173', // Allow requests from this origin
//   credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent
// };
// app.use(cors(corsOptions));

// // Set up rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Limit each IP to 1000 requests per windowMs
// });
// app.use(limiter);

// // Set up API routes
// app.use('/api/v1/user', userRoute);
// app.use('/api/v1/company', companyRoute);
// app.use('/api/v1/job', jobRoute);
// app.use('/api/v1/application', applicationRoute);
// app.use('/api/v1', adminRoutes);
// app.use('/api/v1/chat', chatRoutes);
// app.use('/api/v1/blog', blogRoute);
// app.use('/api/v1/page', pageRoutes);
// app.use('/api/v1/product', productRoute);

// // Serve static files for frontend
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
// app.get('*', (_, res) => {
//   res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
// });

// // Set up Socket.IO
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

// // Function to start the server and connect to the database
// const startServer = async () => {
//   try {
//     await connectDB();
//     httpServer.listen(PORT, () => {
//       console.log(`Server running at port ${PORT}`);
      
//       // Set up auto-reload mechanism
//       setInterval(() => {
//         https.get('https://job-portal-u3t0.onrender.com', (res) => {
//           console.log('Auto-reload request sent. Status:', res.statusCode);
//         }).on('error', (err) => {
//           console.error('Error during auto-reload request:', err.message);
//         });
//       }, 60000); // 60000 ms = 1 minute
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

// // Start the server
// startServer();



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
import applicationRoute from "./routes/application.route.js";
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import chatHandler from './middlewares/chatHandler.js';
import blogRoute from './routes/blog.route.js';
import productRoute from './routes/productRoutes.js';
import path from 'path';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 3000;

const _dirname = path.resolve()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'https://job-portal-u3t0.onrender.com',
  credentials: true
};

app.use(cors(corsOptions));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use('/api/v1', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/blog', blogRoute);
app.use('/api/v1/product', productRoute);

app.use(express.static(path.join(_dirname,'/frontend/dist')));
app.get ('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    success: false
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
      
      // Set up auto-reload mechanism
      setInterval(() => {
        https.get('https://job-portal-u3t0.onrender.com', (res) => {
          console.log('Auto-reload request sent. Status:', res.statusCode);
        }).on('error', (err) => {
          console.error('Error during auto-reload request:', err.message);
        });
      }, 60000); // 60000 ms = 1 minute
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
