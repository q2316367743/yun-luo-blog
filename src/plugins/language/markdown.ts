import * as monaco from 'monaco-editor';

// Difficulty: "Ultra-Violence"
// Language definition for Markdown
// Quite complex definition mostly due to almost full inclusion
// of the HTML mode (so we can properly match nested HTML tag definitions)
const token = {
	defaultToken: '',
	tokenPostfix: '.md',

	// escape codes
	control: /[\\`*_\[\]{}()#+\-\.!]/,
	noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
	escapes: /\\(?:@control)/,

	// escape codes for javascript/CSS strings
	jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

	// non matched elements
	empty: [
		'area', 'base', 'basefont', 'br', 'col', 'frame',
		'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param'
	],

	tokenizer: {
		root: [

			// hexo专有语法
			[/^\s*({%)(.*)(%})\s*$/, ['keyword', 'white', 'keyword']],

			// headers (with #)
			[/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white', 'keyword', 'keyword', 'keyword']],

			// headers (with =)
			[/^\s*(=+|\-+)\s*$/, 'keyword'],

			// headers (with ***)
			[/^\s*((\*[ ]?)+)\s*$/, 'meta.separator'],

			// quote
			[/^\s*>+/, 'comment'],

			// list (starting with * or number)
			[/^\s*([\*\-+:]|\d+\.)\s/, 'keyword'],

			// code block (4 spaces indent)
			[/^(\t|[ ]{4})[^ ].*$/, 'string'],

			// code block (3 tilde)
			[/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: 'string', next: '@codeblock' }],

			// github style code blocks (with backticks and language)
			[/^\s*```\s*((?:\w|[\/\-#])+)\s*$/, { token: 'string', next: '@codeblockgh', nextEmbedded: '$1' }],

			// github style code blocks (with backticks but no language)
			[/^\s*```\s*$/, { token: 'string', next: '@codeblock' }],

			// markup within lines
			{ include: '@linecontent' },
		],

		codeblock: [
			[/^\s*~~~\s*$/, { token: 'string', next: '@pop' }],
			[/^\s*```\s*$/, { token: 'string', next: '@pop' }],
			[/.*$/, 'variable.source'],
		],

		// github style code blocks
		codeblockgh: [
			[/```\s*$/, { token: 'variable.source', next: '@pop', nextEmbedded: '@pop' }],
			[/[^`]+/, 'variable.source'],
		],

		linecontent: [

			// escapes
			[/&\w+;/, 'string.escape'],
			[/@escapes/, 'escape'],

			// various markup
			[/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
			[/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
			[/\b_[^_]+_\b/, 'emphasis'],
			[/\*([^\\*]|@escapes)+\*/, 'emphasis'],
			[/`([^\\`]|@escapes)+`/, 'variable'],

			// links
			[/\{+[^}]+\}+/, 'string.target'],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ['string.link', '', 'string.link']],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

			// or html
			{ include: 'html' },
		],

		// Note: it is tempting to rather switch to the real HTML mode instead of building our own here
		// but currently there is a limitation in Monarch that prevents us from doing it: The opening
		// '<' would start the HTML mode, however there is no way to jump 1 character back to let the
		// HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
		// we cannot correctly tokenize it in that mode yet.
		html: [
			// html tags
			[/<(\w+)\/>/, 'tag'],
			[/<(\w+)/, {
				cases: {
					'@empty': { token: 'tag', next: '@tag.$1' },
					'@default': { token: 'tag', next: '@tag.$1' }
				}
			}],
			[/<\/(\w+)\s*>/, { token: 'tag' }],

			[/<!--/, 'comment', '@comment']
		],

		comment: [
			[/[^<\-]+/, 'comment.content'],
			[/-->/, 'comment', '@pop'],
			[/<!--/, 'comment.content.invalid'],
			[/[<\-]/, 'comment.content']
		],

		// Almost full HTML tag matching, complete with embedded scripts & styles
		tag: [
			[/[ \t\r\n]+/, 'white'],
			[/(type)(\s*=\s*)(")([^"]+)(")/, ['attribute.name.html', 'delimiter.html', 'string.html',
				{ token: 'string.html', switchTo: '@tag.$S2.$4' },
				'string.html']],
			[/(type)(\s*=\s*)(')([^']+)(')/, ['attribute.name.html', 'delimiter.html', 'string.html',
				{ token: 'string.html', switchTo: '@tag.$S2.$4' },
				'string.html']],
			[/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ['attribute.name.html', 'delimiter.html', 'string.html']],
			[/\w+/, 'attribute.name.html'],
			[/\/>/, 'tag', '@pop'],
			[/>/, {
				cases: {
					'$S2==style': { token: 'tag', switchTo: 'embeddedStyle', nextEmbedded: 'text/css' },
					'$S2==script': {
						cases: {
							'$S3': { token: 'tag', switchTo: 'embeddedScript', nextEmbedded: '$S3' },
							'@default': { token: 'tag', switchTo: 'embeddedScript', nextEmbedded: 'text/javascript' }
						}
					},
					'@default': { token: 'tag', next: '@pop' }
				}
			}],
		],

		embeddedStyle: [
			[/[^<]+/, ''],
			[/<\/style\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		],

		embeddedScript: [
			[/[^<]+/, ''],
			[/<\/script\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		],
	},
	//语言大小写不敏感吗
	ignoreCase: true
} as monaco.languages.IMonarchLanguage;

const config = {
	brackets: [],
	autoClosingPairs: [],
	surroundingPairs: [],
	folding: {
		offSide: !0
	}
} as monaco.languages.LanguageConfiguration;

/**
 * 语法提示
 */
const provider = {
	provideCompletionItems(
		model: monaco.editor.ITextModel,
		position: monaco.Position,
		context: monaco.languages.CompletionContext,
		token: monaco.CancellationToken
	): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
		// Markdown基础语法提示
		let suggestions = [{
			label: '#',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '# ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '一级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '##',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '## ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '二级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '###',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '### ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '三级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '####',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '#### ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '四级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '#####',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '##### ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '五级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '######',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '###### ',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '六级标题',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '*',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '*$1*',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '斜体',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '**',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '**$0**',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '加粗',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '***',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '***$1***',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '斜体加粗',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '~~',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '~~$1~~',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '删除线',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '>',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '> $1',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '引用',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '---',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '---',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '引用',
			range: {
				startLineNumber: position.lineNumber + 1,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber + 2,
				endColumn: -1
			}
		}, {
			label: '!',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '![$1]($2)',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '插入图片',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '[',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '[$1]($2)',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '超链接',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '-',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '- $1',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '列表',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '+',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '+ $1',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '列表',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '*',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '* $1',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '列表',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '`',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '`$1`$2',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '单行代码',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '`',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '```$1\n$2\n```\n$3',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: '代码块',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: -1
			}
		}, {
			label: '{',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: '{% $1 $2 $3 %}',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			detail: 'hexo专有语法',
			range: {
				startLineNumber: position.lineNumber,
				startColumn: position.column - 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column + 1
			}
		}];
		// 代码块语法提示
		// 图片提示
		return {
			suggestions: suggestions
		}
	},
	triggerCharacters: ['#', '!', '*', '~', '>', '-', '[', '<', '+', '`', '{']
} as monaco.languages.CompletionItemProvider;

export default { token, config, provider }
