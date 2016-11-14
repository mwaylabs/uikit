# Uikit
[![Build Status](https://travis-ci.org/mwaylabs/uikit.svg?branch=master)](https://travis-ci.org/mwaylabs/uikit)

A toolbox to build portals with AngularJS 1.5.x that have a lot of forms and list views for example admin portals to manage data. 
We started with the uikit in our product http://relution.io. As our codebase was growing we decided to move out the core components into a separate module so we could use it for other projects as well. This was the birthdate of the Uikit. Since then we used it internally for several portals. 
The Uikit itself is split into several submodules so you can also just use parts from it, in case you don't want to use the whole package.

## Whats in the box
- We combined the power of AngularJS with the power of BackboneJS in the [mwUI.Backbone module](./src/mw-backbone/mw_backbone_doc.md)
- A lot of useful ui components like a history timeline, wizard, tab bar, ...
- Paginated list view that supports selecting, sorting and filtering of items
- Easy to use i18n service for internationalized content
- Toast module to display messages for the user
- Responsehandler to configure actions that should happen per method and http status code when the server responds for certain urls e.g.
   ```
   do a redirect to the login page for every url when the server responds with the http status code 401
   ```
 - ResponseToastHandler to configure toast that should be displayed per method and http status code when the server responds e.g.
   ```
   display toast successfully created when server returns with the http status code 200 for every POST request
   ```
 - Modal module to create modals with a controller and a template (similiar to the Angular $routeProvider)
 - Form module that handles input validations and displays messages when a input is invalid and/or required
 - Input module to link backbone models and collections with the inputs like text/number/date inputs, select boxes, radio groups, etc
 - Exception handler module to display an exception modal when a JavaScript exception has occured
 
## Dependendencies
 - AngularJS 1.5.x
 - BackboneJS 1.x
 - Bootstrap 3.x
 
## Customize it
It is built with SASS and Bootstrap so you can easy customize it. For example to use a different color you can overwrite the bootstrap `$brand-primary` variable with your own color code.

## Documentation
A documentation and a sample portal is currently in progress and available soon
