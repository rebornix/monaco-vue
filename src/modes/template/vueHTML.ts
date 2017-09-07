import IWorkerContext = monaco.worker.IWorkerContext;

import { LanguageModelCache, getLanguageModelCache } from '../languageModelCache';
import { DocumentContext } from '../../languageService';
import { TextDocument, Position, Range, FormattingOptions } from 'vscode-languageserver-types';
import { LanguageMode } from '../languageModes';
import { VueDocumentRegions } from '../embeddedSupport';

import { HTMLDocument, parseHTMLDocument } from '../template/parser/htmlParser';
import { doComplete } from '../template/services/htmlCompletion';
import { doHover } from '../template/services/htmlHover';
import { findDocumentHighlights } from '../template/services/htmlHighlighting';
import { findDocumentLinks } from '../template/services/htmlLinks';
import { findDocumentSymbols } from '../template/services/htmlSymbolsProvider';
// import { htmlFormat } from './template/services/formatters';
// import { doValidation, createLintEngine } from './template/services/htmlValidation';
import { ScriptMode } from '../javascriptMode';
import { getComponentTags } from '../template/tagProviders/componentTags';
import { getBasicTagProviders, getDefaultSetting } from '../template/tagProviders/index';

export type DocumentRegionCache = LanguageModelCache<VueDocumentRegions>;

export function getVueHTMLMode(
  documentRegions: DocumentRegionCache,
  _ctx: IWorkerContext,
  scriptMode: ScriptMode): LanguageMode {
  let settings: any = {};
  let completionOption = { html5: true, vue: true, router: true };
//   let completionOption = getDefaultSetting(null); //TODO
  let basicTagProviders = getBasicTagProviders(completionOption);
  const embeddedDocuments = getLanguageModelCache<TextDocument>(10, 60, document => documentRegions.get(document).getEmbeddedDocument('vue-html'));
  const vueDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => parseHTMLDocument(document));
//   const lintEngine = createLintEngine();

  return {
    getId() {
      return 'vue-html';
    },
    configure(options: any) {
      settings = options && options.html;
      completionOption = settings && settings.suggest || getDefaultSetting(null);
      basicTagProviders = getBasicTagProviders(completionOption);
    },
    doValidation(document) {
	  const embedded = embeddedDocuments.get(document);
	  return null;
    //   return doValidation(embedded, lintEngine);
    },
    doComplete(document: TextDocument, position: Position) {
      const embedded = embeddedDocuments.get(document);
      const components = scriptMode.findComponents(document);
      const tagProviders = basicTagProviders.concat(getComponentTags(components));
	  return doComplete(embedded, position, vueDocuments.get(embedded), tagProviders);
    },
    doHover(document: TextDocument, position: Position) {
      const embedded = embeddedDocuments.get(document);
      const components = scriptMode.findComponents(document);
      const tagProviders = basicTagProviders.concat(getComponentTags(components));
	  return doHover(embedded, position, vueDocuments.get(embedded), tagProviders);
    },
    findDocumentHighlight(document: TextDocument, position: Position) {
	  return findDocumentHighlights(document, position, vueDocuments.get(document));
    },
    findDocumentLinks(document: TextDocument, documentContext: DocumentContext) {
	  return findDocumentLinks(document, documentContext);
    },
    findDocumentSymbols(document: TextDocument) {
	  return findDocumentSymbols(document, vueDocuments.get(document));
    },
    format(document: TextDocument, range: Range, formattingOptions: FormattingOptions) {
	//   return htmlFormat(document, range, formattingOptions);
		return null;
    },
    onDocumentRemoved(document: TextDocument) {
	  vueDocuments.onDocumentRemoved(document);
    },
    dispose() {
	  vueDocuments.dispose();
    }
  };
}
