#!/bin/bash
# `set -e` matters here: without it a failed `tsc` left an EMPTY package/ and still
# exited 0, so a broken build looked like a successful one.
set -euo pipefail

START_TIME=$SECONDS

echo "Buidling package..."
rm -rf lib
# Resolved from node_modules rather than assumed to be on PATH, so this works whether the
# script is run by npm, by CI, or directly from a shell.
"$(dirname "$0")/node_modules/.bin/tsc"
rm -rf package
mkdir package

echo "Copying files..."
cp -r lib package/lib
cp -r src/lowdb package/lib
cp package.json README.md LICENSE package

echo "Making package.json public..."
sed -i 's/"private": true/"private": false/' ./package/package.json

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Done in $ELAPSED_TIME seconds!"
