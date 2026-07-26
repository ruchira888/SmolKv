export class MemTable{
  private data=new Map<string,string>();
     put(key:string,value:string){
        this.data.set(key,value)
    }

    get(key:string){
        return this.data.get(key)
    }

    delete(key:string){
        this.data.delete(key)
    }
}