const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(bodyParser.json());

dotenv.config();

// MongoDB connection URL and database name
const uri = process.env.URI;
const dbName = 'anonymousMessage'; // Replace with your database name


let db;


// Connecting to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send("hi this is it");
})

app.get('/user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const query = { username };
        const checkUser = await db.collection('users').find(query).toArray();


        if (checkUser.length) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/push/:username', async (req, res) => {
    const username = req.params.username;
    const newMessage = req.body.message;
    try {
        const query = { username };
        const checkUser = await db.collection('messages').find(query).toArray();
        if (checkUser.length && newMessage) {
            const messages = checkUser[0].messages;
            messages.push(newMessage);
            const filter = { username };
            const update = { $set: { messages } };

            await db.collection('messages').updateOne(filter, update);
            res.status(200).json({ error: 'Message sent.' });
        }else{
            res.status(404).json({error: 'Message could not be sent.'})
        }
    } catch (error) {
        console.error('Error sedning message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(3001);