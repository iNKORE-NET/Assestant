
import type { Plugin as RollupPlugin } from "rollup"

export type AssestantPluginOptions =
{

}

/**
 * A Rollup plugin that generates asset items for the Assestant runtime.
 * It's better to use Assestant by using the 'makeConfig' function instead of using this plugin directly.
 */
export default function assestantPlugin(): RollupPlugin
{
    return {
        name: "assestant-bundler",
        async load(id)
        {
            
        },
        async generateBundle()
        {
        },
        async transform(code, id)
        {
            
        },
    }
}