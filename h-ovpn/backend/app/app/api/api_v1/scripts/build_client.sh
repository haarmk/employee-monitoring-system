#!/bin/bash

read vpn_user
read vpn_user_pem_pass
read ca_pem_pass

cd /etc/openvpn/easy-rsa/
sudo ./easyrsa --passin=pass:$ca_pem_pass --passout=pass:$vpn_user_pem_pass build-client-full  $vpn_user
sudo ./easyrsa --passin=pass:$ca_pem_pass gen-crl

echo done

