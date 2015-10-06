---
title: 'Evaluating an RPN Stack'
tags:
    -   coding
    -   math
    -   algorithms
---

### Terms Used

1.  **Operand**: a fixed numerical value of some sort (i.e. a number, a constant like `π`, or an `ANS` in a calculator).
2.  **Unary Postfix Operator**: operators that appear *after* an operand and only require one operand to operate (i.e. `!`, `%`).
3.  **Unary Prefix Operator**: operators that appear *before* an operand and only require one operand to operate (i.e. `√`, `-`).
4.  **Function**: math functions like `sin`, `cos`, and `tan` that take in at least 1 parameter. In this context, only functions that take in exactly 1 parameter are considered.

Given an RPN stack in the form of an array as input (i.e. derived using the [shunting-yard algorithm](http://blog.andrewwei.mu/?p=216)), do the following to get the numerical output of the stack.

### Verify that the stack is valid

Before doing anything else, perform a few preliminary sanity checks:

1.  Assert that the input array is not `nil` (obviously).
2.  Assert that the array contains at least 1 element. An RPN stack that contains only 1 element, which may be a number, is still a valid stack. In this case the number itself is the output.

### Process each element in the stack one-by-one

Create a temporary empty array to store the processed elements of the original array containing the RPN stack. Starting from the bottom of the stack (i.e. the beginning of the array), process each element based on the following criteria:

1.  If the element is a number, push it into the temporary array.
2.  If the element is a constant/variable, either look-up the value of the constant/variable by whatever means or use the symbol as is. Push the value/symbol into the temporary array.
3.  If the element is a unary prefix/postfix operator or function, evaluate the operation with the last element in the temporary array and pop it from the array. Assert that the popped element is an operand. If it is not an operand or there does not exist a last element in the temporary array, the RPN stack is invalid. Push the result into the temporary array.
4.  If the element is an operator (regular operator that expects two operands), pop the last 2 elements from the temporary array (assert that they are valid operands) and evaluate the operation using those 2 operands. Push the result into the temporary array.
5.  If the element is a parenthesis, either ignore it (by ignoring it, users will not have to manually close the parenthesis), or handle it to check if there is a valid balance of left/right parenthesis. Parenthesis do not impact the elements in the temporary array.

### Analyze the temporary array

The temporary array should contain at least 1 element, in which case the last element is the output of the RPN expression. Assert that the last element of the temporary array is a valid numerical value. Depending on the use-case, there may exist more than 1 elements in the temporary array, which are most likely all numbers. This happens, for example, when the input is `["1", "2", "3", "+"]`, where the temporary array in this case is `["1", "5"]`. The last element is always the evaluated output. Whether or not to handle previous elements is dependent on context.
