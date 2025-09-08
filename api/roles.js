const express = require('express');
const {MongoClient} = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors({origin: 'http://localhost:63342'}));
app.use(express.json());

// Verbindung zu MongoDB Atlas
const client = new MongoClient("mongodb+srv://jensjosef2005:fg_X-B23@clocktowergames.hfnkicc.mongodb.net/?retryWrites=true&w=majority&appName=Clocktower_Homebrew_Collection");

async function getRoles() {
    console.log("hi12");
    await client.connect();
    const database = client.db('Clocktower_Homebrew_Collection');
    const roles = database.collection('roles');
    return await roles.find({}).toArray();
}

async function createRole(user) {
    console.log("create hi uhn")
    await client.connect();
    const database = client.db('Clocktower_Homebrew_Collection');
    const roles = database.collection('roles');
    await roles.insertOne(user);
}

app.get('/api/roles', async (req, res) => {

    // CORS-Header setzen
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const roles = await getRoles();
    console.log("hi123")
    console.log(JSON.stringify(roles));
    res.json(roles);
});

app.post('/', async (req, res) => {

    // CORS-Header setzen
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log(req.body);
    const result = await createRole(req.body);
    console.log(result);
    res.json(result);
});

app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));