---
title: 'Data Structures: Linked Lists'
tags:
    -   c++
    -   coding
    -   datastructures
---

A linked list is a basic data structure that contains a set of nodes, each node containing both data and a pointer to the next node in the list. Since there is no specific size, the size of a linked list can be modified dynamically. New data is added to the list by altering the pointers in the list to point to the newly created node.  Typically, a linked list contains a `head` pointer and a `tail` pointer. `head` points to the first node of the list and `tail` points to the last node of the list.

## Different Types of Linked Lists

1.  Singly linked list: each node contains data and a pointer to the next node. The last node points to `NULL` indicating the end of the linked list.
2.  Circularly linked list: similar to a singly linked list but the last node points to the first node of the list instead.
3.  Doubly linked list: each node contains data and two pointers: one points to the previous node and one points to the next node. By convention the two pointers are called `*prev` and `*next`. `*prev` pointer of the first node points to `NULL`, indicating the beginning of the list, and the `*next` pointer of the last node points to `NULL`, indicating the end of the list.
4.  Circularly doubly linked list: similar to a doubly linked list, but the `*prev` pointer of the first node points to the last node of the list, and the `*next` pointer of the last node points to the first node of the list thus completing a circle.

## Linked Lists vs Arrays

-   Arrays allow random access to the nth element of the array. However, arrays require one block allocation, meaning the addresses of the elements are in sequential order in the memory pool. If the memory pool only has 10 blocks of free memory, allocating an array that requires 11 blocks of memory will be impossible. Arrays are of fixed size, inserting additional data into the array would mean cloning the existing array and porting it over to a new array with a new size. Removing elements from the array would require shifting remaining elements down upon resetting the target element, and placing the NULL element at the end.
-   Linked lists do not allow random access - accessing the nth element of the list will require iterating through the list of nodes from the first node. However, insertion and deletion of data is easy since nodes are coupled with pointers. Size of linked lists can be modified dynamically, and since nodes are connected with pointers, the memory location of each node does not have to be adjacent to each other.

## Insertion in a Linear Linked List

To insert a node X between node A and node B:
-   Make X point to B by setting X's pointer equal to A's.
-   Make A point to X by setting A's pointer to X's address.

To insert a node X at the beginning of the list, with node A as the first node:
-   Make X point to A by setting X's pointer equal to the `head` pointer.
-   Set `head` pointer to address of X.

## Deletion in a Linear Linked List

-   Create a `temp` pointer that stores the address of the node to be deleted.
-   Set the pointer of the previous node to be equal to the pointer of the node to be deleted.
-   Set target node to `NULL` or `0` to release memory by using the `temp` pointer.

## Implementation

Quick examples of implementing the 4 aforementioned types of linked lists:

##### Standard linked list class:

{% highlight c++ %}
#include <iostream>

using namespace std;

class LinkedList
{
public:
    // Properties:
    struct Node
    {
        int data;
        Node* next;
        Node* previous;

        // Struct Contructor:
        Node(int value): data(value) {}
    };

    Node* firstNode;
    Node* lastNode;
    bool isCircular;

    // Constructor/Destructor:
    LinkedList(bool circular = false);
    LinkedList(int value, bool circular = false);
    virtual ~LinkedList();

    // Methods:
    virtual void insert(int value);
    virtual void append(int value);
    void list(int startIndex = 0);
    int getSize();
    Node* getNodeAtIndex(int index);
};

LinkedList::LinkedList(bool circular): isCircular(circular)
{
    cout << "LinkedList constructed, is circular: " << circular << "." << endl;
}

LinkedList::LinkedList(int value, bool circular): isCircular(circular)
{
    cout << "LinkedList constructed with initial node, is circular: " << circular << "." << endl;

    firstNode = new Node(value);
    lastNode = firstNode;
}

LinkedList::~LinkedList()
{
    delete firstNode;
    delete lastNode;

    cout << "LinkedList destructed." << endl;
}

void LinkedList::append(int value)
{
    Node* n = new Node(value);

    if (firstNode == 0)
    {
        firstNode = n;
        lastNode = firstNode;
    }
    else
    {
        lastNode->next = n;
        lastNode = n;

        if (isCircular) lastNode->next = firstNode;
    }
}

void LinkedList::insert(int value)
{
    Node* n = new Node(value);

    if (firstNode == 0)
    {
        firstNode = n;
        lastNode = firstNode;
    }
    else
    {
        n->next = firstNode;
        firstNode = n;

        if (isCircular) lastNode->next = firstNode;
    }

}

void LinkedList::list(int startIndex)
{
    /*
    if (startIndex > (getSize()-1))
    {
        cout << "List index out of bounds." << endl;
        return;
    }
    */
    Node* targetNode = firstNode;
    Node* currentNode = 0;

    for (int i = 0; i < startIndex; i++) { targetNode = targetNode->next; }

    currentNode = targetNode;

    do
    {
        cout << currentNode->data << endl;
        currentNode = currentNode->next;
    }
    while (currentNode != ((isCircular) ? targetNode : 0));
}

int LinkedList::getSize()
{
    Node* currentNode = firstNode;
    int count = 0;

    do
    {
        count++;
        currentNode = currentNode->next;
    }
    while (currentNode != ((isCircular) ? firstNode : 0));

    return count;
}

LinkedList::Node* LinkedList::getNodeAtIndex(int index)
{
    if (index > (getSize() - 1))
    {
        cout << "List index out of bounds." << endl;
        return 0;
    }

    Node* targetNode = firstNode;

    for (int i=0; i < index; i++)
    {
        targetNode = targetNode->next;
    }

    return targetNode;
}
{% endhighlight %}

##### SinglyLinkedList class (with circular option):

{% highlight c++ %}
#include <iostream>

using namespace std;

class SinglyLinkedList: public LinkedList
{
public:
    // Constructor/Destructor:
    SinglyLinkedList(bool circular = false);
    SinglyLinkedList(int value, bool circular = false);
    ~SinglyLinkedList();
};

SinglyLinkedList::SinglyLinkedList(bool circular): LinkedList(circular)
{
    cout << "SinglyLinkedList constructed, is circular: " << circular << "." << endl;
}

SinglyLinkedList::SinglyLinkedList(int value, bool circular): LinkedList(value, circular)
{
    cout << "SinglyLinkedList constructed with initial node, is circular: " << circular << "." << endl;
}

SinglyLinkedList::~SinglyLinkedList()
{
    cout << "SinglyLinkedList destructed." << endl;
}
{% endhighlight %}

##### DoublyLinkedList class (with circular option):

{% highlight c++ %}
#include <iostream>

using namespace std;

class DoublyLinkedList: public LinkedList
{
public:
    // Constructor/Destructor:
    DoublyLinkedList(bool circular = false);
    DoublyLinkedList(int value, bool circular = false);
    ~DoublyLinkedList();

    // Methods:
    void insert(int value);
    void append(int value);
    void reverseList(int startIndex=0);
};

DoublyLinkedList::DoublyLinkedList(bool circular): LinkedList(circular)
{
    cout << "DoublyLinkedList constructed, is circular: " << circular << "." << endl;
}

DoublyLinkedList::DoublyLinkedList(int value, bool circular): LinkedList(value, circular)
{
    cout << "DoublyLinkedList constructed with initial node." << endl;
}

DoublyLinkedList::~DoublyLinkedList()
{
    cout << "DoublyLinkedList destructed." << endl;
}

void DoublyLinkedList::append(int value)
{
    Node* n = new Node(value);

    if (firstNode == 0)
    {
        firstNode = n;
        lastNode = firstNode;
    }
    else
    {
        lastNode->next = n;
        n->previous = lastNode;
        lastNode = n;

        if (isCircular)
        {
            firstNode->previous = lastNode;
            lastNode->next = firstNode;
        }
    }
}

void DoublyLinkedList::insert(int value)
{
    Node* n = new Node(value);

    if (firstNode == 0)
    {
        firstNode = n;
        lastNode = firstNode;
    }
    else
    {
        firstNode->previous = n;
        n->next = firstNode;
        firstNode = n;

        if (isCircular)
        {
            firstNode->previous = lastNode;
            lastNode->next = firstNode;
        }
    }
}

void DoublyLinkedList::reverseList(int startIndex)
{
    Node* targetNode = firstNode;
    Node* currentNode = 0;

    for (int i = 0; i < startIndex; i++) { targetNode = targetNode->next; }

    currentNode = targetNode;

    if (isCircular)
    {
        do
        {
            cout << currentNode->data << endl;
            currentNode = currentNode->previous;
        }
        while (currentNode->previous != targetNode);
    }
    else
    {
        while (currentNode->previous != 0)
        {
            cout << currentNode->data << endl;
            currentNode = currentNode->previous;
        }
    }
}
{% endhighlight %}
