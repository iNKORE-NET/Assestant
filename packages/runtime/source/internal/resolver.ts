import type { AssetItem, AssetItemConstruction } from "../item";

/**
 * You may not manually call this function, the bundler will automatically call this function when building the package.
 */
export function resolveAsset<TItem extends AssetItem>(constructor: new(construction: any) => TItem, construction: ResolveAssetConstruction): TItem
{
    return new constructor(construction);
}

export type ResolveAssetConstruction = Record<string, any> & AssetItemConstruction;