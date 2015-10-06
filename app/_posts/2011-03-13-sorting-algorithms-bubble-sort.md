---
title:  'Sorting Algorithms: Bubble Sort'
tags:
    -   algorithms
    -   c++
    -   coding
---

## Time Complexity

Best case: `O(n)`
Average case: `O(n^2)`
Worst case: `O(n^2)`

## Usage

1.  Bubble sort is used to sort arrays with small number of items where inefficiency is not a huge penalty.
2.  Very efficient to use it on a list that is mostly sorted (i.e. if only 1 element is unsorted, operation will only take `O(2n)` time).

## How It Works

Iterate through every element in an array `arr`, swap every 2 adjacent items whenever `arr[i] > arr[i+1]`, and repeat from the beginning until no more swapping is needed.

## Implementation

{% highlight c++ %}
int* bubblesort(int* arr, int n)
{
    int* temp = new int[n]; copy(temp, arr, n);
    bool swapped = true;

    while (swapped == true)
    {
        swapped = false;

        for (int i=0; i<(n-1); i++)
        {
            if (temp[i] > temp[i+1])
            {
                int t = temp[i];
                temp[i] = temp[i+1];
                temp[i+1] = t;
                swapped = true;
            }
        }
    }

    return temp;
}
{% endhighlight %}
