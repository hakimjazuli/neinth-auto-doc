// @ts-check

import { NeinthComponent } from 'neinth';

const editableConfig = {
	watchPath: '/neinth-src/neinth-auto-doc/',
	copyright: 'build and distributed under MIT license;',
	entryPoint: './index.mjs',
	readMePath: 'README.md',
	tableOfContentTitle: 'class documentations',
};

/**
 * @type {NeinthComponent<
 * import('./core/Configs.mjs').Configs,
 * undefined
 * >}
 */
const neinthInstance = new NeinthComponent(async function () {
	const {
		copyright,
		readMePath,
		entryPoint: filePath,
		watchPath: relativePath,
		tableOfContentTitle,
	} = editableConfig;
	const configs_ = this.listenToNeinth('neinth-src/neinth-auto-doc/core/Configs.mjs');
	this.generateWatcher({
		relativePath,
		addDirToSet: false,
		addFileToSet: true,
		encoding: 'utf-8',
	});
	const folderWatcher_ = this.listenToGeneratedWatcher();
	return this.updateValue$({
		neinthInstance,
		mode: 'mostRecent',
		derived: async () => {
			const configClass = configs_.value;
			const folderWatcher = folderWatcher_.value;
			if (!configClass || !folderWatcher) {
				return;
			}
			return new configClass({
				copyright,
				filePath,
				watcherData: folderWatcher,
				readMePath,
				tableOfContentTitle,
			});
		},
	});
});
export default neinthInstance;
