import MarkdownIt from 'markdown-it';
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";

// $DOCUMENT\\yun-luo-blog\\post-images\\
const imagePrefixUrl = "https://asset.localhost/D%3A%5CDocuments%5Cyun-luo-blog%5Cpost-images%5C";

const markdownIt = new MarkdownIt();
function imageRenderer(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string {
    let token= tokens[0];
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
        }else if (attr[1] === 'alt') {
            src = attr[1];
        }
    }
    if (alt.trim() === '') {
        alt = token.content;
    }
    if (src.startsWith('/')) {
        // TODO: 对于相对目录，则需要处理
        src = imagePrefixUrl + src.substring(1);
    }
    return `<img src="${src}" alt="${alt}"></img>`
}
markdownIt.renderer.rules.image = imageRenderer;

export default markdownIt;