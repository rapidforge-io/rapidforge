#!/bin/sh
set -e

# Persist the gh CLI config across Fly deploys: symlink /root/.config/gh ->
# /data/.config/gh so only one volume is needed.
mkdir -p /data/.config/gh
mkdir -p /root/.config
rm -rf /root/.config/gh
ln -sf /data/.config/gh /root/.config/gh

exec "$@"
