
// @ts-check
import { makeConfig } from "@assestant/bundler";
import { consumerPlugin, bundleAssestant } from "@assestant/bundler/rollup";
import typescript from "@rollup/plugin-typescript";

const assestant = makeConfig
({
    useTypeScript: true,
    publicRoot: "public",
    outputDir: "dist/assestant",
    preloadScripts: ["dist/preload.js"],
});

/** @type {import('rollup').RollupOptions[]} */
const config =
[
    {
        input: "source/index.ts",
        output:
        {
            dir: "dist",
            format: "esm",
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: "source",
        },
        plugins:
        [
            typescript
            ({
                tsconfig: "./tsconfig.json",
                outputToFilesystem: true,
                compilerOptions:
                {
                    declaration: true,
                    declarationDir: "./dist",
                    declarationMap: false,
                    noEmit: false
                },
                removeComments: false,
            }),

            consumerPlugin({ assestant })
        ]
    },

    bundleAssestant({ assestant })
]

export default config;