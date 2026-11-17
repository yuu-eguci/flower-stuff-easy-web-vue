#!/bin/sh
# docker compose で起動したコンテナを検証するスモークテストです。
# リポジトリのルートで、 docker compose up -d --wait の後に実行します。
# 使い方: docker/smoke-test.sh [ホスト側の URL (既定: http://localhost:8080)]
set -eu

base_url=${1:-http://localhost:8080}
app_url="$base_url/flower-stuff-easy-web-vue"
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

fail () {
  echo "NG: $*" >&2
  exit 1
}

# URL を取得し、ステータスコードを検証します。本文は $work_dir/body 、ヘッダは $work_dir/headers に残します。
expect_status () {
  url=$1
  expected=$2
  actual=$(curl -sS -o "$work_dir/body" -D "$work_dir/headers" -w '%{http_code}' "$url")
  [ "$actual" = "$expected" ] || fail "$url returned $actual (expected $expected)"
  echo "OK: $url -> $actual"
}

expect_header () {
  grep -i "^$1:" "$work_dir/headers" | grep -qi -- "$2" || fail "header $1 does not contain '$2'"
}

expect_index_html () {
  grep -q '<div id="app"></div>' "$work_dir/body" || fail "body is not index.html"
}

# index.html を返します。
expect_status "$app_url/" 200
expect_header Content-Type text/html
expect_header Cache-Control no-cache
expect_index_html
cp "$work_dir/body" "$work_dir/index.html"

# 公開パスへリダイレクトします。ポートを保つため相対の Location を返します。
expect_status "$base_url/" 302
expect_header Location '^Location: /flower-stuff-easy-web-vue/'
expect_status "$base_url/flower-stuff-easy-web-vue" 301
expect_header Location '^Location: /flower-stuff-easy-web-vue/'

# ルータのパスへの直接アクセスは index.html を返します。
expect_status "$app_url/media" 200
expect_index_html

# index.html が参照する公開パス配下のファイルを取得できます。
assets=$(grep -o '\(src\|href\)="/flower-stuff-easy-web-vue/[^"]*"' "$work_dir/index.html" | sed 's/^[a-z]*="//; s/"$//' | sort -u)
echo "$assets" | grep -q '^/flower-stuff-easy-web-vue/js/app\.[0-9a-f]*\.js$' || fail "index.html does not reference js/app.*.js"
for asset in $assets; do
  expect_status "$base_url$asset" 200
done
expect_status "$app_url/service-worker.js" 200
expect_header Cache-Control no-cache
expect_status "$app_url/manifest.json" 200

# 存在しない静的ファイルは index.html ではなく 404 を返します。
expect_status "$app_url/js/missing.js" 404
expect_status "$app_url/css/missing.css" 404
expect_status "$app_url/img/missing.png" 404

# イメージにはビルド成果物以外のファイルや環境値を入れません。
# 起動中のコンテナのイメージを、ネットワークなし・ root で検査します。
image=$(docker inspect --format '{{.Image}}' "$(docker compose ps -q web)")
unexpected=$(docker run --rm --network none --user 0 --entrypoint find "$image" / -xdev \( -name '.env*' -o -name '.git' -o -name node_modules -o -name yarn.lock -o -name package.json -o -name '.yarn*' -o -name '.npm*' \) -print)
[ -z "$unexpected" ] || fail "unexpected files in the image: $unexpected"
echo "OK: no env files, source control metadata or dependency files in the image"

# リポジトリの .env.* にある URL の値が、配信ファイルに含まれていないことを確認します。値は表示しません。
for env_file in .env.*; do
  [ -f "$env_file" ] || continue
  grep -o '^[A-Z_]*=.*://.*' "$env_file" | while IFS='=' read -r key value; do
    if docker run --rm --network none --entrypoint grep "$image" -rqF -- "$value" /usr/share/nginx/app; then
      fail "the value of $key in $env_file is in the image"
    fi
  done
done
echo "OK: values in .env.* files are not in the served files"

echo "All smoke tests passed."
