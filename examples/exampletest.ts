import { KVEngine } from "../src/engine.js";
const db = new KVEngine();

const tx2 = db.beginTransaction();

tx2.put("xyz123", "99");

tx2.abort();

console.log(db.get("xyz123"));