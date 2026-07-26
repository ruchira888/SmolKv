export class KVEngine{
  private store:Map<string,string>//each kveng obj will have var and thatll store map

  constructor(){
    this.store=new Map();
  }
  put(key:string,value:string){
    this.store.set(key,value)
  }
  get(key:string){
    return this.store.get(key);
  }
  delete(key:string){
    return this.store.delete(key);
  }
}