---
title: 'Data Structure Alignment: Alignment Class Members'
tags:
    -   coding
    -   c++
---

Suppose there are two C++ classes, A and B, with the following structures in a 64-bit system:

{% highlight c++ %}
class A
{
public:
    bool b1;
    double x1;
    bool b2;
    double x2;
};

class B
{
public:
    double x1;
    double x2;
    bool b1;
    bool b2;
};
{% endhighlight %}

Their members are identical, except their order of declaration is different. So what’s the deal here? If you do a `sizeof()` for both classes, class `A` will have a size of 32 (bytes) and class `B` will have a size of 24 (bytes). This is due to the compiler performing type/class alignment as it reads/writes these members to computer memory. The compiler will attempt to do this in chunks of the computer’s word size, i.e. in a 64-bit system that would be 8 bytes, whereas in a 32-bit system that would be 4 bytes. During this process the compiler will insert byte paddings in between members so they can fit in word chunks. This is what the classes look like after the compiler is done (again, this example refers to a 64-bit system where the word size is 8 bytes):

{% highlight c++ %}
class A
{
public:
    bool b1;            // this is 1 byte
    char padding1[7];   // since the next member is a double (8 bytes), compiler will add 7 bytes to fill the gap and fit the previous bool in a word chunk
    double x1;
    bool b2;
    char padding2[7];   // same as above
    double x2;
};

class B
{
public:
    double x1;
    double x2;
    bool b1;
    bool b2;
    char padding2[6];   // adding 6 bytes to fill the gap
};
{% endhighlight %}

In conclusion, the rule of thumb is to always order members from largest to smallest and group same types together. For more info about data structure alignment, visit this Wikipedia article: [Data Structure Alignment](http://en.wikipedia.org/wiki/Data_structure_alignment).
