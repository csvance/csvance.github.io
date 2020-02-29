---
layout: post
title:  "TensorRT ROS Nodes for nVidia Jetson"
date:   2018-10-11 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
thumbnail: tensorrt.png
---

During the past few months I have been working towards making high performance deep learning inferences much more accessible in [ROS][ros] on the [nVidia Jetson TX2][jetson]. The result is [jetson_tensorrt][jetson_tensorrt]: a collection of optimized [TensoRT][tensorrt] based nodes and nodelets specifically tailored to the Jetson platform. To start out with, classification and object detection are supported for [nVidia DIGITS][digits] ImageNet and DetectNets.

Here is some example output in rviz from a single class pedestrian detector using an Intel RealSense D435:
![detect]({{ "/assets/img/posts/tensorrt_detect.jpg" | absolute_url }}){:class="img-fluid"}
<p align="center">
<b>DetectNet Object Detection</b><br>
</p>


Support is planned for SegNets as well.

Check it out on [Github][jetson_tensorrt]!

[jetson_tensorrt]: https://github.com/csvance/jetson_tensorrt
[jetson]: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems-dev-kits-modules/
[tensorrt]: https://developer.nvidia.com/tensorrt
[digits]: https://developer.nvidia.com/digits
[tf]: https://www.tensorflow.org
[caffe]: http://caffe.berkeleyvision.org
[pytorch]: https://pytorch.org
[ros]: http://www.ros.org
