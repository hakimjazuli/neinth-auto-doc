## neinth-auto-doc

- is a `nodeJS` library for generating `entryPoint` and `README.md`;

- writen on top of `neinth`, for easier code management and smoother integration for other `neinth`
  based libraries or just your personal devTools;

- technically is `neinth` integrated version of
  [@html_first/js_lib_template](https://www.npmjs.com/package/@html_first/js_lib_template),
  specifically for js devTools
  > - however it is build from ground up, so there's some quirks compared from
  >   [@html_first/js_lib_template](https://www.npmjs.com/package/@html_first/js_lib_template),
  >   specifically for js devTools

## installation

- ⚠⚠⚠ installation ⚠⚠⚠:

> - ⚠⚠⚠ the `i` flag are for fresh installation, and might overwrite same name file, suggested to
>   rename the every other than `core` `dir` into something else; ⚠⚠⚠

```shell
npm i neinth-auto-doc
npx neinth-package -p neinth-auto-doc -i
npx neinth-auto-doc-starter-file
```

- update:

```shell
npm i neinth-auto-doc
npx neinth-package -p neinth-auto-doc
```

	
	<h2 id="class-documentations">class documentations</h2>
	
	- [Configs](#configs)
- [DetailsHandler](#detailshandler)
	
	<h2 id="configs">Configs</h2>
	
	`Configs` constructor parameters;
```js
/**
* @typedef {import('neinth/src/helpers/Infos.mjs').Infos} Infos
* @typedef {import('neinth/src/watcher/NeinthWatcher.mjs').NeinthWatcherOptions} NeinthWatcherOptions
*/
/**
* @typedef {Object} ConfigsData
* @property {string} filePath
* @property {{watcherOptions:NeinthWatcherOptions; infos: Set<Infos>}} watcherData
* @property {string} readMePath
* @property {string} tableOfContentTitle
* @property {string} copyright
*/
```
	
	*) <sub>[go to class-documentations](#class-documentations)</sub>
<h2 id="detailshandler">DetailsHandler</h2>
	
	quirks:
- auto generate on `entryPoint` if this requirements are fulfilled:
>- first letter must be `upperCase` for `Go-ish` style;
>- add `module` to `entryPoint`:
>>- must have `namedExport` of the same name to it's `fileName`;
>>- add module `descriptionBlock` to README:
>>>- detect first `@description` `commentBlock` on `validExportModule` according to previous rule;
>>>- use the comment block content as part of `readme` `markDown`;
>>>- use `[blank]"` as escape character, eg. when you want/need to add typehelper on the `description` block;
>- add `type` to `entryPoint`:
>>- only supports `@typedef`;
>>>- example: `@callback` should be `translated`/`refered` to `@typedef`;
>>- must have `@typedef` of the same name to it's `fileName`;
>>- will convert that block only to `@typedef` on `entryPoint` as `imported` `@typedef`;
	
	*) <sub>[go to class-documentations](#class-documentations)</sub>