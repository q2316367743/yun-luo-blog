import MarkdownIt from 'markdown-it';
import Token from "markdown-it/lib/token";
import imageStrategyContext from "@/strategy/image/ImageStrategyContext";
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";


const markdownIt = new MarkdownIt();

function imageRenderer(tokens: Token[]): string {
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
        // 本地解析
        src = imageStrategyContext.getStrategy(ImageTypeEnum.LOCAL).parse(src);
    }
    return `<img src="${src}" alt="${alt}" />`
}

markdownIt.renderer.rules.image = imageRenderer;

export default markdownIt;