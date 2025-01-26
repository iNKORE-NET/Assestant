import type { AssetItem } from "./item";
import type { ResolvableValue } from "./utilities";

declare global
{
    interface AssestantConfigContainer
    {
        /**
         * The global configuration for Assestant. Do not set this property directly.
         * Please use `configureAssestant()` to set the configuration.
         * @example
         * ```typescript
         * // DO NOT:
         * ❎ globalThis.assestantConfig = { ... };
         * ❎ globalThis.assestantConfig.packages = { ... };
         * // DO:
         * ✅ globalThis.assestantConfig.packages["my-package"] = { ... };
         * ```
         */
        assestantConfig?: AssestantConfig;
    }

    interface globalThis extends AssestantConfigContainer { }
}

/**
 * The source to fetch assets from.
 * - "local": Fetch assets from the package. This usually means the bundled assets by the build tool.
 * - "online": Fetch assets from the online url. This usually means the assets are hosted on a server.
 * - "auto": Automatically choose the source based on the asset. If the network is available, and property `onlineUrl` is set, fetch from online. Otherwise, fetch from local.
 * If 'online', the `onlineUrl` must be set, or an error will be thrown.
 */
export type AssetSource = "local" | "online" | "auto";

export type AssestantPackageConfig = 
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
    onlineUrl?: { base: string } | ((asset: AssetItem) => string);


    /**
     * The source to fetch assets from.
     * Pass a string to set the source for all assets, or a function that takes an asset and returns the source.
     * You can also pass an object with package names as keys to set the source for specific packages.
     */
    assetSource: ResolvableValue<AssetSource, [AssetItem]>;
}

export type AssestantConfig = 
{
    /**
     * The configuration for each package, and use 'default' as the key for the default configuration.
     * @example
     * ```typescript
     * // DO NOT:
     * ❎ globalThis.assestantConfig = { ... };
     * ❎ globalThis.assestantConfig.packages = { ... };
     * // DO:
     * ✅ globalThis.assestantConfig.packages["my-package"] = { ... };
     */
    packages: Record<string, Partial<AssestantPackageConfig>> & { "default": AssestantPackageConfig };

    /**
     * When assetSource is set to "auto", we will check if the network is available and use this to determine if the asset should be fetched from online.
     * You can use this property to override the network status.
     */
    isOnline: boolean | (() => boolean);
}

export function getAssestantConfig(): AssestantConfig
{
    if (!globalThis.assestantConfig)
    {
        globalThis.assestantConfig = 
        {
            packages: { "default": { onlineUrl: undefined, assetSource: "auto" } },
            isOnline: () => 
            {
                try
                {
                    if (typeof window === "undefined" || !window.navigator) return true;
                    return navigator.onLine;
                }
                catch(ex)
                {
                    console.warn("Failed to determine network status. Defaulting to online.", ex);
                }
            }
        };
    }

    return globalThis.assestantConfig;
}

export function configureAssestant(config: Partial<AssestantConfig>)
{
    for (const prop in config)
    {
        if (prop === "packages")
        {
            for (const packageName in config.packages)
            {
                if (packageName in getAssestantConfig().packages)
                {
                    Object.assign(getAssestantConfig().packages[packageName], config.packages[packageName]);
                }
                else
                {
                    getAssestantConfig().packages[packageName] = config.packages[packageName];
                }
            }
        }
        else
        {
            getAssestantConfig()[prop] = config[prop];
        }
    }
}
