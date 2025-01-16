import { readdir } from "fs/promises";
// @ts-ignore
import selectFolder from "win-select-folder";
import prompts from "prompts";
import { join } from "path";

export async function promptDirectory(): Promise<string> {
    return selectFolder({
        description: "Pick a folder with source files",
        newFolderButton: 0,
    })
        .then((result: string) => {
            if (result === "cancelled") {
                throw new Error("No folder selected");
            }
            return result;
        })
        .catch((err: any) => console.error(err));
}

export async function dirFilesWithExtension(
    path: string,
    ext: string
): Promise<string[]> {
    if (!ext.startsWith(".")) {
        ext = "." + ext;
    }
    const files = await readdir(path);
    return files
        .filter((file) => file.endsWith(ext))
        .map((file) => join(path, file));
}

export async function pickModelFromList(models: string[]): Promise<string> {
    if (models.length === 0) {
        throw new Error("No models found");
    }

    if (models.length === 1) {
        return models[0];
    }
    const choice = await prompts({
        type: "select",
        name: "model",
        message: "Choose a model",
        choices: models.map((name) => ({ title: name })),
    });
    return models[choice.model];
}
