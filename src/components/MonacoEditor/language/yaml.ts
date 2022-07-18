import * as monaco from 'monaco-editor';

const token = {
    tokenizer: {
        root: [{
            include: "@whitespace"
        }, {
            include: "@comment"
        }, [/%[^ ]+.*$/, "meta.directive"], [/---/, "operators.directivesEnd"], [/\.{3}/, "operators.documentEnd"], [/[-?:](?= )/, "operators"], {
            include: "@anchor"
        }, {
            include: "@tagHandle"
        }, {
            include: "@flowCollections"
        }, {
            include: "@blockStyle"
        }, [/@numberInteger(?![ \t]*\S+)/, "number"], [/@numberFloat(?![ \t]*\S+)/, "number.float"], [/@numberOctal(?![ \t]*\S+)/, "number.octal"], [/@numberHex(?![ \t]*\S+)/, "number.hex"], [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"], [/@numberNaN(?![ \t]*\S+)/, "number.nan"], [/@numberDate(?![ \t]*\S+)/, "number.date"], [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]], {
            include: "@flowScalars"
        }, [/[^#]+/, {
            cases: {
                "@keywords": "keyword",
                "@default": "string"
            }
        }]],
        object: [{
            include: "@whitespace"
        }, {
            include: "@comment"
        }, [/\}/, "@brackets", "@pop"], [/,/, "delimiter.comma"], [/:(?= )/, "operators"], [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"], {
            include: "@flowCollections"
        }, {
            include: "@flowScalars"
        }, {
            include: "@tagHandle"
        }, {
            include: "@anchor"
        }, {
            include: "@flowNumber"
        }, [/[^\},]+/, {
            cases: {
                "@keywords": "keyword",
                "@default": "string"
            }
        }]],
        array: [{
            include: "@whitespace"
        }, {
            include: "@comment"
        }, [/\]/, "@brackets", "@pop"], [/,/, "delimiter.comma"], {
            include: "@flowCollections"
        }, {
            include: "@flowScalars"
        }, {
            include: "@tagHandle"
        }, {
            include: "@anchor"
        }, {
            include: "@flowNumber"
        }, [/[^\],]+/, {
            cases: {
                "@keywords": "keyword",
                "@default": "string"
            }
        }]],
        multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
        multiStringContinued: [[/^( *).+$/, {
            cases: {
                "$1==$S2": "string",
                "@default": {
                    token: "@rematch",
                    next: "@popall"
                }
            }
        }]],
        whitespace: [[/[ \t\r\n]+/, "white"]],
        comment: [[/#.*$/, "comment"]],
        flowCollections: [[/\[/, "@brackets", "@array"], [/\{/, "@brackets", "@object"]],
        flowScalars: [[/"([^"\\]|\\.)*$/, "string.invalid"], [/'([^'\\]|\\.)*$/, "string.invalid"], [/'[^']*'/, "string"], [/"/, "string", "@doubleQuotedString"]],
        doubleQuotedString: [[/[^\\"]+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/"/, "string", "@pop"]],
        blockStyle: [[/[>|][0-9]*[+-]?$/, "operators", "@multiString"]],
        flowNumber: [[/@numberInteger(?=[ \t]*[,\]\}])/, "number"], [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"], [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"], [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"], [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"], [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"], [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"]],
        tagHandle: [[/\![^ ]*/, "tag"]],
        anchor: [[/[&*][^ ]+/, "namespace"]]
    },
    //语言大小写不敏感吗
    ignoreCase: true
} as monaco.languages.IMonarchLanguage;

const config = {
    comments: {
        lineComment: "#"
    },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [{
        open: "{",
        close: "}"
    }, {
        open: "[",
        close: "]"
    }, {
        open: "(",
        close: ")"
    }, {
        open: '"',
        close: '"'
    }, {
        open: "'",
        close: "'"
    }],
    surroundingPairs: [{
        open: "{",
        close: "}"
    }, {
        open: "[",
        close: "]"
    }, {
        open: "(",
        close: ")"
    }, {
        open: '"',
        close: '"'
    }, {
        open: "'",
        close: "'"
    }],
    folding: {
        offSide: !0
    }
} as monaco.languages.LanguageConfiguration;

export default { token, config }