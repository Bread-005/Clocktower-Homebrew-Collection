import {MongoClient} from "mongodb";

let client;
let database;

export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    console.log("hi")
    console.log(process.env.MONGO_URL);

    if (!client) {
        client = new MongoClient("mongodb+srv://jensjosef2005:fg_X-B23@clocktowergames.hfnkicc.mongodb.net/?retryWrites=true&w=majority&appName=Clocktower_Homebrew_Collection");
        await client.connect();
        database = client.db("Clocktower_Homebrew_Collection");
    }
    const roles = await database.collection("roles");

    if (req.method === "GET") {
        // alle Rollen abrufen
        const allRoles = await roles.find().toArray();
        return res.status(200).json(allRoles);
    }

    if (req.method === "POST") {
        // neue Rolle speichern
        const role = req.body;
        console.log(JSON.stringify(role));
        const result = await roles.insertOne(role);
        return res.status(201).json(result);
    }

    res.status(405).json({error: "Method not allowed"});
}