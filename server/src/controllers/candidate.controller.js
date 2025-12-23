const Application = require("../models/Application");
const User = require("../models/User");
const resumeQueue = require("../queues/resume.queue");

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  const user = await User.findById(req.user.id);

  if (!user || user.role !== "candidate") {
    return res.status(403).json({ message: "Only candidates can upload resume" });
  }

  user.resumePath = req.file.path;
  await user.save();

  await resumeQueue.add({
    userId: user._id,
    email: user.email,
    resumePath: user.resumePath
  });

  res.json({
    message: "Resume uploaded successfully",
    resumePath: user.resumePath
  });
};


exports.applyForJob = async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: "jobId is required" });
  }

  const user = await User.findById(req.user.id);

  if (!user || user.role !== "candidate") {
    return res.status(403).json({ message: "Only candidates can apply" });
  }

  if (!user.resumePath) {
    return res.status(400).json({
      message: "Upload resume before applying"
    });
  }

  const alreadyApplied = await Application.findOne({
    jobId,
    candidateId: user._id
  });

  if (alreadyApplied) {
    return res.status(400).json({ message: "Already applied" });
  }

  const application = await Application.create({
    jobId,
    candidateId: user._id,
    resumePath: user.resumePath   
  });

  res.status(201).json({
    message: "Job applied successfully",
    application
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