# flower-stuff-easy-web-vue

Vue 2 + TypeScript (Vue CLI 4) application. Use Node.js 12.x–16.x (CI tests 12.x, 14.x and 16.x; deployment builds with 16.x).

## Project setup
```
yarn install
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

### Type checking
TypeScript in `src/` and `tests/` (including `<script lang="ts">` in `.vue` files) is type-checked by `yarn test:unit` and `yarn build:*`, which fail on type errors. `yarn serve` reports type errors without stopping.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
