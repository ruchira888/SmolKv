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
    //keys gives list of all keys in memtable so once they r written in sstable,kveng can update address to keys n points to sstable file
    keys(): string[] {
    return Array.from(this.data.keys());
  }
 // Return the entire Map so SSTable.write() can write everything to disk
  entries(): Map<string, string> {
    return this.data;
  }
//size after how many should it be flushed
  size(): number {
    return this.data.size;
  }
//clear memtable once flushed
  clear() {
    this.data.clear();
  }
}