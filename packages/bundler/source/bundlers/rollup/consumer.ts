import { posix as path } from "path";
import type { NormalizedOutputOptions, Plugin as RollupPlugin } from "rollup";
import type { AssestantOptions } from "source/config";
import { isNotStrictEqual, type Many } from "source/utilities";


export type ConsumerPluginOptions = 
{
    assestant: Many<Pick<AssestantOptions, "publicRoot" | "outputDir">>;
}

/**
 * If you are consuming the assests inside the same project, you may need to use this plugin.
 */
export function consumerPlugin(ops: ConsumerPluginOptions): RollupPlugin
{
    let outputOptions: undefined | NormalizedOutputOptions = undefined;
    let outputRoot: undefined | string = undefined;

    const sthUNeverUse = Math.random().toString(36).slice(-8);
    const tempImportRegex = new RegExp(`<${sthUNeverUse}%(.*?)%${sthUNeverUse}>`, "g");

    function isAssestantAssest(source: string)
    {
        const sourcePt = source.replaceAll("\\", "/").split("/");
        for (const asses of (Array.isArray(ops.assestant) ? ops.assestant : [ops.assestant]))
        {
            if (isNotStrictEqual(asses.publicRoot, sourcePt[0]))
                return asses;  
        }

        return null;
    }

    return {
        name: "assestant-consumer",
        renderStart(options)
        {
            outputOptions = options;
            outputRoot = outputOptions.dir ?? (outputOptions.file == undefined ? undefined : path.dirname(outputOptions.file)) ?? ".";
        },
        /**
         * 
         * @param source "public/images/dertale/blook.gif"
         * @param importer "/media/common/workspaces/Yoojun Products/(Others)/Assestant/samples/dummy/source/index.ts"
         * @param options 
         */
        async resolveId(source, importer, options)
        {
            if (!importer) return null;
            if (isAssestantAssest(source))
            {
                return { id: `<${sthUNeverUse}%${source}%${sthUNeverUse}>`, external: true };
            }
        },

        generateBundle(options, bundle)
        {
            if (!outputRoot) { throw new Error("outputRoot is not defined. This is mostly because the plugin didn't run renderStart hook correctly."); }

            for (const [fileName, chunk] of Object.entries(bundle))
            {
                if (chunk.type !== "chunk") continue;
                for (let i = 0; i < chunk.imports.length; i++)
                {
                    const importee = chunk.imports[i];
                    const match = importee.matchAll(tempImportRegex).toArray();
                    
                    if (match.length >= 1)
                    {
                        const inner = match[0][1];
                        const sourcePt = inner.replaceAll("\\", "/").split("/");
                        const assestant = isAssestantAssest(inner);
                        if (assestant === null) continue;
                        
                        const indexPath = path.join(assestant.outputDir, sourcePt.slice(1).join("/") + ".js");
                        const chunkPath = path.join(outputRoot, fileName);

                        let indexPathRelat = path.relative(path.dirname(chunkPath), indexPath);
                        if (!indexPathRelat.startsWith(".")) indexPathRelat = "./" + indexPathRelat;
                        chunk.code = chunk.code.replaceAll(importee, indexPathRelat);
                    }
                }
            }
        }
    }
}