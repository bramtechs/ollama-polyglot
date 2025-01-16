import prompts from "prompts";
import {
    dirFilesWithExtension,
    pickModelFromList,
    promptDirectory,
} from "./utils";
import Lama from "./lama";
import { readFile, writeFile } from "fs/promises";

(async function () {
    const modelNames = await Lama.listModelNames();

    const sourceDir = await promptDirectory();
    const choices = await prompts([
        {
            type: "text",
            name: "sourceExtension",
            message: "Enter source files extension (.lua, .ts, .js, etc...)",
            initial: ".lua",
        },
        {
            type: "text",
            name: "targetExtension",
            message: "Enter target language extension",
            initial: ".ts",
        },
        {
            type: "text",
            name: "suffix",
            message: "Enter suffix for prompt",
            initial: "use camelCase, do not polyfill unreferenced functions",
        },
    ]);

    {
        const src = choices.sourceExtension.replace(".", "");
        const target = choices.targetExtension.replace(".", "");
        if (src === target) {
            throw new Error("Source and target extensions cannot be the same");
        }
    }

    const model = await pickModelFromList(modelNames);
    const lama = new Lama(model);
    const files = await dirFilesWithExtension(
        sourceDir,
        choices.sourceExtension
    );

    for (const filePath of files) {
        const outputPath = filePath.replace(
            choices.sourceExtension,
            choices.targetExtension
        );
        if (outputPath === filePath) {
            throw new Error("Source and target destination cannot be the same");
        }

        console.log(`Processing ${filePath}...`);
        const content = await readFile(filePath, "utf-8");
        const prompt = `

            ${content}
            Translate the above code from ${choices.targetExtension} to ${choices.targetExtension}.
            ${choices.suffix}
            Only answer with the translated code.
        `;

        // @type {ChatResponse}
        const response = await lama.chat(prompt);

        await writeFile(outputPath, response.message.content, "utf-8");

        const remaining = files.length - files.indexOf(filePath) - 1;
        console.log(
            `Translated ${filePath} to ${outputPath}. ${remaining} files remaining.`
        );
    }
})();
