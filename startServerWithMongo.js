const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dbUri = "mongodb://localhost:27017";
let serverPort = process.env.PORT || 3000;
let dogCollection;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Client Setup
const dbClient = new MongoClient(dbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Database Connection Function
async function connectToDB() {
    try {
        await dbClient.connect();
        dogCollection = dbClient.db('myDatabase').collection('dogs');
        // const test = await dogCollection.find({}).toArray();
        // console.log("Initial Data::::::::::", test);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

// Routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/indexMongo.html');
});

app.get('/api/cats', async (req, res) => {
    console.log("SERVER GET ALL DOGS");

    try {
        const result = await fetchAllDogs();
        console.log("Server Data::::::::::", result);
        res.json({ statusCode: 200, data: result, message: 'get all dogs successful' });
    } catch (error) {
        console.error("Error fetching dogs:", error);
        res.status(500).json({ statusCode: 500, message: 'Error fetching dogs', error });
    }
});


app.post('/api/cat', (req, res) => {
    let newDog = req.body;
    addDog(newDog, (err, result) => {
        if (!err) {
            res.json({ statusCode: 201, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Error adding dog', error: err });
        }
    });
});

// Helper Functions
function addDog(dog, callback) {
    dogCollection.insertOne(dog, callback);
}

async function fetchAllDogs() {
    try {
        const result = await dogCollection.find({}).toArray();
        console.log("fetchAllDogs result:", result);
        return result;
    } catch (error) {
        console.error("Error in fetchAllDogs:", error);
        throw error;
    }
}


// Start Server
server.listen(serverPort, () => {
    console.log(`Express server started on port ${serverPort}`);
    connectToDB();
});

// Socket.io setup
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);
});