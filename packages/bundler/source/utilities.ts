

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
