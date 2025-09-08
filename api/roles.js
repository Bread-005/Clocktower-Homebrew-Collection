import {MongoClient} from "mongodb";

const client = new MongoClient("mongodb+srv://jensjosef2005:fg_X-B23@clocktowergames.hfnkicc.mongodb.net/?retryWrites=true&w=majority&appName=Clocktower_Homebrew_Collection");

export default async function handler(req, res) {
    await client.connect();
    const db = client.db("Clocktower_Homebrew_Collection");
    const roles = db.collection("roles");

    if (req.method === "GET") {
        // alle Rollen abrufen
        const allRoles = await roles.find().toArray();
        res.status(200).json(allRoles);
    }

    if (req.method === "POST") {
        // neue Rolle speichern
        const role = req.body;
        const result = await roles.insertOne(role);
        res.status(201).json(result);
    }
}