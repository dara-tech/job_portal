import express from 'express';
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob, // Make sure to import deleteJob if you add the delete route
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Public route to get all jobs
router.route("/get").get(getAllJobs);

// Protected route to get jobs created by the authenticated admin
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// Public route to get a specific job by its ID
router.route("/get/:id").get(getJobById);

// Protected route to create a new job
router.route("/post").post(isAuthenticated, postJob);

// Protected route to update a job by its ID
router.route("/update/:id").put(isAuthenticated, updateJob);

// Optional: Add route for deleting a job if needed
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;
