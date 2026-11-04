#!/bin/bash
# Publishes the game to https://flexgames.com/meanderings/ (also www.flexgames.com).
# Static files only. They live in the nginx-proxy container's html volume; the /meanderings/ location
# block in the flexgames.com and www.flexgames.com vhost fragments serves them. Same pattern as
# SwoopWeb/deploy.sh. dockeruser is in the docker group, so no sudo.
set -euo pipefail
HOST="${HOST:-dock}"   # ssh alias for dockeruser@thelatebar.com, the box that runs nginx-proxy
cd "$(dirname "$0")"

echo "▶ Uploading…"
rsync -az --delete --exclude '.git' --exclude 'validate.js' --exclude 'README.md' --exclude 'deploy.sh' \
  ./ "$HOST:/tmp/meanderings-web/"

echo "▶ Installing into the nginx html volume…"
# Emptied first: `docker cp` only ever writes, so a file deleted locally would otherwise stay.
ssh "$HOST" '
  docker exec nginx-proxy mkdir -p /usr/share/nginx/html/meanderings
  docker exec nginx-proxy sh -c "rm -rf /usr/share/nginx/html/meanderings/*"
  docker cp /tmp/meanderings-web/. nginx-proxy:/usr/share/nginx/html/meanderings/
'
echo "✓ https://flexgames.com/meanderings/"
