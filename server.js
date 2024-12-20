const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serviraj statičke datoteke iz 'public' foldera
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');
    
    socket.on('chat message', (msg) => {
        console.log('Poruka primljena: ', msg); // Proveri da li server prima poruke
        io.emit('chat message', msg); // Emituj poruku svim korisnicima
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
