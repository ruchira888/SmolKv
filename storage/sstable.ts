import fs from "fs"

export class SSTable{
  write(filename:string,data:Map<string,string>){
    const sorted=Array.from(data.entries())
.sort()


fs.writeFileSync(
filename,
JSON.stringify(sorted)
);
  }
  read(filename:string){

const file =
fs.readFileSync(
filename,
"utf-8"
)


return JSON.parse(file)

}readKey(filename: string, key: string): string | undefined {
    const entries: [string, string][] = this.read(filename);
    const found = entries.find(([k]) => k === key);
    return found ? found[1] : undefined;
}

}