#!/usr/bin/env bash

set -e

branch=$1
env=$2
ng_build_base_href=$3
ng_build_prod=$4

echo "GIPAM Frontent:: Pulling from $branch branch"
git pull origin ${branch}
#
echo "GIPAM Frontent:: Running npm install"
npm ci

echo "GIPAM Frontent:: Running build"

build_args=(--configuration ${env})
if [[ ! -z "$ng_build_prod" ]]; then
    build_args+=(--prod)
fi
if [[ ! -z "$ng_build_base_href" ]]; then
    build_args+=(--base-href="${ng_build_base_href}")
fi

./node_modules/.bin/ng build "${build_args[@]}"
