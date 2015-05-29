---
title: 'AS3: Event Listeners'
tag:
    -   coding
    -   as3
---

## What Is an Event Listener?

AS3 uses a publish-subscribe pattern to establish communication between objects. Essentially, there is a publisher and there is a subscriber that subscribes to the publisher. what is being published is an `Event`, and at the time of publishing, the publisher will invoke the registered handlers of all subscribers for that specific event. In Flash terms, the subscriber is the event listener and the publisher is the event dispatcher.

## How to Add/Remove Event Listeners

In AS3, only objects that inherits `IEventDispatcher` are capable of dispatching events. That being said, an object can only add itself as an event listener to an `IEventDispatcher` object.

Function to add an event listener:

{% highlight as3 %}
public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void
{% endhighlight %}

Function to remove an event listener:

{% highlight as3 %}
public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void
{% endhighlight %}

## Using the *Capture* Phase

A listener can be added to a dispatcher by passing 2 parameters at a minimum, which is the event name and the event handler to be triggered when the specified event is dispatched. By passing a 3rd parameter to the `addEventListener()` method, it allows specifying whether or not the event should be handled during the *capture* phase. For more information about event phases, see [AS3: Event Phases](/log/as3-event-phases).

## Setting Event Listener Priorities

The optional 4th parameter of the `addEventListener()` method indicates the `priority` for controlling the execution order of the listeners. This is particularly useful when a dispatcher object has more than one listener registered under the same event. By default, `priority` is set to `0`, and when all listeners are set to priority 0, they are handled by the order they are registered in the code.

For example:

{% highlight as3 %}
stage.addEventListener(Event.RESIZE, onResize1);
stage.addEventListener(Event.RESIZE, onResize2);
stage.addEventListener(Event.RESIZE, onResize3);
{% endhighlight %}

In the above code, when the stage resizes, `onResize1` will be executed first, then `onResize2`, and finally `onResize3`. As stated, this is because of the order by which these listeners are registered. To gain more control over the order of handling these listeners, we can set priorities to each `addEventListener()` call.

{% highlight as3 %}
stage.addEventListener(Event.RESIZE, onResize1, false, 1);
stage.addEventListener(Event.RESIZE, onResize2, false, 2);
stage.addEventListener(Event.RESIZE, onResize3, false, 0);
{% endhighlight %}

In this case, when a stage resize event is dispatched, `onResize2` will be executed first, followed by `onResize1` and `onResize3`. The execution order favors the one with the highest priority. Similar to the default case, when listeners are registered with equal priority, the runtime execution order favours the one that is declared first during compile time.

## Weakly Referenced Event Listeners

Before jumping into the deal about weak references, it is important to understand how the *garbage collector* in Flash Player works. In AS3, garbage collection is pretty much automated and objects are automatically marked for sweeping at the end of their scope/life cycle. The only time when objects may **not** be marked for sweeping is when there are other objects holding one or more references to them. These references are known as strong references. Strong references are taken into consideration by the GC to determine whether or not a certain object is eligible for garbage collection. As long as there are at least one or more strong references holding onto an object, that object will remain in memory. This is the fundamental cause of memory leaks. On the other hand, unlike strong references, weak references are ignored by the GC. Therefore, even if the weak reference itself is not removed, it does not affect the GC's decision when it comes to cleaning the referenced object.

In AS3, there are 2 ways to create weak references:

1.  `addEventListener()` - setting the 5th parameter to true
2.  The constructor of the `Dictionary` class - `new Dictionary(true)`

Essentially, when you add an event listener to an object, the listener gets linked to the object. This link is basically a one directional reference that the dispatcher creates from itself to the listener so that the dispatcher can call the listener's event handler when the registered event dispatches. Note that this reference is one way, and not bidirectional, and since the reference is created **from the dispatcher to the listener** (meaning that the dispatcher holds a reference to the listener), the dispatcher is still eligible for garbage collection even if the listener is not removed. On the other hand, if the event listener is not removed, the listener object will continue to lurk around even if it itself is removed from stage (given that it is a `DisplayObject`) or if all of its other references are removed. During the GC's mark and sweep phase, it can access the listener object through the reference that was created by the dispatcher, and therefore the listener will never be removed. This is when weak references come to the rescue.

By default, the 5th parameter of `addEventListener`, `useWeakReference` is set to `false`, thus creating a strong link between the dispatcher and the listener. By setting this parameter to `true`, the reference between the dispatcher and the listener is then set to be a weak reference. Recall that the GC ignores weak references during its mark and sweep routine. As a result, even if the event listener is never removed, it is still eligible for garbage collection.

Always setting the listener to use weak reference can be a good safety measure in case one forgets to remove that listener from the dispatcher, thus avoiding potential leakage. However, the better practice is to always remember to remove the listener because weakly referenced event listeners do have their edges cases when they provide no additional benefit.

Recall that the reference created when adding an event listener to an event dispatcher is one way: from the dispatcher to the listener. That means if the dispatcher is for some reason destroyed, the reference it holds to the listener is also marked for sweep by the GC since the dispatcher is no longer available, and therefore in this scenario the listener is still eligible for deallocation. Whether or not to use a weak reference in this case adds no benefit. It doesn't hurt, but it is also not necessary. Weakly referenced listeners are only

One thing to note about the nature of adding/removing event listeners is that, when the dispatcher is destroyed (but not yet GC'ed), it will continue to dispatch events for as long as it remains in memory and therefore call its listeners' event handlers. There is no guarantee when the GC will run its mark and sweep routine, so it is always best to remove the event listener to prevent weird things from happening.
