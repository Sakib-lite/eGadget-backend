const catchError = require('./catchError');
const Error = require('./appError');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single('image');

exports.resizeImage = catchError(async (req, res, next) => {
  if (!req.file) return next();
  if(req.user){
  const name = req.user.name.split(' ').join('-')
  req.file.fileName = `${name}-${req.user.id}.png`;
  }else{
    req.file.fileName =  req.file.originalname
  }


  await sharp(req.file.buffer)
    .resize(1000,1000,{    fit: sharp.fit.contain,
      background: { r: 0, g: 0, b: 0, alpha: 0 }})
    .toFormat('png')
    .png({ quality: 90 })
    .toFile(`public/${req.user?`users`:`products`}/${req.file.fileName}`);
  next();
});