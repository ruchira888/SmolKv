import fs from "fs"
export class Compact{
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
   }
}