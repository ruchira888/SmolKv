import { KVEngine } from "../engine.js";

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
}
else if (command === "get") {
    const key = args[1];

    if (!key) {
        console.log("Usage: cli get <key>");
        process.exit(1);
    }

    const value = db.get(key);
    console.log(value !== undefined ? value : "(not found)");
}
else if (command === "delete") {
    const key = args[1];

    if (!key) {
        console.log("Usage: cli delete <key>");
        process.exit(1);
    }

    db.delete(key);
    console.log("OK");
}
else {
    console.log("Usage: cli <put|get|delete> <key> [value]");
}
