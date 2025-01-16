
import type { Plugin as RollupPlugin } from "rollup";

import path from "path";
import fs from "fs";
import { createFilter } from "@rollup/pluginutils";
import { createIndex } from "source/indexing";
import { getPackageInfo } from "source/utilities";

export type AssestantPluginOptions =
{
    /**
     * The relative path to the public root directory that you want to include in the bundle.
     * @default "./public"
     */
    publicRoot: string;

    /**
     * The relative path to the output directory.
     * @default "./dist"
     */
    outputDir: string;

    /**
     * Add TypeScript declaration files to the bundle. This requires you to have the `@rollup/plugin-typescript` plugin installed.
     */
    useTypeScript: boolean;

    /**
     * The path to the script that will be preloaded before every asset item is resolved.
     * This is useful for adding default AssestantPackageConfig to the runtime.
     */
    preloadScript?: string[];
}

export type AssestantPluginOptionsInput = AssestantPluginOptions &
{
    exclude?: string[];
    include?: string[];
}

/**
 * A Rollup plugin that generates asset items for the Assestant runtime.
 * It's better to use Assestant by using the 'makeConfig' function instead of using this plugin directly.
 */
export default function assestantPlugin(ops: AssestantPluginOptionsInput): RollupPlugin
{
    const filter = createFilter(ops.include ?? ["**/*"], ops.exclude ?? ["node_modules/**"]);
    /** Absolute path */
    const publicRoot = path.resolve(ops.publicRoot);
    const outputDir = path.resolve(ops.outputDir);
    const packageName = getPackageInfo()?.name ?? "default";

    return {
        name: "assestant-bundler",
        async load(id)
        {
            const content = `export default ${JSON.stringify(`ASSESTANT_TMP://` + id)};`;
            return { code: content, map: null, moduleSideEffects: false };
        },
        async generateBundle(options, bundle, isWrite)
        {
            for (const key in bundle)
            {
                if (!filter(key) || bundle[key].type !== "chunk") continue;
                const id = bundle[key].facadeModuleId;
                if (!id) continue;

                const indexJSFullPath = path.join(outputDir, key);
                const srcRelative = path.relative(publicRoot, id);
                const indexJS = await createIndex
                ({ 
                    srcFullPath: id, publicRoot, 
                    indexFullPath: indexJSFullPath,
                    outputDir, packageName 
                }, "js");

                // this.emitFile
                // ({
                //     type: "asset",
                //     fileName: indexJS.path,
                //     source: indexJS.content
                // });
                bundle[key].code = indexJS.content;

                if (ops.useTypeScript)
                {
                    const dtsPat = path.join(path.dirname(indexJSFullPath), path.basename(indexJSFullPath, ".js") + ".d.ts");
                    const indexDTS = await createIndex
                    ({ 
                        srcFullPath: id, publicRoot, 
                        indexFullPath: dtsPat,
                        outputDir, packageName 
                    }, "dts");

                    this.emitFile
                    ({
                        type: "asset",
                        fileName: path.relative(outputDir, dtsPat),
                        source: indexDTS.content
                    });
                }
            }
        },
        async transform(code, id)
        {
            
        },
    }
}