import fs from "fs"
import { Manifest } from "./manifest.js";
export class Compact{
 //single source of truth that updates it once da compaction is done, so restart doesn't load a file that no longer exists. 
  private manifest = new Manifest();
   compact(){
        const files = fs.readdirSync("./data")
            .filter(file => file.endsWith(".sst"));
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
    fs.writeFileSync(
"./data/merged.sst",
JSON.stringify(
Array.from(merged.entries())
)
);
this.manifest.save(['merged.sst']);

 // delete da old files now that they're safely merged
        for(const file of files){
            fs.unlinkSync("./data/"+file);
        }
   }
}