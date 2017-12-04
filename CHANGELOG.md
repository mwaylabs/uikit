# v1.21.3
## Features
### Ui components module
- Keep tab content in the DOM by default. For complex tab content the attribute `removeInactiveContent` on
`mwTabs` can be set to true. The default behaviour in gerenral is a bit faster during the initialisation but may slow down
the general performance because the content wit h all its listeners stays in the dom.

## Bug Fixes
### Menu module
- Fix #182: Menuentry is not hidden when it is removed during menu initialisation

# v1.21.2
## Features
### Utils module
- Urls query params that are set by the `mwUrlStorage` won't be put into the navigation history by default.
So when calling `mwUrlStorage.setItem('key','value')` it will append the query prams to the url but not create a
history entry. When using the back button you will be moved to the previous url. If you want to let the user browse 
through the different query states you can set the options param `keepInHistory`
`mwUrlStorage.setItem('key','value', {keepInHistory: true})`

# v1.21.1
## Bug Fixes
### Ui components module
- Fix bug that tab pane could not be selected by number anymore

# v1.21.0
## Features
### Backbone module
- Trigger Backbone model/collection sync events (`request`, `sync`, `error` ) 
when calling `model.request` or `collection.request
- Set property `isSynchronising` on model/collection on request and unset it when its done

### Ui components module
- `mw-view-change-loader` can be set manually by triggering rootscope events 
`$showViewChangeLoader` and `$hideViewChangeLoader`
- `mwTabPane` was extended with scope property `id` and its possible to select a tab pane from `mwTabBar` by 
setting scope property `activePaneNumber`
- Transcluded content from `mwTabPane` is removed when tab is not selected anymore

### Layout module
- Add `backdrop-filter`to `mwHeader` to blur content beneath it (works only in safari so far)

## Bug Fixes
### Utils module
- Fix mwUrlStorage so it also removes query params from url when they were set to `options.removeOnUrlChange` and remove is called

# v1.20.1
## Features
### List module
- Directive `mw-listable-action` was added to define a custom action that is registered as action column similiar
  to `mw-list-url-action-button` only that you can transclude custom content and define custom function. 
  Custom function is executed on click of the element and when the user double clicks on the row.
  ```html
  <td mw-listable-action="action()">
    <div mw-arrow-button></div> <!-- transclude custom content -->
  </td> 
  ```
  
## Bug Fixes
### List module
- Colspan of action column header is now set correctly. It uses the maximum of registered `mw-listable-action` per row.
  So when the first row registers only one `mw-listable-action` but the second registers two the colspan of the
  action column header element will be set to two

# v1.20.0
## Features
### Utils module
- Adding mwRuntimeStorage service with an api like localstorage to store key, values during runtime
- Adding mwScheduler to run future tasks. mwScheduler can be paused and continued at any time. When paused the execution time 
from tasks will be paused. mwScheduler is paused when window becomes inactive and started when window becomes active again

### Toast module
- Toasts are using mwScheduler for the auto hide logic to fix #168

### Src-Relution module
- Filters, Searchquery and sort order are not persisted in localstorage anymore only in mwRuntimeStorage
- Handling for invalid filters that can not be applied anymore


## Bug Fixes
### List module
- Fix wrong positioned table configurator dropdown when you have scrolled down in the list

# v1.19.2
## Bug Fixes
### List module
- Fix flickering of columns during table initialisation

# v1.19.1
## Features
### Ui components module
- The `mw-collabsable` was extended with two optional attributes `icon` and `tooltip`.
```html
<div mw-collapsable="true" mw-title="Title" tooltip="ABC DEF"> <!-- for helper tooltip -->
```html
<div mw-collapsable="true" mw-title="Title" tooltip="ABC DEF" icon="fa-taxi"><!-- for helper tooltip with custom icon -->
```
When a tooltip is provided but no icon the question circle will be used as icon

## Bug Fixes
### Backbone module
- When reseting a filter of the `Filterable` the pagination will be also reset. (#159)

# v1.19.0
## Features
### List module
- Table rows got a opacity fade in animation to prevent flickering during initialisation when user has 
changed visibility of columns.
- Columns that have been hidden or made visible by the user are now persisted in localstorage so they keep their 
visibility status after reload (#144)

### Src-Relution module
- `mwFileUpload`: Made cancel button visible by default. To hide it set `hideCancelBtn` to `true`.
- `mwFileUpload`: Added some small animations to the uploader.
- `mwFileUpload`: Adjusted text of cancel button to `Abort upload`.

## Bug Fixes
### List module
- Fix #154 by changing the visibility handling of columns. Provided test cases to check functionality

# v1.18.5
## Bug Fixes
### Src-Relution module
- Fix typo in mwMimetype service which prevents uploads with file extension image/jpeg.

# v1.18.4
## Bug Fixes
### Src-Relution module
- Add an additional check to the directive `mw-multi-select-boxes` in the event `addBeforeSave`. 
This will fix an issue when the Backbone object is instantiated but empty. 
The event will now no longer add this empty object to the collection.

# v1.18.3
## Bug Fixes
### Src-Relution module
- Extend the directive `mw-multi-select-boxes` by listening to the event `addBeforeSave`. 
If the event gets triggered by the mwListCollection, the last selected element will be added to the list, even when the 
user didn't clicked on the add button.

# v1.18.2
## Bug Fixes
### Src-Relution module
- Fixes the directive `mw-file-upload` by adding an optional flag (showCancelButton) to explicitly show the cancel 
button, by default the directive doesn't show the cancel button.
```html
    <div mw-file-upload
          ...
         show-cancel-button="true"> <!-- set the flag to true if you want to cancel the upload -->
    </div>
```
- Extend the directive `mw-file-upload` by adding an optional flag (abortFlag) to abort the current upload from outside 
the directive.
```html
    <div mw-file-upload
          ...
         abort-flag="viewModel.abortFlag"><!-- set the flag to true if you want to cancel the upload -->
    </div>
```

# v1.18.1
## Bug Fixes
### List module
- Fixes the column configurator feature, which was introduced in 1.0.17, by adding a configuration flag to enable it. 
The feature is now deactivated by default to ensure the backwards compatibility. 
It can be enabled for every single list by adding the ```enable-configurator="true"``` flag.
```html
   <table mw-listable-bb
          collection="ctrl.heroes"
          enable-configurator="true">
        ...
   </table>
```

# v1.18.0
## Features
- Change version number pattern from MAJOR.0.MINOR to match the Semantic Versioning Specification (SemVer) pattern (MAJOR.MINOR.PATCH). 
-- This will fix the versioning syntax in bower.json when version ranges are used.

# v1.0.17
## Features
### List module
- The columns of a table are now configurable. The user can now select columns that should be (not) visible. You can
add optional columns by adding the attribute `hidden` to the `mw-listable-header-bb` directive. 
It is also possible to configure optional columns per 
bootstrap breakpoint `xs`, `sm`, `md`, `lg` by passing them as array into the `hidden` attribute. 
Optional columns will be only visible when the user selects them or they don't match the active breakpoint. 
If you have columns that are mandatory and shall not be unselected you can set the attribute `mandatory`
  ```html
   <table mw-listable-bb
             collection="ctrl.heroes">
        <thead>
        <tr mw-listable-header-row-bb>
          <th mw-listable-header-bb
              width="30%"
              mandatory="true"> <!-- is mandatory and user can not unselect this column -->
            {{'hero.name' | i18n}} <!-- this is the text that will be displayed in the column configurator because no title was defined -->
          </th>
          <th mw-listable-header-bb
              sort="abc"
              title="Description" <!-- this is the text that will be displayed in the column configurator -->
              hidden <!-- is not visible for all breakpoints unless user selects column to be visible -->
              width="30%">
            {{'hero.description' | i18n}}
          </th>
          <th mw-listable-header-bb
              hidden="['xs', 'sm']" <!-- is not visible when the breakpoint xs or sm is active (smartphones, tablets) -->
              width="40%">
            {{'hero.superPowers' | i18n}}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr mw-listable-body-row-bb
            ng-repeat="item in ctrl.heroes.models">
          ...
        </tr>
        </tbody>
      </table>
  ```
  The `mw-listable-header-row-bb` automatically adds a button that lets the user configure the visiblity of all columns. The
  column name is automatically generated either by using the title attribute or the transcluded text

### Src-Relution module
- The directive `mw-file-upload` was extended with the attribute `has-drop-zone="true|false"` to disable the dropzone
where the user can drop a file. By default the dropzone is turned on.
- The directive `mw-file-upload` got a cancel button to abort uploads. The button is visible when an upload is in progress
- The directive `mw-file-upload` was restyled and displays the file name that is uploaded. It also got translations for
the locales de_DE and en_US.

# v1.0.16
## Features
### Layout module
- Back button of `mw-header` is now more visible by adding a border around it (#126)
- A refresh icon was added to the `mw-header` to make a soft page refresh

## Bug Fixes
### Menu module
- Fixed bug that menu did not close when changing screen size or changing the route in mobile mode (#131)

### Ui components module
- Fixed wrong initial state of `mwCollapsable` when content was not available during initialisation (#136)

### Src-Relution module
- Fixed exception when filter attribute of filterable is not available (#137). When this happens e.g when the user changes
the url query param manually the whole filter will be reset 

# v1.0.15
## Features
### Layout module
- Support pages without `mwHeader`
- Handle style when no `mwMenuTopBar` is available

### Modal module
- Modaloptions was extended with size property so a modal size can be configured:
  - DEFAULT: Default bootstrap modal size
  - BIGGER: Takes almost whole window, max size 1024px
  - LARGE: Takes almost whole window without a max size
  - FULLSCREEN: Takes the whole window
  ```
  Modal.prepare({
   templateUrl: 'PTH_TO_TEMPLATE.html',
   controller: 'CONTROLLER_NAME',
   size: mwUI.Modal.Sizes.DEFAULT|BIGGER|LARGE|FULLSCREEN 
  });
  ```
  
### Ui components module
- Hardcoded `max-height` of `mwCollapsable` was removed and is now calculated during runtime. It also allows transcluded 
content to grow in height.
- `mwOptionsGroup` was extended with the optional attribute `badges` that can be an array of strings. They will be displayed
as badges right next to to the title

### Src-Relution module
- `mwFileUpload` directive registers error message for `mwInputWrapper` when mime-type is invalid.

## Bug Fixes
### List module
- Fixed issue that reset button did not work when the search input was focused
- Responsive mode of `mwListHead` was adjusted so the clear search button is not floating around in the middle of the view. 
  Instead the reset button will replace the search icon as soon as there is a input value.
### Modal module
- Fixed overflow issue in modal body. When the content is wider then the modal it can be scrolled horizontally
### Src-Relution module
- Fixed duplicate is required error message in `mwFileUpload` directive
- Remove `icon-` prefix of relution font icons because font was updated

# v1.0.14
## Features
### Backbone module
- Selectable was extended with the public method `setSingleSelection(true|false)` to change the selection mode.
It also allows to set single selection to true even though the attribute `preSelected` is a collection.

# v1.0.13
## Features
### Utils module
- Service `mwUrlStorage` was added to store runtime vars in url e.g. for deeplinking. Call 
`mwUrlStorage.setItem('key','value')` to store a variable in the url. Will be available also after route change.

### Ui Components module
- `mwTabs` directive got attribute `tabChanged` to register a callback when a tab has been changed

## Fixes
### Src-Relution Module
- `mwFileUpload` directive checks whether model is instance of `Backbone.Model` instead of `mCAP.Model`

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
