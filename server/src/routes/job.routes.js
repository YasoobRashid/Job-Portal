const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createJob,
  getJobs
} = require("../controllers/job.controller");

router.post(
  "/",
  auth,
  role("recruiter"),
  createJob
);

router.get("/", getJobs);

module.exports = router;
