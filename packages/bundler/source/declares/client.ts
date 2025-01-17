// Prevent rollup from removing the module declaration
window?.toString();

type ASSET_BASE = import("@assestant/runtime").AssetItem;
type ASSET_IMAGE = import("@assestant/runtime").ImageAssetItem;

// images
declare module '*.apng' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.bmp' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.png' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.jpg' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.jpeg' 
{
  const src: ASSET_IMAGE
  export default src
}
declare module '*.jfif' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.pjpeg' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.pjp' 
{
  const src: ASSET_BASE
  export default src
}
declare module '*.gif' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.svg' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.ico' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.webp' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.avif' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.cur' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.tiff' 
{
    const src: ASSET_IMAGE
    export default src
}
declare module '*.avif1' 
{
    const src: ASSET_IMAGE
    export default src
}

// media
declare module '*.mp4' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.webm' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.ogg' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.mp3' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.wav' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.flac' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.aac' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.opus' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.mov' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.m4a' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.vtt' 
{
    const src: ASSET_BASE
    export default src
}

// fonts
declare module '*.woff' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.woff2' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.eot' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.ttf' 
{
    const src: ASSET_BASE
    export default src
}
declare module '*.otf' 
{
    const src: ASSET_BASE
    export default src
}
