var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Covariance Matrices in ROS",
      category: null,
      content: "A common issue learning ROS for those without a background in mathematics (specifically Statistics and Linear Algebra) is how to generate a covariance matrix for various message types, and why one needs to generate such a thing in the first place. Today I will attempt to explain both!\n\n\n\nCovariance Matrix\n\n\nWhat are covariance matrices used for anyway?\n\nIn robotics, a common problem is how to estimate the robot’s pose in three dimensional space. We need to know where the robot (starting with base_link) is in order to understand where the sensor readings take place. In ROS most things are relative to base_link so we if we don’t know where base_link is we don’t know where laser_scanner, camera, or any of our other sensors are! If we don’t know where the sensor is, we don’t know where the readings apply to in space. Covariance matrices help us with robotic state estimation problems in two different ways here:\n\n\n  The diagonal of a covariance matrix is simply the variance of one of our sensor readings. By knowing the variance, we know a reasonable upper and lower bound of the error over time. This is important to know for using these readings to estimate other things.\n  State estimation algorithms can use the non diagonal entries (covariance) of the covariance matrix to reduce error in readings by understanding how things vary with other things. A positive covariance tells us that when one reading is high, the other one is likely to be as well. A negative covariance tells us the opposite.\n\n\nSomething Practical\n\nA practical example of a covariance matrix is using an IMU sensor to improve our estimation of our current position and heading. An IMU can help with this by letting the robot know how much it is accelerating and how fast it is rotating. Knowing this information lets the robot have an easier time estimating its future position based on its current.\n\nLets look at the simplest case possible, a robot that only lives in the X and Y dimension. At T=0s, the robot is at (x=0, y=0), and our acceleromter is telling us we are accelerating at (x=1, y=0) m/s^2. At T=1s we see our acceleration remains constant, and want to know how far the robot moved and how fast it is going. Newton taught us that velocity is the derivative of position, and acceleration the derivative of velocity. So we need to apply the inverse operation of the derivative, the integral. However, because we are only working with numerical sensor readings, we need to use a numerical integration method. Ideally we would use Simpson’s rule or the trapezoid rule, but because our acceleration is constant it forms a rectangle shape, so we can just multiply our delta T (1s - 0s) by our acceleration (1 m/s^2). Our speed is increases from 0 to 1 m/s over 1 second. We can either integrate or calculate the area of the triangle 1/2 base*height. This gives us a position of (x=0.5, y=0) m. Now consider how the covariance matrix plays into this estimation.\n\nLet’s start by looking at the variance of acceleration. In this particular case we found it to be (x=0.001, y=0.002). This means it has a standard deviation of (x=0.0316, y=0.0447) by taking the square root of the variance. We then add and subtract 1/2 the standard deviation from our linear accelerometer readings.\n\nBecause acceleration is constant, multiplying by our delta T = 1s gives us a linear velocity curve starting at 0 and ending at the same place as acceleration for both x and y. To calculate the possible range of our position we integrate again, this time recognizing that because velocity is linear, we can calculate p_x and p_y as the area of a right triangle.\n\n\n\nNow our state estimator can look at the intersections of our different estimations, and calculate the maximum likely value of a variable we are trying to estimate. So say we also had an estimation of our X and Y from odometry and there was some intersection between our IMU estimation. The true X and Y we are trying to estimate is most likely inside the intersection.\n\nThe concept for covariance is similar, but the details are far more complicated. Just know that state estimation systems such as Extended Kalman Filters use this information to make better predictions about the state.\n\nHow to calculate a (sampling) covariance matrix?\n\nLet’s consider the case of an IMU sensor again. We want to measure the sampling noise of the linear acceleration when it is completely still. We create a matrix A containing 3 rows (x, y, z) and 100 columns (individual readings). Next, we calculate the row mean of x, y, and z. We subtract each rows row mean from itself. This gives us a matrix B. Next, we matrix multiply B*B^T. Finally we divide the resulting matrix by n, the number of samples we recorded. This gives us a covariance matrix C.\n\n\n\nWhen we multiply two matrices together, the result has the dimensions of their outside dimensions. So 3 x 100 * 100 x 3 = 3 x 3. So we now have a 3 x 3 covariance matrix, and we need to add it to our ROS IMU messages. The IMU message in ROS contains an array called linear_acceleration_covariance which has 9 floating point values. We can simply reshape our matrix to a 9 element array, and store the values in linear_acceleration_covariance. In our covariance array, indexes 0, 4, and 8 (the diagonals) will contain variances, and the rest of the indexes contain covariances between variables.\n\nKeep in mind that this process is only taking into account sampling noise from the sensor, rather than inherent inaccuracies that may be present.\n\nFor an example of calculating a covariance matrix with a real sensor and data within a ROS node, see my LSM9DS0 IMU ROS node.\n\n",
      tags: [],
      id: 0
    });
    

    index.add({
      title: "TensorRT ROS Nodes for nVidia Jetson",
      category: null,
      content: "During the past few months I have been working towards making high performance deep learning inferences much more accessible in ROS on the nVidia Jetson TX2. The result is jetson_tensorrt: a collection of optimized TensoRT based nodes and nodelets specifically tailored to the Jetson platform. To start out with, classification and object detection are supported for nVidia DIGITS ImageNet and DetectNets.\n\nHere is some example output in rviz from a single class pedestrian detector using an Intel RealSense D435:\n\n\nDetectNet Object Detection\n\n\nSupport is planned for SegNets as well.\n\nCheck it out on Github!\n\n",
      tags: [],
      id: 1
    });
    

    index.add({
      title: "Keras/Tensorflow, TensorRT, and Jetson",
      category: null,
      content: "nVidia’s Jetson platform is arguably the most powerful family of devices for deep learning at the edge. In order to achieve the full benefits of the platform, a framework called TensorRT drastically reduces inference time for supported network architectures and layers. However, nVidia does not currently make it easy to take your existing models from Keras/Tensorflow and deploy them on the Jetson with TensorRT. One reason for this is the python API for TensorRT only supports x86 based architectures. This leaves us with no real easy way of taking advantage of the benefits of TensorRT. However, there is a harder way that does work: To achieve maximum inference performance we can export and convert our model to .uff format, and then load it in TensorRT’s C++ API.\n\n1. Training and exporting to .pb\n\n  Train your model\n  If using Jupyter, restart the kernel you trained your model in to remove training layers from the graph\n  Reload the models weights\n  Use an export function like the one in this notebook to export the graph to a .pb file\n\n\n2. Converting .pb to .uff\nI suggest using the chybhao666/cuda9_cudnn7_tensorrt3.0:latest Docker container to access the script needed for converting a .pb export from Keras/Tensorflow to .uff format for TensorRT import.\n\ncd /usr/lib/python2.7/dist-packages/uff/bin\n# List Layers and manually pick out the output layer\n# For most networks it will be dense_x/BiasAdd, the last one that isn't a placeholder or activation layer\npython convert_to_uff.py tensorflow --input-file /path/to/graph.pb -l\n\n# Convert to .uff, replace dense_1/BiasAdd with the name of your output layer\npython convert_to_uff.py tensorflow -o /path/to/graph.uff --input-file /path/to/graph.pb -O dense_1/BiasAdd\n\n\n\nMore information on the .pb export and .uff conversion is available from nVidia\n\n3. Loading the .uff into TensorRT C++ Inference API\nI have created a generic class which can load the graph from a .uff file and setup TensorRT for inference while taking care of all host / device CUDA memory management behind the scenes. It supports any number of inputs and outputs and is available on my Github. It can be built with nVidia nSight Eclipse Edition using a remote toolchain (instructions here)\n\nCaveats\n\n  Keep in mind that many layers are not supported by TensorRT 3.0. The most obvious omission is BatchNorm, which is used in many different types of deep neural nets.\n  Concatenate only works on the channel axis and if and only if the other dimensions are the same. If you have multiple paths for convolution, you are limited to concatenating them only when they have the same dimensions.\n\n\n",
      tags: [],
      id: 2
    });
    

    index.add({
      title: "Turn Based Games and 1v1 DQNs",
      category: null,
      content: "Background\nAt this point, one would have to be living under a rock to have not heard of DeepMind’s success at teaching itself to play Go by playing itself without any feature engineering. However, most available tutorials online about Deep Q Networks are coming from an entirely different angle: learning how to play various single player games in the OpenAI Gym. If one simply applies these examples to turn based games in which the AI learns by playing itself, a world of hurt is in store for several reasons:\n\n\n  In standard DQN learning, the target reward is retrieved by using the next state after an action is taken. However, the next state in a turned based dueling game is used by the enemy of the agent who took the action. To further complicate matters, the generated next state from an action is in the perspective of the agent taking the action. If we attempt to implement standard DQN, we are training the agent with data used in incorrect game contexts and assigning rewards for the wrong perspective.\n  Many turn based dueling games only have a win condition rather than a score which can be used for rewards. This complicates both measuring a DQN’s performance and assigning rewards.\n\n\nState and Perspective\nFirst of all, in a game where an agent plays itself from multiple perspectives, we must be careful the correct perspective is provided when making predictions or training discounted future rewards. For example, let us consider the game Connect Four. Instead of viewing the game as a battle between a red agent and a black agent, we could consider it from the perspective the agents viewpoint at the state being considered. For example, when the agent who takes the second turn blocks the agent who went first, the following next state is generated:\n\n\n\nHowever, this next state wouldn’t be used by the agent who went second to take an action. It is going to be used by the agent who went first, but it needs to be inverted to their perspective before it can be used:\n\n\n\nHowever, this is not the only tweak needed to get DQN working with a dueling turn based game. Let us recall how the discounted future reward is calculated:\n\n  future_reward = reward + gamma * amax(predict(next_state))\n  gamma: discount factor, for example 0.9\n  reward: the reward the agent recieved for taking an action\n  next_state: the state generated from applying an action to the original state\n  amax selects: highest value from the result\n\n\nRemember, next_state will be the enemy agent’s state. So if we simply implement this formula, we are predicting the discounted future reward that the enemy agent might receive, not our own. We must predict one more state into the future in order to propagate the discounted future reward:\n\n# We must invert the perspective of next_state so it is in the perspective of the enemy of the player who took the action which resulted in next_state\nnext_state.invert_perspective()\n# Predict the action the enemy is most likely to take\nenemy_action = argmax(predict(next_state))\n# Apply the action and invert the perspective back to the original one\ntrue_next_state = next_state.apply(enemy_action)\ntrue_next_state.invert_perspective()\n# Finally calculate discounted future reward\nfuture_reward = reward + gamma * amax(predict(true_next_state))\n\nI have also tried subtracting the enemy reward from the reward that took the original action, but have not been able to measure good long or short term results with this policy.\n\nWin Conditions and Rewards\nAnother problem with certain board games such as Connect Four is that they have no objective way of keeping score. There is only reward for victory and punishment for failure. I have had luck using 1.0 for victory, -1.0 for failure, and 0.0 for all other moves. Samples for duplicate games in a row and ties should be discarded as they don’t contain any useful information and will only serve to pollute our replay memory.\n\nMeasuring Performance\nOne major challenge of DQNs with only win / loss conditions is measuring the networks performance over time. I have found a few ways to do this, including having the agent play a short term reward maximizing symbolic AI every N games as validation. If our agent cannot beat an agent that only thinks in the short term, then we need to continue making changes to the network structure, hyper-parameters, and feature representation. Beating this short sighted AI consistently should be our first goal.\n\nNetwork Stability\nA common mistake creating a DQN is making the network have too few dimensions to begin with. This can cause serious aliasing in our predictions, resulting in an unstable network. Generally speaking, it is better to start with a wide network and testing how much the network can be slimmed down.\n\nWe must also make sure our training data and labels are formatted in a way to ensure stability. Rewards should be normalized in the [-1., 1.] range, and any discounted future reward which is outside of this range should be clipped.\n\nAnother factor in network stability is our experience replay buffer size. Too small and our network will forget past things it learned, and too big and it will take excessive time to learn. I find it is generally its better to start smaller while testing if the network is able to learn simple gameplay, and increasing it as training time increases and we want to insure network stability. People smarter than I such as Schaul et al. (2017) have proposed methods to optimize the size of the experience replay buffer: Prioritized Experience Replay which may be worth investigating if you are unsure how to tune this.\n\nAnother factor to consider is the optimizer learning rate. A high learning rate can create instabilities in the neural networks state approximation behavior, resulting in all kinds of catastrophic forgetfulness. Starting at 0.001 is a good idea, and if you note instabilities with this try decreasing it from there. I find that 0.0001 works optimally for longer training sessions.\n\nFinally, techniques used in deep neural networks such as dropout and batchnorm have a negative impact on Deep-Q Learning. I suggest watching Deep RL Bootcamp Lecture 3: Deep Q-Networks if you are interested in more information on this.\n\nConclusion\nDeep Q Learning proves to be both extremely interesting and challenging. While I am not completely happy with my own results in training a DQN for Connect Four, I think it is at least worth posting some of the things I have learned from the experience. My current agent can be found at the link below.\n\n  Github: DQN AI for Connect Four\n\n\nReferences\n\n  Deep Q-Learning with Keras and Gym\n  Deep RL Bootcamp Lecture 3: Deep Q-Networks\n\n\n",
      tags: [],
      id: 3
    });
    

    index.add({
      title: "The RNN Sequence Prediction Seed Problem and How To Solve It",
      category: null,
      content: "The Problem\nThere are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However, most of these tutorials show an example where an initial seed value must be used to start the generation process. This is highly impractical for a query response generation scheme. Luckily, there is a fairly easy way to solve this involving how we format our training data.\n\nSolution\nEmpty Item\nFirst of all, we need to make sure we have a dummy value which represents an empty sequence item. It is convenient to use zero for this, because most padding functions are going to pad with zeros, and functions like np.zeros make it easy to initialize this. We will represent this value as NULL for simplicity.\nEnd of Sequence Item\nWe need a second special value for marking the end of a sequence. Call it EOS for short, and it can be whatever value you want provided it stays consistent.\nSequence Steps\nInstead of feeding entire sequences for training, we are going to step through each sequence, generating subsequences starting with all empty values and adding one more item in each step. The label for each sequence will simply be the next word in the sequence, or  if we reach the end of the sequence. For example, take the sequence \"The quick brown fox jumps over the lazy dog. This will break down into the following sequences:\n\n\"NULL NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; The\n\"The NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; quick\n\"The quick NULL NULL NULL NULL NULL NULL NULL\" -&gt; brown\n\"The quick brown NULL NULL NULL NULL NULL NULL\" -&gt; fox\n\"The quick brown fox NULL NULL NULL NULL NULL\" -&gt; jumps\n\"The quick brown fox jumps NULL NULL NULL NULL\" -&gt; over\n\"The quick brown fox jumps over NULL NULL NULL\" -&gt; the\n\"The quick brown fox jumps over the NULL NULL\" -&gt; lazy\n\"The quick brown fox jumps over the lazy NULL\" -&gt; dog\n\"The quick brown fox jumps over the lazy dog\" -&gt; EOS\n\nSequence Size\nIf you have a sequence larger than your maximum size, start removing the first element before you append a new one. This will have no bearing on prediction because the network will learn how to handle this.\nConclusion\nWe can now train the network and start by feeding it a sequence filled with NULLs to predict the first value. Here is an example doing this using Keras:\n\n  Preprocessing &amp; Model\n\n\n",
      tags: [],
      id: 4
    });
    

    index.add({
      title: "Hello World!",
      category: null,
      content: "Hi, and welcome to my portfolio and blog. I will be chronicling my explorations in machine learning, artificial intelligence, and software engineering here.\n",
      tags: [],
      id: 5
    });
    


var store = [{
    "title": "Covariance Matrices in ROS",
    "link": "/blog/covariance-matrices-in-ros.html",
    "image": null,
    "date": "January 21, 2019",
    "category": null,
    "excerpt": "A common issue learning ROS for those without a background in mathematics (specifically Statistics and Linear Algebra) is how to..."
},{
    "title": "TensorRT ROS Nodes for nVidia Jetson",
    "link": "/blog/tensorrt-ros-nodes-nvidia-jetson.html",
    "image": null,
    "date": "October 11, 2018",
    "category": null,
    "excerpt": "During the past few months I have been working towards making high performance deep learning inferences much more accessible in..."
},{
    "title": "Keras/Tensorflow, TensorRT, and Jetson",
    "link": "/blog/keras-tensorrt-jetson.html",
    "image": null,
    "date": "May 22, 2018",
    "category": null,
    "excerpt": "nVidia’s Jetson platform is arguably the most powerful family of devices for deep learning at the edge. In order to..."
},{
    "title": "Turn Based Games and 1v1 DQNs",
    "link": "/blog/turn-based-games-1v1-dqn.html",
    "image": null,
    "date": "January 9, 2018",
    "category": null,
    "excerpt": "Background At this point, one would have to be living under a rock to have not heard of DeepMind’s success..."
},{
    "title": "The RNN Sequence Prediction Seed Problem and How To Solve It",
    "link": "/blog/RNN-seed-problem.html",
    "image": null,
    "date": "December 29, 2017",
    "category": null,
    "excerpt": "The Problem There are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However,..."
},{
    "title": "Hello World!",
    "link": "/blog/hello-world.html",
    "image": null,
    "date": "December 9, 2017",
    "category": null,
    "excerpt": "Hi, and welcome to my portfolio and blog. I will be chronicling my explorations in machine learning, artificial intelligence, and..."
}]

$(document).ready(function() {
    $('#search-input').on('keyup', function () {
        var resultdiv = $('#results-container');
        if (!resultdiv.is(':visible'))
            resultdiv.show();
        var query = $(this).val();
        var result = index.search(query);
        resultdiv.empty();
        $('.show-results-count').text(result.length + ' Results');
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="'+ hostname + store[ref].link+'">'+store[ref].title+'</a></li>';
            resultdiv.append(searchitem);
        }
    });
});