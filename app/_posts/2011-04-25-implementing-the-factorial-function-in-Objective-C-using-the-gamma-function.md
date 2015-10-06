---
title: 'Implementing the Factorial Function in Objective-C Using the Gamma Function'
tags:
    -   math
    -   objc
    -   coding
extensions:
    -   math
---

A common way of implementing the factorial function uses recursion, which looks something like this:

{% highlight objc %}
- int factorial(int operand)
{
    if (operand < 0)
    {
        return -1; // factorial of negative integer is invalid, -1 means invalid
    }
    else if (operand > 1)
    {
        return operand * factorial(operand-1);
    }
    else
    {
        return 1; // factorial of 0 or 1 yields 1
    }
}
{% endhighlight %}

This works most of the time, but there are a few cases when this would cause major performance issues.

##### Case 1: Working with large numbers

Imagine calculating the factorial of a 5-digit number with this implementation. The function calls itself at least 10,000 times. The output would be `inf`, but on runtime the program will crash because the recursions eat up too much memory unless you have an excess amount of RAM hanging around. Either way this is not memory-efficient.

##### Case 2: Reusing this function in other contexts where more than 1 factorial function is needed in a math formula, i.e. calculating permutations and combinations

Recall:

$$
P(n, r) = {n!}/{(n-r)!}
$$

$$
C(n, r) = {n!}/{r!(n-r)!}
$$

Since the implementation is recursive and it is being used more than once in a formula, you will need to allocate even more memory to the application. Eventually you will hit a wall, especially when you start working with large numbers.

##### Case 3: Calculating decimal factorials

Digging deeper into the math, factorials can also apply to positive/negative non-integers. In this case, the above implementation will be restricted to calculating and yielding positive integers only.

##### Solution: Use the gamma function

To solve all of the aforementioned issues, use the gamma function which is conveniently defined in `math.h`. By mathematical definition:

$$
Gamma(n) = (n-1)!
$$

`math.h` provides two useful equivalents to the gamma function, which is `tgamma()` and `lgamma()`, where:

$$
(n-1)! = tgamma(n)
$$

$$
(n-1)! = e^{lgamma(n)}
$$

The gamma function solves for any type of factorials (including decimals) and does the job fairly quickly. This creates an excellent yet simple alternative to the recursive approach. One thing to take note of is that the gamma function produces an approximated output, so it is important to monitor the decimals in the output especially in the case when we are using gamma to calculate the factorial of an integer which should theoretically yield an integer answer (not decimal). In this case, check to see if the input is an integer and round the output accordingly.

## Difference Between `lgamma()` and `tgamma()`

An example of when you might prefer using `lgamma()` over `tgamma()` is when you are implementing a function that calculates permutations and combinations.

Recall that:

$$
P(n, r) = {n!}/{(n-r)!}
$$

$$
C(n, r) = {n!}/{r!(n-r)!}
$$

If you use `tgamma()` to compute the factorials in $$C(n,r)$$, you might produce inaccurate results or crash the program when dealing with larger numbers (i.e. if $$r!$$ produces a large number, multiplying that by $$(n-r)!$$ can yield `inf`). In this case, the `lgamma()` is preferred because the formula can be rewritten using logarithmic properties.

Sample implementations for $$n!$$, $$P(n,r)$$, and $$C(n,r)$$ are as follows:

{% highlight objc %}
- double fact(double __n)
{
    if (__n == 0.0)
    {
        return 1.0;
    }
    else if (__n < 0.0)
    {
        // negative integer
        if (fmod(__n, floor(__n)) == 0.0)
        {
            return NAN;
        }
        // negative non-integer
        else
        {
            return tgamma(__n + 1.0);
        }
    }
    else
    {
        // positive integer
        if (fmod(__n, floor(__n)) == 0.0)
        {
            return round(exp(lgamma(__n + 1.0)));
        }
        // positive non-integer
        else
        {
            return tgamma(__n + 1.0);
        }
    }
}

double ncr(double __n, double __r)
{
    double o = exp((lgamma(__n+1.0)) - (lgamma(__r+1.0) + lgamma(__n-__r+1.0)));

    if ((fmod(__n, floor(__n)) == 0.0) && (fmod(__n, floor(__r)) == 0.0))
    {
        return round(o);
    }
    else
    {
        return o;
    }
}

double npr(double __n, double __r)
{
    double o = exp(lgamma(__n+1.0) - lgamma(__n-__r+1.0));

    if ((fmod(__n, floor(__n)) == 0.0) && (fmod(__n, floor(__r)) == 0.0))
    {
        return round(o);
    }
    else
    {
        return o;
    }
}
{% endhighlight %}
