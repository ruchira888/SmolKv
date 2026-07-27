import { KVEngine } from "../src/engine.js";

const db = new KVEngine();

for (let i = 1; i <= 6; i++) {
    db.put(`key${i}`, `value${i}`);
}

console.log(db.get("key1")); // should still work, from SSTable now
console.log(db.get("key6")); // should work, from MemTable (not flushed yet)