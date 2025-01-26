import type { AssetItem, AssetItemConstruction } from "../item";

/**
 * You may not manually call this function, the bundler will automatically call this function when building the package.
 */
export function resolveAsset<TItem extends AssetItem>(constructor: new(construction: any) => TItem, construction: ResolveAssetConstruction): TItem
{
    return new constructor({ ...construction, srcLocal: peelLocalImport(construction.srcLocal) });
}

function peelLocalImport(imported: any): string
{
    if (typeof imported === "string")
    {
        return imported;
    }
    
    for (const prop of ["src", "source", "href", "url", "default"])
    {
        if (typeof imported[prop] === "string")
        {
            return imported[prop];
        }
    }

    throw new Error("Could not peel local import. Please check if the build tool you are using is supported by the current version of Assestant.");
}

export type ResolveAssetConstruction = Record<string, any> & Omit<AssetItemConstruction, "srcLocal"> &
{
    srcLocal: any;
}