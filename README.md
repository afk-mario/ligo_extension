# ligo_extension

Extension to save links on the api.afk

<p align="center">
  <img src="https://github.com/afk-mario/ligo_extension/blob/master/src/public/img/icon.svg" alt="Logo"/>
</p>

## Develop

Watch-build into `dist/` and open a local preview of the popup

`yarn start`

Opens [http://127.0.0.1:8080/popup.html](http://127.0.0.1:8080/popup.html) (browser APIs like `tabs`/`storage` are unavailable in this preview — use Firefox for full extension behavior).

Run Firefox with temporary profile (loads `dist/`)

`yarn start:fox`

Build production bundle

`yarn build`
