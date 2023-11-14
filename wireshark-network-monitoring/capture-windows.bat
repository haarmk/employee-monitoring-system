@echo off
setlocal enabledelayedexpansion

REM Set the network interface to capture on (adjust this to your interface name)
set INTERFACE=OpenVPN Data Channel Offload

REM Set the capture file name and location
set CAPTURE_FILE=C:\Users\prahalad\Desktop\cature.pcap

REM Set the capture duration in seconds (adjust as needed)
set CAPTURE_DURATION=60

REM Start capturing packets
echo Capturing packets on %INTERFACE% for %CAPTURE_DURATION% seconds...
tshark -i "%INTERFACE%" -w "%CAPTURE_FILE%"

echo Packet capture completed. Press any key to exit.
pause
