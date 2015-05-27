---
title: 'Xcode Custom Key Bindings'
---

## Adding Custom Commands

Open this file: `Xcode.app/Contents/Frameworks/IDEKit.framework/Resources/IDETextKeyBindingSet.plist`

At the bottom create a new entry and add any custom commands. Below is an example of the custom commands `Delete Line` and `Duplicate Line`:

{% highlight xml %}
<key>Custom</key>
<dict>
    <key>Delete Line</key>
    <string>selectLine:, delete:</string>
    <key>Duplicate Line</key>
    <string>moveToBeginningOfLine:, deleteToEndOfLine:, yank:, insertNewline:, moveToBeginningOfLine:, yank:</string>
</dict>
{% endhighlight %}

## Exporting Key Bindings

Key binding sets are stored in ```~/Library/Developer/Xcode/UserData/KeyBindings/```. A new set can be created via Xcode preferences in the *Key Bindings* tab. These sets are immediately available to all installed Xcode versions. Simply copy these sets to import them into another Xcode on another machine.
