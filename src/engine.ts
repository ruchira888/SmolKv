
import { MemTable } from "../memtable/memtable.js";
import { WAL} from "../storage/wal.js";
import { Index } from "./index.js";
import { SSTable } from "../storage/sstable.js";
export class KVEngine{
    private memtable: MemTable;//each Kveng instance gets its own store property, initialize to empty Map
  private wal:WAL;
   private index: Index;
   private sstable:SSTable;
   private sstableCount=0;//cnt of how many files have been created
   private readonly MAX_MEMTABLE_SIZE=5;


  constructor(){
    this.memtable=new MemTable();
    this.wal=new WAL();
    this.index=new Index();
    this.sstable=new SSTable();
  }
  private nextSSTableName():string{
    this.sstableCount++;//cnt++ for flush
    return `${String(this.sstableCount).padStart(3, "0")}.sst`;
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
  const filename = this.nextSSTableName();

    this.sstable.write(filename, this.memtable.entries());

    for (const key of this.memtable.keys()) {
      this.index.set(key, filename);
  }
     this.memtable.clear();
    }
  get(key:string){
    return this.memtable.get(key);
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