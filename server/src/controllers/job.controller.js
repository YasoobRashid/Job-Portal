const Job = require("../models/Job");
const {
  cacheJobs,
  getCachedJobs,
  publishJobEvent
} = require("../services/redis.service");

exports.createJob = async (req, res) => {
  const { title, description, sector } = req.body;

  const job = await Job.create({
    title,
    description,
    sector,
    recruiterId: req.user.id
  });

  await publishJobEvent(sector, {
    jobId: job._id,
    title: job.title
  });

  res.status(201).json({
    message: "Job created successfully",
    job
  });
};

exports.getJobs = async (req, res) => {
  const { sector } = req.query;

  if (sector) {
    const cached = await getCachedJobs(sector);
    if (cached) {
      return res.json(cached);
    }
  }

  const filter = sector ? { sector } : {};
  const jobs = await Job.find(filter).sort({ createdAt: -1 });

  if (sector) {
    await cacheJobs(sector, jobs);
  }

  res.json(jobs);
};
