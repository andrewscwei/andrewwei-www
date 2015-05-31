---
published: true
title: Linux User Management
---

## Where User Info Are Stored

1.	`/etc/passwd`: List of users.
2.	`etc/shadow`: Users' encrypted password.
3.	`/etc/group`: List of groups.
4.	`/etc/default/useradd`: Value for the default group if none is specified by the `useradd` command.
5.	`/etc/login.defs`: Defines site-specific configurations for the shadow passwords stored in the `/etc/shadow` file.

## Managing Users

To add a new user (by default this creates a new group with the same name and assigns this new user's primary group to the new group):
```
$ useradd username
```

To add a new user and assign its primary group to an existing group:
```
$ useradd -g primary_group_name username
```

To add a new user and assign its secondary group to an existing group (primary group is still the same as the username):
```
$ useradd -G secondary_group_name username
```

To change a password:
```
$ passwd username
```

To delete a user:
```
$ userdel username
```

To delete a user along with its home directory and any other related data:
```
$ userdel -r username
```

## Managing User Groups

There are two types of user groups in the Linux system: primary and secondary. Groups are defined in `/etc/group`.

To create a new group:
```
$ groupadd groupname
```

To delete an existing group:
```
$ groupdel groupname
```

To verify status of a group:
```
$ grep groupname /etc/group
```
