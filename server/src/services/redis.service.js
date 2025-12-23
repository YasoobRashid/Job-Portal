const redis = require("../config/redis");

exports.cacheJobs = async (sector, jobs) => {
  const key = `jobs:${sector}`;
  await redis.setex(key, 60, JSON.stringify(jobs));
};

exports.getCachedJobs = async (sector) => {
  const key = `jobs:${sector}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

exports.publishJobEvent = async (sector, payload) => {
  const channel = `sector.${sector}`;
  await redis.publish(channel, JSON.stringify(payload));
};
