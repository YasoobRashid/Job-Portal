const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (_, file, cb) => {
  if (path.extname(file.originalname) !== ".pdf") {
    return cb(new Error("Only PDF files allowed"));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter
});
