import fs from "fs"

export class sstable{
  write(data:Map<String,String>){
    const sorted=Array.from(data.entries())
.sort()


fs.writeFileSync(
"data.sst",
JSON.stringify(sorted)
)
  }
  read(){

const file =
fs.readFileSync(
"data.sst",
"utf-8"
)


return JSON.parse(file)

}
}