import type { RollupOptions, Plugin as RollupPlugin } from "rollup";

import type { AssestantPluginOptions } from "./plugin";
import type { PartialPartial } from "source/utilities";

import assestantPlugin from "./plugin";
import { builtinFilters, listFilesByInclusion, type InclusionFilter } from "source/inclusion";

export type MakeConfigOptions = AssestantPluginOptions &
{
    /** 
     * Which files should be included in the bundle.
     * You can use a list of filters to make things easier,
     * or you can use a list of strings as the files to include.
     * @default 
     * [includesEverything, excludesInvalidAssets]
     */
    includes: InclusionFilter[] | string[];

    rollupOptions?: Omit<Partial<RollupOptions>, "plugins"> &
    {
        plugins?: RollupPlugin[];
    }
}

export type MakeConfigOptionsInput = PartialPartial<MakeConfigOptions, "outputDir" | "publicRoot" | "useTypeScript" | "includes">;

export function assestantConfig(_ops: MakeConfigOptionsInput): RollupOptions
{
    const ops: MakeConfigOptions =
    {
        publicRoot: "./public",
        outputDir: "./dist/assestant",
        useTypeScript: true,
        includes: [builtinFilters.includeAll, builtinFilters.noInvalidAssets],
        ..._ops,
    };

    return {
        input: (() => 
        {
            const includes = ops.includes;
            if (includes.every((f) => typeof f === "string")) return includes;
            else return listFilesByInclusion(ops.publicRoot, includes as InclusionFilter[]);
        })(),
  watch: {
    clearScreen: false
  },
        ...ops.rollupOptions,

        output: 
        {
            dir: ops.outputDir,
            format: "esm",
            preserveModules: true,
            preserveModulesRoot: ops.publicRoot,
            ...(ops.rollupOptions?.output ?? {})
        },
        plugins:
        [
            assestantPlugin(ops),
            ...(ops.rollupOptions?.plugins ?? [])
        ]
    }
}