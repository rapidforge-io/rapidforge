#!/bin/bash
# sync-versions.sh - Sync versions from .mise.toml to all project files

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ ! -f ".mise.toml" ]; then
    echo -e "${RED}Error: .mise.toml not found${NC}"
    exit 1
fi

GO_VERSION=$(grep '^go = ' .mise.toml | sed 's/go = "\(.*\)"/\1/')
NODE_VERSION=$(grep '^node = ' .mise.toml | sed 's/node = "\(.*\)"/\1/')

if [ -z "$GO_VERSION" ] || [ -z "$NODE_VERSION" ]; then
    echo -e "${RED}Error: Could not extract versions from .mise.toml${NC}"
    exit 1
fi

echo -e "${GREEN}Syncing versions:${NC}"
echo -e "  Go: ${YELLOW}${GO_VERSION}${NC}"
echo -e "  Node: ${YELLOW}${NODE_VERSION}${NC}"
echo ""

update_file() {
    local file=$1
    local pattern=$2

    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}Warning: $file not found, skipping${NC}"
        return
    fi

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "$pattern" "$file"
    else
        sed -i "$pattern" "$file"
    fi
    echo -e "${GREEN}✓${NC} Updated $file"
}

update_file "go.mod" "s/^go [0-9.]\+$/go ${GO_VERSION}/" "go ${GO_VERSION}"
update_file "dockerfile" "s/FROM golang:[0-9.]\+ AS builder/FROM golang:${GO_VERSION} AS builder/" "FROM golang:${GO_VERSION} AS builder"
update_file ".github/workflows/ci.yml" "s/go-version: '[0-9.]\+'/go-version: '${GO_VERSION}'/" "go-version: '${GO_VERSION}'"
update_file "README.md" "s/Go-[0-9.]\++-/Go-${GO_VERSION}+-/" "Go-${GO_VERSION}+"
update_file "README.md" "s/- Go [0-9.]\+ or higher/- Go ${GO_VERSION} or higher/" "- Go ${GO_VERSION} or higher"

echo ""
echo -e "${GREEN}Version sync complete!${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} Make sure to commit these changes:"
echo -e "  git add .mise.toml go.mod dockerfile .github/workflows/ci.yml README.md"
echo -e "  git commit -m 'chore: update Go to ${GO_VERSION} and Node to ${NODE_VERSION}'"
