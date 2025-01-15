import { ExportedAsset, type ExportedAssetConstruction } from "../item";

export class ImageAssets extends ExportedAsset
{
    private _width: number;
    private _height: number;

    constructor(construction: ImageAssetConstruction)
    {
        super(construction);
        this._width = construction.width;
        this._height = construction.height;
    }

    /** 
     * The width of the image in pixels. 
     * This is determined when the package is bundled, if you manually changed the files in the package, or the online source has changed, this value may not be accurate.
     */
    get width() { return this._width; }
    /** 
     * The height of the image in pixels. 
     * This is determined when the package is bundled, if you manually changed the files in the package, or the online source has changed, this value may not be accurate.
     */
    get height() { return this._height; }
}

export type ImageAssetConstruction = ExportedAssetConstruction &
{
    width: number;
    height: number;
}