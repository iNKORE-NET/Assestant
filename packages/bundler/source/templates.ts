export const AssetItemJsTemplate = `
/** ENTRY-POINT */

import SRC_LOCAL from "__SRC_LOCAL__";
import { resolveAsset } from "@assestant/runtime/internal";
import { __ASSET_CONSTRUCTOR__ } from "@assestant/runtime";

const __ASSET_NAME__ = resolveAsset(__ASSET_CONSTRUCTOR__, 
{
    srcLocal: SRC_LOCAL,
    ...__OTHERS___
});

export default __ASSET_NAME__;
`.trim();


export const AssetItemTsTemplate = AssetItemJsTemplate;