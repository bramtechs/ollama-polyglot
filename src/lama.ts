import ollama from "ollama";

export default class Lama {
    private readonly model: string;

    constructor(model: string) {
        this.model = model;
    }

    static async listModelNames() {
        const models = (await ollama.list()).models;
        return models.map((model) => model.name);
    }

    chat(prompt: string) {
        return ollama.chat({
            model: this.model,
            messages: [{ role: "user", content: prompt }],
        });
    }
}
