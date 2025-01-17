import { builtinFilters, type InclusionFilter } from "./inclusion";
import type { CreateIndexOptions } from "./indexing";
import type { PartialPartial } from "./utilities";

export type AssestantOptions = AssestantPluginBaseOptions &
{
    /** 
     * Which files should be included in the bundle.
     * You can use a list of filters to make things easier,
     * or you can use a list of strings as the files to include.
     * @default 
     * [includesEverything, excludesInvalidAssets]
     */
    includes: InclusionFilter[] | string[];
}

export type AssestantOptionsInput = PartialPartial<AssestantOptions, "outputDir" | "publicRoot" | "useTypeScript" | "includes">;

export type AssestantPluginBaseOptions =
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
     * If a string is provided, it will be used as the path to the js file.
     * All the paths are relative to the __dirname.
     */
    preloadScripts?: CreateIndexOptions["preloadScripts"];
}

export const AssestantDefaultOptions =
{
    publicRoot: "./public",
    outputDir: "./dist/assestant",
    useTypeScript: true,
    includes: [builtinFilters.includeAll, builtinFilters.noInvalidAssets] satisfies AssestantOptionsInput["includes"],
    
} as const;

export function makeConfig(ops: AssestantOptionsInput): AssestantOptions
{
    return { ...AssestantDefaultOptions, ...ops };
}