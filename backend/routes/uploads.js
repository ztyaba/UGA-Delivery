const express = require('express');
const multer = require('multer');
const path = require('path');
const { getUploadsDir, buildPublicUrl } = require('../utils/storage');
const { handleUpload } = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadsDir());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.dat';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

function fileFilter (req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image uploads are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

function attachPublicUrl (req, res, next) {
  if (req.file) {
    req.file.publicUrl = buildPublicUrl(path.basename(req.file.path));
  }
  next();
}

router.post('/delivery-photo', auth, upload.single('file'), attachPublicUrl, asyncHandler(handleUpload));
router.post('/id', auth, upload.single('file'), attachPublicUrl, asyncHandler(handleUpload));

module.exports = router;
