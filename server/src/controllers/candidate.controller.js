const resumeQueue = require("../queues/resume.queue");
const Application = require("../models/Application");

exports.applyForJob = async (req, res) => {
  if (req.user.role !== "candidate") {
    return res
      .status(403)
      .json({ message: "Only candidates can apply for jobs" });
  }

  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: "jobId is required" });
  }

  const alreadyApplied = await Application.findOne({
    jobId,
    candidateId: req.user.id
  });

  if (alreadyApplied) {
    return res.status(400).json({ message: "Already applied" });
  }

  const application = await Application.create({
    jobId,
    candidateId: req.user.id
  });

  res.status(201).json({
    message: "Job applied successfully",
    application
  });
};

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  const application = await Application.findOne({
    candidateId: req.user.id
  }).sort({ createdAt: -1 });

  if (!application) {
    return res.status(400).json({
      message: "Apply for a job before uploading resume"
    });
  }

  application.resumePath = req.file.path;
  await application.save();

  res.json({
    message: "Resume uploaded successfully",
    resumePath: application.resumePath
  });
};

exports.getMyApplications = async (req, res) => {
  const applications = await Application.find({
    candidateId: req.user.id
  })
    .populate("jobId", "title sector")
    .sort({ createdAt: -1 });

  res.json(applications);
};