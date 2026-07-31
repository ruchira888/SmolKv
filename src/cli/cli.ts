import { KVEngine } from "../engine.js";
import { TOMBSTONE } from "../constants.js";
import { MemTable } from "../../memtable/memtable.js";

const db = new KVEngine();
db.recover();

const args = process.argv.slice(2);//Array of cli args & skips da 1st 2 items in process.argv because they r added automatically by Node.js
const command = args[0];

if (command === "put") {
    const key = args[1];
    const value = args[2];

    if (!key || !value) {
        console.log("Usage: cli put <key> <value>");
        process.exit(1);
    }

    db.put(key, value);
    console.log("OK");
    printLSMState(db);  
}
else if (command === "get") {
    const key = args[1];

    if (!key) {
        console.log("Usage: cli get <key>");
        printLSMState(db);  
        process.exit(1);
    }

    const value = db.get(key);
    console.log(value !== undefined ? value : "(not found)");
}
else if (command === "delete") {
    const key = args[1];

    if (!key) {
        console.log("Usage: cli delete <key>");
        printLSMState(db);  
        process.exit(1);
    }

    db.delete(key);
    console.log("OK");
}
else {
    console.log("Usage: cli <put|get|delete> <key> [value]");
}
function printLSMState(db: KVEngine) {
    const state = db.inspect();

    console.log("\n┌─ LSM Tree State ─────────────────────");
    console.log("│ MemTable (RAM):");
    if (state.memtable.length === 0) {
        console.log("│   (empty)");
    } else {
        for (const [k, v] of state.memtable) {
            const display = v === TOMBSTONE ? `${k} → [tombstone]` : `${k} → ${v}`;
            console.log(`│   ${display}`);
        }
    }

    console.log("│");
    console.log("│ Index (key → location):");
    if (state.index.length === 0) {
        console.log("│   (empty)");
    } else {
        for (const [k, loc] of state.index) {
            console.log(`│   ${k} → ${loc}`);
        }
    }

    console.log("│");
    console.log("│ SSTables on disk:");
    if (state.sstables.length === 0) {
        console.log("│   (none yet)");
    } else {
        for (const file of state.sstables) {
            console.log(`│   ${file}`);
        }
    }
    console.log("└───────────────────────────────────────\n");
}