import type { ExportedAsset, ExportedAssetConstruction } from "../item";

/**
 * You may not manually call this function, the bundler will automatically call this function when building the package.
 */
export function resolveAsset<TItem extends ExportedAsset>(constructor: new(construction: any) => TItem, construction: any): TItem
{
    return new constructor(construction);
}

export type ResolveAssetConstruction = Record<string, any> & ExportedAssetConstruction;