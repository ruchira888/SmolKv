import { describe,it,expect,beforeEach } from "vitest";
import { KVEngine } from "../src/engine.js";
import fs from "fs";


beforeEach(()=>{
if(fs.existsSync("./data/")){
  fs.rmSync("./data",{recursive:true, force: true })//dels entire data folder bcuz sstable from prev tests shpuldnt aff next ones
}
if(fs.existsSync("./database.log")){//check if wal exists if yes del
  fs.unlinkSync("./database.log");
}
}
);

describe("basic put/get/delete", () => {
    it("put then get returns the value", () => {
        const db = new KVEngine();
        db.put("name", "Ruchira");
        expect(db.get("name")).toBe("Ruchira");
    });

    it("delete removes the value", () => {
        const db = new KVEngine();
        db.put("name", "Ruchira");
        db.delete("name");
        expect(db.get("name")).toBeUndefined();
    });

    it("getting a key that never existed returns undefined", () => {
        const db = new KVEngine();
        expect(db.get("ghost")).toBeUndefined();
    });
});
describe("flush to SSTable", () => {
    it("data is still readable after MemTable flushes", () => {
        const db = new KVEngine();

        for (let i = 1; i <= 6; i++) {
            db.put(`key${i}`, `value${i}`);
        }

       
        expect(db.get("key1")).toBe("value1");
        
        expect(db.get("key6")).toBe("value6");
    });

    it("creates an SSTable file on disk after flush", () => {
        const db = new KVEngine();

        for (let i = 1; i <= 5; i++) {
            db.put(`key${i}`, `value${i}`);
        }

        const files = fs.readdirSync("./data").filter(f => f.endsWith(".sst"));
        expect(files.length).toBeGreaterThan(0);//so atleast 1  .sst file fnd so successfully flushed to sstable from memtable
    });
});
describe("recovery after restart", () => {
    it("data survives creating a new KVEngine instance", () => {
        const db1 = new KVEngine();
        for (let i = 1; i <= 6; i++) {
            db1.put(`key${i}`, `value${i}`);
        }

        // simulate a restart  brand new instance, same disk files
        const db2 = new KVEngine();
        db2.recover();

        expect(db2.get("key1")).toBe("value1"); 
        expect(db2.get("key6")).toBe("value6"); 
    });
       it("deleted keys stay deleted after restart (tombstones)", () => {
        const db1 = new KVEngine();
        db1.put("name", "Ruchira");
        db1.delete("name");

        const db2 = new KVEngine();
        db2.recover();

        expect(db2.get("name")).toBeUndefined();
    });
});
describe("compaction", () => {
    it("merges multiple SSTables and keeps only the latest value", () => {
        const db = new KVEngine();

        // first flush
        for (let i = 1; i <= 5; i++) {
            db.put(String.fromCharCode(96 + i), String(i)); 
        }

        // second flush: a gets overwritten+new keys
        db.put("a", "999");
        db.put("f", "6");
        db.put("g", "7");
        db.put("h", "8");
        db.put("i", "9"); // triggers 2nd flush

        expect(db.get("a")).toBe("999"); // before compaction

        db.compact();

        expect(db.get("a")).toBe("999");   // survives compaction, latest value kept
        expect(db.get("b")).toBe("2");      // untouched old key still readable

        const files = fs.readdirSync("./data").filter(f => f.endsWith(".sst"));
        expect(files.length).toBe(1); // old files merged into one
    });

    it("drops tombstoned keys during compaction", () => {
        const db = new KVEngine();

        for (let i = 1; i <= 4; i++) {
            db.put(`k${i}`, `v${i}`);
        }
        db.put("dead", "temp");   // 5th put goes to flush
        db.delete("dead");         // tombstone written to memtable

        db.put("x1", "1");
        db.put("x2", "2");
        db.put("x3", "3");
        db.put("x4", "4"); // 5th put so  2nd flush, tombstone gets flushed too

        db.compact();

        expect(db.get("dead")).toBeUndefined();
    });
});

describe("transactions", () => {
    it("writes are not applied until commit()", () => {
        const db = new KVEngine();
        const tx = db.beginTransaction();

        tx.put("a", "1");
        expect(db.get("a")).toBeUndefined(); // not committed yet

        tx.commit();
        expect(db.get("a")).toBe("1");
    });

    it("abort() discards buffered writes", () => {
        const db = new KVEngine();
        const tx = db.beginTransaction();

        tx.put("a", "1");
        tx.abort();

        expect(db.get("a")).toBeUndefined();
    });

    it("commit applies multiple operations in order", () => {
        const db = new KVEngine();
        const tx = db.beginTransaction();

        tx.put("a", "1");
        tx.put("a", "2"); // overwrite same transaction
        tx.commit();

        expect(db.get("a")).toBe("2");
    });
});