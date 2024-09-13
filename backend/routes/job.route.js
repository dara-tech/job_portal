import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

// Route to post a new job
router.route("/post").post(isAuthenticated, postJob);

// Route to get all jobs with optional filters and pagination
router.route("/get").get(isAuthenticated, getAllJobs);

// Route to get all jobs created by the authenticated admin
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// Route to get a job by ID
router.route("/get/:id").get(isAuthenticated, getJobById);

// Route to update a job by ID
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;
