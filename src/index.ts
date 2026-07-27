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
}