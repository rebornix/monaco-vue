/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './vueMode';
import { language, conf } from './vueLanguage';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;

// --- vue configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.vue.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.vue.LanguageServiceDefaults>();
	private _options: monaco.languages.vue.Options;
	private _languageId: string;

	constructor(languageId: string, options: monaco.languages.vue.Options) {
		this._languageId = languageId;
		this.setOptions(options);
	}

	get onDidChange(): IEvent<monaco.languages.vue.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get options(): monaco.languages.vue.Options {
		return this._options;
	}

	setOptions(options: monaco.languages.vue.Options): void {
		this._options = options || Object.create(null);
		this._onDidChange.fire(this);
	}
}


const vueOptionsDefault: monaco.languages.vue.Options = {
	suggest: { html5: true, angular1: true, ionic: true }
}

const vueLanguageId = 'vue';

const vueDefaults = new LanguageServiceDefaultsImpl(vueLanguageId, vueOptionsDefault);

// Export API
function createAPI(): typeof monaco.languages.vue {
	return {
		vueDefaults: vueDefaults
	}
}
monaco.languages.vue = createAPI();

// --- Registration to monaco editor ---

function withMode(callback: (module: typeof mode) => void): void {
	require<typeof mode>(['vs/language/vue/vueMode'], callback);
}

monaco.languages.register({
	id: 'vue',
	extensions: ['.vue'],
	aliases: ['Vue', 'vuejs']
});

monaco.languages.setMonarchTokensProvider('vue', language);
monaco.languages.setLanguageConfiguration('vue', conf);

monaco.languages.onLanguage(vueLanguageId, () => {
	withMode(mode => mode.setupMode(vueDefaults));
});
