#!/bin/bash

WORK_DIR="$(dirname "$0")/backend"

python3.9 -m venv ENV
source "$WORK_DIR/ENV/bin/activate"
pip install --upgrade pip setuptools wheel
pip install -r "$WORK_DIR/requirements.txt"
