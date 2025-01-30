import { setupPackageDefaults } from "@assestant/runtime";


console.log("This will be executed before the asset is resolved!");

setupPackageDefaults("dummy", 
{
    assetSource: "online",
    onlineUrl: (path) => `https://github.com/iNKORE-NET/Assestant/blob/main/samples/dummy/public/${path}?raw=true`
    // This is just an example, so we use github as the online source. This will cause CORS issues.
    // So when you use this in your project, you need to host the assets on a server that allows CORS.
});