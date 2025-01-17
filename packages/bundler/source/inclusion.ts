import { glob } from "glob";
import { posix as path } from "path";
import { invalidAssetExtensions } from "./utilities";

export type InclusionFilter = Selector &
{
    action: "include" | "exclude";
};

export type ExtensionSelector = 
{ 
    /**
     * The files with these extensions will be selected for the action.
     * Extensions should be in the format of ".ext", including the dot.
     */
    extensions: readonly string[]; 
};

export type EverythingSelector = { };

export type GlobSelector = 
{ 
    /**
     * The glob pattern to select files.
     */
    pattern: string; 
};

export type Selector = EverythingSelector | ExtensionSelector | GlobSelector;

export function listFilesBySelector(dirname: string, selector: Selector): string[]
{
    if ("extensions" in selector)
    {
        // ExtensionSelector
        return glob.sync(path.join(dirname, "**/*"), { nodir: true }).filter((f) => selector.extensions.some((ext) => f.toLowerCase().endsWith(ext.toLowerCase())));
    }
    else if ("pattern" in selector)
    {
        // GlobSelector
        return glob.sync(path.join(dirname, selector.pattern), { nodir: true });
    }
    else 
    {
        // EverythingSelector
        return glob.sync(path.join(dirname, "**/*"), { nodir: true });
    }

    return [];
}

export function listFilesByInclusion(dirname: string, filters: InclusionFilter[]): string[]
{
    let result: string[] = [];
    
    for (const filter of filters)
    {
        const filtered = listFilesBySelector(dirname, filter);
        
        if (filter.action === "include")
        {
            filtered.forEach((f) => { if(!result.includes(f)) result.push(f); });
        }
        else if (filter.action === "exclude")
        {
            result = result.filter((f) => !filtered.includes(f));
        }
    }

    return result;
}

export const builtinSelectors =
{
    everything: { } as EverythingSelector,
    scripts: { extensions: [".js", ".jsx", ".ts", ".tsx"] } as ExtensionSelector,
    styles: { extensions: [".css", ".scss", ".sass", ".less"] } as ExtensionSelector,
    invalidAssets: { extensions: invalidAssetExtensions } as ExtensionSelector,
}

export const builtinFilters =
{
    includeAll: { action: "include", ...builtinSelectors.everything } as InclusionFilter,
    excludeAll: { action: "exclude", ...builtinSelectors.everything } as InclusionFilter,
    noScripts: { action: "exclude", ...builtinSelectors.scripts } as InclusionFilter,
    noStyles: { action: "exclude", ...builtinSelectors.styles } as InclusionFilter,
    noInvalidAssets: { action: "exclude", ...builtinSelectors.invalidAssets } as InclusionFilter,
}