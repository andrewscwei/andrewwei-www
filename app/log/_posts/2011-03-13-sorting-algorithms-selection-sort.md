---
title: 'Sorting Algorithms: Selection Sort'
tags:
    -   algorithms
    -   c++
    -   coding
---

## Time Complexity

Best case: `O(n^2)`
Average case: `O(n^2)`
Worst case: `O(n^2)`

## Usage

It's good to use it to sort small arrays where inefficiency is not really a penalty and auxiliary memory is limited.

## How It Works

1.  Iterate through the array and find the minimum.
2.  Once minimum is found, swap it with the first element of the array.
3.  Iterate through the array again to find the minimum, but this time starting from the second element.
4.  Once minimum is found swap it with the second element.
5.  Repeat the procedure with the third element, fourth element, etc.

## Implementation

{% highlight c++ %}
int* selectionsort(int* arr, int n)
{
    int* temp = new int[n]; copy(temp, arr, n);
    int curIndex;
    int minIndex;

    for (curIndex = 0; curIndex < n; curIndex++)
    {
        minIndex = curIndex;

        for (int i=curIndex+1; i<n; i++)
        {
            if (temp[i] < temp[minIndex])
            {
                minIndex = i;
            }
        }

        if (minIndex != curIndex)
        {
            int t = temp[curIndex];
            temp[curIndex] = temp[minIndex];
            temp[minIndex] = t;
        }
    }

    return temp;
}
{% endhighlight %}
