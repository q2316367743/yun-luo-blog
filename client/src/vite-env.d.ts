/// <reference types="vite/client" />

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'monaco-editor/esm/vs/basic-languages/typescript/typescript.js' {
    export {
        conf,
        language
    };
}
declare module 'monaco-editor/esm/vs/basic-languages/javascript/javascript.js' {
    export {
        conf,
        language
    };
}
