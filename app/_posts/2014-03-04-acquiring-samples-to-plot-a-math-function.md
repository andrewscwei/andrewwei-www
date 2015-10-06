---
title: 'Acquiring Samples to Plot a Math Function: Adaptive Sampling'
cover: /assets/images/log/2014/03/adaptive-sampling-cover.jpg
tags:
    -   coding
    -   math
    -   algorithms
extensions:
    -   math
---

Plotting graphs involves acquiring a set of samples (points) of the function $$f(x)$$ between two finite $$x$$-boundaries ($$x_{min}$$ and $$x_{max}$$ usually corresponding to the fixed width of the display), drawing these points on the display as dots and then connecting them with lines. More samples imply a higher precision of the graph, but that also imposes a direct impact on the performance since acquiring more samples means doing more calculation work. This log demonstrates an efficient way to collect enough samples while yielding an accurate representation of the function plot where the level of precision can be easily adjusted through a variable. This method is commonly known as the *adaptive sampling* routine.

## Linear Sampling

Before exploring the *adaptive sampling* routine, let’s first take a look at the most commonly used sampling algorithm – *linear sampling*. This method predetermines a fixed $$x_{delta}$$, and evaluates $$f(x)$$ for each $$x$$-interval uniformly separated by $$x_{delta}$$ between $$x_{min}$$ and $$x_{max}$$. The $$x_{delta}$$ can be easily derived from the desired number of samples. For example:

$$
x_{delta} = \frac{x_{max}-x_{min}}{n_{samples}}
$$

This method will evaluate $$f(x)$$ $$n_{samples}$$ times, yielding $$n_{samples}$$ $$y$$-values, thus completing the entire sampling routine. The result is a set of samples available to be plotted on the display to form a graph. The number of samples can be easily tweaked to adjust the precision of the graph, but again, it will require more resources to sample. While linear sampling may suffice for most cases (when precision is not a factor), it does not account for rapid oscillations. Since each sample is taken at an $$x$$-interval that uniformly increases by $$x_{delta}$$, it has no way of knowing what is in between each point. *Adaptive sampling* attempts to solve this problem.

## Adaptive Sampling

In a nutshell, the *adaptive sampling* routine works by recursively evaluating and splitting intervals in half until a certain precision threshold is met (think binary search algorithm), and until the provided function $$f(x)$$ is well approximated. There are criteria in which a given interval requires further splitting, and the depth of binary splittings can be adjusted through a parameter to easily customize the level of precision. Like any other sampling routines, this method yields a set of points available for direct plotting.

### Procedure

Take note that the following variables will be involved: `max_depth`, `depth`, and `tolerance`.

1.  Decide on a maximum recursion depth - `max_depth`. This number varies depending on how large the display is and the specs of the machine. For starters, use 8 as the magical number and play around with it accordingly. At the start of the routine, let `depth = max_depth = 8`. `depth` is the current depth.

2.  Decide on a `tolerance` value. A good tolerance value is $$\frac{1}{n_{pixels}}$$. If not, `DBL_EPSILON` will do. This will be used later as a threshold to measure precision against computed samples.

3.  Determine the $$x_{min}$$ and $$x_{max}$$ values. Typically this corresponds to the width of the display where the graph will be drawn.

4.  Begin with $$x_{min}$$ and $$x_{max}$$ as the starting points $$x_a$$ and $$x_c$$. Split them into 3 points: $$x_a \equiv x_{min}$$, $$x_b \equiv \frac{x_c-x_a}{2}$$, and $$x_c \equiv x_{max}$$.

5.  Further split the above 3 points into 5 points: $$x_a$$, $$x_{ab} \equiv \frac{x_b-x_a}{2}$$, $$x_b, x_{bc} \equiv \frac{x_c-x_b}{2}$$, and $$x_c$$.

6.  Evaluate $$f(x)$$ at all 5 $x$-intervals: $$x_a$$, $$x_{ab}$$, $$x_b$$, $$x_{bc}$$, and $$x_c$$, and store these points in an array.

7.  If `depth <= 0`, return the array as is.

8.  Otherwise walk through each point in the array to determine if there are rapid oscillations. Use an integer `count` defaulted to 0 to measure the result: either there exists rapid oscillations and requires further refinements or there aren’t any. Here are the steps to determine:

    1.  Iterate through each point, starting from the second point and ending at the fourth point (the first and last points are omitted in this iteration).

    2.  At each point, examine the $$y$$-value of the previous, current, and next points. For example, if the current point is $$x_{ab}$$, then the previous and next points are $$x_a$$ and $$x_b$$ respectively. If any of these values are invalid (i.e. `NAN`, `infinity`, etc), meaning that there are irregularities, increment `count` and continue to the next point. Otherwise, analyze the values to determine if there is high fluctuation, i.e. the current value is larger than both the previous and next values, or the current value is less than both the previous and next values. If any of these situations are true, fluctuation is detected, increment `count` and continue to the next point. Repeat until all 3 points of interest are examined. At the end of the iteration, `count` will determine the next steps of refinement.

    3.  Evaluate `count`:
        1.  If `count > 2`, that means further splittings are needed to produce more accurate samples. Two sets of samples are required, each computed by recursively invoking *step 1* again, except with `depth--`, `tolerance *= 2` and starting points are $$x_a$$ and $$x_b$$ for the first set and $$x_b$$ and $$x_c$$ for the second set. Return the combined results of set 1 and set 2.

        2.  Otherwise if `count <= 2`, that means this sample pool is accurate enough. But before returning these samples as the final output, perform one last check to ensure that the graph is smooth enough. This is done by computing and comparing the area under the graph:

            $$
            g(x) \equiv f(x){-}f_0
            $$

            where:

            -   $$f_0$$ is the minimum of the values of $$(x)$$ between $$x_a$$ and $$x_c$$
            -   $$g(x)$$ is nonnegative and has the mimimum value of 0

            To approximate the area:

            $$
            \int_{x_0}^{x_1} g(x)dx
            $$

            use *Newton-Cotes quadratures*. Compute two *Newton-Cotes quadratures* using the 5 points: 1 quadrature using $$x_a$$, $$x_{ab}$$, $$x_b$$, and $$x_{bc}$$ and the other using $$x_b$$, $$x_{bc}$$, and $$x_c$$ with coefficients $$(\frac{3}{8}, \frac{19}{24}, -\frac{5}{24}, \frac{1}{24})$$ and $$(\frac{5}{12}, \frac{2}{3}, -\frac{1}{12})$$ respectively:

            $$
            f_1(x) \approx \frac{3}{8}f(x_a) + \frac{19}{24}f(x_{ab}) - \frac{5}{24}f(x_b) + \frac{1}{24}f(x_{bc})
            $$

            $$
            f_2(x) \approx \frac{5}{12}f(x_b) + \frac{2}{3}f(x_{bc}) - \frac{1}{12}f(x_c)
            $$

            Determine if the graph is smooth by evaluating:

            $$
            abs(f_1(x){-}f_2(x)) \lt tolerance*f_2(x)
            $$

            If `true`, routine is complete and the final array of samples can be returned. If `false`, split the intervals further as if the `count > 2`.

            ![](/assets/images/log/2014/03/linear-sampling.png)
            *Linear sampling demo (500 samples) of $$sin(\frac{1}{x})$$ on [Calculator³](https://itunes.apple.com/us/app/calculator3/id828838134?ls=1&mt=8).*

            ![](/assets/images/log/2014/03/adaptive-sampling.png)
            *Adaptive sampling demo (recursion depth=8) of $$sin(\frac{1}{x})$$ on [Calculator³](https://itunes.apple.com/us/app/calculator3/id828838134?ls=1&mt=8).*

Freely adjust `max_depth` and `tolerance` as desired to acquire optimal precision-performance balance.

## Sources

1.  [Numerical algorithms I: basic methods](http://yacas.sourceforge.net/Algochapter4.html)
