const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/')
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname)

    const fileName =
      'resume_' +
      Date.now() +
      extension

    cb(null, fileName)
  }
})

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

module.exports = upload