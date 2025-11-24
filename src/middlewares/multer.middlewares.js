import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { //file is the uploaded file only multer have this file object
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage})

export {upload};
