const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function getUploadsDir () {
  return uploadsDir;
}

function buildPublicUrl (filename) {
  return `/uploads/${filename}`;
}

module.exports = {
  getUploadsDir,
  buildPublicUrl
};
