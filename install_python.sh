#!/bin/bash



    if [[ $EUID -ne 0 ]]; then
        cat <<-EOF >&2
			You must run this script with root privilege
			Please do:
			sudo $WORK_DIR/${0##*/} $PARAN
		EOF
        exit 1
    else

        apt-get update
	apt-get install software-properties-common -y
	add-apt-repository ppa:deadsnakes/ppa -y

	apt-get install python3.9 -y
	apt-get install python3.9-pip -y
	apt-get install python3.9-venv -y

        # cleaning downloaded packages from apt-get cache
        apt-get clean

        exit 0
    fi
