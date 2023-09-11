import logging
import socket
import re
from collections import OrderedDict, deque
from datetime import datetime
import json
import subprocess
import time
from app.core.config import settings
from app.utils import runBash
from fastapi import HTTPException

from app.models.enums import Os

try:
    from ipaddr import IPAddress as ip_address
except ImportError:
    from ipaddress import ip_address

import string

logger = logging.getLogger(__name__)

try:
    from geoip2 import database
    from geoip2.errors import AddressNotFoundError
    geoip2_available = True
except ImportError:
    geoip2_available = False



def get_date(date_string, uts=False):
    if not uts:
        return datetime.strptime(date_string, "%a %b %d %H:%M:%S %Y")
    else:
        return datetime.fromtimestamp(float(date_string))


class OpenvpnMgmtSocket(object):
    def __init__(self, host: str, port: int, password: str = None) -> None:

        self.host = host
        self.port = port
        self.password = password
        self.connect()
    
    def connect(self): 
        timeout = 3
        self.s = False
        try: 
            self.s = socket.create_connection((self.host, self.port), timeout=timeout)
            
            if self.s:
                if self.password:
                    self.wait_for_data()
                    
        except Exception as e:
            print(e)
  

    def is_socket_closed(self) -> bool:
        try:
            # this will try to read bytes without blocking and also without removing them from buffer (peek only)
            data = self.s.recv(16, socket.MSG_DONTWAIT | socket.MSG_PEEK)
            if len(data) == 0:
                return True
        except BlockingIOError:
            return False  # socket is open and reading from it would block
        except ConnectionResetError:
            return True  # socket was closed for some other reason
        except Exception as e:
            logger.exception("unexpected exception when checking if a socket is closed")
            return False
        return False


    def disconnect(self):
        self._socket_disconnect()

    def send_command(self, command):
        # info('Sending command: {0!s}'.format(command))
        if command.startswith('kill') or command.startswith('client-kill'):
            return
        while True:
            
            try:
                self._socket_send(command)
                return self.wait_for_data(command=command) 
            except Exception as e:
                # print(f"connection failed: {e}")
                # print(f"trying to connect after 5 seconds")
                time.sleep(5)
                self.connect()
                
            
        
        

    def wait_for_data(self, command=None):
        data = ''
        while 1:
            socket_data = self._socket_recv(1024)
            socket_data = re.sub('>INFO(.)*\r\n', '', socket_data)
            data += socket_data
            if data.endswith('ENTER PASSWORD:'):
                if self.password:
                    self._socket_send('{0!s}\n'.format(self.password))
                else:
                    print('password requested but no password supplied by configuration')
            if data.endswith('SUCCESS: password is correct\r\n'):
                break
            if command == 'load-stats\n' and data != '':
                break
            
            if len(socket_data) <= 0 and self.is_socket_closed():
                break
            elif data.endswith("\nEND\r\n"):
                break
        
        return data
    
    def _socket_send(self, command):
        result = self.s.sendall(bytes(command, 'utf-8'))
        
        
        
    def _socket_recv(self, length):
        return self.s.recv(length).decode('utf-8')

    def _socket_disconnect(self):
        self._socket_send('quit\n')
        self.s.shutdown(socket.SHUT_RDWR)
        self.s.close()




class OpenvpnMgmtInterface(object):
    def __init__(self, host: str, port: int, password: str = None) -> None:
        self.ovpn_mgmt_socket = OpenvpnMgmtSocket(host, port, password=password)
        self.geoip_version = None
        self.gi = None
        try:
            
            if geoip2_available:
                self.gi = database.Reader(settings.GEOIP2_DATABASE_PATH)
                self.geoip_version = 2
        except IOError:
            print('No compatible geoip1 or geoip2 data/libraries found.')

    def get_status(self):
        data = self.ovpn_mgmt_socket.send_command('status 3\n')
        return self.parse_status(data=data)
        
    

    def parse_status(self, data):
        gi = self.gi
        client_section = False
        routes_section = False
        sessions = {}
        client_session = {}
        for line in data.splitlines():
            parts = deque(line.split('\t'))
            if parts[0].startswith('END'):
                break
            if parts[0].startswith('TITLE') or \
               parts[0].startswith('GLOBAL') or \
               parts[0].startswith('TIME'):
                continue
            if parts[0] == 'HEADER':
                if parts[1] == 'CLIENT_LIST':
                    client_section = True
                    routes_section = False
                if parts[1] == 'ROUTING_TABLE':
                    client_section = False
                    routes_section = True
                continue

            if parts[0].startswith('TUN') or \
               parts[0].startswith('TCP') or \
               parts[0].startswith('Auth'):
                parts = parts[0].split(',')
            if parts[0] == 'TUN/TAP read bytes':
                client_session['tuntap_read'] = int(parts[1])
                continue
            if parts[0] == 'TUN/TAP write bytes':
                client_session['tuntap_write'] = int(parts[1])
                continue
            if parts[0] == 'TCP/UDP read bytes':
                client_session['tcpudp_read'] = int(parts[1])
                continue
            if parts[0] == 'TCP/UDP write bytes':
                client_session['tcpudp_write'] = int(parts[1])
                continue
            if parts[0] == 'Auth read bytes':
                client_session['auth_read'] = int(parts[1])
                sessions['Client'] = client_session
                continue
            

            if client_section:
                session = {}
                parts.popleft()
                common_name = parts.popleft()
                remote_str = parts.popleft()
                if remote_str.count(':') == 1:
                    remote, port = remote_str.split(':')
                elif '(' in remote_str:
                    remote, port = remote_str.split('(')
                    port = port[:-1]
                else:
                    remote = remote_str
                    port = None
                remote_ip = ip_address(remote)
                session['remote_ip'] = remote_ip
                if port:
                    session['port'] = int(port)
                else:
                    session['port'] = ''
                if session['remote_ip'].is_private:
                    session['location'] = 'RFC1918'
                elif session['remote_ip'].is_loopback:
                    session['location'] = 'loopback'
                else:
                    try:
                        gir = gi.city(str(session['remote_ip']))
                        session['location'] = gir.country.iso_code
                        session['region'] = gir.subdivisions.most_specific.iso_code
                        session['city'] = gir.city.name
                        session['country'] = gir.country.name
                        session['longitude'] = gir.location.longitude
                        session['latitude'] = gir.location.latitude
                    except AddressNotFoundError:
                        pass
                    except SystemError:
                        pass
                local_ipv4 = parts.popleft()
                if local_ipv4:
                    session['local_ip'] = ip_address(local_ipv4)
                else:
                    session['local_ip'] = ''
                local_ipv6 = parts.popleft()
                session['bytes_recv'] = int(parts.popleft())
                session['bytes_sent'] = int(parts.popleft())
                parts.popleft()
                session['connected_since'] = get_date(parts.popleft(), uts=True)
                username = parts.popleft()
                if username != 'UNDEF':
                    session['username'] = username
                else:
                    session['username'] = common_name
                session['client_id'] = parts.popleft()
                session['peer_id'] = parts.popleft()
                sessions[str(session['local_ip'])] = session
             
            if routes_section:
                local_ip = parts[1]
                remote_ip = parts[3]
                last_seen = get_date(parts[5], uts=True)
                if sessions.get(local_ip):
                    sessions[local_ip]['last_seen'] = last_seen
                elif self.is_mac_address(local_ip):
                    matching_local_ips = [sessions[s]['local_ip']
                                          for s in sessions if remote_ip ==
                                          self.get_remote_address(sessions[s]['remote_ip'], sessions[s]['port'])]
                    if len(matching_local_ips) == 1:
                        local_ip = '{0!s}'.format(matching_local_ips[0])
                        if sessions[local_ip].get('last_seen'):
                            prev_last_seen = sessions[local_ip]['last_seen']
                            if prev_last_seen < last_seen:
                                sessions[local_ip]['last_seen'] = last_seen
                        else:
                            sessions[local_ip]['last_seen'] = last_seen

            

        return sessions
    
    @staticmethod
    def is_mac_address(s):
        return len(s) == 17 and \
            len(s.split(':')) == 6 and \
            all(c in string.hexdigits for c in s.replace(':', ''))

ovpn_mgmt = OpenvpnMgmtInterface(host=settings.OVPN_MANAGEMENT_HOST, port=settings.OVPN_MANAGEMENT_PORT, password='Ankit@00')
status = ovpn_mgmt.get_status()



def create_ovpn_file(client:str, os: Os) -> str:
    ovpn: str = "client"
    ovpn+= "\nproto udp"
    ovpn+= f"\nremote {settings.OVPN_HOST}"
    ovpn+= f"\nport {settings.OVPN_PORT}"
    ovpn+= "\ndev tun"
    ovpn+= "\nkey-direction 1"
    ovpn+= "\naskpass"
    ovpn+= "\nnobind"
    ovpn+= "\npersist-tun"
    ovpn+= "\npersist-key"
    ovpn+= "\nauth-nocache"
    ovpn+= "\nauth-user-pass"
    ovpn+= '\nstatic-challenge "MFA OTP" 1'
    ovpn+= "\nremote-cert-tls server"
    ovpn+= "\nuser nobody"
    ovpn+= "\ngroup   nogroup"
    ovpn+= "\nverb 3"
    ovpn+= "\nreneg-sec 43200"
    if(os.name is not "WINDOWS"):
        ovpn+= "\ndaemon"
        ovpn+= "\nlog-append /var/log/openvpn/client.log"

    result: subprocess.CompletedProcess = runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/create_vpn_ovpn_file.sh", input=client)
    if result.returncode != 0:
        raise Exception(result.stderr)
    else:
        ovpn+= f"\n{result.stdout}"
    
    return ovpn


def get_google_2af_code(client:str) -> str:
    result: subprocess.CompletedProcess = runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/googal_2af_read.sh", input=client)
    if result.returncode != 0:
        raise Exception(result.stderr)
    else:
        code = f"\n{result.stdout}"  
    return code.split()[0]  


