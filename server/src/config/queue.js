const Queue = require("bull");

const resumeQueue = new Queue("resume-processing", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

module.exports = resumeQueue;
