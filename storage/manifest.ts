import fs from "fs";

export class Manifest {

    private path = "./data/manifest.json";

    save(files: string[], walOffset: number = 0) {
        const data = {
            files, walOffset
        };

        fs.writeFileSync(
            this.path,
            JSON.stringify(data)
        );
    }

    load() {
        if (!fs.existsSync(this.path)) {
            return {
                files: [], walOffset: 0
            };
        }

        const data = fs.readFileSync(
            this.path,
            "utf-8"
        );
        const parsed = JSON.parse(data);

        return {
            files: parsed.files || [],
            walOffset: parsed.walOffset || 0
        };
    }

    nextFileName(): string {
        const manifest = this.load();
        const files = manifest.files;

        if (files.length === 0) {
            return "001.sst";
        }

        const lastFile = files[files.length - 1];
        const number = parseInt(lastFile.replace(".sst", ""));

        return `${String(number + 1).padStart(3, "0")}.sst`;
    }

    addFile(filename: string) {
        const manifest = this.load();
        manifest.files.push(filename);
        this.save(manifest.files, manifest.walOffset);
    }

    saveWalOffset(offset: number) {
        const manifest = this.load();
        this.save(manifest.files, offset);
    }
}