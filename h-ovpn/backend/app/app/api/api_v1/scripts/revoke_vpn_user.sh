#!/bin/bash

read vpn_user
read ca_pem_pass

cd /etc/openvpn/easy-rsa

sudo ./easyrsa --passin=pass:$ca_pem_pass revoke  $vpn_user
sudo ./easyrsa --passin=pass:$ca_pem_pass gen-crl

