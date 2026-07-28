
import { MemTable } from "../memtable/memtable.js";
import { WAL} from "../storage/wal.js";
import { Index } from "./index.js";
import { SSTable } from "../storage/sstable.js";
import { Manifest } from "../storage/manifest.js";
import { TOMBSTONE } from "./constants.js";
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

      for (const [key,value] of entries) {
        if(value===TOMBSTONE){
          this.index.delete(key);
        }else{
        //destructurin n only using key whichll point to file so index key-->001.sst
        this.index.set(key, filepath);
        }
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
   const filepath = `./data/${filename}`;


    this.sstable.write(filepath, this.memtable.entries());

  const currentWalLength = this.wal.read().length;
    this.manifest.addFile(filename);
    this.manifest.saveWalOffset(currentWalLength);

    for (const key of this.memtable.keys()) {
      this.index.set(key, filepath);
  }
     this.memtable.clear();
    }
  get(key: string) {
    // 1. Check MemTable first
    const value = this.memtable.get(key);
    if(value===TOMBSTONE)return undefined;
    if (value !== undefined) return value;
    
  

    // 2. Check the Index
    const location = this.index.get(key);

    if (location && location !== "memtable") {
        const found = this.sstable.readKey(location, key);
        if (found === TOMBSTONE) return undefined;  
        if (found !== undefined) return found;
    }
  
    return undefined;
}
  delete(key:string){
    this.wal.append("delete", key,"");
    this.memtable.put(key,TOMBSTONE);
    this.index.set(key,"memtable");
}
  recover(){
    const manifestData = this.manifest.load();
    const walOffset = manifestData.walOffset || 0;

    const logs=this.wal.read();
     const newLogs = logs.slice(walOffset);

    for(const log of newLogs){
       if(log.operation === "put"){
            this.memtable.put(log.key, log.value);
            this.index.set(log.key, "memtable");
        } else if(log.operation === "delete"){
            this.memtable.put(log.key,TOMBSTONE);
            this.index.set(log.key,"memtable");
        }
    }
  }
}