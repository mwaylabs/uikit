# 1.0.2
## Features
### Backbone Module
- Collection got a request method that works as the request method of the model. 
This method can make plain ajax request that are not bound to the collection url.
- You can define a `hostName` and a `basePath` that should be used by the 
collections and models to generate the url for the remote calls.
The `hostName` and `basePath` can be defined globally by setting 
`mwUI.Backbone.hostName` and `mwUI.Backbone.basePath` and the attribute 
can be overwritten per `Model` and `Collection`

## Breaking Changes
### Backbone Module
- The attribute `baseUrl` is replaced by the new attributes `hostName` and `basePath`

### Utils Module
- The `concatUrlParts` method was moved from the `Utils` module 
into the `Backbone` module.
You have to call `mwUI.Backbone.Utils.concatUrlParts` 
instead of `window.mwUI.Utils.shims.concatUrlParts`