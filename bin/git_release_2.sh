#!/usr/bin/env bash
mv ./.gitignore ./.ignore_tmp
mv ./.release_ignore ./.gitignore

git add -A
git commit -m 'release new version'

mv ./.gitignore ./.release_ignore
mv ./.ignore_tmp ./.gitignore