import MarkdownIt from 'markdown-it';
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";

// $DOCUMENT\\yun-luo-blog\\post-images\\
let imagePrefixUrl = "";

const markdownIt = new MarkdownIt();
Constant.PATH.POST_IMAGES().then(path => {
    FileApi.resolve(path, "").then(encodePath => {
        imagePrefixUrl = `file:///${encodePath}`;
    })
})

function imageRenderer(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string {
    let token = tokens[0];
    if (!token) {
        return "";
    }
    if (!token.attrs) {
        return "";
    }
    let src = "";
    let alt = "";
    for (let attr of token.attrs) {
        if (attr[0] === 'src') {
            src = attr[1];
        } else if (attr[1] === 'alt') {
            src = attr[1];
        }
    }
    if (alt.trim() === '') {
        alt = token.content;
    }
    if (src.startsWith('/')) {
        src = imagePrefixUrl + src.substring(1);
    }
    return `<img src="${src}" alt="${alt}" />`
}

markdownIt.renderer.rules.image = imageRenderer;

export default markdownIt;