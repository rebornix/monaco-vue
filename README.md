# Monaco Vue

Vue language plugin for the Monaco Editor. Forked from [Vetur](https://github.com/vuejs/vetur), replaced components with Monaco standalone packages and adopted Monaco Editor Extension API.

Internally the Vue plugin uses the [vscode-html-languageservice](https://github.com/Microsoft/vscode-html-languageservice), [vscode-css-languageservice](https://github.com/Microsoft/vscode-css-languageservice)
node modules. The same modules is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the HTML/CSS editing experience.

## Development

* `git clone https://github.com/rebornix/monaco-vue`
* `cd monaco-vue`
* `npm install . // yarn install`
* `npm run watch // gulp watch`
* run `gulp simpleserver` in another terminal session and launch `http://127.0.0.1:4000/`.

## License
[MIT](https://github.com/Microsoft/monaco-vue/blob/master/LICENSE.md)
