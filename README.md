<p align="center">
  <a target="_blank" rel="noopener noreferrer">
    <img width="128" src="https://github.com/iNKORE-NET/.github/blob/main/assets/icons/NodejsLibrary_256w.png?raw=true" alt="iNKORE Logo">
  </a>
</p>

<p align="center">Include assets in your NPM package with your favorite bundler!</p>

<h1 align="center">
  Assestant
</h1>

<p align="center">Give us a star if you like this!</p>

<p align="center">
  <a href="https://github.com/iNKORE-NET/Assestant/releases"><img src="https://img.shields.io/github/downloads/iNKORE-NET/Assestant/total?color=%239F7AEA" alt="Release Downloads"></a>
  <a href="#"><img src="https://img.shields.io/github/repo-size/iNKORE-NET/Assestant?color=6882C4" alt="GitHub Repo Size"></a>
  <a href="#"><img src="https://img.shields.io/github/last-commit/iNKORE-NET/Assestant?color=%23638e66" alt="Last Commit"></a>
  <a href="#"><img src="https://img.shields.io/github/issues/iNKORE-NET/Assestant?color=f76642" alt="Issues"></a>
  <a href="#"><img src="https://img.shields.io/github/v/release/iNKORE-NET/Assestant?color=%4CF4A8B4" alt="Latest Version"></a>
  <a href="#"><img src="https://img.shields.io/github/release-date/iNKORE-NET/Assestant?color=%23b0a3e8" alt="Release Date"></a>
  <a href="https://github.com/iNKORE-NET/Assestant/commits/"><img src="https://img.shields.io/github/commit-activity/m/iNKORE-NET/Assestant" alt="Commit Activity"></a>
</p>

<p align="center">
  <a href="https://github.com/iNKORE-NET/Assestant/network/members"><img src="https://img.shields.io/github/forks/iNKORE-NET/Assestant?style=social" alt="Forks"></a>
  <a href="https://github.com/iNKORE-NET/Assestant/stargazers"><img src="https://img.shields.io/github/stars/iNKORE-NET/Assestant?style=social" alt="Stars"></a>
  <a href="https://github.com/iNKORE-NET/Assestant/watchers"><img src="https://img.shields.io/github/watchers/iNKORE-NET/Assestant?style=social" alt="Watches"></a>
  <a href="https://github.com/iNKORE-NET/Assestant/discussions"><img src="https://img.shields.io/github/discussions/iNKORE-NET/Assestant?style=social" alt="Discussions"></a>
  <a href="https://discord.gg/m6NPNVk4bs"><img src="https://img.shields.io/discord/1092738458805608561?style=social&label=Discord&logo=discord" alt="Discord"></a>
  <a href="https://twitter.com/NotYoojun"><img src="https://img.shields.io/twitter/follow/NotYoojun?style=social&logo=twitter" alt="NotYoojun's Twitter"></a>
</p>

<br>


## ✨ Features

- **Automatic**: Automatically bundle assets into your NPM package, no more making one file for each single asset file.

- **Metadata**: Get the metadata of the asset (e.g. width, height, file name, etc.) without requesting the actual file (coded when bundling).

- **Universal**: Use the dist in most bundlers or frameworks (listed below).

- **Elegant**: Include assets in your NPM package with just a few lines of code and use them in your source code easily.

- **Tree-Shaking**: You can add assets as much as you want, and the consumer will only keep what they need.

- **Online CDN**: you can optionally create a signle site specially for resources, throw away the resources when bundling your application, and always fetch the resources from your CDN site when running the application.

Supported **Library Bundlers** to make the library with Assestant: Rollup, ... (more coming soon)

Supported **Website Builders** you can use the library made with Assestant: Vite, Next.js, Docusaurus (Docusaurus may need a few special configs when resolving SVG assets), ... (more coming soon)

This project is still in a stage of early development, so don't give expectation too high, and if there's something wrong, please report!

### Do I need this?

You may not always need Assestant when building your NPM package.

If you are building a website, or a web application, you may not need Assestant. You can use the bundler's built-in asset handling feature to include assets in your project. Only use Assestant when you are building a package that will be used by others.

If you are using CommonJS, instead of ESM, you may not need Assestant. Assestant is designed for ESM, and it may not work well, or even necessary, in CommonJS.

## 🏍️ Motivation

The stuff in this section is kinda long, which includes the problem we have, the solution we provide, and the reason why we created this tool. If you're not interested in this, you can skip to the next section.

Have you ever tried to add assets (especially images, fonts and static files) to your NPM package? We have encountered this problem - when we're making our React control library, we may sometimes need images or icons to be included in the package. That is absolutely not as easy as it seems. We usually use Vite, Next.js and Docusaurus (the last two are based on Webpack) to build our final website / applications. If you have ever used these tools, you may know that there are a little bit of differences when coming to asset handling.

Let's use Vite and Next.js as examples. If you want to include an image in your package **with Vite**, you may need to import it in your source code like this:

```tsx
import image from "path/to/image.png";

export const ImageComponent: React.FunctionComponent = () => 
{
    return <img src={image} alt="Image" />;
};
```

As you can see, the image is imported as a module, and the default export is the URL of the image. In **Next.js**, you may use the same way to import the image, but things get unusual when using the imported image. The default export is no longer even a string, but an object. You may need to use `image.src` to get the URL of the image like this:

```tsx
import image from "path/to/image.png";

export const ImageComponent: React.FunctionComponent = () => 
{
    return <img src={image.src} alt="Image" />;
};
```

Now you may wonder, that shouldn't be a big deal, right? Yeah I admit that you're right, but only if you are building just a website. When it comes to building a library that you don't know which bundler or framework the user will use, things get complicated. You may need to provide different ways to import the image, and distribute multiple branches of the package. Obviously, that sucks!

Initially, we used a middleware to handle the assets, for example, I have an image in `public/icons/products/contoso.png` in my control library, I would create a file named `public/icons/products/contoso.png.ts` (or js, whatever) in the same directory, and write the following code in it:

```ts
import ASSET from "../../public/icons/products/contoso.png"; // Rollup can only resolve relative paths
export default resolveAsset(ASSET);

function resolveAsset(asset: unknown): string
{
    if (typeof asset === "string")
    {
        return asset;
    }
    if (typeof asset === "object")
    {
        if (typeof asset.src === "string") return asset.src;
        if (typeof asset.default === "string") return asset.default;
    }

    throw new Error("Invalid asset type. There's nothin I can do with it.");
}
```

It's a good idea to do things like this (if we put the resolveAsset function in a shared file), but it's still not perfect. We need to create a file for each asset, and in this way we can't get the metadata of the asset (e.g. the width and height of an image, file name, length, etc.). So does that mean there's NO way to include assets in an NPM package elegantly?

Personally, I believe I'm not a man who gives up easily. I've been thinking about this for a long time, and finally, I came up with an idea - why not use a middleware, but more powerful and automatic? That's why I created Assestant. By parsing this name - Assets + Assistant, you may know what it does. It's an assistant that helps you to include assets in your NPM package, and it's powerful enough to handle the assets automatically. You don't need to create a file for each asset, and you can get the metadata of the asset easily. That's what Assestant does.

You can use Assestant with your favorite bundler *(currently we only do Rollup, but we will support more bundlers in the future)*. It's easy to use, and it's powerful. You can include assets in your NPM package with just a few lines of code. And the dist can be used in most bundlers or frameworks.

## 😰 Limitations

There's no silver bullet in the world. Assestant is not perfect, and it has some limitations. For library builders (who build libraries that will be used by others), you may need to know these limitations before using Assestant:

- **ESM Recommeded**: As mentioned above, Assestant is designed for ESM, we've not tested it in CommonJS. Additionally, to import the asset outside, you need to modify the `exports` field in `package.json` to include the asset. This may not work well in CommonJS.

- **Always Preserve Modules**: Assestant will always preserve the folder structure of the asset. This is very important for tree-shaking. If everything are bundled into one single file, the tree-shaking may longer work *(consumers will have to dist all the assets in your library even if they only use a tiny amount of them)*.

There are also a few limitations for comsumers who uses libraries made with Assestant:

- **Tree-shaking**: The build tool of the final website is better to support tree-shaking, libraries made with Assestant usually includes all the assets anyone may need, but the final dist of your website should only contain the assets you really used.

- **Import Statement**: Assestant can only import an asset with a ES import statement like `import ASSE from "../../a.png"`. It doesn't matter what type the imported ASSE variable is *(mostly Assestant runtime will handle this correctly, but if you are using a build tool that doesn't work with Assestant, please submit an issue and we'll add support)*, but your build tool must support this pattern to use libraries made with Assestant.
