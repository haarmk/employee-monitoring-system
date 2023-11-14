#!/bin/bash

read vpn_user
read vpn_user_pass

echo "$vpn_user:$vpn_user_pass" | sudo chpasswd
