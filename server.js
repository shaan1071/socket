const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('something');
    socket.on('disconnect', () => {
        console.log('user disconnect!');
    });

    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);
});

// Routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/indexMongo.html');
});

app.get('/api/cats', (req, res) => {
    res.json({ statusCode: 200, data: [], message: 'get all cats successful' });
});

app.post('/api/cat', (req, res) => {
    let newdog = req.body;
    res.json({ statusCode: 201, data: newdog, message: 'success' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});