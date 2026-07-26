import fs from "fs";

export class wal{
  private file="database.log"

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
