const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));  // Folder za statičke fajlove (HTML, JS, itd.)

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('playSong', (songPath) => {
    const stream = fs.createReadStream(songPath);
    stream.on('data', (chunk) => {
      socket.emit('audioData', chunk);
    });

    stream.on('end', () => {
      console.log('Song streaming finished');
      socket.emit('audioEnded');
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
