# andrewwei.mu [![Circle CI](https://circleci.com/gh/andrewscwei/andrewwei.mu/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/andrewwei.mu/tree/master)

This app is scaffolded by [Yeoman](http://yeoman.io). See [generator-vars-jekyll](https://github.com/VARIANTE/generator-vars-jekyll.git) for more details. This app is a static, database-less, blog-aware site that uses the [Jekyll](http://jekyllrb.com) generator and pipelined by [Gulp](http://gulpjs.com).

## Setup

### Remote

Set up remote Git repositories. The source code is hosted on GitHub, while the app itself lives on Heroku. Heroku is linked to the GitHub repo.

1.  Clone this project:
    -   ```$ git clone https://github.com/andrewscwei/andrewwei.mu.git```

2.  ```cd``` into it
    -   ```$ cd andrewwei.mu```

3.  Set up Heroku remotes for all 3 environments: prod, stage and dev.
    -   ```$ git remote add prod https://git.heroku.com/andrewwei-mu.git```
    -   ```$ git remote add stage https://git.heroku.com/andrewwei-mu-stage.git```
    -   ```$ git remote add dev https://git.heroku.com/andrewwei-mu-dev.git```

4.  Verify that your remotes are set up correctly by doing: ```$ git remote -v```. You should see the following:
    ```
    dev     https://git.heroku.com/andrewwei-mu-dev.git (push)
    dev     https://git.heroku.com/andrewwei-mu-dev.git (fetch)
    origin  https://github.com/andrewscwei/andrewwei.mu.git (fetch)
    origin  https://github.com/andrewscwei/andrewwei.mu.git (push)
    prod    https://git.heroku.com/andrewwei-mu.git (push)
    prod    https://git.heroku.com/andrewwei-mu.git (fetch)
    stage   https://git.heroku.com/andrewwei-mu-stage.git (fetch)
    stage   https://git.heroku.com/andrewwei-mu-stage.git (push)
    ```

### Local

Do the following to get the app up and running in your local machine.

1.  Get dependencies:
    - Heroku Toolbelt ([https://toolbelt.heroku.com](https://toolbelt.heroku.com))
    - Node ([https://nodejs.org](https://nodejs.org))
    - Bundler ([http://bundler.io](http://bundler.io))
    - Gulp ([http://gulpjs.com](http://gulpjs.com))
        - ensure that Gulp is installed globally: ```$ sudo npm install -g gulp```

2.  Install required gems:
    ```
    $ bundle install
    ```

3.  Install required node modules:
    ```
    $ npm install
    ```
    After ```npm``` is done installing dependencies, it will trigger its ```postinstall``` script which will run a clean ```gulp``` build for production.

### Cloud (Heroku)

This guideline refers to creating a new Heroku app from scratch.

1.  Create new app.

2.  Add the following [Heroku buildpacks](https://devcenter.heroku.com/articles/buildpacks) (order matters):
    - Ruby: ```$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby```
    - Node.js: ```$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs```

3.  Allow the Node.js buildpack to install ```devDependencies```:
    - ```$ heroku config:set NPM_CONFIG_PRODUCTION=false```

4.  Push to Heroku (or link to GitHub for automatic deploy):
    - ```$ git push heroku master```

5.  If order of buildpacks is set up correctly, the Ruby buildpack should act first to install gem dependencies (namely [Jekyll](http://jekyllrb.com)), then the Node.js buildpack which will install all dependencies defined in ```package.json``` and run the ```postinstall``` script on complete. The ```postinstall``` script kickstarts a ```gulp``` build.

6.  When ```gulp``` is done, ```npm start``` will kickoff the ```start``` script in ```package.json```, which will do:
    ```
    $ node server.js
    ```
    This will serve the ```public``` directory in the port provided by Heroku or ```9000``` otherwise.

## Tasks

1.  ```gulp --debug```: Builds all source files in the ```app``` directory but skips all compression tasks.

2.  ```gulp```: Builds all source fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```public``` directory.

3.  ```gulp serve --debug```: Serves the project to ```http://localhost:9000``` by default in debug configuration (recommended for development).

4.  ```gulp serve```: Serves the project to ```http://localhost:9000``` by default in production configuration (not recommended for development).

See ```gulpfile.js``` for more tasks and custom flags such as ```--skip-uglify```, ```--skip-csso```, etc.

## Blogging

For a user-friendly UI, use [prose.io](http://prose.io) to add/modify/remove blog posts as well as uploading required images. Note that in [prose.io](http://prose.io), any file/directory that is irrelevant to blogging will be hidden from the UI for security reasons. You can modify this inside ```_config.yml```.
