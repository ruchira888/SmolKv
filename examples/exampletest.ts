import { KVEngine } from "../src/engine.js";

const db = new KVEngine();
db.put("a", "1");
db.put("b", "2");
db.put("c", "3");
db.put("d", "4");
db.put("e", "5");
db.put("f", "6");

const db2 = new KVEngine();
db2.recover();

console.log(db2.get("a"));
console.log(db2.get("f")); 