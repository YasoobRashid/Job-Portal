const express = require("express");
const cors = require("cors");
const path = require("path");



const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const candidateRoutes = require("./routes/candidate.routes");
const recruiterRoutes = require("./routes/recruiter.routes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/recruiter", recruiterRoutes);



app.get("/health", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;
