---
title: 'Data Structures: Circular Queues'
tags:
    -   c++
    -   coding
    -   datastructures
---

A circular queue is a particular implementation of a queue. It is an abstract data type that contains a collection of data (like an array) which allows addition of data at the end of the queue and removal of data at the beginning of the queue. Like a linear queue, it is a *First-In-First-Out* (FIFO) data structure, meaning that the first element added to the queue will be the first one to be removed. A circular queue is **bounded**, meaning it has a fixed size.

## Linear Queues vs Circular Queues

1.  Linear queues *by theory* do not have a specific capacity and new elements can always be added to the queue; queues that have a fixed capacity are called **bounded queues**. In a typical implementation, queues are **bounded**.
2.  Circular queues always have a fixed size, like bounded queues.
3.  The end of a linear queue points to `NULL` indicating the end of the queue, while the end of a circular queue points to the beginning of the queue, thus completing the circle.
4.  Linear queues do not allow overwriting of existing data. When the queue is full, new data cannot be inserted until old data is freed. Linear queues must pass both "Queue Empty" test before dequeue operation and "Queue Full" test before enqueue operation. Circular queues are only required to pass "Queue Empty" test, and depending on the application the "Queue Full" test is optional. When new data is enqueued into a full circular queue, the oldest data of the queue is overwritten.

## How Circular Queues Work
Circular queues use two pointers, `head` and `tail` to indicate the beginning of the queue and the end of the queue. `head` pointer points to the location in the queue to be dequeued, and `tail` pointer points to the location in the queue to enqueue. That being said, a circular queue is empty/full when `head` equals `tail`

Here's what happens when a circular queue is full:

Imagine a full circular queue of size 6 containing the following data, where the leftmost element is the oldest data - both `head` and `tail` pointers point to the location containing `1`:

`{1, 2, 3, 4, 5, 6}` -> Head: `1`, Tail: `1`

At this point, the circular is full. If you enqueue the number `7`, the result would be:

`{7, 2, 3, 4, 5, 6}` -> Head: `2`, Tail: `2`

`1` is replaced by `7` since `1` is the oldest element. If you enqueue another number, let`s say `8` into the queue, it becomes:

`{7, 8, 3, 4, 5, 6}` -> Head: `3`, Tail: `3`

At this point, if dequeue is executed twice, both `3` and `4` will be removed, resulting in:

`{7, 8, 0, 0, 5, 6}` -> Head: `5`, Tail: leftmost `0`

Enqueue the number `9` would give:

`{7, 8, 9, 0, 5, 6}` -> Head: `5`, Tail: `0`

## Implementation

Implementation of circular queues is fairly simple. Circularly linked list is a great choice of data structure to implement the queue. Another option is to use an array. The only tricky part is to evaluate "Queue Full" and "Queue Empty" tests because both `head` and `tail` pointers are equal in both cases. There are a number of ways to work around this:

1.  Keep track of the number of elements in the queue.
2.  Let the queue hold 1 more element than the specified length so that the queue is never full.
3.  Instead of having the 'tail' pointer point at the next address to write data at, let it point at the address of the last element.

Below is an implementation of circular queues using the array structure, and having the `tail` pointer point at the location of the last element instead.

{% highlight c++ %}
#include <iostream>

class CircularQueue
{
private:
    int* arr;
    int head;
    int tail;
    int max;

    int initialize(int n);
public:
    CircularQueue(int n);
    ~CircularQueue();
    int enqueue(int data);
    int dequeue();
};

CircularQueue::CircularQueue(int n)
{
    if (initialize(n) == 0)
    {
        arr = 0;
        std::cout << "Queue not properly initialized." << std::endl;
    }
}

CircularQueue::~CircularQueue()
{
    if (arr)
        delete [] arr;
}

int CircularQueue::initialize(int n)
{
    if (n <= 0)
        return 0;

    arr = new (nothrow) int[n];

    if (arr == 0)
    {
        std::cout << "Cannot allocate memory." << std::endl;
        return 0;
    }

    max = n;
    head = -1;
    tail = -1;

    for (int i = 0; i < max; i++)
        arr[i] = 0; // initialize all values to 0

    return 1;
}

int CircularQueue::enqueue(int data)
{
    if (arr == 0)
    {
        std::cout << "Queue not properly initialized." << std::endl;
        return 0;
    }

    if (tail == -1) // queue is empty
    {
        tail = head = 0;
        arr[tail] = data;
        return 1;
    }

    // perform whatever operation when queue is full
    if ((tail + 1) % max == head)
    {
        std::cout << "Queue is full." << std::endl;
    }

    tail = (tail + 1) % max;
    arr[tail] = data;

    if (tail % max == head)
        head = (head + 1) % max;

    return 1;
}

int CircularQueue::dequeue()
{
    if (head == -1)
    {
        std::cout << "Queue is empty." << std::endl;
        return 0;
    }

    arr[head] = 0;

    if (head == tail) // queue is empty after dequeueing
        head = tail = -1;
    else
        head = (head + 1) % max;

    return 1;
}
{% endhighlight %}
