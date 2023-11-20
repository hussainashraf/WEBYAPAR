const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const app = express();
const mongoose = require('./db');
const ImageModel = require('./models/ImagesData');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Process the image using sharp (resize and convert to webp)
      const processedImageBuffer = await sharp(req.file.path)
        .resize({ width: 500 }) // Adjust the width as needed
        .webp() // Convert to webp format
        .toBuffer();
  
      // Save the processed image
      const processedFileName = req.file.filename.replace(path.extname(req.file.filename), '.webp');
      const processedFilePath = path.join('public/Images', processedFileName);
      await sharp(processedImageBuffer).toFile(processedFilePath);
  
      // Create a record in the database
      const imageRecord = await ImageModel.create({ image: processedFileName });
  
      // Send the response
      res.json({ success: true, image: imageRecord });
    } catch (error) {
      console.error('Error uploading and processing image:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  

app.post('/uploadWithCrop', upload.single('file'), async (req, res) => {
  try {
    const { croppedImage } = req.body;

    // Convert cropped image data URL to Buffer
    const croppedImageBuffer = Buffer.from(croppedImage.split(',')[1], 'base64');

    // Process the cropped image using sharp (resize and convert to webp)
    const processedImageBuffer = await sharp(croppedImageBuffer)
      .resize({ width: 500 })
      .webp()
      .toBuffer();

    // Save the processed image
    const processedFileName = req.file.filename.replace(path.extname(req.file.filename), '_cropped.webp');
    const processedFilePath = path.join('public/Images', processedFileName);
    await sharp(processedImageBuffer).toFile(processedFilePath);

    // Create a record in the database for the processed image
    const processedImageRecord = await ImageModel.create({ image: processedFileName });

    res.json({ success: true, image: processedImageRecord });
  } catch (error) {
    console.error('Error uploading and processing image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/getImages', (req, res) => {
  ImageModel.find()
    .then(images => res.json(images))
    .catch(err => console.log(err));
});

app.listen(4000, () => {
  console.log('Server Running at port 4000');
});
