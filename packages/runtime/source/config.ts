import type { ExportedAsset } from "./item";

declare global
{
    interface Window
    {
        assestantConfig?: AssestantConfig;
    }
}

/**
 * The source to fetch assets from.
 * - "local": Fetch assets from the package. This usually means the bundled assets by the build tool.
 * - "online": Fetch assets from the online url. This usually means the assets are hosted on a server.
 * - "auto": Automatically choose the source based on the asset. If the network is available, and property `onlineUrl` is set, fetch from online. Otherwise, fetch from local.
 * If 'online', the `onlineUrl` must be set, or an error will be thrown.
 */
export type AssetSource = "local" | "online" | "auto";

export type AssestantConfig = 
{
    /**
     * When fetching assets with online url, this is the base url to prepend to the relative path.
     * You can pass a string as the root url, or a function that takes a relative path and returns the full url.
     * This must be set if `assetSource` is set to "online".
     * @example
     * ```typescript
     * onlineUrl: { base: "https://assets.contoso.com/" }
     * // When fetching "images/logo.png", the full url will be "https://assets.contoso.com/images/logo.png"
     * onlineUrl: (relativePath) => `https://assets.contoso.com/${relativePath}`
     * // This is equivalent to the previous example, but allows for more complex logic.
     * ```
     */
    onlineUrl?: { base: string } | ((asset: ExportedAsset) => string);


    /**
     * The source to fetch assets from.
     * Pass a string to set the source for all assets, or a function that takes an asset and returns the source.
     */
    assetSource: AssetSource | ((asset: ExportedAsset) => AssetSource);
}

export const assestantConfig: AssestantConfig = 
{
    assetSource: "auto"
};

window.assestantConfig = assestantConfig;
