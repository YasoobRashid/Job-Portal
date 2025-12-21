const Job = require("../models/Job");
const Application = require("../models/Application");
const { publishJobEvent } = require("../services/redis.service");


exports.getMyJobs = async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user.id });
  res.json(jobs);
};


exports.getJobApplications = async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    recruiterId: req.user.id
  });

  if (!job) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const applications = await Application.find({ jobId })
    .populate("candidateId", "name email sector");

  res.json(applications);
};


exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  // validate status
  if (!["shortlisted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const application = await Application.findById(applicationId)
    .populate("jobId");

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // ownership check
  if (application.jobId.recruiterId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  application.status = status;
  await application.save();

  await publishJobEvent(`candidate.${application.candidateId}`, {
    type: "APPLICATION_STATUS_UPDATE",
    jobId: application.jobId._id,
    status
  });

  res.json({ message: "Application status updated" });
};
