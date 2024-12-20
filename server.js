const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (e.g., your index.html)
app.use(express.static('public'));

// On client connection
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('broadcaster', () => {
        console.log(`${socket.id} is a broadcaster.`);
        // Broadcast to all clients that a new broadcaster has connected
        socket.broadcast.emit('broadcaster');
    });

    socket.on('watcher', () => {
        console.log(`${socket.id} is a watcher.`);
        // When a watcher connects, send an offer to the broadcaster
        socket.broadcast.emit('watcher');
    });

    socket.on('offer', (id, description) => {
        console.log(`Received offer from ${socket.id} to ${id}`);
        console.log('Offer description:', description);
        // Send offer to all connected clients (broadcast)
        io.emit('offer', socket.id, description); // This sends the offer to all clients
    });

    socket.on('answer', (id, description) => {
        console.log(`Received answer from ${socket.id} for ${id}`);
        console.log('Answer description:', description);
        // Send answer to the broadcaster
        io.to(id).emit('answer', socket.id, description);
    });

    socket.on('candidate', (id, candidate) => {
        console.log(`Received ICE candidate from ${socket.id} for ${id}`);
        console.log('ICE candidate:', candidate);
        // Send ICE candidate to the other peer
        io.to(id).emit('candidate', socket.id, candidate);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

// Run the server on all network interfaces (0.0.0.0) and port 3000
server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});
