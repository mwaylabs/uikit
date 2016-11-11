# 1.0.2
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

## Breaking Changes
### Backbone Module
- The attribute `baseUrl` is replaced by the new attributes `hostName` and `basePath`

### Utils Module
- The `concatUrlParts` method was moved from the `Utils` module 
into the `Backbone` module.
You have to call `mwUI.Backbone.Utils.concatUrlParts` 
instead of `window.mwUI.Utils.shims.concatUrlParts`