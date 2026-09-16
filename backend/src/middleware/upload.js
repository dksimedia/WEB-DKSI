const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/media');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi,'_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const fileFilter = (req, file, cb) => {
  const ok = /^(image\/(png|jpe?g|webp|svg\+xml|gif)|application\/pdf)$/.test(file.mimetype);
  if (!ok) return cb(new Error('File type not allowed'));
  cb(null, true);
};
module.exports = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 } });
