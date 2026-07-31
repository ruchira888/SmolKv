import fs from "fs";

export class WAL{
  private file="./data/database.log";

  append(
  operation:string,
  key:string,
  value:string
  ){
    const data={
      operation,
      key,
      value
    }
    fs.appendFileSync(
this.file,
JSON.stringify(data)+"\n"
)
  }


read(){
  if (!fs.existsSync(this.file)) {
        return [];
    }
const logs =
fs.readFileSync(
this.file,
"utf-8"//decode raw bytes to readable txt
)


return logs
.split("\n")
.filter(Boolean)
.map((line:string)=>JSON.parse(line))


}
}
