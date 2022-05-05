#!/bin/bash

git tag -d 2.13.0
git push --delete origin 2.13.0
git tag 2.13.0
git push origin 2.13.0

