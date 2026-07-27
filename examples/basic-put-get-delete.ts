import { KVEngine } from "../src/engine.js";

const db = new KVEngine();

db.put("name", "Ruchira");
console.log("After put:", db.get("name")); // expect "Ruchira"

db.delete("name");
console.log("After delete:", db.get("name")); // expect undefined