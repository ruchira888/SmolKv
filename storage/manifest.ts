import fs from "fs";

export class Manifest {

    private path = "./data/manifest.json";

    save(files: string[]) {//Save the list of SSTable filenames into manifest.json
        const data = {
            files
        };

        fs.writeFileSync(
            this.path,
            JSON.stringify(data)
        );
    }

    load() {//Read manifest.json n return the filenmes
        // On startup manifest.json doesn't exist yet
        if (!fs.existsSync(this.path)) {
            return {
                files: []
            };
        }

        const data = fs.readFileSync(
            this.path,
            "utf-8"
        );

        return JSON.parse(data);
    }

  
    nextFileName(): string {//return nex filename
        const manifest = this.load();

        const files = manifest.files;

        if (files.length === 0) {
            return "001.sst";
        }

        const lastFile = files[files.length - 1];

        const number = parseInt(lastFile.replace(".sst", ""));

        return `${String(number + 1).padStart(3, "0")}.sst`;
    }

    
    addFile(filename: string) {//add new filenme to manifest.json
        const manifest = this.load();

        manifest.files.push(filename);

        this.save(manifest.files);
    }
}