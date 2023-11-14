#!/bin/bash

read vpn_user


if id $vpn_user >/dev/null 2>&1; 
    then
        sudo userdel -r $vpn_user
    else
        echo "Error: User $vpn_user does not exit." >&2
    exit 1
fi


