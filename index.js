const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = "mongodb+srv://bharatroy1005:8tHK40WDuLV58iRH@cluster0.rluwc.mongodb.net/?appName=Cluster0";

// MongoDB Client Config
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Main async function
async function run() {
    try {
        // Connect MongoDB client
        await client.connect();

        // Create collection instance
        const userCollection = client.db('userBD').collection('users');

        // ✅ READ all users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // ✅ READ a single user by ID
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // ✅ CREATE a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('New User:', user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // ✅ DELETE a user by ID
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        // ✅ UPDATE a user by ID (Includes Image)
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image, // ✅ Support for image field
                    age: updatedUser.age      // Optional, only if you're sending age
                },
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Ping to confirm MongoDB connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB!");
    } finally {
        // Optional: Close the client when needed
        // await client.close();
    }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('🛠️ CRUD server is running');
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
