
import type { Plugin as RollupPlugin } from "rollup";

import path from "path";
import fs from "fs";
import { createFilter } from "@rollup/pluginutils";
import { createIndex, type CreateIndexOptions } from "source/indexing";
import { getPackageInfo } from "source/utilities";
import type { AssestantOptions } from "source/config";

export type AssestantPluginOptionsInput = 
{
    assestant: AssestantOptions;
    exclude?: string[];
    include?: string[];
}

const dirname = path.resolve(".");

/**
 * A Rollup plugin that generates asset items for the Assestant runtime.
 * It's better to use Assestant by using the 'makeConfig' function instead of using this plugin directly.
 */
export default function bundlePlugin(ops: AssestantPluginOptionsInput): RollupPlugin
{
    const { assestant } = ops;
    const filter = createFilter(ops.include ?? ["**/*"], ops.exclude ?? ["node_modules/**"]);
    /** Absolute path */
    const publicRoot = path.resolve(assestant.publicRoot);
    const outputDir = path.resolve(assestant.outputDir);
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
                    outputDir, packageName, dirname,
                    preloadScripts: assestant.preloadScripts,
                }, "js");

                // this.emitFile
                // ({
                //     type: "asset",
                //     fileName: indexJS.path,
                //     source: indexJS.content
                // });
                bundle[key].code = indexJS.content;

                if (assestant.useTypeScript)
                {
                    const dtsPat = path.join(path.dirname(indexJSFullPath), path.basename(indexJSFullPath, ".js") + ".d.ts");
                    const indexDTS = await createIndex
                    ({ 
                        srcFullPath: id, publicRoot, 
                        indexFullPath: dtsPat,
                        preloadScripts: assestant.preloadScripts,
                        outputDir, packageName, dirname,
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