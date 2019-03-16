---
layout: page
title: Portfolio
permalink: /portfolio/
menu: main
---

## Jetson TensorRT ROS Nodes (Finished)
- TensorRT ROS nodes for Jetson TX1/TX2 for accelerated embedded deep learning inferences
- nVidia DIGITS Nodes (detection and classification)
- [Github][jetson-tensorrt]

![detect]({{ "/assets/img/tensorrt_detect.jpg" | absolute_url }})
<p align="center">
<b>Jetson TensorRT Detection + Ranging with an Intel RealSense D435</b><br>
</p>

## CarRoBot (Finished)
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

## Tails (Current)
- Autonomous indoor drone powered by a Raspberry Pi and Intel RealSense
- Finite state machine based flight control code with multiple failover behaviors
- [Github][tails]

![Tails]({{ "/assets/img/tails.jpg" | absolute_url }})
<p align="center">
<b>Tails</b><br>
</p>

## PeliCannon (Current)
- Computer vision powered Nerf Turret
- Uses an nVidia Jetson TX2 and Intel RealSense camera to track different things and shoot them with a nerf gun
- Final version plans to use deep learning based approach for object detection using my Jetson TensorRT nodes
- [Github][pelicannon]

<iframe width="560" height="315" src="https://www.youtube.com/embed/7Tb6nidiBTE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

![detect]({{ "/assets/img/realsense_follower.jpg" | absolute_url }})
<p align="center">
<b>Pelicannon Object Tracking Test Setup</b><br>
<br>
</p>


## armchair-expert (Finished)
- Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries
- Learns new words like a typical [Markov chain][markov-chain], but uses an [RNN][rnn] to structure and capitalize the output
- [Github][armchair-expert]

## deep-connect-four (Finished)
- Deep Reinforcement Learning agent for the game "Connect Four" powered by a Deep Q-Network
- [Github][deep-connect-four]


[structure-model]: https://github.com/csvance/armchair-expert/blob/master/models/structure.py
[armchair-expert]: https://github.com/csvance/armchair-expert
[deep-hammy]: https://github.com/csvance/deep-hammy
[deep-connect-four]: https://github.com/csvance/deep-connect-four
[jetson-tensorrt]: https://github.com/csvance/jetson_tensorrt
[carrobot]: https://github.com/csvance/carrobot/tree/master/launch
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
