// @ts-check

import { NeinthComponent } from 'neinth';

/**
 * @description
 * `Configs` constructor parameters;
 * ```js
 *	/**
 *	 * @typedef {import('neinth/src/helpers/Infos.mjs').Infos} Infos
 *	 * @typedef {import('neinth/src/watcher/NeinthWatcher.mjs').NeinthWatcherOptions} NeinthWatcherOptions
 *	 *[blank]/
 * 	/**
 *	 * @typedef {Object} ConfigsData
 *	 * @property {string} filePath
 *	 * @property {{watcherOptions:NeinthWatcherOptions; infos: Set<Infos>}} watcherData
 *	 * @property {string} readMePath
 *	 * @property {string} tableOfContentTitle
 *	 * @property {string} copyright
 *	 *[blank]/
 * ```
 */
export class Configs {
	/**
	 * @param {ConfigsData} arg0
	 */
	constructor({ filePath, copyright, watcherData, readMePath, tableOfContentTitle }) {
		this.filePath = filePath;
		this.copyright = copyright;
		this.watcherData = watcherData;
		this.readMePath = readMePath;
		this.tableOfContentTitle = tableOfContentTitle;
	}
	/**
	 * @type {string}
	 */
	filePath;
	/**
	 * @type {string}
	 */
	copyright;
	/**
	 * @type {{ watcherOptions: import('neinth/src/watcher/NeinthWatcher.mjs').NeinthWatcherOptions; infos: Set<Infos>}}
	 */
	watcherData;
	/**
	 * @type {string}
	 */
	readMePath;
	/**
	 * @type {string}
	 */
	tableOfContentTitle;
}

/**
 * @type {NeinthComponent<typeof Configs, undefined>}
 */
const neinthInstance = new NeinthComponent(async function () {
	return Configs;
});
export default neinthInstance;
