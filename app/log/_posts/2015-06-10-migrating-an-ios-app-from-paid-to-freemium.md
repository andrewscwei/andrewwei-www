---
title: 'Migrating an iOS App From Paid to Freemium'
tags:
    -   objc
    -   mobile
    -   ios
---

This log details out my recent effort in migrating the iOS app [Calculator³](https://itunes.apple.com/us/app/calculator3/id828838134?ls=1&mt=8) from paid model to freemium model with IAPs. Hopefully developers out there who are trying to do the same thing will find this log useful.

## Background

1. I had a paid app with features fully accessible to users.
2. I decided to convert this paid app into a free app and divide the features into in-app purchases with limited trial sessions. Why? So users can try out the features before they decide whether or not they want to pay for them, as opposed to a paid app where users must pay first before given a chance to try out the app.
3. I need to make sure that rightful pre-owners of this app retain full access to all features because they already purchased the app while it was still paid.

## Approach

In iOS 7+, there exists an App Store receipt for every downloaded app which contains all the details that tell you exactly **when** and **at what version** the user first downloaded the app. At first glance, it seemed like all I had to do was to analyze the fields in the receipt upon app launch and determine whether the user is a pre-owner, then unlock the features silently.

And so I began the implementation.

I started off in the sandbox environment (obviously), with sandbox tester accounts, on an iOS 8 device. Following Apple's [guide](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateLocally.html#//apple_ref/doc/uid/TP40010573-CH1-SW2), I tried to retrieve the App Store receipt url using `[NSBundle mainBundle].appStoreReceiptURL`.

>   **NOTE**
>   In the sandbox environment, I was unable to locate the receipt unless I manually refresh it via `SKReceiptRefreshRequest`. During the production environment, however, the receipt is readily available upon the initial launch of the app. For safety reasons it is best to account for both cases and do not assume that the receipt is available, even though it should be in production.

When I located the App Store receipt, I verified it locally with iTunes Store (see Apple's [guide](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateLocally.html#//apple_ref/doc/uid/TP40010573-CH1-SW2)). In return I received JSON data that contains all the details of the receipt, which looks something like this in the sandbox environment:

{% highlight objc %}
{
    environment = Sandbox;
    receipt =     {
        "adam_id" = 0;
        "app_item_id" = 0;
        "application_version" = 108;
        "bundle_id" = "mu.ghozt.Calculator";
        "download_id" = 0;
        "in_app" =      (
        );
        "original_application_version" = "1.0";
        "original_purchase_date" = "2013-08-01 07:00:00 Etc/GMT";
        "original_purchase_date_ms" = 1375340400000;
        "original_purchase_date_pst" = "2013-08-01 00:00:00 America/Los_Angeles";
        "receipt_type" = ProductionSandbox;
        "request_date" = "2015-06-14 00:06:31 Etc/GMT";
        "request_date_ms" = 1434240391409;
        "request_date_pst" = "2015-06-13 17:06:31 America/Los_Angeles";
        "version_external_identifier" = 0;
    };
    status = 0;
}
{% endhighlight %}

Note the 2 keys of interest: `original_application_version` and `original_purchase date`.

>   **NOTE**
>   In the sandbox environment, the `original_application_version` seems to always be `1.0`.

The approach I took was to compare `original_application_version` against the new version number of the freemium update. Theoretically, if `original_application_version` is earlier than the new version, that would indicate that the user is a pre-owner, and therefore all the features should be unlocked. It was a fair assumption at the moment and I knew not a method to verify this in production. In fact, I was so hung up on this assumption that I thought it was unnecessary to make use of `original_purchase_date`. This soon proved to be a fatal mistake.

>   **NOTE**
>   I was unable to verify this in production. I have read that some developers are able to monitor the app receipt in production by first downloading their app from the App Store, then installing a dev version over it via Xcode. This did not work for me unfortunately, and I suspect that it has to do with iOS 8.

So the app went live. I soon learned that some pre-owners were able to restore their features, but some **weren't**. I also learned that **all new users got all features unlocked**.

WHAT???

There was only one explanation - users had all features unlocked because `original_application_version` in their production receipt showed up as earlier than the newest version. Likewise, some pre-owners couldn't unlock their already paid features because their `original_application_version` showed up as later than the newest version. I implemented a function that compares version numbers and handles any number of sequences, and that was working perfectly. Everything worked fine in the sandbox environment with `original_application_version` being `1.0`. I even tested with random version numbers and everything seemed fine.

I cried a little bit inside devastated by this major screw up, and finally began to seek for the answer. I started by looking for a way to see what the app receipt looks like in production. As I mentioned above, I had no luck doing so during development, but that was because I was testing with iOS 8 devices. By chance, I managed to get ahold of an iOS 7 device and **successfully** logged the production receipt to console using the following method:

1. Download the production version of the app from the App Store
2. **Do not launch the app**
3. Install the dev version over it and debug it in Xcode
4. Log the receipt to console and verify it

With the production receipt in front of me, I discovered what the mistake was. I assumed that `original_application_version` refers to the version number of the app. It does not. It is actually referring to the **build number**. Is this documented? Yes it is. According to Apple's [doc](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html):

>   **Original Application Version**
>   The version of the app that was originally purchased.
>
>   ASN.1 Field Type 19
>   ASN.1 Field Value UTF8STRING
>   JSON Field Name original_application_version
>   JSON Field Value string
>
>   This corresponds to the value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in OS X) in the Info.plist file when the purchase was originally made.
>
>   In the sandbox environment, the value of this field is always “1.0”.
>
>   Receipts prior to June 20, 2013 omit this field. It is populated on all new receipts, regardless of OS version. If you need the field but it is missing, manually refresh the receipt using the SKReceiptRefreshRequest class.

`CFBundleVersion` for iOS, and `CFBundleShortVersionString` for OS X. `CFBundleVersion` is the build number.

If I took an extra measure of precaution and also compared the `original_purchase_date`, I might have avoided this regretful mistake.

## Conslusion

This incident welcomed a lot of 1-star reviews. Fellow developers, please be extra careful if you are also trying to convert your paid app to a freemium app using the same approach.
