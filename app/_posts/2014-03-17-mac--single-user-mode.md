---
title: 'Mac: Single-User Mode'
cover: /assets/images/log/2014/03/single-user-mode-cover.jpg
tags:
    -   hacks
---

## How to boot into Single-User Mode on a Mac

On bootup, hold down ⌘S until the screen turns black.

## Tricks

1. The filesystem is by default read-only in Single-User Mode, which prevents writing files in case you need to put important system files back into their original place. To make the filesystem writable, execute the following command:

    ```
    $ mount -uw /
    ```
