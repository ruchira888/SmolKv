export class Index{
  private map=new Map<string,string>();



set(
key:string,
location:string
){

this.map.set(
key,
location
);

}


get(key:string){

return this.map.get(key);

}
delete(key:string){
    this.map.delete(key);
}
entries(): [string, string][] {
    return Array.from(this.map.entries());
}
}