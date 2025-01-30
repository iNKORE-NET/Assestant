import type { AssetItem } from "./item";
import type { DeepReadonly, ResolvableValue, SomePartial } from "./utilities";

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
    readonly assestantConfig?: DeepReadonly<AssestantConfig>;
}

declare global
{
    //interface globalThis extends AssestantConfigContainer { }
}

/**
 * The source to fetch assets from.
 * - "local": Fetch assets from the package. This usually means the bundled assets by the build tool.
 * - "online": Fetch assets from the online url. This usually means the assets are hosted on a server.
 * - "auto": Automatically choose the source based on the asset. If the network is available, and property `onlineUrl` is set, fetch from online. Otherwise, fetch from local.
 * If 'online', the `onlineUrl` must be set, or an error will be thrown.
 */
export type AssetSource = "local" | "online" | "auto";

export interface AssestantPackageConfig
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
    onlineUrl: { base: string } | ((path: string, asset: AssetItem) => string);


    /**
     * The source to fetch assets from.
     * Pass a string to set the source for all assets, or a function that takes an asset and returns the source.
     * You can also pass an object with package names as keys to set the source for specific packages.
     */
    assetSource: ResolvableValue<AssetSource, [AssetItem]>;
}

export interface AssestantConfig
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
    packages: { "default": SomePartial<AssestantPackageConfig, "onlineUrl"> } & Record<string, Partial<AssestantPackageConfig>>;

    /**
     * When assetSource is set to "auto", we will check if the network is available and use this to determine if the asset should be fetched from online.
     * You can use this property to override the network status.
     */
    isOnline: boolean | ((asset: AssetItem) => boolean);
}

export interface AssestantConfigInternal extends AssestantConfig
{
    /**
     * The default config for packages that is set BY THE PACKAGE AUTHOR.
     * This shouldn't be used, or set by the user. It can only be modified via setupPackageDefaults() in the preload script of the package.
     */
    packages_defaults: Record<string, Partial<import("./config").AssestantPackageConfig>>;
}

/**
 * Get the assestant configuration object. This is a writable object, so internal use only.
 */
function _assestantConfigWritable(): AssestantConfigInternal
{
    if (!globalThis.assestantConfig)
    {
        const newConfig: AssestantConfigInternal = 
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

                return true;
            },

            packages_defaults: { }
        };

        globalThis.assestantConfig = newConfig;
    }

    return globalThis.assestantConfig;
}

/**
 * Get the assestant configuration object. 
 * To modify the configuration, use `configureAssestant()` instead.
 */
export function getAssestantConfig(): DeepReadonly<AssestantConfig>;
/**
 * Get the assestant configuration object for one specific package.
 * To modify the configuration, use `configureAssestant(packName, config)` instead.
 */
export function getAssestantConfig(packName: string): DeepReadonly<AssestantPackageConfig>;

export function getAssestantConfig(packName?: string)
{
    const config = _assestantConfigWritable();

    if (packName)
    {
        const defaults = config.packages.default;
        const thisPack = config.packages[packName];
        const thisPackDefaults = config.packages_defaults[packName];
        
        return { ...defaults, ...thisPackDefaults, ...thisPack };
    }

    return config as DeepReadonly<AssestantConfig>;
}

/**
 * Configure the Assestant runtime for one specific package.
 */
export function configureAssestant(packName: string, config: Partial<AssestantPackageConfig>);
/**
 * Configure the Assestant runtime.
 */
export function configureAssestant(config: Partial<AssestantConfig>);

export function configureAssestant(arg1: string | Partial<AssestantConfig>, arg2?: Partial<AssestantPackageConfig>)
{
    const assestant = _assestantConfigWritable();

    if (typeof arg1 === "string")
    {
        const packName = arg1;
        const packConfig = arg2;

        if (!assestant.packages[packName])
        {
            assestant.packages[packName] = {};
        }

        Object.assign(assestant.packages[packName], packConfig);
    }
    else
    {
        const config = arg1;
        for (const prop in config)
        {
            if (prop === "packages")
            {
                for (const packageName in config.packages)
                {
                    if (packageName in assestant.packages)
                    {
                        Object.assign(assestant.packages[packageName], config.packages[packageName]);
                    }
                    else
                    {
                        assestant.packages[packageName] = { ...config.packages[packageName] };
                    }
                }
            }
            if (prop === "packages_defaults")
            {
                throw new Error("Cannot set packages_defaults directly. If you are the package author, use setupPackageDefaults() instead; otherwise, please use configureAssestant(packName, config) to set USER-defined configurations.");
            }
            else
            {
                assestant[prop] = config[prop];
            }
        }
    }
}


/**
 * Sets the default configuration for a package. This is set by the package author, and should not be set by the user.
 * Only use this in the preload script of the package.
 */
export function setupPackageDefaults(packName: string, defaults: Partial<AssestantPackageConfig>)
{
    const assestant = _assestantConfigWritable();

    if (!assestant.packages_defaults[packName])
    {
        assestant.packages_defaults[packName] = {};
    }

    Object.assign(assestant.packages_defaults[packName], defaults);
}