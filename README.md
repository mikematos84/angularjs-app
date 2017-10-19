# Angular App

### Description
* Scaffolding for a basic Angular single page app.
* This app is ment to run on an existing web server such as Apache, NGINX, or IIS.

### Requirements
* <a href="https://www.npmjs.com/" target="_blank">NPM - Node Package Manager</a>

## Before running application
* run "npm install" from the project's root directory to install dependencies 
* run "gulp install" to perform preprosessing tasks
    * google web fonts
        * downloads google web fonts found in fonts.list file
        * creates or updates _fonts.scss found in /src/scss
        * For more information on usauge, visit: <a href="https://fonts.google.com/" target="_blank">Google Fonts</a>
    * google material icons
        * downloads google material icons fonts
        * creates or updates _material-icons.scss file found in /src/scss
        * For Modern Browsers: <i class="material-icons">home</i>
        * For IE9 or below: <i class="material-icons">&#xE88A;</i>
        * For more information on usuage, visit: <a href="https://material.io/icons/#ic_home" target="_blank">Google Material Icons</a>

## Running with Gulp
* run "gulp" to build the project in development mode (Uncompressed)
* run "gulp --production" to build the project in production mode (Compressed)