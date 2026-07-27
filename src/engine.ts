
import { MemTable } from "../memtable/memtable.js";
import { WAL} from "../storage/wal.js";
import { Index } from "./index.js";
export class KVEngine{
    private memtable: MemTable;//each Kveng instance gets its own store property, initialize to empty Map
  private wal:WAL;
   private index: Index;


  constructor(){
    this.memtable=new MemTable();
    this.wal=new WAL();
    this.index=new Index();
  }

  put(key:string,value:string){

    this.wal.append("put",key,value)
    this.memtable.put(key,value)
    this.index.set(key,"memtable")
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