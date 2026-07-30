import { KVEngine } from "../src/engine.js";


const db = new KVEngine();

db.put("a", "1");
db.put("b", "2");
db.put("a", "99");  
db.put("c", "3");
db.put("d", "4");    

db.put("e", "5");
db.delete("e");       
db.put("f", "6");
db.put("g", "7");
db.put("h", "8");    

console.log("a before compact:", db.get("a")); 

db.compact();

console.log("a after compact:", db.get("a"));   
console.log("e after compact:", db.get("e"));  