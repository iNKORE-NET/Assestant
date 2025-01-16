import type { RollupOptions } from "rollup";
import { glob } from "glob";
import path from "path";

export type MakeConfigOptions =
{
    /**
     * The relative path to the public root directory that you want to include in the bundle.
     * @default "./public"
     */
    publicRoot: string;

    /**
     * The relative path to the output directory.
     * @default "./dist"
     */
    outputDir: string;

    /**
     * Add TypeScript declaration files to the bundle. This requires you to have the `@rollup/plugin-typescript` plugin installed.
     */
    useTypeScript?: boolean;

    external?: 
    { 
        /**
         * The extensions of the files that you want to exclude from the bundle.
         */
        extensions: string[]; 
    } | ((path: string) => boolean);
}

export function makeConfig(ops: MakeConfigOptions): RollupOptions
{
    return {
        input: glob.sync(path.join(ops.publicRoot, "**/*")).filter((f) => 
        {
            if (typeof ops.external === "function") return !ops.external(f);
            else if (typeof ops.external === "object")
            {
                return !ops.external.extensions.some((ext) => f.endsWith(ext));
            }

            return true;
        }),
        output: 
        {
            dir: ops.outputDir,
            format: "esm",
            preserveModules: true,
            preserveModulesRoot: ops.publicRoot
        },
        plugins:
        [
            
        ]
    }
}