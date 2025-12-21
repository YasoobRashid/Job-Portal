const resumeQueue = require("../queues/resume.queue");
const Application = require("../models/Application");

exports.applyForJob = async (req, res) => {
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

  await resumeQueue.add({
    userId: req.user.id,
    filePath: req.file.path
  });

  res.json({ message: "Resume upload queued" });
};
