import {MongoClient} from "mongodb";

let client;
let database;

export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (!client) {
        client = new MongoClient(process.env.MONGO_URL);
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