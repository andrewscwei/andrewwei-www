---
title: 'How to Recover Storage Claimed by "Other" on the iPhone'
published: false
tags:
    -   mobile
---

## The Problem

Occasionally, iPhones (or iPads) will have a portion of their storage occupied by an ambiguous category labeled "Other" and there is no easy way to get around reclaiming it. This can be observed by plugging your device into iTunes and checking the storage meter, where you see other categories like Photos, Music and Apps. This amount of space being occupied can vary, and there is little documentation on what exactly this category "Other" is and how to properly control the space claimed by it.

## What Is It?

The data that is marked as "Other" is obviously something that does not belong to any of the other categories: Audio, Video, Photos, Apps, and Books. That being said, "Other" mostly consists of system files and any application data associated with the **native apps**. These can include your iOS system files, browser cache, email cache, downloaded files, Google Maps cache, notes, reminders, etc. Note the emphasis on **native apps**, which means data such as game saves or downloaded maps on your GPS app does not fall into the "Other" category.

The most common solution to reclaiming this occupied space is by doing a **full system restore**, meaning you need to restore your iPhone's iOS without restoring from a previous backup. This is indeed the safest solution that is guaranteed to work if all else fails, but the price is to lose all your data and start from scratch. Below is a compiled list of things you can do to attempt to reclaim this space before you really need to go down the road of doing a full restore.

## How to Reclaim "Other" Storage

1.  Delete your browser cache (i.e. history, cookies, and data): This can be done in Settings -> Safari. If you have never done it before, chances are your space taken up by "Other" is due to the piled up cache stored by your browser ever since the phone was activated.
2.  Delete your email account and re-add: There is no easy way to clear your email cache other than deleting your account. In terms of accessing your iPhone's local files directly through means like SSH, I have yet to find where these caches are stored. This should clear any of the recent attachments you have downloaded (like PDFs and images).
3.  Go to `/var/mobile/Media/ApplicationArchives` using **SSH** (requires jailbroken iPhone) or [DiskAid](http://imazing.com/?diskaid=1) and delete everything. This folder contains partially downloaded apps which were never completed nor removed because the download processes were probably interrupted by whatever.

If the above steps fail, do a full system restore...

Note: This post is written when the newest iPhone in store was the **iPhone 4S running iOS 5.1**.