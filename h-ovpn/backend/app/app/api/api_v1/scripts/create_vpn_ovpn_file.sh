read CLIENT

if ! id $vpn_user >/dev/null 2>&1; then
    echo "Error: User $vpn_user does not exits." >&2
    exit 1
fi

echo "<ca>"
cat "/etc/openvpn/easy-rsa/pki/ca.crt"
echo "</ca>"
echo
echo "<cert>"
awk '/BEGIN/,/END CERTIFICATE/' "/etc/openvpn/easy-rsa/pki/issued/$CLIENT.crt"
echo "</cert>"
echo
echo "<key>"
cat "/etc/openvpn/easy-rsa/pki/private/$CLIENT.key"
echo "</key>"
echo
echo "<tls-auth>"
cat  "/etc/openvpn/easy-rsa/pki/private/ta.key"
echo "</tls-auth>"
		