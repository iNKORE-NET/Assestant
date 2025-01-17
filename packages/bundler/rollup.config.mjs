import path from "path";
import { glob } from "glob";

import typescript from "@rollup/plugin-typescript";
import nodeExternals from 'rollup-plugin-node-externals'

import PreserveDirectivesPlugin from "@inkore/rollup-plugins/preserve-directives";
import RelativeDtsImportsPlugin from "@inkore/rollup-plugins/relative-imports-dts";
import PreserveCommentsPlugin from "@inkore/rollup-plugins/preserve-comments";

const mode = process.env.MODE;
const isProd = mode === "prod";
const __dirname = path.resolve();

/** @type {import("rollup").RollupOptions} */
const config =
{
    input: ["source/index.ts", ...glob.sync("source/bundlers/*/index.ts"), ...glob.sync("source/declares/*.ts")],
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
            sourceMap: !isProd,
            outputToFilesystem: true,
            compilerOptions:
            {
                sourceMap: !isProd,
                declaration: true,
                declarationDir: "./dist",
                declarationMap: false,
                noEmit: false
            },
            removeComments: false,
        }),

        PreserveCommentsPlugin({ }),
        nodeExternals({ }),

        RelativeDtsImportsPlugin
        ({
            rootDirectories:
            [{
                alias: ["source"],
                path: "./dist"
            }]
        }),
    ]
}

export default config;