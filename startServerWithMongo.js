const express = require('express');
const server = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbUri = "mongodb://localhost:27017";
let serverPort = process.env.PORT || 3000;
let catCollection;

// Middleware
server.use(express.static((__dirname + '/public')))
server.use(express.json());
server.use(express.urlencoded({extended: false}));

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
        catCollection = dbClient.db('dog').collection('dog');
        console.log('Connected to MongoDB successfully');
    } catch(error) {
        console.error('Database connection error:', error);
    }
}

// Routes
server.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/indexMongo.html');
});

server.get('/api/cats', (req, res) => {
    fetchAlldogs((err, result) => {
        if (!err) {
            res.json({statusCode: 200, data: result, message: 'get all cats successful'});
        } else {
            res.status(500).json({statusCode: 500, message: 'Error fetching cats', error: err});
        }
    });
});

server.post('/api/cat', (req, res) => {
    let newdog = req.body;
    adddog(newdog, (err, result) => {
        if (!err) {
            res.json({statusCode: 201, data: result, message: 'success'});
        } else {
            res.status(500).json({statusCode: 500, message: 'Error adding cat', error: err});
        }
    });
});

// Helper Functions
function adddog(cat, callback) {
    catCollection.insertOne(cat, callback);
}

function fetchAlldogs(callback) {
    catCollection.find({}).toArray(callback);
}

// Start Server
server.listen(serverPort, () => {
    console.log(`Express server started on port ${serverPort}`);
    connectToDB();
});