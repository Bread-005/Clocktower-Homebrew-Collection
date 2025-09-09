const express = require('express');
const {MongoClient} = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors({origin: 'http://localhost:63342'}));
app.use(express.json());

const client = new MongoClient("mongodb+srv://jensjosef2005:fg_X-B23@clocktowergames.hfnkicc.mongodb.net/?retryWrites=true&w=majority&appName=Clocktower_Homebrew_Collection");

async function database() {
    await client.connect();
    const database = client.db('Clocktower_Homebrew_Collection');
    return database.collection('roles');
}

async function getRoles() {
    const roles = await database();
    return await roles.find().toArray();
}

async function createRole(user) {
    const roles = await database();
    return await roles.insertOne(user);
}

app.get('/api/roles', async (req, res) => {
    const roles = await getRoles();
    console.log(roles.map(role => role.name));
    res.json(roles);
});

app.post('/api/roles/create', async (req, res) => {
    const result = await createRole(req.body);
    res.json(result);
});

app.post('/api/roles/update', async (req, res) => {
    console.log(req.body);
    const role = req.body;
    const roles = await database();
    const result = await roles.updateOne(role.createdAt, {$set: role});
    res.json(result);
});

app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));