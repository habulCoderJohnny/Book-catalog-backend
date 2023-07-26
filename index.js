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
            const cursor = bookCollection.find({}).sort({ publicationDate: -1 });;
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
        
      // reviewCollection - CRUD operation
      app.post('/review/:id', async (req, res) => {
        const bookId = req.params.id;
        const review = req.body;
  
        const result = await bookCollection.updateOne(
          { _id: ObjectId(bookId) },
  
        );
        if (result.modifiedCount !== 1) {
          res.json({ error: 'Book not found or review not added' });
          return;
        }
        res.json({ message: 'Review added successfully' });
      });
      app.get('/review/:id', async (req, res) => {
        const bookId = req.params.id;
        const result = await bookCollection.findOne(
          { _id: ObjectId(bookId) },

        );
        if (result) {
          res.json(result);
        } else {
          res.status(404).json({ error: 'Book not found' });
        }
      });

      app.patch('/review/:id/user/:email', async (req, res) => {
        const bookId = req.params.id;
        const userEmail = req.params.email
        const updatedReview = req.body.review
  
        const result = await bookCollection.findOneAndUpdate(
          { _id: ObjectId(bookId), "reviews.userEmail": userEmail },
          { $set: { "reviews.$.review": updatedReview } }
        );
  
        if (result) {
          return res.json(result);
        }
  
        res.status(404).json({ error: 'Book not found' });
      });
  
      app.delete('/review/:id/user/:email', async (req, res) => {
        const bookId = req.params.id;
        const userEmail = req.params.email
  
        const result = await bookCollection.findOneAndUpdate(
          { _id: ObjectId(bookId) },

        );
  
        if (result) {
          return res.json(result);
        }
  
        res.status(404).json({ error: 'Book not found' });
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