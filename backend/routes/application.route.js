import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    applyJob,
    getApplicants,
    getAppliedJobs,
    updateStatus,
    getAllApplicants
} from "../controllers/application.controller.js";

const router = express.Router();

// Route to apply for a job
router.route("/apply/:id").get(isAuthenticated, applyJob); // Changed to POST for applying

// Route to get jobs applied by the authenticated user
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Route to get applicants for a specific job
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// New route to get all applicants for all jobs (if applicable)
router.route("/applicants").get(isAuthenticated, getAllApplicants); // New route for all applicants

// Route to update the status of an application
router.route("/status/:id/update").put(isAuthenticated, updateStatus);

export default router;
