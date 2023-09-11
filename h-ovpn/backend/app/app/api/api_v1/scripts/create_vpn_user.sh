#!/bin/bash

read vpn_user
read vpn_user_pass
read vpn_user_pem_pass
read ca_pem_pass

if id $vpn_user >/dev/null 2>&1; then
    echo "Error: User $vpn_user already exits." >&2
    exit 1
fi

sudo useradd -m $vpn_user
# sudo usermod -s /usr/sbin/nologin $vpn_user
echo "$vpn_user:$vpn_user_pass" | sudo chpasswd

cd /etc/openvpn/easy-rsa
sudo ./easyrsa --passin=pass:$ca_pem_pass --passout=pass:$vpn_user_pem_pass build-client-full  $vpn_user
sudo ./easyrsa --passin=pass:$ca_pem_pass gen-crl
echo $vpn_user_pass | su $vpn_user -c "echo -e 'y\n-1\ny\ny\ny\ny\ny\ny\ny\n' | google-authenticator"

echo done

