import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteCompany, getCompany, getCompanyById, registerCompany, updateCompany,getApplicantCount,getJobCount,getAllCompaniesWithCounts } from "../controllers/campany.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Register a new company - requires authentication
router.post("/register", isAuthenticated, registerCompany);

// Get all companies for the authenticated user - requires authentication
router.get("/get", isAuthenticated, getCompany);

// Get a specific company by ID - requires authentication
router.get("/get/:id", isAuthenticated, getCompanyById);

// Update company information - requires authentication
router.put("/update/:id", isAuthenticated,singleUpload, updateCompany);
router.route('/delete/:id').delete(isAuthenticated, deleteCompany);


// New routes
router.get('/applicant-count/:companyId', isAuthenticated, getApplicantCount);
router.get('/job-count/:companyId', isAuthenticated, getJobCount);
router.get('/all-with-counts', isAuthenticated, getAllCompaniesWithCounts);

export default router;
