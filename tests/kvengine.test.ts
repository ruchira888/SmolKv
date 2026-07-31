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