---
layout: post
title:  "Covariance Matrices in ROS"
date:   2019-01-21 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
---

A common issue learning [ROS][ros] for those without a background in mathematics (specifically Statistics and Linear Algebra) is how to generate a covariance matrix for various message types, and why one needs to generate such a thing in the first place. Today I will attempt to explain both!

![Covariance Matrix]({{ "/assets/img/covariance_matrix.png" | absolute_url }})
<p align="center">
<b>Covariance Matrix</b><br>
</p>

## What are covariance matrices used for anyway?

In robotics, a common problem is how to estimate the robot's pose in three dimensional space. We need to know where the robot (starting with base_link) is in order to understand where the sensor readings take place. In ROS most things are relative to base_link so we if we don't know where base_link is we don't know where laser_scanner, camera, or any of our other sensors are! If we don't know where the sensor is, we don't know where the readings apply to in space. Covariance matrices help us with robotic state estimation problems in two different ways here:

- The diagonal of a covariance matrix is simply the variance of one of our sensor readings. By knowing the variance, we know a reasonable upper and lower bound of the error over time. This is important to know for using these readings to estimate other things.
- State estimation algorithms can use the non diagonal entries (covariance) of the covariance matrix to reduce error in readings by understanding how things vary with other things. A positive covariance tells us that when one reading is high, the other one is likely to be as well. A negative covariance tells us the opposite.

## Something Practical

A practical example of a covariance matrix is using an IMU sensor to improve our estimation of our current position and heading. An IMU can help with this by letting the robot know how much it is accelerating and how fast it is rotating. Knowing this information lets the robot have an easier time estimating its future position based on its current.

Let's look at the simplest possible case: a robot that lives in the X and Y dimensions. At T=0s, the robot is at (x=0, y=0), and our accelerometer is telling us we are accelerating at (x=1, y=0) m/s^2. At T=1s we see our acceleration remains constant, and want to know how far the robot moved and how fast it is going. Newton taught us that velocity is the derivative of position, and acceleration the derivative of velocity. Since we are working with numbers, we will need to use numerical integration techniques to determine our velocity V and position P. Because our acceleration is constant it forms a rectangle shape, so we can just multiply our ΔT (1s - 0s) by our acceleration (1 m/s^2). We find that our velocity V increases linearly by 1 m/s over 1 second. To get to position P We can calculate the area of the triangle under the linear velocity curve (1/2 base*height). This gives us a final position P of (x=0.5, y=0) m. Now consider how the covariance matrix can help us understand the error in this process.

Let's start by looking at the variance of acceleration. In this particular case we found it to be (x=0.001, y=0.002). This means it has a standard deviation of (x=0.0316, y=0.0447) by taking the square root of the variance. We then add and subtract 1/2 the standard deviation from our linear accelerometer readings. This gives us a reasonable estimation of the real range of the acceleration A.

Now we repeat the process of numerical integration with both our high and low estimates.

![Covariance Example]({{ "/assets/img/covariance_example.png" | absolute_url }})

We have now calculated a possible range of estimates for velocity V and position P for our IMU. The real magic starts when we consider using a second sensor and combining fusing the results together: our state estimator will look at the intersections of our different sensors estimation of velocity V and position P, and calculate the maximum likely value for X and Y. So say we also had an estimation of our position from odometry, and there was some intersection between our IMU estimation. The true X and Y we are trying to estimate is most likely inside the intersection of these ranges.

The concept for covariance is similar, but the details are far more complicated. Just know that state estimation systems such as [Extended Kalman Filters][ekf] use this information to make better predictions about the state.

## How to calculate a (sampling) covariance matrix?

Let's consider the case of an IMU sensor again. We want to measure the sampling noise of the linear acceleration when it is completely still. We create a matrix A containing 3 rows (x, y, z) and 100 columns (individual readings). Next, we calculate the row mean of x, y, and z. We subtract each rows row mean from itself. This gives us a matrix B. Next, we matrix multiply B*B^T. Finally we divide the resulting matrix by n, the number of samples we recorded. This gives us a covariance matrix C.

![Covariance Calculation]({{ "/assets/img/covariance_calculation.png" | absolute_url }})

When we multiply two matrices together, the result has the dimensions of their outside dimensions. So 3 x 100 * 100 x 3 = 3 x 3. So we now have a 3 x 3 covariance matrix, and we need to add it to our ROS IMU messages. The [IMU message][imu] in ROS contains an array called linear_acceleration_covariance which has 9 floating point values. We can simply reshape our matrix to a 9 element array, and store the values in linear_acceleration_covariance. In our covariance array, indexes 0, 4, and 8 (the diagonals) will contain variances, and the rest of the indexes contain covariances between variables.

Keep in mind that this process is only taking into account sampling noise from the sensor, rather than inherent inaccuracies that may be present.

For an example of calculating a covariance matrix with a real sensor and data within a ROS node, see my [LSM9DS0 IMU ROS node][example].


[imu]: http://docs.ros.org/api/sensor_msgs/html/msg/Imu.html
[ros]: http://www.ros.org
[example]: https://github.com/csvance/lsm9ds0/blob/master/src/lsm9ds0_node.py
[ekf]: https://en.wikipedia.org/wiki/Extended_Kalman_filter
