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

A user can belong to only 1 primary group and muliple secondary groups.

To add a new user (by default this creates a new group with the same name and assigns this new user's primary group to the new group):
```
$ useradd username
```

To add a new user and assign its primary group to an existing group:
```
$ useradd -g {primary_group_name} {username}
```

To add a new user and assign its secondary group to an existing group (primary group is still the same as the username):
```
$ useradd -G {secondary_group_name, secondary_group_name, ...} {username}
```

To create a new home directory and assign its ownership to the new user:
```
$ mkdir /home/username
$ chown {username} /home/username
```

To create/change a password:
```
$ passwd {username}
```

To delete a user:
```
$ userdel {username}
```

To delete a user along with its home directory and mail spool:
```
$ userdel -r {username}
```

To check the status of a user:
```
$ id {username}
```

To check the secondary groups which a user belongs to:
```
$ id -nG {username}
```

To change an existing user's primary group:
```
$ usermod -g {primary_group_name} {username}
```

To overwrite an existing user's secondary groups:
```
$ usermod -G {secondary_group_name, secondary_group_name, ...} {username}
```

To add a secondary group to an existing user:
```
$ usermod -a -G {secondary_group_name} {username}
```

## Managing User Groups

There are two types of user groups in the Linux system: primary and secondary. Groups are defined in `/etc/group`.

To create a new group:
```
$ groupadd {group_name}
```

To delete an existing group:
```
$ groupdel {group_name}
```

To check the status of a group:
```
$ grep {group_name} /etc/group
```
