import express from "express";
import { KVEngine } from "../engine.js";

const app = express();
app.use(express.json());

const db = new KVEngine();
db.recover();

app.post("/put", (req, res) => {
    const { key, value } = req.body;

    if (!key || value === undefined) {
        return res.status(400).json({ error: "key and value are required" });
    }

    db.put(key, value);
    res.json({ status: "ok" });
});

app.get("/get/:key", (req, res) => {
    const key = req.params.key;
    const value = db.get(key);

    if (value === undefined) {
        return res.status(404).json({ error: "key not found" });
    }

    res.json({ value });
});

app.delete("/delete/:key", (req, res) => {
    const key = req.params.key;
    db.delete(key);
    res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SmolKV server running on http://localhost:${PORT}`);
});