const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://bharatroy1005:8tHK40WDuLV58iRH@cluster0.rluwc.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('userBD').collection('users')

        // fixed get route
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        }),

            app.get('/users/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const user = await userCollection.findOne(query);
                res.send(user)
            })

        // ✅ Fixed POST route
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('users list', user);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // You can keep client open for now (commented out close)
        // await client.close();
    }
}
run().catch(console.log);

// Root route
app.get('/', (req, res) => {
    res.send('I create crud operation');
});

// Server listen
app.listen(port, () => {
    console.log(`CRUD operation is running on port: ${port}`);
});
