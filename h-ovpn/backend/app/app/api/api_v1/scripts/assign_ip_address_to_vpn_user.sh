#!/bin/bash

read vpn_user
read ip

#sudo bash -c 'echo "ifconfig-push ip 255.255.255.0" > /etc/openvpn/ccd/vpn_user'
echo "ifconfig-push $ip 255.255.255.0" > /etc/openvpn/ccd/$vpn_user
echo done