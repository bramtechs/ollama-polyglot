require("esbuild").build({
    entryPoints: ["src/index.ts"],
    outfile: "bundle.js",
    minify: true,
    sourcemap: true,
    bundle: true,
    format: "cjs",
    platform: "node",
    treeShaking: true,
    tsconfig: "tsconfig.json",
});
