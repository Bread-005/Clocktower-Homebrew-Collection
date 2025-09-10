const express = require('express');
const {MongoClient} = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors({origin: ['http://localhost:63342', 'https://bread-005.github.io']}));
app.use(express.json());

async function database(type = "roles") {
    const client = new MongoClient("mongodb+srv://jensjosef2005:8qyi_iaCq.8hHFX@clocktowergames.hfnkicc.mongodb.net/?retryWrites=true&w=majority&appName=Clocktower_Homebrew_Collection");
    await client.connect();
    const database = client.db('Clocktower_Homebrew_Collection');
    return database.collection(type);
}

app.get('/api/roles', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const collection = await database("roles");
    const roles = await collection.find().toArray();
    res.json(roles);
});

app.post('/api/roles/create', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const collection = await database("roles");
    const result = await collection.insertOne(req.body);
    res.json(result);
});

app.post('/api/roles/update', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const role = req.body;
    const roles = await database("roles");
    await roles.updateOne({createdAt: role.createdAt}, {
        $set: {
            name: role.name,
            characterType: role.characterType,
            ability: role.ability,
            createdAt: role.createdAt,
            image: role.image,
            otherImage: role.otherImage,
            rating: role.rating,
            isFavorite: role.isFavorite,
            tags: role.tags,
            firstNight: role.firstNight,
            firstNightReminder: role.firstNightReminder,
            otherNight: role.otherNight,
            otherNightReminder: role.otherNightReminder,
            howToRun: role.howToRun,
            jinxes: role.jinxes,
            reminders: role.reminders,
            remindersGlobal: role.remindersGlobal,
            special: role.special,
            script: role.script,
            comments: role.comments,
            lastEdited: role.lastEdited,
        }
    });
    res.json(role);
});

app.post('/api/roles/delete', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const collection = await database("roles");
    const result = await collection.deleteOne({createdAt: req.body.createdAt});
    res.json(result);
});

app.get('/api/users', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const collection = await database("users");
    const users = await collection.find().toArray();
    res.json(users);
});

app.post('/api/users/create', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const collection = await database("users");
    const result = await collection.insertOne(req.body);
    res.json(result);
});

app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));