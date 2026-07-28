import fs from "fs"
import { Manifest } from "./manifest.js";
import { TOMBSTONE } from "../src/constants.js";
export class Compact{
 
  private manifest = new Manifest();
   compact(){
        const files = fs.readdirSync("./data")
            .filter(file => file.endsWith(".sst"))
            .sort();
            //end up holdin da correct value 4 every key
            const merged=new Map<string,string>();
            for(const file of files){
            const content =
fs.readFileSync(
"./data/"+file,
"utf-8"
);

const entries =
JSON.parse(content);



for(const [key,value] of entries){

//tombstone
if(value==="__DELETE__"){

merged.delete(key);

}

else{

merged.set(
key,
value
);

}
            }
        
    }

    const newFilename=this.manifest.nextFileName();
    fs.writeFileSync(
"./data/"+newFilename,
JSON.stringify(
Array.from(merged.entries())
)
);
this.manifest.save([newFilename]);

 // delete da old files now that they're safely merged
        for(const file of files){
            fs.unlinkSync("./data/"+file);
        }
   }
}