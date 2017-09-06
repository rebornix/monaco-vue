/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import IWorkerContext = monaco.worker.IWorkerContext;

import Thenable = monaco.Thenable;
import Promise = monaco.Promise;

import * as htmlService from 'vscode-html-languageservice';
import * as ls from 'vscode-languageserver-types';
import { getLanguageModes, LanguageModes, Settings } from './modes/languageModes';

export class VueWorker {

	private _ctx:IWorkerContext;
	private _languageService: htmlService.LanguageService;
	private _languageSettings: monaco.languages.vue.Options;
    private _languageId: string;

    private languageModes: LanguageModes;

	constructor(ctx:IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._languageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
        this._languageService = htmlService.getLanguageService();

        this.languageModes = getLanguageModes(this._ctx, { css: true, javascript: true });

	}

    doValidation(uri: string): Thenable<ls.Diagnostic[]> {
		// not yet suported
		return Promise.as([]);
	}
    doComplete(uri: string, position: ls.Position): Thenable<ls.CompletionList> {
        let document = this._getTextDocument(uri);
        let mode = this.languageModes.getModeAtPosition(document, position);
        if (mode && mode.doComplete) {
            return Promise.as(mode.doComplete(document, position, {css: true,javascript:true}));
        }
        return Promise.as({ isIncomplete: true, items: [] });
    }
    format(uri: string, range: ls.Range, options: ls.FormattingOptions): Thenable<ls.TextEdit[]> {
		let document = this._getTextDocument(uri);
		let textEdits = this._languageService.format(document, range, null); //TODO options.
		return Promise.as(textEdits);
	}
    findDocumentHighlights(uri: string, position: ls.Position): Promise<ls.DocumentHighlight[]> {
		let document = this._getTextDocument(uri);
		let mode = this.languageModes.getModeAtPosition(document, position);
		if (mode && mode.findDocumentHighlight) {
			return Promise.as(mode.findDocumentHighlight(document, position));
		}
		return Promise.as([]);
	}
    findDocumentLinks(uri: string): Promise<ls.DocumentLink[]> {
		let document = this._getTextDocument(uri);
		let links = this._languageService.findDocumentLinks(document, null);
		return Promise.as(links);
	}
	private _getTextDocument(uri: string): ls.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}
}

export interface ICreateData {
	languageId: string;
	languageSettings: monaco.languages.vue.Options;
}

export function create(ctx:IWorkerContext, createData: ICreateData): VueWorker {
	return new VueWorker(ctx, createData);
}
