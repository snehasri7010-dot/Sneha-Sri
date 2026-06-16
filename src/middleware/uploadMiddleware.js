const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ApiError = require("../utils/apiError");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = file.fieldname === "profileImage" ? "profiles" : "cars";
    const uploadPath = path.join(__dirname, "..", "..", "uploads", folder);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    cb(null, `${Date.now()}-${baseName || "image"}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new ApiError(400, "Only image files are allowed"));
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
