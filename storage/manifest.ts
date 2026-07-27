import fs from "fs";

export class Manifest{

  private path="./data/manifest.json";

save(files:string[]){


const data = {
    files
};


fs.writeFileSync(
    this.path,
    JSON.stringify(data)
);


}



load(){
//on startup manifest.json doesnt exist yet so retur empty list

if(!fs.existsSync(this.path)){
    return {
        files:[]
    };
}


const data =
fs.readFileSync(
    this.path,
    "utf-8"
);


return JSON.parse(data);


}
}