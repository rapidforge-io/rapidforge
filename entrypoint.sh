#!/bin/sh
set -e

# Keep copilot config on the persistent /data volume across Fly deploys.
# Symlink /root/.copilot -> /data/.copilot so only one volume is needed.
mkdir -p /data/.copilot
rm -rf /root/.copilot
ln -sf /data/.copilot /root/.copilot

# Similarly persist the gh CLI config
mkdir -p /data/.config/gh
mkdir -p /root/.config
rm -rf /root/.config/gh
ln -sf /data/.config/gh /root/.config/gh

exec "$@"
