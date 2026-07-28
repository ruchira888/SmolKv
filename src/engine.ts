
import { MemTable } from "../memtable/memtable.js";
import { WAL} from "../storage/wal.js";
import { Index } from "./index.js";
import { SSTable } from "../storage/sstable.js";
import { Manifest } from "../storage/manifest.js";
export class KVEngine{
    private memtable: MemTable;//each Kveng instance gets its own store property, initialize to empty Map
  private wal:WAL;
   private index: Index;
   private sstable:SSTable;

   private readonly MAX_MEMTABLE_SIZE=5;
   private manifest: Manifest;


  constructor(){
    this.memtable=new MemTable();
    this.wal=new WAL();
    this.index=new Index();
    this.sstable=new SSTable();
    this.manifest=new Manifest();

    this.loadExistingSSTables();
  }
  //called right at end of constr so runs the moment new kveng() gets created
  private loadExistingSSTables(){
    const manifestData=this.manifest.load();

    for(const filename of manifestData.files){
       const filepath = `./data/${filename}`;
      const entries: [string, string][] = this.sstable.read(filepath);

      for (const [key] of entries) {//destructurin n only using key whichll point to file so index key-->001.sst
        this.index.set(key, filepath);
      }
    }
  }

  put(key:string,value:string){

    this.wal.append("put",key,value);
    this.memtable.put(key,value);
    this.index.set(key,"memtable");

     if (this.memtable.size() >= this.MAX_MEMTABLE_SIZE) {
      this.flush();
    }
  }
  flush(){
  const filename = this.manifest.nextFileName();

    this.sstable.write(filename, this.memtable.entries());
    this.manifest.addFile(filename);

    for (const key of this.memtable.keys()) {
      this.index.set(key, filename);
  }
     this.memtable.clear();
    }
  get(key: string) {
    // 1. Check MemTable first
    const value = this.memtable.get(key);
    if (value !== undefined) {
        return value;
    }

    // 2. Check the Index
    const location = this.index.get(key);

    if (!location || location === "memtable") {
        return undefined;
    }

    // 3. Read from the SSTable
    return this.sstable.readKey(location, key);
}
  delete(key:string){
    this.wal.append("delete", key, "");
    this.memtable.delete(key);
    this.index.delete(key);
}
  recover(){
    const logs=this.wal.read();
    for(const log of logs){
       if(log.operation === "put"){
            this.memtable.put(log.key, log.value);
            this.index.set(log.key, "memtable");
        } else if(log.operation === "delete"){
            this.memtable.delete(log.key);
            this.index.delete(log.key);
        }
    }
  }
}