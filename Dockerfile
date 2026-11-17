# syntax=docker/dockerfile:1

# package.json の volta.node と同じ版にします。異なる場合は deps ステージで失敗します。
ARG NODE_VERSION=24.22.3

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN node -e "const v = require('./package.json').volta.node; if (process.version !== 'v' + v) { console.error('NODE_VERSION in Dockerfile must be ' + v); process.exit(1) }" \
  && yarn install --frozen-lockfile --non-interactive
COPY . .

# lint と unit test を実行します。 docker build --target check . で使います。
FROM deps AS check
RUN yarn lint && yarn test:unit

FROM deps AS build
# API のベース URL です。公開される JavaScript に埋め込まれます。
ARG VUE_APP_API_BASE_URL=
RUN yarn build:production

FROM nginxinc/nginx-unprivileged:1.30.6-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/app/flower-stuff-easy-web-vue
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --start-interval=1s \
  CMD ["wget", "-q", "--spider", "http://127.0.0.1:8080/flower-stuff-easy-web-vue/"]
