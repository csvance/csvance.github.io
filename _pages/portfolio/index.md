---
layout: page
title: Portfolio
permalink: /portfolio/
menu: main
---

## Keras MobileDetectNet
MobileDetectNet is an object detector which uses [MobileNet][mobilenet] feature extractor to predict bounding boxes. It was designed to be computationally efficient for deployment on embedded systems and easy to train with limited data. It was inspired by the simple yet effective design of [DetectNet][detectnet] and enhanced with the anchor system from [Faster R-CNN][faster-r-cnn].

![MobileDetectNet]({{ "/assets/img/mobiledetectnet.png" | absolute_url }})

#### Feature Overview
- Online data augmentation with fit_generator multiprocessing
- Runs at 60 FPS on [Jetson Nano][jetson] using TensorRT FP16 mode
- [Github][mobiledetectnet]

## Jetson TensorRT ROS Nodes
- TensorRT ROS nodes for Jetson TX1/TX2/Nano/Xavier for accelerated embedded deep learning inferences
- nVidia DIGITS Nodes (detection and classification)
- [Github][jetson-tensorrt]

![Jetson TensorRT]({{ "/assets/img/tensorrt_detect.jpg" | absolute_url }})
<p align="center">
<b>Jetson TensorRT Detection + Ranging with an Intel RealSense D435</b><br>
</p>

## CarRoBot
- Autonomous robot powered by a Raspberry Pi and ROS
- Uses explore_lite, gmapping, and move_base to map out an area
- [Github][carrobot]

![CarRoBot]({{ "/assets/img/carrobot.jpg" | absolute_url }})
<p align="center">
<b>CarRoBot</b><br>
</p>

![CarRoBot Mapping]({{ "/assets/img/carrobot_map.jpg" | absolute_url }})
<p align="center">
<b>CarRoBot running gmapping with a Neato XV11 LIDAR</b><br>
</p>

## armchair-expert
- Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries
- Learns new words like a typical [Markov chain][markov-chain], but uses an [RNN][rnn] to structure and capitalize the output
- [Github][armchair-expert]

## deep-connect-four
- Deep Reinforcement Learning agent for the game "Connect Four" powered by a Deep Q-Network
- [Github][deep-connect-four]


[structure-model]: https://github.com/csvance/armchair-expert/blob/master/models/structure.py
[armchair-expert]: https://github.com/csvance/armchair-expert
[deep-hammy]: https://github.com/csvance/deep-hammy
[deep-connect-four]: https://github.com/csvance/deep-connect-four
[jetson-tensorrt]: https://github.com/csvance/jetson_tensorrt
[carrobot]: https://github.com/csvance/carrobot
[pelicannon]: https://github.com/csvance/pelicannon
[tails]: https://github.com/csvance/tails

[aol-reaction-model]: https://github.com/csvance/armchair-expert/blob/master/models/reaction.py
[neighbor-markov-chain]: https://github.com/csvance/armchair-expert/blob/legacy-sql/markov.py
[markov-chain-ng]: https://github.com/csvance/armchair-expert/blob/master/markov_engine.py

[keras]: https://keras.io
[tensorflow]: https://www.tensorflow.org

[nlp]: https://en.wikipedia.org/wiki/Natural_language_processing
[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
[liltrumpy]: https://twitter.com/LilTrumpyAI
[twitter]: https://twitter.com
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
[mobiledetectnet]: https://github.com/csvance/keras-mobile-detectnet
[detectnet]: https://devblogs.nvidia.com/detectnet-deep-neural-network-object-detection-digits/
[faster-r-cnn]: https://arxiv.org/abs/1506.01497
[jetson]: https://developer.nvidia.com/embedded/buy/jetson-nano-devkit
[mobilenet]: https://arxiv.org/abs/1704.04861
