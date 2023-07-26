const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
const run = async () => {
    try {
        const db = client.db('Boinama');
        const bookCollection = db.collection('books');
     

        // bookCollection - CRUD operation
        app.get('/books', async (req, res) => {
            onst cursor = bookCollection.find({}).sort({ publicationDate: -1 });;c
            const book = await cursor.toArray();
            res.send({ status: true, data: book });
        });
        app.post('/book', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book);
            res.send(result);
        });

        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        });

        app.patch('/book/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body
            const result = await bookCollection.findOneAndUpdate({ _id: ObjectId(id) }, { $set: updatedData });
            res.send(result);
        });

        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

    } finally {

    }

}
run().catch((err) => console.log(err));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});