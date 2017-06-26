# v1.0.12
## Features
### Backbone Module
- Selectable of the collection was extended with the method `useSelectionFor(modelOrCollection)` to reset the `modelOrCollection`
with the current selection
- The `mwUI.Collection` is now triggering the event `change:filterValue` when a filter was set on the filterable

### Menu Module
- The menu-entry directive was extended with an `is-active` attribute that accepts a function or a boolean.
This attribute can be used to control the active state of a `mw-menu-entry` programmatically. Can be useful for entries that 
don't have a url but only a click action. When a manual `is-active` function is defined the url won't be checked
```html
<div mw-menu-entry 
     label="abc"
     url="#/xyz"
     is-active="false"></div> <!-- This entry will never be in active state -->
     
<div mw-menu-entry 
     label="abc"
     url="#/xyz"
     is-active="true"></div> <!-- This entry will always be in active state -->  
        
<div mw-menu-entry 
     label="abc"
     url="#/xyz"
     is-active="ctrl.isEntryActive()"></div> <!-- This entry will be in active state  when the isEntryActive() function returns true -->          
```

### Src-Relution Module
- The search query of `mw-listable-head-2` (#93) will be persisted in local storage. To get the feature working the Attribute 
`collection` of `mw-listable-head-2` has to be replaced with the attribute `mw-list-collection="mwListCollection"`
- Fixed the selection of a public filter in the filter bar on page reload
- Switch filter sidebar tabs immediately instead of waiting for the fetch results
- Display loading spinner in filter sidebar tab when the filter is fetching results

## Fixes
### Backbone Module
The page of the filterable is reset to 1 when a filter was set. This fixes the wrong offset when the user has paginated 
through the collection and changes the filter afterwards e.g. by searching.

### List Module
The scroll listener of the directive `mwListableHead2` is now only active when the directive is visible to improve performance
and to fix broken affixed state when a user is e.g. switching from one tab to another

# v1.0.11
## Features
### Src-Relution Module
Sort order of listviews will be persisted in local storage

# v1.0.10
## Features
### Modal Module
The service mwModalOptions was added to configure global modal options. Those options will be used for all modals except
the modal configures it differently.
```js
angular.module('App')

.config(function (mwModalOptionsProvider) {
    mwModalOptionsProvider.config({
      holderEl: '.module-page', // Element where modal should be appended to (default is body)
      styleClass: 'my-modal-class', // Css class that should be set on the modal when appended to DOM
      dismissible: false // Whether the user should be able to close modal by clicking on backdrop (default true)
    });
  });
```

# v1.0.9
## Bug Fixes
### Src-Relution Module
- Fixed filter owner check on page reload #80. Waits until user is authenticated before checking if authenticated user 
is the filter owner
- Fixed sass datepicker dependencies file import #79. Removed those files from sass import. You have to make sure that
you have imported `bootstrap-sass-datepicker/sass/datepicker` in your `main.scss` before including the uikit sass file. 
The other file `bootstrap-sass-official/assets/stylesheets/bootstrap/variables` is already imported there

# v1.0.8
## Features
### Src-Relution Module
Added public filter functionality for src-relution. This lets the user create a public filter that can be seen by all
users of the organisation

# v1.0.7
## Features
### Form Module
Added directive `mw-form-actions` that can be used in the `mw-header` directive to save the form or to cancel the changes.
Save button is disabled when form is invalid. `save` and `cancel` functions can be defined that should be executed on button click.
When the function is returning a promise a loading spinner is displayed until the promise is resolved.
### Layout Module
- Added `mw-ui` directive that shall be used as top directive. It applies basic styles and sets up the `toasts` holder

  ```html
  <html>
  <body>
    <div mw-ui>
      <!-- Your app -->
      <div ng-view></div>
    </div> 
  </body>
  </html>
  ```
- Added `mw-sidebar` directive.  
- Added `mw-footer` directive.
- `mw-header` directive is now setting the browser title

### Ui Components Module
- An optional icon and tooltip can be defined for `mw-tabs-pane` directive

### Utils Module
- Added service to get and set browser title
- Added `mw-append-route-class` directive to append css classes that were defined for a route in the `$routeProvider`

## Bug Fixes
### Modal module
- fixed style of toasts that are displayed in the modal
- fixed default selector where the modal should be appended. Is now `body`

### List Module
- fixed style of unselect button in the list header
- fixed affix bug of list header when no header element could be found

### Toast module
- sanitize message when option `isHtmlMessage` is set to `true`

### Ui Components Module 
- fix style of mw-button-help
- fix missing translation of mw-button-help when changing the locale

# v1.0.6
## Features
### Menu Module
Added directives to create a top menu bar. It provides an easy markup to create the [Bootstrap navbar](http://getbootstrap.com/components/#navbar)
```html
<div mw-menu-top-bar>
  <img src="PATH_TO_LOGO_IMG"> <!-- header image -->
  <div mw-menu-top-entries>
    <div mw-menu-entry 
         label="Start"> <!-- dropdown entry with sub entries -->
      <div mw-menu-entry 
           url="#/start"
           label="Index"> <!-- dropdown sub entry -->
      </div>
      <div mw-menu-entry
           url="#/start/details"
           label="Details">
      </div>
    </div>
    <div mw-menu-entry 
         url="#/start/new"
         label="New"> <!-- normal entry without sub entries-->
    </div>
  </div>
</div>
```

## Bug Fixes
### Form Module
Fixed missing leave confirmation for form. The leave confirmation should be displayed when the user made changes in a form
and tries to leave the form (e.g. by navigting to a different page) without submitting the changes.
The form leave confirmation is available as a directive called mw-form-leave-confirmation that can be applied
on form elements
```html
<form mw-form-leave-confirmation></form>
```

### Backbone Module 
- Fixed collection selectable performance issue. Internal change listeners on the selection state of the model where registered multiple times.
- Fixed collection selectable wrong reference issue when calling preSelectCollection. The reference was not updated to the model in the actual collection.

### Input Module
- Fixed mw-select-box directive to also work in Firefox. Previously it was not possible to select an item in Firefox
 

# v1.0.5
## Features
### i18n Module
It is now possible to define a `basePath` for i18n locales and resources.
This can be useful when you want to overwrite translations of the uikit or 
add new translations for locales that are not supported by the uikit.
To do so you can simply overwrite the resource path of an uikit translation.
Each module has a i18n folder when it has directives that include a text.

If you want to replace the translation e.g. of the `mw-list` module copy the 
i18n folder into your directory of choice. After that you have to overwrite the
existing resource with your new basePath. 

To do so call the the method 
`i18nProvider.addResource('mw-list/i18n', 'PATH_TO_YOUR_NEW_DIRECTORY')` 
during the angular config phase.
In the run phase it will fetch the translations for `mw-list` by making a 
`$templateRequest` to the path `PATH_TO_YOUR_NEW_DIRECTORY/mw-list/i18n/{locale}.json`.

If you want to replace all translations of the uikit you have to repeat the steps for all 
uikit modules

### Modal module
The modal prepare method got a new option called `dismissible`. It is set to true by default.
If it is set to false the modal can not be closed  by clicking on the backdrop or by hitting escape.
```
Modal.prepare({
 templateUrl: 'PTH_TO_TEMPLATE.html',
 controller: 'CONTROLLER_NAME',
 dismissible: [true|false]     
});
```

# v1.0.4
## Bug Fixes
### Mw List Module
- Fixed bug that the wrong link was executed when double clicking on a row. 
This happened when not every row had a mw-listable-link-show-bb` directive`
Bug is fixed and a double click will execute the correct link. 

# v1.0.3
## Features
### Modal Module
- Modal got a function to watch its scope attributes. It is not recommended to call `modal.getScope()` and add a watcher 
because the scope will be destroyed on hide so the watchers are gone. If you want to watch on scope attributes
use the `modal.watchScope(expression, callback)`. It delegates to the angular `scope.$watch` and ensures that you will 
always watch on the right scope.

# v1.0.2
## Features
### Ui Module
- The directive `mw-hide-on-request` was added to hide the transcluded content and show a spinner as long
as the backbone model or collection is syncing
    ```html
    <div mw-hide-on-reqeust="backboneModel">
      Content that sould be hidden while the model is beeing synched
     </div>
    ``` 

# v1.0.1
## Bugfixes
### List module
- The loading spinner of `mw-list-footer` will be only displayed when the collection is fetching data
and has a next page (#19)

## Features
### Backbone Module
- Collection got a request method that works as the request method of the model. 
This method can make plain ajax request that are not bound to the collection url.
- You can define a `hostName` and a `basePath` that should be used by the 
collections and models to generate the url for the remote calls.
The `hostName` and `basePath` can be defined globally by setting 
`mwUI.Backbone.hostName` and `mwUI.Backbone.basePath` and the attribute 
can be overwritten per `Model` and `Collection`

### Modal Module
- Modal can be configured with controllerAs that is exposed to the modal template
- Modal can be configured with preresolvers. All preresolvers will be resolved and injected into the controller
before the modal is opened
- Modal triggers the following events: 
    - $modalOpenStart
    - $modalResolveDependenciesStart
    - $modalResolveDependenciesSuccess
    - $modalOpenSuccess / $modalOpenError
    - $modalCloseStart
    - $modalCloseSuccess
    
### i18n Module
- Translations can be added during run time. Previously it was only possible to 
define translations in the angular config phase.
Already existing translations for keys will be overwritten.  
    ```
    i18n.extendForLocale('de_DE', {common: {helloWord: 'Hallo Welt'}});
    i18n.extend({de_DE: {common: {helloWord: 'Hallo Welt'}}, en_US: {common: {helloWord: 'Hello World'}}};
    ```

## Breaking Changes
### Backbone Module
- The attribute `baseUrl` is replaced by the new attributes `hostName` and `basePath`

### Utils Module
- The `concatUrlParts` method was moved from the `Utils` module 
into the `Backbone` module.
You have to call `mwUI.Backbone.Utils.concatUrlParts` 
instead of `window.mwUI.Utils.shims.concatUrlParts`