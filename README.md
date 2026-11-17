# flower-stuff-easy-web-vue

Vue 2.7 + TypeScript (Vue CLI 5 / webpack 5) application.

The production build is served under `/flower-stuff-easy-web-vue/`:

- `/flower-stuff-easy-web-vue/`: sign-in screen
- `/flower-stuff-easy-web-vue/media`: camera and prediction screen

## Docker

`docker compose` builds the production bundle (`yarn build:production`) in a Node.js container and serves it with nginx. Node.js and Yarn are not needed on the host.

### Requirements

- Docker Engine 25 or later and Docker Compose v2.20 or later (Docker Desktop includes both)
- Internet access while building the image, to pull the base images and npm packages

### Start

Run in the repository root:

```
docker compose up -d --build --wait
```

Open http://localhost:8080/flower-stuff-easy-web-vue/ (`http://localhost:8080/` redirects there). The port is bound to `127.0.0.1` only.

### Stop

```
docker compose down
```

`docker compose down --rmi local` also removes the built image.

### Configuration

| Variable | Read when | Default | Description |
| --- | --- | --- | --- |
| `VUE_APP_API_BASE_URL` | building the image | empty | Base URL of the API. It is compiled into the public JavaScript, so it must not contain secrets. When empty, the app calls `/api/v1/...` on the same origin, which the container does not serve. |
| `HOST_PORT` | starting the container | `8080` | Host port for the app. |

Set them in the shell when running `docker compose`:

```
VUE_APP_API_BASE_URL=https://api.example.com HOST_PORT=8081 docker compose up -d --build --wait
```

The `.env.*` files are not sent to the Docker build (`.dockerignore`), so the image never uses their values. Changing `VUE_APP_API_BASE_URL` requires rebuilding the image (`--build`).

Direct access to an app route such as `/flower-stuff-easy-web-vue/media` returns `index.html`. Missing files under `js/`, `css/`, `img/` and `fonts/` return 404.

### Lint and unit tests

```
docker build --target check .
```

This runs `yarn lint` and `yarn test:unit` with the same Node.js and `yarn.lock` as the image build.

### Troubleshooting

- `port is already allocated`: another process uses port 8080. Start with another port, for example `HOST_PORT=8081 docker compose up -d --build --wait`, and open http://localhost:8081/flower-stuff-easy-web-vue/.
- The sign-in screen shows `Sorry, the server is not ready.`: the API did not answer `GET /api/v1/status` with `{"ready": true}`. Check that `VUE_APP_API_BASE_URL` was set when the image was built, that the API is reachable from the browser, and that the API allows cross-origin requests from the URL you opened (for example `http://localhost:8080`).
- The media screen shows `This application needs to access your camera.`: allow camera access in the browser. Browsers allow cameras only on `https://` or `localhost`, so open the app through `localhost`, not a LAN IP address.
- The old version appears after rebuilding: the service worker serves cached files until the new version is installed. Reload the page, or clear the site data in the browser.
- Status and logs: `docker compose ps` and `docker compose logs web`.

## Local development (Node.js)

### Requirements

- Node.js 24 LTS. The exact version is `volta.node` in `package.json`; CI and deployment read it from there, and the Docker build fails if `NODE_VERSION` in `Dockerfile` differs from it.
- Yarn Classic 1.22.22 (`packageManager` and `volta.yarn` in `package.json`).

Node.js 26 is not supported yet: `@achrinza/node-ipc`, a dependency of Vue CLI 5, only allows Node.js up to 25.

`webpack` is pinned to `~5.111.1` with `resolutions`, because `mochapack` (used by `yarn test:unit`) requires `webpack/lib/Watching`, which webpack 5.112.0 moved.

### Project setup
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
