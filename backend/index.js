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
// import applicationRoute from "./routes/application.route.js";
// import adminRoutes from './routes/adminRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import chatHandler from './middlewares/chatHandler.js';

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//   origin: 'http://localhost:5173', // Your frontend URL
//   credentials: true, // This is needed if you are working with cookies for authentication
// };

// app.use(cors(corsOptions));
// app.use(helmet());
// app.use(morgan('dev'));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // API Routes
// app.use('/api/v1/user', userRoute);
// app.use('/api/v1/company', companyRoute);
// app.use('/api/v1/job', jobRoute);
// app.use("/api/v1/application", applicationRoute);
// app.use('/api/v1', adminRoutes);
// app.use('/api/v1/chat', chatRoutes);

// // Socket.IO setup
// const io = new Server(httpServer, {
//   cors: corsOptions
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   chatHandler(io, socket);
// });

// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: 'Something went wrong!',
//     success: false,
//   });
// });

// const startServer = async () => {
//   try {
//     await connectDB();
//     httpServer.listen(PORT, () => {
//       console.log(`Server running at port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to connect to the database', error);
//     process.exit(1); // Exit the process with failure
//   }
// };

// startServer();

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server')
//   httpServer.close(() => {
//     console.log('HTTP server closed')
//   })
// })




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
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const _dirname = path.resolve()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'https://job-portal-qpq4.onrender.com',
  credentials: true
};

app.use(cors(corsOptions));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use('/api/v1', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
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
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1); // Exit the process with failure
  }
};

startServer();