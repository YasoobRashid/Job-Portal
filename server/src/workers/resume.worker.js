const resumeQueue = require("../queues/resume.queue");
const transporter = require("../config/mailer");
const User = require("../models/User");

resumeQueue.process(async (job) => {
  const { userId, filePath } = job.data;

  // simulate resume processing
  await new Promise((res) => setTimeout(res, 2000));

  const user = await User.findById(userId);

  await transporter.sendMail({
    to: user.email,
    subject: "Resume Uploaded Successfully",
    text: "Your resume has been processed successfully."
  });

  return { status: "completed" };
});
