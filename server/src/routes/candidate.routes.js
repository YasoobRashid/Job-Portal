const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const upload = require("../utils/fileUpload");

const {
  uploadResume,
  applyForJob
} = require("../controllers/candidate.controller");

router.post(
  "/resume",
  auth,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/apply",
  auth,
  applyForJob
);

module.exports = router;
