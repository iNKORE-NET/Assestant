import path from "path";
import fs from "fs";

import createAsset from "./construction";
import { AssetItemJsTemplate, AssetItemTsTemplate } from "./templates";
import { toSafeName } from "./utilities";


export type CreateIndexOptions =
{
    /** The full path of the asset. */
    fullPath: string;
    /** The public root directory. */
    publicRoot: string;
    /** The output directory. */
    outputDir: string;
    packageName: string;
    language?: "js" | "ts";
}

export async function createIndex({ fullPath, publicRoot, outputDir, packageName, language = "js" }: CreateIndexOptions)
{
    const relat = path.relative(publicRoot, fullPath).replaceAll("\\", "/");
    const dt = await createAsset(fullPath);
    const indexPath = path.join(outputDir, relat, "/index." + language);
    

    let content = language === "js" ? AssetItemJsTemplate : AssetItemTsTemplate;

    content = content.replaceAll("__SRC_LOCAL__", path.relative(path.dirname(indexPath), fullPath)
        .replaceAll("\\", "/"));

    content = content.replaceAll("__ASSET_CONSTRUCTOR__", dt.constuctor);
    content = content.replaceAll("__ASSET_NAME__", toSafeName(path.basename(fullPath).replace(/\.[^/.]+$/, "")));

    let construction = "";
    dt.construction.relativePath = relat;
    dt.construction.package = packageName ?? "unknown";
    dt.construction.length = fs.statSync(fullPath).size;

    for (const key in dt.construction)
    {
        construction += `   ${key}: ${JSON.stringify(dt.construction[key])},\n`;
    }

    content = content.replaceAll("__OTHERS___", construction);

    return {
        path: indexPath,
        content
    }
}
