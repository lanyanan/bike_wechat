#!/usr/bin/env bash

if [ ! -n "$BRAND" ] ;then
    echo "brand name required"
    exit 1
fi

BRAND_DIR="$PWD/brand/$BRAND"
if [ ! -d $BRAND_DIR ]; then
    echo 'brand not exists'
    exit 2
else
    if [ ! -d "$BRAND_DIR/dist" ]; then
        mkdir "$BRAND_DIR/dist"
    fi
    ln -f -s "$BRAND_DIR/assets" "$PWD/src/"
    ln -f -s "$BRAND_DIR/dist" "$PWD/"
    node "$PWD/build/build.js"
    exit 0
fi
