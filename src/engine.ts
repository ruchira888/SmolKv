
import { WAL} from "../storage/wal.js";
export class KVEngine{
  private store=new Map<string,string>()//each Kveng instance gets its own store property, initialize to empty Map
  private wal:WAL;


  constructor(){
    this.store=new Map();
    this.wal=new WAL;
  }

  put(key:string,value:string){

    this.wal.append("put",key,value)
    this.store.set(key,value)
  }
  get(key:string){
    return this.store.get(key);
  }
  delete(key:string){
    return this.store.delete(key);
  }
  recover(){
    const logs=this.wal.read();
    for(const log of logs){
       if(log.operation === "put"){
            this.store.set(log.key, log.value)
        } else if(log.operation === "delete"){
            this.store.delete(log.key)
        }
    }
  }
}