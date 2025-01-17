import { posix as path } from "path";
import fs from "fs";

import createAsset from "./construction";
import { AssetItemTemplateJS, AssetItemTemplateDTS } from "./templates";
import { toSafeName } from "./utilities";
import type { ArrayElement } from "type-fest/source/internal";


export type CreateIndexOptions =
{
    /** The full path of the asset. */
    srcFullPath: string;
    /** The public root directory. */
    publicRoot: string;
    /** The output directory. */
    outputDir: string;
    dirname: string;
    packageName: string;
    indexFullPath: string;
    preloadScripts?: (string | 
    {
        js?: string;
        dts?: string;
    })[];
}

export async function createIndex({ srcFullPath, indexFullPath, publicRoot, outputDir, packageName, preloadScripts, dirname }: CreateIndexOptions, file: "js" | "dts")
{
    const relat = path.relative(publicRoot, srcFullPath).replaceAll("\\", "/");
    const dt = await createAsset(srcFullPath);
    const indexDirname = path.dirname(indexFullPath);
    const srcFileName = path.basename(srcFullPath);

    let construction = "";
    if (file === "js")
    {
        dt.construction.relativePath = relat;
        dt.construction.package = packageName ?? "unknown";
        dt.construction.length = fs.statSync(srcFullPath).size;

        for (const key in dt.construction)
        {
            construction += `    ${key}: ${JSON.stringify(dt.construction[key])},\n`;
        }

        construction = construction.substring(0, construction.length - "\n".length);
    }

    const importPreloads = preloadScripts?.map((preload) => 
    {
        let scripts: Exclude<ArrayElement<CreateIndexOptions["preloadScripts"]>, undefined | string> | undefined = undefined;
        if (typeof preload === "string") scripts = { js: preload };
        else scripts = preload;
        const script = scripts[file];

        if (!script) return undefined;
        return `import ${JSON.stringify(path.relative(indexDirname, path.join(dirname, script)))};`;

    }).filter(v => typeof v === "string").join("\n");
    
    function fillValues(input: string)
    {
        let content = input;
        content = content.replaceAll("__SRC_LOCAL__", path.relative(indexDirname, srcFullPath)
            .replaceAll("\\", "/"));

        content = content.replaceAll("__ASSET_CONSTRUCTOR__", dt.constuctor);
        content = content.replaceAll("__ASSET_NAME__", toSafeName(path.basename(srcFullPath).replace(/\.[^/.]+$/, "")));
        content = content.replaceAll("__OTHER_CONSTRUCTIONS__", construction);

        if (importPreloads)
            content = importPreloads + "\n" + content;

        return content;
    }

    if ([".ts", ".tsx", ".js", ".jsx"].some((ext) => srcFileName.endsWith(ext)))
    {
        console.warn("You are trying to include a script file as an asset. This is most likely a mistake and the asset will not be able to load correctly, \
            Please double-check the file you are trying to include. File: '" + srcFullPath + "'");
    }

    // function fName(ext: string)
    // {
    //     return path.relative(outputDir, path.join(indexDirname, srcFileName + ext));
    // }

    switch (file)
    {
        case "js":
            return {
                content: fillValues(AssetItemTemplateJS),
            };
        case "dts":
            return {
                content: fillValues(AssetItemTemplateDTS),
            };

    }
}
