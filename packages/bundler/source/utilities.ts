import path from "path";
import fs from "fs";

import type { PackageJson } from "type-fest";

/**
 * Replace any character that is not a letter or number with underscore
 * Then replace multiple consecutive underscores with a single one
 */
export function toSafeName(str: string) 
{
    const result = str.replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

    return result ? result : "_UNKNOWN_";
}


/**
 * A type that makes some properties of an object optional.
 */
export type PartialPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;


/**
 * Recursively finds the package.json file in the given directory and its parents.
 */
export function getPackageInfo(dirname?: string): Partial<PackageJson>
{
    let dir = dirname ?? path.resolve(".");
    while (dir !== "/" && dir)
    {
        const packagePath = path.join(dir, "package.json");
        if (fs.existsSync(packagePath) && fs.statSync(packagePath).isFile())
        {
            let obj = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
            return obj;
        }

        dir = path.dirname(dir);
    }
    
    return { };
}

/**
 * A list of extensions that are not allowed to be included as assets.
 * Well actually, they can be included, but in most cases, that will cause severe problems.
 */
export const invalidAssetExtensions = 
[
    ".ts", ".tsx", 
    ".js", ".jsx",
    ".css"
] as const;