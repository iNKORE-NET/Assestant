declare module "./config"
{
    export interface AssestantConfig
    {
        /**
         * The default config for packages that is set BY THE PACKAGE AUTHOR.
         * This shouldn't be used, or set by the user. It can only be modified via setupPackageDefaults() in the preload script of the package.
         */
        packages_defaults: Record<string, Partial<import("./config").AssestantPackageConfig>>;
    }
}