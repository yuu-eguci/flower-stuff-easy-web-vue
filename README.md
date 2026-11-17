# flower-stuff-easy-web-vue

Vue 2.7 + TypeScript (Vue CLI 5 / webpack 5) application.

## Requirements

- Node.js 24 LTS. The exact version is `volta.node` in `package.json`; CI and deployment read it from there.
- Yarn Classic 1.22.22 (`packageManager` and `volta.yarn` in `package.json`).

Node.js 26 is not supported yet: `@achrinza/node-ipc`, a dependency of Vue CLI 5, only allows Node.js up to 25.

`webpack` is pinned to `~5.111.1` with `resolutions`, because `mochapack` (used by `yarn test:unit`) requires `webpack/lib/Watching`, which webpack 5.112.0 moved.

## Project setup
```
yarn install --frozen-lockfile
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies
```
yarn build:local
yarn build:production
```

### Run your unit tests
```
yarn test:unit
```

### Lints files
```
yarn lint
```

ESLint 10 runs with `eslint.config.mjs`. `yarn serve` and `yarn build:*` do not run ESLint.

### Type checking
TypeScript in `src/` and `tests/` (including `<script lang="ts">` in `.vue` files) is type-checked by `yarn test:unit` and `yarn build:*`, which fail on type errors. `yarn serve` reports type errors without stopping.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
