export function removeSlash(url: string, removes: { trailing?: boolean, leading?: boolean })
{
    if (removes.trailing) url = url.replace(/\/+$/, "");
    if (removes.leading) url = url.replace(/^\/+/, "");
    return url;
}