---
layout: post
title:  "Using the new Jetson.GPIO python library in Jetpack 4.2"
date:   2019-03-21 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
thumbnail: jetsonnano.jpg
---

With the release of the new [Jetson Nano][nano] also comes the [4.2 release of nVidia's Jetpack BSP for the Jetson][jetpack]. This included a new python library called Jetson.GPIO which provides a familiar interface for anyone who has used RPi.GPIO before. However, it doesn't seem to be installed by default, so here are the instructions for getting it loaded into python!

{% highlight bash %}
# Setup groups/permissions
sudo groupadd -f -r gpio
sudo usermod -a -G gpio your_user_name
sudo cp /opt/nvidia/jetson-gpio/etc/99-gpio.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger

# Reboot required for changes to take effect
sudo reboot
{% endhighlight %}

Now we need to install Jetson.GPIO:

{% highlight bash %}
sudo pip3 install Jetson.GPIO
sudo pip install Jetson.GPIO
{% endhighlight %}

After this we should be able to import the library in both versions of python:

{% highlight bash %}
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
{% endhighlight %}

Happy hacking!

[jetpack]: https://developer.nvidia.com/embedded/jetpack
[nano]: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-nano/

[imu]: http://docs.ros.org/api/sensor_msgs/html/msg/Imu.html
[ros]: http://www.ros.org
[example]: https://github.com/csvance/lsm9ds0/blob/master/src/lsm9ds0_node.py
[ekf]: https://en.wikipedia.org/wiki/Extended_Kalman_filter
