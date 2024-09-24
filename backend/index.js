import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from "./routes/application.route.js";
// import path from "path"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // This is needed if you are working with cookies for authentication
};

app.use(cors(corsOptions));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use("/api/v1/application", applicationRoute);

// const corsOptions = {
//   origin: 
//   // 'https://job-portal-qpq4.onrender.com', 
//   " http://localhost:8000",
//   credentials: true
// };
// app.use(express.static(path.join(_dirname,'/frontend/dist')));
// app.get ('*',(_,res)=>{
//   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
// })



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




// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './utils/db.js';
// import userRoute from './routes/user.route.js';
// import companyRoute from './routes/company.route.js';
// import jobRoute from './routes/job.route.js';
// import applicationRoute from "./routes/application.route.js";
// import path from "path"
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// const _dirname = path.resolve()
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//   origin: 'https://job-portal-qpq4.onrender.com',
//   credentials: true
// };

// app.use(cors(corsOptions));
// app.use('/api/v1/user', userRoute);
// app.use('/api/v1/company', companyRoute);
// app.use('/api/v1/job', jobRoute);
// app.use("/api/v1/application", applicationRoute);
// app.use(express.static(path.join(_dirname,'/frontend/dist')));
// app.get ('*',(_,res)=>{
//   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
// })
// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: 'Something went wrong!',
//     success: false
//   });
// });

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running at port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to connect to the database', error);
//     process.exit(1); // Exit the process with failure
//   }
// };

// startServer();