---
title: 'Sorting Algorithms: Insertion Sort'
tags:
    -   algorithms
    -   c++
    -   coding
---

## Time Complexity

Best case: `O(n)`
Average case: `O(n^2)`
Worst case: `O(n^2)`

## How It Works

1.  This algorithm scans through the array and inserts each item into the right place.
2.  Involves finding the right place to place the item.
3.  Can be done using two arrays: a sorted one and an unsorted one (temporary), or it can be done in one array.
4.  Scan through an array, and shift the element at index <code>i</code> left until the previous element is smaller. Repeat for next element at ++i.

## Implementation

{% highlight c++ %}
int* insertionsort(int* arr, int n)
{
    int* temp = new int[n]; copy(temp, arr, n);
    int i, j, tmp;

    for (i = 1; i < n; i++)
    {
        j = i;

        while ((j > 0) && (temp[j-1] > temp[j]))
        {
            tmp = temp[j];
            temp[j]  = temp[j-1];
            temp[j-1] = tmp;
            j--;
        }
    }

    return temp;
}
{% endhighlight %}
