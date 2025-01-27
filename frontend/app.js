// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get('http://localhost:5000/api/videos');
    setVideos(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('caption', caption);
    await axios.post('http://localhost:5000/api/videos', formData);
    fetchVideos();
  };

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/videos/${id}/like`);
    fetchVideos();
  };

  return (
    <div className="app">
      <div className="upload-form">
        <form onSubmit={handleUpload}>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <input
            type="text"
            placeholder="Add caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type="submit">Upload</button>
        </form>
      </div>

      <div className="video-feed">
        {videos.map(video => (
          <div key={video._id} className="video-container">
            <ReactPlayer
              url={`http://localhost:5000/${video.url}`}
              controls
              width="300px"
              height="500px"
            />
            <div className="video-info">
              <p>{video.caption}</p>
              <div className="video-stats">
                <button onClick={() => handleLike(video._id)}>❤️ {video.likes}</button>
                <span>💬 {video.comments.length}</span>
                <span>↪️ {video.shares}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;