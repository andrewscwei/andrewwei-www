---
title: 'Data Structures: Stacks'
tags:
    -   c++
    -   coding
    -   datastructures
---

A stack is a data structure that follows the *Last-In-First-Out* (LIFO) principle. It is basically a list of items which takes in new items at the end of the list (push) and removes items ONLY from the end of the list (pop). "End of the list" means the top of the stack.

## Usage

Stacks are used by the computer itself to store memory for local methods and variables when a thread is executed. Basically the stack memory is allocated at compile time, limited to the knowledge of the compiler as to how much memory is needed for the code. Stacks are also used to store states - the most recent state is inserted onto the top of the stack, and before returning to the previous state you must remove the recent state from the top of the stack (i.e. popping the stack). Another usage of stacks is evaluating of postfix or Reverse Polish notations (RPN).

## Implementation

In C++, stacks can be easily implemented using arrays. In the C++ environment however it is a good idea to keep a variable that keeps track of the total number of items in the stack. When using arrays to represent stacks, the first element of the array is the bottom of the stack, and the counter variable will be the index that indicates where the top of the stack is.

In other languages, such as Objective-C and ActionScript 3, stacks are already part of the language. For example, the AS3 `Array` class already have built-in `push()` and `pop()` functions. In Objective-C, the Foundation Framework contains the `NSMutableArray` class which, similar to push and pop, has the `addObject()` and `removeLastObject()` functions.
