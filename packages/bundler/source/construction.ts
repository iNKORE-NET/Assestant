import { type resolveAsset, type ResolveAssetConstruction } from "@assestant/runtime/internal";

export type AssetTypeConstruction =
{
    /** The name of the constructor function */
    constuctor: string;
    /** The construction object. Do not include the general properties (srcLocal, length, etc.) */
    construction: Record<string, any>;
}

/**
 * A method that constructs an asset item.
 * @param src The source of the asset. Must be an absolute path.
 */
type ConstructingMethod = (src: string) => Promise<AssetTypeConstruction>;



import sharp from "sharp";
export const createImageAsset: ConstructingMethod = async (src) =>
{
    const metadata = await sharp(src).metadata();
    return {
        constuctor: "ImageAssetItem",
        construction: 
        {
            width: metadata.width,
            height: metadata.height
        }
    }
}

export const createUnknownAsset: ConstructingMethod = async (src) =>
{
    return {
        constuctor: "AssetItem",
        construction: { }
    }
}

const TYPE_MAP: Record<string, ConstructingMethod> =
[
    {
        extensions: ["jpg", "jpeg", "png", "webp", "gif", "avif", "tiff", "svg"],
        create: createImageAsset
    },

].reduce((acc, cur) =>
{
    cur.extensions.forEach(ext => acc[ext] = cur.create);
    return acc;
}, {} as Record<string, ConstructingMethod>);

const createAsset: ConstructingMethod = async (src) =>
{
    const extname = src.split(".").pop()?.toLowerCase();
    
    if (extname !== undefined && TYPE_MAP[extname] !== undefined)
    {
        return TYPE_MAP[extname](src);
    }

    return createUnknownAsset(src);
}

export default createAsset;