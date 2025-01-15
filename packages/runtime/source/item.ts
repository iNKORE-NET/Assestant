import { assestantConfig, type AssetSource } from "./config";
import { removeSlash, resolveValue } from "./utilities";

export class ExportedAsset
{
    private _srcLocal: string; // imported from the package
    private _srcRelative: string; // the relative path to the asset
    private _relatedPackage: string; // the package that the asset is imported from

    private _length: number;

    constructor(construction: ExportedAssetConstruction)
    {
        this._srcLocal = construction.srcLocal;
        this._srcRelative = construction.relativePath;
        this._relatedPackage = construction.package;
        this._length = construction.length;
    }

    /**
     * The full path to the asset when fetching from the local package.
     * This is the path that is imported from the package.
     */
    get srcLocal() { return this._srcLocal; }

    /**
     * The relative path to the asset.
     */
    get relativePath() { return this._srcRelative; }

    /**
     * The package that the asset is imported from.
     */
    get package() { return this._relatedPackage; }

    /**
     * The extension of the asset. Without the dot.
     * @example `png`, `jpg`, `svg`
     */
    get extension() { return this.relativePath.split(".").pop(); }

    /**
     * The length (file size) of the asset in bytes.
     * This is determined when the package is bundled, if you manually changed the files in the package, or the online source has changed, this value may not be accurate.
     */
    get length() { return this._length; }

    /**
     * The full url to the asset when fetching from the local package.
     * @throws An error if the online url base is not set in assesstantConfig.
     */
    get srcOnline() 
    { 
        if (this.packageConfig.onlineUrl == undefined) throw new Error("The onlineUrlBase must be set in the assestantConfig in order to fetch assets from online.");
        if (typeof this.packageConfig.onlineUrl === "function") return this.packageConfig.onlineUrl(this);

        return removeSlash(this.packageConfig.onlineUrl.base, { trailing: true }) + "/" + removeSlash(this.relativePath ?? "", { leading: true });
    }

    /**
     * Get the source of the asset that you can directly use in the `src` attribute of an HTML element or for fetching.
     * This will automatically choose the source based on the asset and the configuration.
     */
    get src() 
    { 
        let method: AssetSource = resolveValue(this.packageConfig.assetSource, [this]);

        switch (method)
        {
            case "local": return this.srcLocal;
            case "online": return this.srcOnline;
            case "auto": return ((typeof assestantConfig.isOnline === "function" ? assestantConfig.isOnline() : assestantConfig.isOnline) && this.packageConfig.onlineUrl != undefined)
                ? this.srcOnline : this.srcLocal;
        }
    }

    protected get packageConfig() { return { ...assestantConfig.packages["default"], ...assestantConfig.packages[this.package] }; }

    /** Returns the `src` property. */
    public toString() { return this.src; }
    /** Returns the `src` property. */
    public valueOf() { return this.src; }
    /** Returns the `src` property. */
    public [Symbol.toPrimitive]() { return this.src; }
}

export type ExportedAssetConstruction = Pick<ExportedAsset, "srcLocal" | "relativePath" | "package" | "length"> &
{

}