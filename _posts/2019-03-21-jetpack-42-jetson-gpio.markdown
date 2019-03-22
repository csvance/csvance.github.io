---
layout: post
title:  "Using the new Jetson.GPIO python library in Jetpack 4.2"
date:   2019-03-21 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
---

With the release of the new [Jetson Nano][nano] also comes the [4.2 release of nVidia's Jetpack BSP for the Jetson][jetpack]. This included a new python library called Jetson.GPIO which provides a familiar interface for anyone who has used RPi.GPIO before. However, it doesn't seem to be installed by default, so here are the instructions for getting it loaded into python!

```
# Setup groups/permissions
sudo groupadd -f -r gpio
sudo usermod -a -G gpio your_user_name
sudo cp /opt/nvidia/jetson-gpio/etc/99-gpio.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger

# Reboot required for changes to take effect
udo reboot
```

Now we need to install Jetson.GPIO because by default neither Python 2.7 or Python3.6 can access it.

```
# Python 2.7
sudo cp -r /opt/nvidia/jetson-gpio/lib/python/Jetson /usr/local/lib/python2.7/dist-packages/
sudo cp -r /opt/nvidia/jetson-gpio/lib/python/RPi /usr/local/lib/python2.7/dist-packages/

# Python 3.7
sudo cp -r /opt/nvidia/jetson-gpio/lib/python/Jetson /usr/local/lib/python3.6/dist-packages/
sudo cp -r /opt/nvidia/jetson-gpio/lib/python/RPi /usr/local/lib/python3.6/dist-packages/

# We also have to remove the __init__.py file in order for the paths to work correctly for python 3.6 import
sudo rm /usr/local/lib/python3.6/dist-packages/Jetson/GPIO/__init__.py
```

After this we should be able to import the library in both versions of python:

```
nvidia@tx2:~$ python3
Python 3.6.7 (default, Oct 22 2018, 11:32:17)
[GCC 8.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import Jetson.GPIO
>>>
nvidia@tx2:~$ python
Python 2.7.15rc1 (default, Nov 12 2018, 14:31:15)
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import Jetson.GPIO
>>>
```

Happy hacking!

[jetpack]: https://developer.nvidia.com/embedded/jetpack
[nano]: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-nano/

[imu]: http://docs.ros.org/api/sensor_msgs/html/msg/Imu.html
[ros]: http://www.ros.org
[example]: https://github.com/csvance/lsm9ds0/blob/master/src/lsm9ds0_node.py
[ekf]: https://en.wikipedia.org/wiki/Extended_Kalman_filter
