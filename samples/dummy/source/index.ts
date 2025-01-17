import "./preload";
import BLOOK from "public/images/dertale/blook.gif";

/**
 * An example of using an image asset inside the dummy package.
 */
export function blook()
{
    // Create a new window showing the image.
    const win = window.open(BLOOK.src, "_blank");
    return BLOOK;
}

const hello = 'Hello, world!';
export default hello;