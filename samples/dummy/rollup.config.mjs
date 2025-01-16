
// @ts-check
import { assestantConfig } from "@assestant/bundler/rollup";
import typescript from "@rollup/plugin-typescript";

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
        ]
    },

    assestantConfig
    ({
        useTypeScript: true,
        publicRoot: "public",
        outputDir: "dist/assestant",
        preloadScripts: ["dist/preload.js"],
    })
]

export default config;