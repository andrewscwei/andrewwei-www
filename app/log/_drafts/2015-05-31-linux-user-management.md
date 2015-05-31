## Where User Info Are Stored

1.	`/etc/passwd`: List of users.
2.	`etc/shadow`: Users' encrypted password.
3.	`/etc/group`: List of groups.
4.	`/etc/default/useradd`: Value for the default group if none is specified by the `useradd` command.
5.	`/etc/login.defs`: Defines site-specific configurations for the shadow passwords stored in the `/etc/shadow` file.

## Managing User Groups

There are two types of user groups in the Linux system: primary and secondary. Groups are defined in `/etc/group`.
