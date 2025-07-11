// @ts-check
	
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/neinth-auto-doc | neinth-auto-doc}
 * 
 * @description
 * build using [neinth-auto-doc]()
 * build and distributed under MIT license;
 * 
 * ## neinth-auto-doc
 * 
 * - is a `nodeJS` library for generating `entryPoint` and `README.md`;
 * 
 * - writen on top of `neinth`, for easier code management and smoother integration for other `neinth`
 *   based libraries or just your personal devTools;
 * 
 * - technically is `neinth` integrated version of
 *   [@html_first/js_lib_template](https://www.npmjs.com/package/@html_first/js_lib_template),
 *   specifically for js devTools
 *   > - however it is build from ground up, so there's some quirks compared from
 *   >   [@html_first/js_lib_template](https://www.npmjs.com/package/@html_first/js_lib_template),
 *   >   specifically for js devTools
 * 
 * ## installation
 * 
 * - ⚠⚠⚠ installation ⚠⚠⚠:
 * 
 * > - ⚠⚠⚠ the `i` flag are for fresh installation, and might overwrite same name file, suggested to
 * >   rename the every other than `core` directory into something else; ⚠⚠⚠
 * 
 * ```shell
 * npm i neinth-auto-doc
 * npx neinth-package -p neinth-auto-doc -i
 * npx neinth-auto-doc-starter-file
 * ```
 * 
 * - update:
 * 
 * ```shell
 * npm i neinth-auto-doc
 * npx neinth-package -p neinth-auto-doc
 * ```
 * 
 * ## how to run
 * 
 * - `neinth` packages can be run with
 * 
 * ```shell
 * npx neinth
 * ```
 * 
 */

export {Configs} from './neinth-src/neinth-auto-doc/core/Configs.mjs';
export {DetailsHandler} from './neinth-src/neinth-auto-doc/core/DetailsHandler.mjs';

