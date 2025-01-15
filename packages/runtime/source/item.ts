import { assestantConfig, type AssetSource } from "./config";
import { removeSlash } from "./utilities";

export class ExportedAsset
{
    private _srcLocal: string; // imported from the package
    private _srcRelative: string; // the relative path to the asset

    constructor(srcLocal?: string, srcOnline?: string)
    {

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
     * The extension of the asset. Without the dot.
     * @example `png`, `jpg`, `svg`
     */
    get extension() { return this.relativePath.split(".").pop(); }

    /**
     * The full url to the asset when fetching from the local package.
     * @throws An error if the online url base is not set in assesstantConfig.
     */
    get srcOnline() 
    { 
        if (assestantConfig.onlineUrl == undefined) throw new Error("The onlineUrlBase must be set in the assestantConfig in order to fetch assets from online.");
        if (typeof assestantConfig.onlineUrl === "function") return assestantConfig.onlineUrl(this);

        return removeSlash(assestantConfig.onlineUrl.base, { trailing: true }) + "/" + removeSlash(this.relativePath ?? "", { leading: true });
    }

    /**
     * Get the source of the asset that you can directly use in the `src` attribute of an HTML element or for fetching.
     * This will automatically choose the source based on the asset and the configuration.
     */
    get src() 
    { 
        let method: AssetSource;
        if (typeof assestantConfig.assetSource === "function") method = assestantConfig.assetSource(this);
        else method = assestantConfig.assetSource;

        switch (method)
        {
            case "local": return this.srcLocal;
            case "online": return this.srcOnline;
            case "auto": return (navigator.onLine && assestantConfig.onlineUrl != undefined) ? this.srcOnline : this.srcLocal;
        }
    }

    /** Returns the `src` property. */
    public toString() { return this.src; }
    /** Returns the `src` property. */
    public valueOf() { return this.src; }
    /** Returns the `src` property. */
    public [Symbol.toPrimitive]() { return this.src; }
}