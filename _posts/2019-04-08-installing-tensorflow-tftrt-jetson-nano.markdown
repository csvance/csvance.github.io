---
layout: post
title:  "Installing and using Tensoflow with TF-TRT on the Jetson Nano"
date:   2019-04-08 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
---

One of the great things to release alongside the [Jetson Nano][nano] is [Jetpack 4.2][jetpack], which includes support for [TensorRT][tensorrt] in python. One of the easiest ways to get started with TensorRT is using the [TF-TRT interface][tftrt], which lets us seamlessly integrate TensorRT with a [Tensorflow][tensorflow] graph even if some layers are not supported. Of course this means we can easily accelerate [Keras][keras] models as well!

nVidia now provides a [prebuilt Tensorflow][prebuilt] for Jetson that we can install through pip, but we also need to make sure certain dependencies are satisfied.

{% highlight bash %}
sudo apt install python3-numpy python3-markdown python3-mock python3-termcolor python3-astor libhdf5-dev
{% endhighlight %}

Follow the instructions here to install tensorflow-gpu on Jetpack 4.2: [https://devtalk.nvidia.com/default/topic/1038957/jetson-tx2/tensorflow-for-jetson-tx2-][prebuilt]

Now that Tensorflow is installed on the Nano, lets load a pretrained MobileNet from Keras and take a look at its performance with and without TensorRT for binary image classification.

{% highlight python %}
import tensorflow.keras as keras
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense

mobilenet = keras.applications.mobilenet.MobileNet(input_shape=(224, 224, 3), weights='imagenet', pooling='max', alpha=0.25)

new_output = mobilenet.get_layer('global_average_pooling2d').output
new_output = Dense(1, activation='softmax')(new_output)

model = Model(inputs=mobilenet.input, outputs=new_output)
model.summary()
model.save('mobilenet.h5')
{% endhighlight %}

Next we can execute inferences with different settings using [this script][script] (thanks to [jeng1220][jeng1220] for the [Keras to TF-TRT code][tftrt-keras])

You will need to install plac to run the script: `pip3 install --user plac`

{% highlight bash %}
python3 tftrt_inference.py -T TF mobilenet.h5
# Time = 4.19 s
# Samples = 30
# FPS = Samples / Time = 30 / 6.53 = 4.59 FPS

python3 tftrt_inference.py -T FP32 mobilenet.h5
# Time = 0.96 s
# Samples = 30
# FPS = Samples / Time = 30 / 0.96 = 31.3 FPS

python3 tftrt_inference.py -S 30 -T FP16 mobilenet.h5
# Time = 0.84 s
# Samples = 30
# FPS = Samples / Time = 30 / 0.84 = 35.8 FPS

{% endhighlight %}

For more options, see `python3 tftrt_inference.py --help`

It looks like TensorRT makes a significant difference vs simply running the inference in Tensorflow! Stay tuned for my next steps on the Nano: implementing and optimizing MobileNet SSD object detection to run at 30+ FPS!

[jetpack]: https://developer.nvidia.com/embedded/jetpack
[nano]: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-nano/
[tensorflow]: http://tensorflow.org
[tensorrt]: https://developer.nvidia.com/tensorrt
[tftrt]: https://github.com/tensorflow/tensorrt
[prebuilt]: https://devtalk.nvidia.com/default/topic/1038957/jetson-tx2/tensorflow-for-jetson-tx2-/
[keras]: https://keras.io
[tftrt-keras]: https://github.com/jeng1220/KerasToTensorRT
[script]: https://gist.github.com/csvance/47ec78d67894c0d454ca98029d4d323c
[jeng1220]: https://github.com/jeng1220
