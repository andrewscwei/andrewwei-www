---
title: 'The Shunting-Yard Algorithm'
tags:
    -   algorithms
    -   coding
    -   objc
    -   math
---

The *Shunting-Yard* algorithm is an algorithm developed by [Edsger Dijkstra](http://en.wikipedia.org/wiki/Edsger_Dijkstra) which parses infix mathematical expressions into *Reverse Polish Notations* (RPN). The algorithm scans a string representation of a math expression (i.e. `1+4(6)+53`) and records each character group in the expression as tokens, and each token will be processed accordingly to generate an RPN stack. From the RPN output the numerical answer can then be easily deducted.

## Requirements

1.  A temporary stack array for storing math operator tokens inside the math expression. Let this be `stack`.
2.  An output array. This will eventually be the final RPN output. Let this be `output`.
3.  Both arrays implement the stack data structure.


## Terms Used

1.  **Operand**: a fixed numerical value of some sort (i.e. a number, a constant like `π`, or an `ANS` in a calculator).
2.  **Unary Postfix Operator**: operators that appear *after* an operand and only require one operand to operate (i.e. `!`, `%`).
3.  **Unary Prefix Operator**: operators that appear *before* an operand and only require one operand to operate (i.e. `√`, `-`).
4.  **Function**: math functions like `sin`, `cos`, and `tan` that take in at least 1 parameter. In this context, only functions that take in exactly 1 parameter are considered.

## Walkthrough

1.  Given a string mathematical expression, from left to right, scan for each `token`.
    1.  If `token` is an *operand*, push it onto `output`.
    2.  If `token` is a *unary postfix operator*, push it onto `output`.
    3.  If `token` is a *unary prefix operator*, push it onto `stack`.
    4.  If `token` is a *function*, push it onto `stack`.
    5.  If `token` is an *operator*:
        1.  If operator is *left-associative* (i.e. `+`, `-`, `*`, `/`):
            -   While `stack` contains an operator that has equal/higher precedence than `token`, pop `stack` and push the popped item onto `output`.
            -   Push `token` onto `stack`.
        2.  If operator is *right-associative* (i.e. `^`, `EE`, `√`, `-`):
            - While `stack` contains an operator that has higher precedence than `token`, pop `stack` and push popped item onto `output`.
            - Push `token` onto `stack`.
    6.  If `token` is a *parenthesis*:
        1.  If *left-parenthesis* `(`:
            - Push `token` onto `stack`.
        2.  If *right-parenthesis* `)`:
            - While top of `stack` is not a *left-parenthesis*, pop each item from `stack` and push each popped item onto `output`.
            - Now pop `stack` one more time (popped item should be a *left-parenthesis*).
            - If top of `stack` is now a *function*, pop that as well and push it onto `output`.
2.  Pop remainder of `stack` and push each popped item onto `output`.
3.  `output` now represents a postfix math notation, or RPN. `stack` should now be empty and can be deleted from memory.

## Example

Consider the math expression: `1 + 3 * 9 / (2 + 4)`

1.  First `token` is `1` which is an operand, push it onto `output`.

    ```
    $ output = ["1"]
    $ stack = []
    ```

2.  Next `token` is `+` - apply above rules, this goes straight onto `stack`.

    ```
    $ output = ["1"]
    $ stack = ["+"]
    ```

3.  Next `token` is `3` - goes onto `output`.

    ```
    $ output = ["1", "3"]
    $ stack = ["+"]
    ```

4.  Next `token` is `*` - following the above rules, the only operator in the stack is `+` which is of lower precedence, so push `*` straight onto `stack`.

    ```
    $ output = ["1", "3}]
    $ stack = ["+", "*}]
    ```

5.  Next `token` is `9` - to `output`.

    ```
    $ output = ["1", "3", "9}]
    $ stack = ["+", "*}]
    ```

6.  Next `token` is `/` - `stack` contains `*` which is of equal precedence. Pop and push that onto `output`, and push `/` onto `stack`.

    ```
    $ output = ["1", "3", "9", "*}]
    $ stack = ["+", "/}]
    ```

7.  Next `token` is a left-parenthesis - goes straight to `stack`.

    ```
    $ output = ["1", "3", "9", "*}]
    $ stack = ["+", "/", "(}]
    ```

8.  Next `token` is `2` - to `output`.

    ```
    $ output = ["1", "3", "9", "*", "2}]
    $ stack = ["+", "/", "(}]
    ```

7.  Next `token` is `+` - apply above rules, top of `stack` is `(`, NOT an operator, so ignore and push `+` straight onto `stack`.

    ```
    $ output = ["1", "3", "9", "*", "2}]
    $ stack = ["+", "/", "(", "+}]
    ```

8.  Next `token` is `4` - to `output`.

    ```
    $ output = ["1", "3", "9", "*", "2", "4}]
    $ stack = ["+", "/", "(", "+}]
    ```

9.  Last `token` is a right-parenthesis - pop and push everything on the `stack` onto `output` until `(` is reached. Then pop `(`.

    ```
    $ output = ["1", "3", "9", "*", "2", "4", "+}]
    $ stack = ["+", "/}]
    ```


10. No more tokens, so pop remaining items from `stack` and push them onto `output`.

    ```
    $ output = ["1", "3", "9", "*", "2", "4", "+", "/", "+}]
    $ stack = []
    ```

Final `output` `["1", "3", "9", "*", "2", "4", "+", "/", "+"]` is now RPN.


## Implementation

After understanding the concept behind the *Shunting-Yard* algorithm, implementation should be trivial. However, this is assuming that the tokens are properly recorded from a string-based math expression, and that a method for evaluating RPN stacks is available. The algorithm can be further extended to consider other token variations such as expressions like `2(6)` and `(6)(2)` which both mean `2*6`.
