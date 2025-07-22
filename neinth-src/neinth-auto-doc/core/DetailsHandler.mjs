// @ts-check

import { NeinthComponent, NeinthRuntime } from 'neinth';
import { dirname } from 'path';
/**
 * @description
 * quirks:
 * - auto generate on `entryPoint` if this requirements are fulfilled:
 * >- first letter must be `upperCase` for `Go-ish` style;
 * >- add `module` to `entryPoint`:
 * >>- must have `namedExport` of the same name to it's `fileName`;
 * >>- add module `descriptionBlock` to README:
 * >>>- detect first `[blank]@[blank]description` `commentBlock` on `validExportModule` according to previous rule;
 * >>>- use the comment block content as part of `readme` `markDown`;
 * >>>- use `[[blank]blank[blank]]"` as escape character, eg. when you want/need to add typehelper on the `description` block;
 * >- add `type` to `entryPoint`:
 * >>- only supports `@typedef`;
 * >>>- example: `@callback` should be `translated`/`refered` to `@typedef`;
 * >>- must have `@typedef` of the same name to it's `fileName`;
 * >>- will convert that block only to `@typedef` on `entryPoint` as `imported` `@typedef`;
 */
export class DetailsHandler {
	#runTypedefCheck = () => {
		const { basename, content } = this;
		if (!DetailsHandler.hasTypedefExported(basename, content)) {
			return;
		}
		const generics = DetailsHandler.getGenerics(basename, content);
		this.exportedTypedef = DetailsHandler.generateTypedefForEntryFile(
			basename,
			this.relativeFromRoot,
			generics
		);
	};
	#runDescriptionCheck = () => {
		const { content } = this;
		this.exportedDescription = DetailsHandler.getDescriptionBlock(content);
	};
	/**
	 * @param {string} content
	 * @returns {string}
	 */
	static getDescriptionBlock = (content) => {
		const jsdocBlocks = content.match(/\/\*\*[\s\S]*?\*\//g);
		if (!jsdocBlocks) {
			return '';
		}
		for (const block of jsdocBlocks) {
			const lines = block.split(/\r?\n/);
			let isDescription = false;
			let captured = [];
			for (const line of lines) {
				const stripped = line
					.trim()
					.replace(/^\/?\**/, '')
					.trim();
				if (stripped.startsWith('@description')) {
					isDescription = true;
					captured.push(stripped.replace('@description', '').trim());
					continue;
				}
				if (isDescription) {
					if (stripped.startsWith('@') && !stripped.startsWith('@description')) {
						break;
					}
					captured.push(stripped);
				}
			}
			if (captured.length > 0) {
				const cleaned = captured
					.join('\n')
					.replace(/\[blank\]/g, '')
					.replace(/^\s+|\s+$/g, '')
					.replace(/\n\/$/, '');
				return cleaned;
			}
		}
		return '';
	};
	/**
	 * Converts a string to a single-line, lowercase, dashified version.
	 * Keeps only alphanumerics and spaces, replaces spaces with dashes.
	 * @param {string} str
	 * @returns {string}
	 */
	static slugify(str) {
		return str
			.replace(/[^a-zA-Z0-9 ]+/g, '')
			.trim()
			.replace(/\s+/g, '-')
			.toLowerCase();
	}
	/**
	 * Prefixes each line of a template literal with ` * `.
	 * @param {string} multilineStr
	 * @param {string} StartsLineWith
	 * @returns {string}
	 */
	static annotateLines(multilineStr, StartsLineWith) {
		return multilineStr
			.split(/\r?\n/)
			.map((line) => `${StartsLineWith}${line}`)
			.join('\n');
	}
	/**
	 * @param {string} basename
	 * @param {string} content
	 * @returns {boolean}
	 */
	static hasTypedefExported = (basename, content) => {
		const jsdocBlocks = content.match(/\/\*\*[\s\S]*?\*\//g);
		if (!jsdocBlocks) {
			return false;
		}
		for (const block of jsdocBlocks) {
			const typedefRegex = new RegExp(`@typedef\\s+\\{[^}]+\\}\\s+${basename}\\b`);
			if (typedefRegex.test(block)) {
				return true;
			}
		}
		return false;
	};
	/**
	 * @param {string} basename
	 * @param {string} content
	 * @returns {string[]}
	 */
	static getGenerics = (basename, content) => {
		const jsdocBlocks = content.match(/\/\*\*[\s\S]*?\*\//g);
		if (!jsdocBlocks) {
			return [];
		}
		for (const block of jsdocBlocks) {
			const typedefMatch = new RegExp(`@typedef\\s+(.*\\s)?\\b${basename}\\b`).test(block);
			if (!typedefMatch) {
				continue;
			}
			const lines = block.split(/\r?\n/);
			const generics = [];
			for (const line of lines) {
				const withType = line.match(/@template\s+\{([^}]+)\}\s+(\w+)/);
				if (withType) {
					generics.push(`@template {${withType[1]}} ${withType[2]}`);
				}
				const withoutType = line.match(/@template\s+(\w+)/);
				if (withoutType && !withType) {
					generics.push(`@template ${withoutType[1]}`);
				}
				if (/@typedef\b/.test(line)) {
					break;
				}
			}
			return generics;
		}
		return [];
	};
	/**
	 * @param {string} basename
	 * @param {string} relativePath
	 * @param {string[]} generics
	 * @returns {string}
	 */
	static generateTypedefForEntryFile = (basename, relativePath, generics) => {
		const genericsString = [];
		const genericAssign = [];
		for (let i = 0; i < generics.length; i++) {
			const [gentype, genname] = DetailsHandler.resolveImportsForGeneric(relativePath, generics[i]);
			if (gentype) {
				genericsString.push(`@template {${gentype}} ${genname}`);
			} else {
				genericsString.push(`@template ${genname}`);
			}
			genericAssign.push(genname);
		}
		return generics.length
			? `/**
 * ${genericsString.join('\n * ')}
 * @typedef {import('${relativePath}').${basename}<${genericAssign.join(',')}>} ${basename}
 */`
			: `/**
 * @typedef {import('${relativePath}').${basename}} ${basename}
 */`;
	};
	/**
	 * Resolves a template type import and returns its canonical form.
	 * Supports both `@template {Type} Name` and `@template Name`.
	 * @param {string} relativePath
	 * @param {string} genericString
	 * @returns {[string, string]}
	 */
	static resolveImportsForGeneric = (relativePath, genericString) => {
		const withType = genericString.match(/@template\s+\{([^}]+)\}\s+(\w+)/);
		const withoutType = genericString.match(/@template\s+(\w+)/);
		let genericType = '';
		let genericName = '';
		if (withType) {
			genericType = withType[1].trim();
			genericName = withType[2].trim();
		} else if (withoutType) {
			genericName = withoutType[1].trim();
			return ['', genericName];
		} else {
			return ['', ''];
		}
		const importMatch = genericType.match(/^import\(['"](.+?)['"]\)\.(\w+)$/);
		if (importMatch && importMatch[1].includes('.')) {
			const [_, importPath, suffix] = importMatch;
			const tempPaths = `${dirname(relativePath)}/${importPath}`.split('/');
			const trueResolved = [];
			for (let i = 0; i < tempPaths.length; i++) {
				const path = tempPaths[i];
				if (i == 0) {
					continue;
				}
				if (path === '.') {
					continue;
				}
				if (path === '..') {
					trueResolved.pop();
					continue;
				}
				trueResolved.push(path);
			}
			genericType = `import('./${NeinthRuntime.normalizePath(
				trueResolved.join('/').replace(/\/+/g, '/')
			)}').${suffix}`;
		}
		return [genericType, genericName];
	};

	constructor({ content, relativeFromRoot, basename, haveValidJsExport }) {
		this.content = content;
		this.basename = basename;
		this.relativeFromRoot = relativeFromRoot;
		this.haveValidJsExport = haveValidJsExport;
		if (haveValidJsExport) {
			this.#runDescriptionCheck();
			return;
		}
		this.#runTypedefCheck();
	}
	/**
	 * @type {string|undefined}
	 */
	exportedDescription = undefined;
	/**
	 * @type {string|undefined}
	 */
	exportedTypedef = undefined;
	/**
	 * @type {string}
	 */
	relativeFromRoot;
	/**
	 * @type {boolean}
	 */
	haveValidJsExport;
}
/**
 * @type {NeinthComponent<
 * void,
 * undefined
 * >}
 */
const neinthInstance = new NeinthComponent(async function () {
	const configInstanceSignal = this.listenToNeinth('neinth-src/neinth-auto-doc/main.mjs');
	const readmemain_ = this.listenToNeinth('neinth-src/neinth-auto-doc/core/readMeMain.mjs');
	this.new$(async () => {
		const configInstance = configInstanceSignal.value;
		const readmemain = readmemain_.value;
		this.safeUniquePing(
			'writeFiles',
			async () => {
				if (!configInstance || !readmemain) {
					return;
				}
				let description = '';
				readmemain.infos.forEach((info) => {
					description = info.content ?? '';
				});
				const {
					copyright,
					filePath,
					watcherData,
					readMePath,
					tableOfContentTitle: tableOfContentTitle_,
				} = configInstance;
				const tableOfContentTitle = DetailsHandler.slugify(tableOfContentTitle_);
				const { infos } = watcherData;
				const exports = [];
				const exportedClass = [];
				const classDef = [];
				const types = [];
				for (const info of infos) {
					const relativeFromRoot = `./${this.normalizePath(info.path.relative)}`;
					const basename = info.baseName.noExt;
					if (basename[0] !== basename[0].toUpperCase()) {
						continue;
					}
					if (info.ext.noDot !== 'mjs') {
						continue;
					}
					const regexForValidExportedModule = new RegExp(
						`^export\\s+(const|class|function|async\\s+function)\\s+${basename}`,
						'gm'
					);
					const haveValidJsExport = regexForValidExportedModule.test(info.content);
					const detail = new DetailsHandler({
						content: info.content,
						relativeFromRoot,
						haveValidJsExport,
						basename,
					});
					if (haveValidJsExport) {
						const lowerBasename = basename.toLocaleLowerCase();
						exports.push(`export {${basename}} from '${relativeFromRoot}';`);
						exportedClass.push(`- [${basename}](#${lowerBasename})`);
						classDef.push(`<h2 id="${lowerBasename}">${basename}</h2>

${detail.exportedDescription}
	
*) <sub>[go to ${tableOfContentTitle_}](#${tableOfContentTitle})</sub>`);
					}
					if (detail.exportedTypedef) {
						types.push(detail.exportedTypedef);
					}
					this.safeUniquePing;
				}
				this.synchronizeFiles({
					id: 'entryPoint',
					SetOfFilesInstance: new this.SetOfFiles(
						{
							relativePathFromProjectRoot: filePath,
							encoding: 'utf-8',
							template: {
								string: `// @ts-check
	
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/neinth-auto-doc | neinth-auto-doc}
 * 
 * @description
 */

/**
 * export
 */

/**
 * types
 */`
									.replace(
										`/**
 * export
 */`,
										exports.join('\n')
									)
									.replace(
										`/**
 * types
 */`,
										types.join('\n')
									)
									.replace(
										` * @description
 */`,
										` * @description
 * build using [neinth-auto-doc]()
${DetailsHandler.annotateLines(`${copyright}\n\n${description}`, ' * ')}
 */`
									),
							},
						},
						{
							relativePathFromProjectRoot: readMePath,
							encoding: 'utf-8',
							template: {
								string: `## description
	
## table-of-content

## exported`
									.replace('## description', description)
									.replace(
										'## table-of-content',
										`<h2 id="${tableOfContentTitle}">${tableOfContentTitle_}</h2>

${exportedClass.join('\n')}`
									)
									.replace('## exported', classDef.join('\n')),
							},
						}
					),
				});
			},
			100
		);
	});
});
export default neinthInstance;
