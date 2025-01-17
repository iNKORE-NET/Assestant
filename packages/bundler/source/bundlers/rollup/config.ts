import type { RollupOptions, Plugin as RollupPlugin } from "rollup";
import type { Many, PartialPartial } from "source/utilities";

import assestantPlugin from "./plugin";
import { builtinFilters, listFilesByInclusion, type InclusionFilter } from "source/inclusion";
import type { AssestantOptions, AssestantOptionsInput } from "source/config";

export type BundleAssestantOptions =
{
    assestant: AssestantOptions;
    rollupOptions?: Omit<Partial<RollupOptions>, "plugins"> &
    {
        plugins?: RollupPlugin[];
    }
}

export type BundleAssestantOptionsInput = BundleAssestantOptions;


export function bundleAssestant(ops: BundleAssestantOptionsInput): RollupOptions;
export function bundleAssestant(ops: BundleAssestantOptionsInput[]): RollupOptions[];

export function bundleAssestant(ops: Many<BundleAssestantOptionsInput>): Many<RollupOptions>
{
    if (Array.isArray(ops)) return ops.map((ops) => bundleAssestant(ops));

    return {
        input: (() => 
        {
            const includes = ops.assestant.includes;
            if (includes.every((f) => typeof f === "string")) return includes;
            else return listFilesByInclusion(ops.assestant.publicRoot, includes as InclusionFilter[]);
        })(),
        watch: 
        {
            clearScreen: false
        },
        ...ops.rollupOptions,

        output: 
        {
            dir: ops.assestant.outputDir,
            format: "esm",
            preserveModules: true,
            preserveModulesRoot: ops.assestant.publicRoot,
            ...(ops.rollupOptions?.output ?? {})
        },
        plugins:
        [
            assestantPlugin(ops),
            ...(ops.rollupOptions?.plugins ?? [])
        ]
    }
}