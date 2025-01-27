// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tiktok-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Video Model
const Video = mongoose.model('Video', new mongoose.Schema({
  url: String,
  caption: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: String }],
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}));

// Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.post('/api/videos', upload.single('video'), async (req, res) => {
  const newVideo = new Video({
    url: req.file.path,
    caption: req.body.caption
  });
  await newVideo.save();
  res.status(201).json(newVideo);
});

app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

app.post('/api/videos/:id/like', async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.likes += 1;
  await video.save();
  res.json(video);
});

app.post('/api/videos/:id/comment', async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.comments.push(req.body.comment);
  await video.save();
  res.json(video);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));