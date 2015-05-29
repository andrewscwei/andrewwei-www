---
title: 'How to Invert Mouse Wheel Scrolling on Windows 7/8'
tags:
    -   hacks
---

This log demonstrates how to invert mouse wheel scrolling on Windows 7/8. Note that this only applies to the mouse, not the trackpad. If the mouse is connected via USB, it must be always plugged into the same slot for this tweak to work (or you can repeat the same procedure for the remaining USB slots). It also only applies to the same mouse this tweak was performed on.

## Step 1: Find the instance path of the mouse

1.  Go to *Control Panel* > *Hardware and Sound* > *Mouse* settings
2.  Go to *Hardware* tab, select the connected mouse, then click on *Properties*.
3.  In the *Properties* window, go to the *Details* tab, select *Device instance path* from the *Property* dropdown menu, and make note of the value. That is the device path.

## Step 2: Edit the registry

1.  Open up Registry Editor `regedit.exe`.
2.  Navigate to `HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Enum/HID/{VID_###}/{###}/Device Parameters`. ### is the mouse instance path from above.
3.  Set `FlipFlopWheel` to 1 to invert vertical scrolling, and/or set `FlipFlopHScroll` to 1 to invert horizontal scrolling.

## Step 3: Reconnect the mouse

For changes to take effect, disconnect and reconnect the mouse (note that for the above procedures the mouse must remain connected). If that makes no difference, restart the PC.