const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mqvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Main Function
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("production").collection("product");

        // Get Products from DB
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
            console.log('Get Product from DB');
        });

        // Load Product from DB by ID
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // Update Quantity by Id
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateQuantity.quantity
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Delete Item
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        // Add Data to DB
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log('New Product Added', newProduct);
            const result = await userCollection.insertOne(newProduct);
            res.send(result);
        });

    } finally {

    }
}

run().catch(console.dir);

// Server Home Page
app.get('/', async (req, res) => {
    res.send('Hello World');
})

// Server Listen
app.listen(port, () => {
    console.log('Server is running', port);
})

// User : khokan
// Pass : G0cyMeBUbvZU5HD8