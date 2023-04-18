#!/bin/bash


# node install
# npm install
# npm build
# copy systemd files to /etc/systemd/system/


systemctl enable --now gunicorn.socket


