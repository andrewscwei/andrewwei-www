---
title: 'Sorting Algorithms: Quicksort'
tags:
    -   algorithms
    -   c++
    -   coding
---

## Time Complexity

Best case: `O(nlog(n))`
Average case: `O(nlog(n))`
Worst case: `O(n^2)`

## Implementation

{% highlight c++ %}
void quicksort(int* arr, int left, int right)
{
    int i = left, j = right;
    int tmp;
    int pivot = arr[(left + right)/2];

    while (i <= j)
    {
        while (arr[i] < pivot) { i++; }
        while (arr[j] > pivot) { j--; }

        if (i <= j)
        {
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
            j--;
        }
    }

    if (left < j) quicksort(arr, left, j);
    if (right > i) quicksort(arr, i, right);
}
{% endhighlight %}