#!/bin/bash
git add --all
git commit -m $'build_number'
git push -u origin master
