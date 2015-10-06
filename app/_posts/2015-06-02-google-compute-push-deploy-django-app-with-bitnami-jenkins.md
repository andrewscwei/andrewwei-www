---
title: 'Push-Deploy a Django App with Bitnami Jenkins on Google Cloud Engine'
cover: /assets/images/log/2015/06/jenkins.svg
tags:
    -   systems
---

This log demonstrates how to set up a push-deploy [Jenkins](https://jenkins-ci.org) build system for a [Django](https://www.djangoproject.com) app on [Google Compute Engine](https://cloud.google.com/compute/). This log assumes that you have already set up and served a Django app successfully on a GCE VM instance with Nginx and uWSGI running in emperor mode. Go [here](/log/2015/06/01/google-compute-engine-setup-for-django-app-with-uwsgi-and-nginx) for a step-by-step tutorial.

## Overview

The set up is as follows:

1.  There will be two instances on your GCE project:
    1.  An instance containing Jenkins.
    2.  An instance that serves your Django app.

2.  The Jenkins instance will use Google's Bitnami Jenkins image. It will connect to your Google Cloud Repository which syncs with the GitHub repo that hosts your Django app source code. Every time you commit changes to your GitHub repo, your Cloud Repo will automatically sync up, and Jenkins will pick this up and start building the project. After the build, it will deploy the built files to your other VM instance which serves the Django app.

3.  The VM instance responsible for hosting/serving the app will have Nginx installed and uWSGI set up to run in emperor mode, constantly watching the folder that contains the built Django app and serving it. Every time the Jenkins instance completes a build and deploys new built files to this instance, uWSGI will automatically serve the new files and end-users will see the changes live immediately.

## Pipeline

This is a typical pipeline from committing a change to showing it to the world.

1.  You make a change locally and push it to GitHub master branch.
2.  Google Cloud Repository, which is linked to your GitHub repo, syncs up and now has that change you commited.
3.  Your Jenkins VM instance, which polls changes from the Cloud Repo every X minutes, detects changes and kicks off a build. This build process is summarized in a shell script, which:
    1.  Activates your Python virtual environment
    2.  Installs Python dependencies through `pip` in case they were changed
    3.  Reconciles `npm` packages (i.e. `npm prune`)
    4.  Runs `npm install`
    5.  Runs `npm update`
    6.  Kicks off a Django migration
    7.  Runs `gulp` to build the app
4.  After the build is completed successfully, Jenkins will:
    1.  SSH into your other VM instance which hosts the app
    2.  Deletes the directory that stores the files from the previous build
    3.  Copies the new build over
5.  Since the hosting VM instance has Nginx set up and uWSGI running in emperor mode, it will pick up the new files (they are still in the same directory that the emperor expects) and serve them immediately for the world to see.

## Walkthrough

### Cloud Repo

Assuming you already have a GitHub repo containing your app, you need to link it to your Google Cloud Repository. This can be achieved in the [Developers Console](https://console.developers.google.com/), under *Source Code*. This step should be trivial.

### Jenkins VM Instance Setup

You will be using Bitnami Jenkins. See this [official guide from Google](https://cloud.google.com/tools/repo/push-to-deploy) on how to create one. You just need to follow the guide up to the point where you can access the Jenkins app in the browser and log in successfully. Note that the default username is always `user` (pay attention to the metadata params in the command for creating the Bitnami image), so just leave it as `user`. Changing that can cause problems logging in later on.

After you've successfully created the instance, log in and configure your own user settings (i.e. resetting the password, adding your email, etc).

##### Install Required Plugins

The only plugin you need for Jenkins is *Publish Over SSH*, so do the following:

1.  Login to your Jenkins dashboard.
2.  Go to *Manage Jenkins* > *Manage Plugins* > *Available*.
3.  Find *Publish Over SSH* and install it.
4.  Let Jenkins restart after the installation.

##### Generate SSH Key for Jenkins User

This step is required so that Jenkins can later SSH into your app hosting instance and deploy the new build into it. First, SSH into the Jenkins instance.

1.  Log in as `tomcat`, which is the user that will be performing the build jobs.

    ```
    $ sudo su tomcat
    ```

2.  Generate SSH key for `tomcat`. Leave the location as default (i.e. `/home/tomcat/.ssh/id_rsa`) and don't enter a passphrase.

    ```
    $ ssh-keygen
    ```

    The SSH keys (private and public) are now generated in `/home/tomcat/.ssh`. Open up `/home/tomcat/.ssh/id_rsa.pub` and copy everything inside to somewhere (i.e. the clipboard). You will need this for the next step.

##### Addng the Generated SSH Key to the Hosting Instance

You will need to take the key you just copied and add it to the `authorized_keys` file of your hosting instance.

1.  Since Jenkins will use user `tomcat` to SSH into this instance, you need to create the same user for it. So create one.

    ```
    $ sudo useradd tomcat
    $ sudo mkdir /home/tomcat
    ```

2.  Go to the home directory of `tomcat` and create the `authorized_keys` file.

    ```
    $ sudo mkdir /home/tomcat/.ssh
    $ sudo touch /home/tomcat/.ssh/authorized_keys
    ```

3.  Open up `authorized_keys` and add the key you just copied. Beware of word wraps. Upon completing this step, `tomcat` user from the Jenkins instance should now be able to successfully SSH into your hosting instance.

##### Configure SSH Connection

This step will configure the SSH connection on Jenkins.

1.  Go to your Jenkins dashboard.
2.  Go to *Manage Jenkins* > *Configure System* and scroll to where it says *Publish over SSH*.
3.  Leave *Passphrase* as blank since we ignored it when we generated the SSH key for `tomcat`.
4.  Set *Path to key* to the path of the generated key, which should be `/home/tomcat/.ssh/id_rsa`.
5.  Leave *Key* as blank. If you didn't set the path, you can copy and paste the key here.
6.  For *SSH Servers*...
    -   Set *Name* to anything you want. I usually do `tomcat@hosting_instance_name`.
    -   Set *Hostname* to the external IP address of the hosting instance.
    -   Set *Username* to `tomcat`.
    -   Set *Remote Directory* to the absolute path of the directory in the hosting instance where Jenkins will deploy to after building. Normally I do `/srv/example.com`, with `example.com` being the name of your project. This guide assumes your Django app structure is the same as the one generated by [generator-vars-django](https://github.com/VARIANTE/generator-vars-django).
7.  Finally, test your configuration by clicking on the button that says 'Test Configuration'. You will see a spinner and then the word 'Success'. That indicates that user `tomcat` in your Jenkins instance is able to SSH into your hosting instance as `tomcat` as well.

##### Create a New Build Job

This step creates the build job in Jenkins that will be responsible for building your app and deploying it after the build is successful.

1.  Go to your Jenkins dashboard.
2.  Go to *New Item*.
3.  Specify a name, select *Freestyle project* and then *OK*.
4.  You should now be in the configuration page for the job. Set the following:
    1.  Under *Source Code Management*, select Git. For your *Repository URL*, use the URL of your Cloud Repo, which is `https://source.developers.google.com/p/project-id`.
    2.  For *Credentials*, select `{project-id} service account`. This is available because you are using a Bitnami Jenkins image, which comes with a bunch of plugins that takes care of Google OAuth stuff for you. If you don't see it, click on *Add* and add it manually:
        -   In the *Add Credentials* popup, select *Google Service Account from metadata*.
        -   Enter your project ID if it's not already populated.
        -   Click *Add*.
    3.  Under *Build Triggers*, select *Poll SCM* to tell Jenkins to watch for repo changes every X minutes. Enter `H/5 * * * *` for *Schedule* to set the poll interval to 5 minutes.
    4.  Under *Build*, select *Add build step* and pick *Execute shell*. Then add the shell commands needed to build your app. It should look something like this:

        ```
        #!/bin/bash

        echo -n 'Starting Jenkins job in working directory: '; pwd

        echo 'Activating Python virtual environment...'
        source ../bin/activate

        echo 'Installing Python dependencies...'
        pip install -r requirements.txt
        echo -n 'Installed directory of packages: '; which django-admin

        echo 'Installing Node dependencies...'
        npm prune
        npm install
        npm update

        echo 'Resolving database migrations...'
        gulp migrate

        echo 'Building the app...'
        gulp
        ```

        This should be pretty self-explanatory if you already followed this [guide](/log/2015/06/01/google-compute-engine-setup-for-django-app-with-uwsgi-and-nginx) on how to set up a Django app on GCE.
    5.  Under *Post-build actions*, click on *Add post-build action* and select *Send build artifacts over SSH* to tell Jenkins to deploy your built files to the hosting instance. Set the name of the SSH server to the name of the one you created for `tomcat`. Next, you need 2 transfer sets:
        1.  The first transfer will be responsible for removing any previous builds in your hosting instance. Assuming you are following the structure of [generator-vars-django](https://github.com/VARIANTE/generator-vars-django), your built files should be inside `example.com/build`. So all you need is an *Exec command* with:

            ```
            rm -rf build
            ```

            This path is relative to the *Remote Directory* entry you set during the SSH configuration step.

        2.  The second transfer will be responsible for copying the built files over. All you have to do is just set *Source files* to

            ```
            build/**/*
            ```

            This path is relative to the default workspace directory of this Jenkins job. Typically it should be `/opt/bitnami/apps/jenkins/jenkins_home/jobs/job_name/workspace`.

    You now have a job configured, but don't execute it yet because it will fail at the moment. Since this VM instance will be responsible for doing all the building, you need to install all the dependencies needed to build your project, i.e. Node.js, Python, etc. You also need to set up your virtual environment, which this log assumes that it is located in `../bin/activate`, relative to the workspace directory of the job. Follow this [guide](/log/2015/06/01/google-compute-engine-setup-for-django-app-with-uwsgi-and-nginx) on how to install the dependencies. Just treat this like any other VM instance, SSH into it and do what you need to do.

### Hosting Instance Setup

This VM instance will be serving the app. It will receive the build from the Jenkins instance, and it will serve it using Nginx and uWSGI in emperor mode. Again, follow this [guide](/log/2015/06/01/google-compute-engine-setup-for-django-app-with-uwsgi-and-nginx) on how to set those up. Note that you do not need the dependencies for building the app itself because the Jenkins instance will be doing the building, but at the very least you need:

1.  Python dependencies in `requirements.txt` so your VM understands Django.
2.  The database set up properly for the app to use.
3.  Python virtual environment with all the required environment variables which your app depends on.

Run Nginx, run uWSGI (assuming you got the conf/ini files all symlinked and stuff), and you should be all set.
