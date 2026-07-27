import fs from "fs"
export class Compact{
   compact(){
        const files = fs.readdirSync("./data")
            .filter(file => file.endsWith(".sst"));
            const merged=new Map<string,string>();
        console.log(
          "SSTables found:",
           files);
    }
}