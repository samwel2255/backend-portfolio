const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { randomUUID } = require('crypto')

const uploadDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.png'
    const safeName = file.originalname.replace(/[^a-z0-9.-]/gi, '-').toLowerCase()
    callback(null, `${Date.now()}-${randomUUID()}-${safeName.replace(extension, '')}${extension}`)
  }
})

function imageFileFilter(_req, file, callback) {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return callback(new Error('Only image uploads are allowed'))
  }

  return callback(null, true)
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = {
  upload,
  uploadDir
}