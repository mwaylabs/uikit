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