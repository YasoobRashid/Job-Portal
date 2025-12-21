const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  getMyJobs,
  getJobApplications,
  updateApplicationStatus
} = require("../controllers/recruiter.controller");


router.get(
  "/jobs",
  auth,
  role("recruiter"),
  getMyJobs
);

router.get(
  "/jobs/:jobId/applications",
  auth,
  role("recruiter"),
  getJobApplications
);

router.patch(
  "/applications/:applicationId",
  auth,
  role("recruiter"),
  updateApplicationStatus
);

module.exports = router;
