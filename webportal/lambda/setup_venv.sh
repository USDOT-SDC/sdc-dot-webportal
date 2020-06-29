#!/bin/bash

python3 -m venv .venv
. .venv/bin/activate
pip3 install -r requirements.txt -r development_requirements.txt

if test -f "/proc/sys/crypto/fips_enabled"; then
    echo "On FIPS compliant system, executing ugly, ugly hack."
    # For more details on this monstrosity, see this issue here:
    # https://github.com/aws/chalice/issues/1442
    sed -i 's/hashlib.md5(contents)/hashlib.md5(contents,usedforsecurity=False)/g' .venv/lib64/python3.6/site-packages/chalice/deploy/packager.py
else
    echo "On non-FIPS compliant system."
fi