---
title: 'AS3: Event Phases'
tags:
    -   coding
    -   as3
---

When an event is dispatched, it flows/propegates through the display tree starting from the topmost parent (the stage) down to the event target (the dispatcher instance which has a listener added to it via `addEventListener()`), then back up to the stage. Event propagation only takes place in the display tree, assuming all child nodes in the tree inherit `EventDispatcher` (i.e. `DisplayObject` inherits `EventDispatcher`). Events will not propegate to objects that are not on the display tree.

This event flow is divided into three phases:

1.  **Capture Phase**: The flow of an event from the stage to the event target.
2.  **Target Phase**: The moment the event has arrived at the event target.
3.  **Bubble Phase**: The flow of an event from the event target back to the stage. In Flash terms, the event is "bubbling" back up to the stage from the target. This phase is optional, and most events have this property defaulted to `false`, meaning that the event will stop at its target and will not propegate, or "bubble", back up to the stage. `MouseEvent` is an example which event bubbling is defaulted to `true`.

Note that the event flow goes in one direction following the strict order of *capture*, *target*, and *bubble* phases. Event handlers are triggered in the very same order depending on what phase they are listening for.

## How Capture and Target Phases Are Used

When an event listener is added to a dispatcher using `addEventListener()`, there is an option to specify whether the listener listens for the specified event in its *capture* phase or its *target* phase. This is the 3rd parameter `useCapture` of the `addEventListener()` method, which defaults to `false`, meaning the *target* phase is used instead. In other words, when the event is dispatched, the listener handler will not be triggered until the event propegates and arrives at the *target* phase, where `target` equals the dispatcher. On the other hand, if `useCapture` is set to `true`, the listener handler will not be triggered when the event arrives at the dispatcher in the *target* phase. Instead, it will be triggered when the event arrives at the dispatcher in the *capture* phase.

Let's look at this more closely. Recall that events flow through the display tree, from top to bottom (ignore the *bubble* phase for now). Imagine a `MouseEvent.CLICK` event listener being added to a display object that is added as a direct child of the stage root. Now, if *target* phase is used (i.e. `useCapture` is `false`), the listener handler will be triggered when the user clicks directly on the display object. The reason behind is trivial - the mouse click event propagates from the stage down to the display object and stops there (before it bubbles back up) because that is where the mouse click is applied. The listener is added to the same display object thus making it the target, marking it the `target` phase.

How will the same event listener with `useCapture` set to `true` behave differently? In the very same scenario above, if the `capture` phase is used instead, when the user clicks on the display object, nothing will happen. Precisely, the listener handler will not be triggered. Recall that the `capture` phase encapsulates the point of event propagation from the topmost parent (stage) to the event target, which, in this case, is the display object. The important thing to note is that arriving at the event target is **NOT** part of the `capture` phase. The click event flows and stops at where the mouse click is applied, which is the display object. Since `useCapture` is set to `true`, the listener handler will not be triggered because during the mouse click event flow, the event never arrived at the display object during its *capture* phase. So, how is the *capture* phase used? Imagine that the display object itself is a parent of another display object. When the user clicks on the parent display object, the event listener will not be triggered because it never got to the target during the *capture* phase. However, when the user clicks on the child of that display object, the event will be handled. The target in the *target* phase is now the child, and as a result the event will visit the parent at some point during the *capture* phase.

## Event Bubbling

The *bubble* phase is slightly different in nature from the *capture* and *target* phases. The *bubble* phase is optional, and it is entirely dependent on the nature of the event itself when it is instantiated. Mouse/keyboard events that are natively dispatched by Flash such as the common `MouseEvent.CLICK` event and the `KeyboardEvent.KEY_DOWN` event support bubbling by default, whereas `Event.ENTER_FRAME` et al. do not.

Event bubbling simply means that after an event has arrived at the *target* phase, instead of terminating the event flow instantly, it will continue to propegate in the reverse direction until it reaches the stage. Imagine the same scenario as above where there is a display object inside another display object that is placed on the stage, where each instance has a `MouseEvent.CLICK` listener. Assuming `useCapture` is left as default (`false`) for both listeners, when the inner display object is clicked, both event handlers will trigger due to event bubbling, with the child's listener being triggered before the parent's. If bubbling is ignored, the parent's listener will not be handled.

## `target` vs. `currentTarget`

One can acquire a reference to the current node where the event is at in its event flow. This is commonly used inside event handlers via the `Event` paramenter which is the instance of the event being dispatched.

-   `target` - This is the node of which the event is currently at (aka the node that triggers the event). Most of the time it is the dispatcher of which the listener is being added to. However, the target can be different if, say, the event was bubbled from a child of a parent node that was originally listening for the event, or, the event was triggered by a child but was captured at the target during the *capture* phase.
-   `currentTarget` - The node of which the event listener was added to, always.

## `stopPropagation()` vs. `stopImmediatePropagation()`

As events propagate through the 3 phases, two methods can be called to terminate this propagation immediately, often done in event handlers:

1.  `stopPropagation()` - Stops the event from propagating to the next node, but allows the rest of the listeners added to the current node to be handled.
2.  `stopImmediatePropagation()` - Stops the event from propagating to the next node and also prevents the rest of the listeners added to the current node from being handled.
