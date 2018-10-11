---
layout: post
title:  "TensorRT ROS Nodes for nVidia Jetson"
date:   2018-10-11 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
---

During the past few months I have been working towards making high performance deep learning inferences much more accessible in [ROS][ros] on the [nVidia Jetson TX2][jetson]. The result is [jetson_tensorrt][jetson_tensorrt]: a collection of optimized [TensoRT][tensorrt] based nodes and nodelets specifically tailored to the Jetson platform. To start out with, image detection and object detection are supported for [nVidia DIGITS][digits] ImageNet and DetectNets.

Here is some example output captured from a single class pedestrian detector and an 1000 class image classifier trained with the ILSVRC2012 dataset running simultaneously on the TX2. **Keep in mind that the detection rectangle is unrelated to the class shown at the top of the image as we are dealing with two separate models**:
![detect_classify]({{ "/assets/img/detect_classify.jpg" | absolute_url }})
<p align="center">
<b>DetectNet Object Detection + ImageNet Image Classification </b><br>
</p>


Support is planned for SegNets as well as generic nodes for [TensorFlow][tf], [Caffe][caffe], and [PyTorch][pytorch] (all running within TensorRT)

Check it out on [Github][jetson_tensorrt]!

[jetson_tensorrt]: https://github.com/csvance/jetson_tensorrt
[jetson]: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems-dev-kits-modules/
[tensorrt]: https://developer.nvidia.com/tensorrt
[digits]: https://developer.nvidia.com/digits
[tf]: https://www.tensorflow.org
[caffe]: http://caffe.berkeleyvision.org
[pytorch]: https://pytorch.org
[ros]: http://www.ros.org
