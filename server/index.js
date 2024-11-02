const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { jwtDecode } = require('jwt-decode');

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


app.post('/login', async (req, res) => {
    const token = req.headers['authorization'];
    const name=req.headers['name']
    // console.log(token);



    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    } else {
        decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        
    }

    try {
        const query = { username: decodedToken.email };
        const checkUser = await db.collection('users').find(query).toArray();
        const checkUsermessages = await db.collection('messages').find(query).toArray();


        if (checkUser.length) {
            res.send({name: checkUser[0].name, ifuser: true, messages: checkUsermessages[0].messages.reverse(), username: checkUser[0].username});
        } else {
            const newDocument = { username: decodedToken.email,name: decodedToken.name };
            const collection1 = db.collection('users'); // Replace with your collection name
            const collection2 = db.collection('messages');

            const result1 = await collection1.insertOne(newDocument);


            const checkUser2 = await db.collection('messages').find(query).toArray();
            if (checkUser2.length) {
                // res.status(201).json({
                //     message: 'Document already inserted successfully',
                // });
                res.send({name: decodedToken.name, ifuser: true, messages: checkUser2[0].messages.reverse(), username: decodedToken.email});
            } else {
                const newDocument2= { username: decodedToken.email,name,messages: [] };
                const result2 = await collection2.insertOne(newDocument2);
                // res.status(201).json({
                //     message: 'Document inserted successfully',
                //     insertedId: result.insertedId,
                // });
                res.send({name: decodedToken.name, ifuser: true, messages: [], username: decodedToken.email});
            }

            
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
        } else {
            res.status(404).json({ error: 'Message could not be sent.' })
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(3001);