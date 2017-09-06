/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module monaco.languages.vue {

    export interface CompletionConfiguration {
        [provider: string]: boolean;
    }

    export interface Options {        /**
         * A list of known schemas and/or associations of schemas to file names.
         */
        readonly suggest?: CompletionConfiguration;
    }

    export interface LanguageServiceDefaults {
        readonly onDidChange: IEvent<LanguageServiceDefaults>;
        readonly options: Options;
        setOptions(options: Options): void;
    }

    export var vueDefaults: LanguageServiceDefaults;
}