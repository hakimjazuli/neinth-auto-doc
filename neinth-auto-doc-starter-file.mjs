#!/usr/bin/env node
// @ts-check

import { xixth } from 'xixth';

new xixth({
	packageName: 'neinth-auto-doc',
	pathCopyHandlers: {
		readme: {
			src: './README.neinth-auto-doc.md',
			dest: './README.neinth-auto-doc.md',
			on: {
				async success({ src, dest }) {
					console.log({ succesfullyToCopy: `from "${src}" to "${dest}"` });
				},
				async failed({ src, dest }) {
					console.error({ failedToCopy: `from "${src}" to "${dest}"` });
				},
			},
		},
	},
});
