import fs from "fs"

export class SSTable{
   constructor() {
    if (!fs.existsSync("./data")) {
      fs.mkdirSync("./data");
    }
  }
  write(filepath:string,data:Map<string,string>){
    const sorted=Array.from(data.entries())
.sort()


fs.writeFileSync(
filepath,
JSON.stringify(sorted)
);
  }
  read(filepath:string){

const file =
fs.readFileSync(
filepath,
"utf-8"
)


return JSON.parse(file)

}readKey(filepath: string, key: string): string | undefined {
    const entries: [string, string][] = this.read(filepath);
    const found = entries.find(([k]) => k === key);
    return found ? found[1] : undefined;
}

}