import { KVEngine } from "./engine.js";

type Operation =
    | { type: "put"; key: string; value: string }
    | { type: "delete"; key: string };

export class Transaction {
    private buffer: Operation[] = [];
    private db: KVEngine;

    constructor(db: KVEngine) {
        this.db = db;
    }

    put(key: string, value: string) {
        this.buffer.push({ type: "put", key, value });
    }

    delete(key: string) {
        this.buffer.push({ type: "delete", key });
    }

    commit() {
        for (const op of this.buffer) {
            if (op.type === "put") {
                this.db.put(op.key, op.value);
            } else {
                this.db.delete(op.key);
            }
        }
        this.buffer = [];
    }

    abort() {
        this.buffer = [];
    }
}