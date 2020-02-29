---
layout: post
title:  "Ordinary Differential Equations: Limit Sets and Long Term Behavior"
date:   2019-05-09 6:00:00 -0600
author: Carroll Vance
comments: true
categories: blog
author: Carroll Vance
thumbnail: d2_f_ph.png
---

I wrote my Ordinary Differential Equations term project in [LaTeX][latex] and thought it would be fun to see if I could convert it to markdown and post it here. Apparently [MathJax][mathjax] makes this easy, so here it is!

Abstract
===============

This paper will address the long-term behavior of systems of ordinary
differential equations (hereafter ODEs), including the first and second
dimensional cases. The specific behavior of interest is:


$$

\lim_{t\to\infty} y(t) \neq\pm\infty

$$

 where ${y}(t)$ is a solution to
a system of ODEs. Families of solutions will be considered analytically
and numerically for behavior such as periodic orbits and fixed points.
The considered problems will be plotted and have their limit sets
enumerated.

Dimension D = 1
===============

Consider the first order linear ODE:

$$

y\prime = y

$$

 By simply looking
at the equation, it can be observed that it is autonomous (no
independent variable is present in the ODE). From this we know that the
behavior of the solution does not change with the independent variable
$t$. Solving the differential equation through integration provides a
solution:

$$

y(t) = C_1e^t

$$

 Analytically it can be observed that with an
initial condition of $y(0) = 0$ that $C_1 = 0$. Consequentially for any
value of $t$, $y(t) = 0$:


$$

\lim_{t\to\infty} y(t) = 0 \textrm{ where } y(0) = 0

$$

 For any other
initial condition, it can observed that $y(t)$ will grow without bounds:

![](/assets/img/posts/d1.png){:class="img-fluid"}

Because $y\prime = y$ is a one dimensional system, its phase plane only
has a single dimension $y(t)$. The limit set includes all points in this
dimension such that:


$$

\lim_{t\to\infty} y(t) \neq\pm\infty | t \in \mathbb{R}

$$

 It directly
follows that the limit set for the ODE $y\prime = y$ is $\\{(0)\\}$.

Dimension D = 2
===============

#### Damped Vibrating Spring

Consider the second order system of linear ODEs:

$$

\begin{array}{lcl}
y\prime=v\\
v\prime=-4y-2v
\end{array}

$$

 This is derived from a second order unforced and damped
harmonic motion ODE $y\prime\prime + 2cy\prime + \omega_0^2 = 0$ where
$c = 1$ and $\omega_0 = 2$. When $c < \omega_0$ the system is
over-damped. Knowing this, it should be expected that all solutions in
the phase plane converge to a single point as the damping term overtakes
the rest of the system. Consequentially, the limit set of the system
contains the point of convergence for all solutions as $t\to\infty$.

![](/assets/img/posts/d2_a_p.png){:class="img-fluid"}
![](/assets/img/posts/d2_a_v.png){:class="img-fluid"}
![](/assets/img/posts/d2_a_ph.png){:class="img-fluid"}

Plotting the solution curves displays behavior typical of a spiral sink,
and the trace determinant plane confirms it: $D(A) = 4,T(A) = -2$. Due
to this behavior, all sollution curves in the phase plane converge to a
single two dimensional equilibrium point $(0, 0)$ as $t\to\infty$. It
follows that the limit set for this ODE is $\\{(0, 0)\\}$. While this
limit set resembles the limit set of the one dimensional case, it should
be noted that the ODE in the one dimensional case only had a non
infinite solution as $t\to\infty$ with a single IVP, where as every IVP
in the two dimensional case converged towards the origin.

#### Undamped Vibrating Spring

Consider the second order system of linear ODEs:

$$

\begin{array}{lcl}
y\prime=v\\
v\prime=-4y
\end{array}

$$

 This is derived from a second order unforced and undamped
harmonic motion ODE $y\prime\prime + 2cy\prime + \omega_0^2 = 0$ where
$c = 0$ and $\omega_0 = 2$. When $c = 0$ the system is undamped. Knowing
this, it should be expected that all solutions of $y(t)$ and
$y\prime(t)$ to be repeating in nature, so they should form an ellipse
like shape in the phase plane. Consequentially, the limit set of the
system should contain as many members as there are solutions to initial
value problems. A plot confirms these suspicions:

![](/assets/img/posts/d2_b_p.png){:class="img-fluid"}
![](/assets/img/posts/d2_b_v.png){:class="img-fluid"}
![](/assets/img/posts/d2_b_ph.png){:class="img-fluid"}

This system clearly exhibits a center behavior, which is confirmed by
the trace determinant plane: $D(A) = 4,T(A) = 0$. It follows that the
limit set contains every curve in the phase plane formed by the general
solution of the ODE and its derivative:

$$

\begin{array}{lcl}
y(t) = C_1cos(2t) + C_2sin(2t)\\
y\prime(t) = -C_1(2sin(2t)) + C_2(2cos(2t))\\
\end{array}

$$

 It should also be noted that the origin of the phase plane
$(0, 0)$ is in the limit set. This can easily be verified by solving the
initial value problem for $y(0) = 0, y\prime(0) = 0$. Finally, the limit
set for this ODE can be characterized by the two behaviors mentioned
above:

1.  $(y=0,y\prime=0)$: Solutions that start at the origin stay at the
    origin as $t\to\infty$

2.  $y\ne0,y\prime \ne 0$: Solutions that start outside of the origin
    stay in a periodic solution curve as $t\to\infty$ which is defined
    by the system solution for the initial value problem.

#### Undamped Pendulum

Consider the second order system of nonlinear ODEs:

$$

\begin{array}{lcl}
\theta\prime=\omega\\
\omega\prime=-sin(\theta)\\
\end{array}

$$

 This is derived from the undamped pendulum ODE
$\theta\prime\prime = -sin(\theta)$. There are quite a few initial
conditions $p_0$ to consider.

1.  For $p_0\in\\{ (\theta = 2n\pi, \omega_0 = 0)| n\in\mathbb{Z} \\}$,
    the phase plane solution should be a single point $p_0$ as the
    pendulum has no energy.

2.  For $p_0\in\\{\theta_0 \ne 0, \omega_0 = 0\\}$ the phase plane
    solution should look like a center around a point
    $p_c \in \\{ (\theta = 2n\pi, \omega)| n\in\mathbb{Z} \\}$ as the
    pendulum converts potential energy to velocity, back to potential
    energy, and finally changing directions to repeat the process.

3.  For $p_0\in\\{(\theta_0=0,\mid\omega_0\mid \lessapprox 2.00027)\\}$ ,
    the pendulum should behave like case two.

4.  For $p_0\in\\{(\theta_0=0,\mid\omega_0\mid \gtrapprox 2.00027)\\}$,
    the pendulum no longer changes direction and
    $\lim_{t\to\infty} \theta(t) = \pm\infty$

5.  For
    $p_0\in\\{ (\theta_0 = \pi + 2n\pi, \omega_0 = 0)| n\in\mathbb{Z} \\}$,
    the phase plane solution should be a single point $p_0$ as the
    pendulum needs a nudge in either direction to start moving.

The plots above confirm the predicted behavior of solutions. The limit
set can be broken down into three different cases:

![](/assets/img/posts/d2_c_p.png){:class="img-fluid"}
![](/assets/img/posts/d2_c_v.png){:class="img-fluid"}
![](/assets/img/posts/d2_c_ph.png){:class="img-fluid"}

1.  Solutions where $\omega$ contains positive and negative values
    behave as a center around some point
    $p_c \in \\{(\theta_0 = 2n\pi, \omega_0 = 0) | n\in\mathbb{Z} \\}$.
    This is confirmed by looking at the trace determinant plane for the
    center equilibrium: $D(J)=1, T(J)=0$.

2.  $p_0 \in \\{(\theta_0 = 2n\pi, \omega_0 = 0) | n\in\mathbb{Z} \\}$:
    Solutions to this IVP stay at the angle they started at as
    $t\to\infty$. These equilibrium points are shared with case one.

3.  $\\{ (\theta_0 = \pi + 2n\pi, \omega_0 = 0) | n\in\mathbb{Z} \\}$:
    Solutions to this IVP stay at the angle they started at as
    $t\to\infty$. These equilibrium points are saddle points in the
    trace determinant plane: $D(J)=-1, T(J)=0$.

It is important to keep in mind that solutions where
$\lim_{t\to\infty} \omega(t) \neq\pm\infty$ are not a member of the
limit set if $\lim_{t\to\infty} \theta(t) = \pm\infty$. This excludes
any solutions for which $\omega$ is exclusively $> 0$ or $< 0$ as
$t\to\infty$. However, we can still make a definitive statement as to
the behavior of $\omega$ as $t\to\infty$.

#### Damped Pendulum

Consider the second order system of nonlinear ODEs:

$$

\begin{array}{lcl}
\theta\prime=\omega\\
\omega\prime=-sin(\theta) - \frac{1}{2}\omega\\
\end{array}

$$

 This is derived from the damped pendulum ODE
$\theta\prime\prime = -sin(\theta) - c\theta\prime$. A reasonable guess
as to its behavior would be behaving much like the undamped case except
in the cases that resulted in endless oscillation. On the phase plane,
these cases should converge to
$(\theta_0 = 2n\pi | n\in\mathbb{Z}, \omega_0 = 0)$ instead.

![](/assets/img/posts/d2_d_p.png){:class="img-fluid"}
![](/assets/img/posts/d2_d_v.png){:class="img-fluid"}
![](/assets/img/posts/d2_d_ph.png){:class="img-fluid"}

Based on analysis of the system and observed behavior of the numerical
plot, a limit set can be constructed:

1.  When $\\{(\theta_0 = \pi + 2n\pi, \omega_0=0)| n\in\mathbb{Z}\\}$,
    solutions remain where they started. This can be verified because
    these values are in the set of equilibrium points. The trace
    determinant shows saddle point behavior for the set of initial
    conditions: $D(J)=1, T(J)=-\frac{1}{2}$

2.  All solutions not included in case one converge to a spiral sinks in
    the set of $\\{(\theta = 2n\pi, \omega = 0)| n\in\mathbb{Z}\\}$
    depending on initial conditions. This can be confirmed by
    recognizing that equilibrium points which follow the same pattern
    are all in the spiral sink region of the trace determinant plane:
    $D(J)=1, T(J)=-\frac{1}{2}$

#### Competing Species

Consider the second order system of nonlinear ODEs:

$$

\begin{array}{lcl}
x\prime = (1 - x - y)x\\
y\prime = (4 - 2x -7y)y\\
\end{array}

$$

 In a competing species system, the populations of two
species interact with each other and/or themselves. To analyze such a
system for long term behavior, the equilibrium points should first be
considered:

$$

\begin{array}{lcl}
(1-x-y)x = 0\\
(4-2x-7y)y=0\\
\end{array}

$$

 Solving for the x-nullcline, y-nullcline, and nullcline
provides the set
$\\{(0, 0), (1, 0), (0, \frac{4}{7}), ({\frac{3}{5}, \frac{2}{5}})\\}$
Next, the system is linearized by computing the Jacobian:


$$

\begin{array}{lcl}
J = \begin{pmatrix}
\frac{\partial}{\partial x}(1 - x - y)x & \frac{\partial}{\partial y}(1 - x - y)x  \\
\frac{\partial}{\partial x}(4 - 2x - 7y)y & \frac{\partial}{\partial y}(4 - 2x - 7y)y
\end{pmatrix}\\
J = \begin{pmatrix}
1 - y - 2x & -x\\
-2y & 4-14y-2x
\end{pmatrix}\\
\end{array}

$$

 Next the Jacobian is used to examine the equilibrium in
the trace determinant plane:

$$

\begin{array}{lcl}
(0, 0):\textrm{ Nodal Source}\\
D_{0, 0} = det_{0, 0}(J) = 4\\
T_{0, 0} = tr_{0, 0}(J) = 5\\
\\
(1, 0):\textrm{ Saddle Point}\\
D_{1, 0} = det_{1, 0}(J) = -2\\
T_{1, 0} = tr_{1, 0}(J) = 1\\
\\
(0, \frac{4}{7}):\textrm{ Saddle Point}\\
D_{0, \frac{4}{7}} = det_{0, \frac{4}{7}}(J) = 0\\
T_{0, \frac{4}{7}} = tr_{0, \frac{4}{7}}(J) = -3\\
\\
(\frac{3}{5}, \frac{2}{5}):\textrm{ Nodal Sink}\\
D_{\frac{3}{5}, \frac{2}{5}} = det_{\frac{3}{5}, \frac{2}{5}}(J) = \frac{6}{5}\\
T_{\frac{3}{5}, \frac{2}{5}} = tr_{\frac{3}{5}, \frac{2}{5}}(J) = -\frac{17}{5}\\
\end{array}

$$

 Plotting for several initial value problems, a few things
can be observed:

1.  When $x$ and $y$ have an initial values $> 0$, their solutions
    gravitate towards $\frac{3}{5}$ and $\frac{2}{5}$. This is
    consistent with the predicted nodal sink behavior.

2.  Initial values of $x$ and $y$ that start at zero stay at zero, which
    is expected when starting at the center of a nodal source.

3.  When $y = 0$, Initial values of $x > 0$ gravitate towards one. This
    makes sense when $y = 0$ reduces the first equation to
    $x\prime = x(x - 1)$ which clearly has a root of $1$. It follows
    that it has an equilibrium point there as well. Examining the trace
    determinant of $(1, 0)$ places it in the region of saddle points.

4.  When $x = 0$, $y$ gravitates towards $\frac{4}{7}$. This makes sense
    considering the second equation is reduced to $y\prime = y(4 - 7y)$,
    which has a root $\frac{4}{7}$. Examining the trace determinant of
    this point it clearly falls into the region of saddle points.

![](/assets/img/posts/d2_e_ph.png){:class="img-fluid"}
![](/assets/img/posts/d2_e_1_1.png){:class="img-fluid"}
![](/assets/img/posts/d2_e_1_0.png){:class="img-fluid"}
![](/assets/img/posts/d2_e_0_1.png){:class="img-fluid"}
![](/assets/img/posts/d2_e_0_0.png){:class="img-fluid"}

Considering the above, the limit set contains individual points on the
phase plane:
$\\{(0, 0), (1, 0), (0, \frac{4}{7}), ({\frac{3}{5}, \frac{2}{5}})\\}$.
This system contains more non periodic individual points in its limit
set than any previously examined system while containing no center
curves.

#### Van der Pol's Equation

Consider the following system of nonlinear ODEs:

$$

\begin{array}{lcl}
x\prime = 2x-y-x^3\\
y\prime = x\\
\end{array}

$$

 To analyze this system, first the equilibrium points need
to be solved using the intersection of the nullclines:


$$

\begin{array}{lcl}
2x-y-x^3 = 0\\
x = 0\\
S = \\{(0, 0)\\}\\
\end{array}

$$

 Next, the system is linearized and the trace determinant
of the equilibrium point computed:

$$

\begin{array}{lcl}
J = \begin{pmatrix}
\frac{\partial}{\partial x}2x-y-x^3 & \frac{\partial}{\partial y} 2x-y-x^3\\
\frac{\partial}{\partial x}x & \frac{\partial}{\partial y} x
\end{pmatrix}\\
\\
J = \begin{pmatrix}
2 - 3x^2 & -1\\
1 & 0
\end{pmatrix}\\
\\
(0, 0):\textrm{ Special Case / Nodal Source}\\
D_{0, 0} = det_{0, 0}(J) = 1\\
T_{0, 0} = tr_{0, 0}(J) = 2\\
\end{array}

$$

 The equilibrium point is a special case with real
eigenvalues and $T^2 = 4D$. Plotting the phase plane reveals atypical
behavior:

![](/assets/img/posts/d2_f_ph.png){:class="img-fluid"}

There are two clear behaviors here, both of which are clearly members of
the limit set:

1.  For $(x = 0, y = 0)$, the solution does not leave the origin of the
    phase plane.

2.  All other initial values seem to converge into the exact same
    periodic closed curve. This is different than previous center
    periodic solutions where there were infinitely many different paths
    depending on initial conditions.

Setting the initial condition to a part of the closed loop yields the
following result:

![](/assets/img/posts/d2_f_loop.png){:class="img-fluid"}

Extra Work
==========

#### Approximating Van der Pol's Solution Curve

While I wasn't able to find a solution to Van der Pol's equation, I was
not content walking away without at least approximating a solution. Here
are the steps I took to approximate a curve. First, we apply a rotation
using a linear transformation with $\theta=\frac{\pi}{16}$ (Matrix $A$
is the output of ODE45)

![](/assets/img/posts/fit_rotate.png){:class="img-fluid"}

$$

\begin{array}{lcl}
R = \begin{pmatrix}
cos(\theta) & -sin(\theta) \\
sin(\theta) & cos(\theta) \\
\end{pmatrix}\\\\
X = AR
\end{array}

$$

 Next a shear transform is applied with $k = 0.03$:

![](/assets/img/posts/fit_shear.png){:class="img-fluid"}

$$

\begin{array}{lcl}
K = \begin{pmatrix}
1 & k \\
0 & 1 \\
\end{pmatrix}\\\\
X = XK
\end{array}

$$

![](/assets/img/posts/fit_pretrans.png){:class="img-fluid"}

A polynomial fit is found with $n = 26$. Next we apply the inverse of
the linear transformations previously applied.

![](/assets/img/posts/fit_pretest.png){:class="img-fluid"}

The moment of truth:

![](/assets/img/posts/fit_test.png){:class="img-fluid"}

While the fit may not be anywhere near perfect, it is a good first
attempt and perhaps worthy of more exploration at a later time.

[latex]: https://www.latex-project.org
[mathjax]: https://www.mathjax.org
