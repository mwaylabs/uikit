# mwUI.Backbone.Filter
The filter is used by the [filterable](./filterable_doc.md) of the collection to generate query params 
that are send to the server. 
The server should filter the response accordingly.

## Example
```
var filter = new mwUI.Backbone.Filter();
var nameFilter = filter.string('name','peter');

 => {type: "string", fieldName: "name", value: "peter"}
```
 If you want to combine filter you can use the `logOp` operator or
 the `and` or `or` that are delegating to the `logOp`.
 For example when you have a searchbar and you want to have all items
 that have the query string in the `givenName` or in the `lastName` you
 can do the following:
 ```
 var filter = new mwUI.Backbone.Filter();
 var givenNameFilter = filter.string('givenName','peter');
 var lastNameFilter = filter.string('lastName','peter');
 var combinedFilter = filter.or([givenNameFilter,lastNameFilter])
 
 => Object {type: "logOp", operation: "OR", filters: [
   {type: "string", fieldName: "givenName", value: "peter"},
   {type: "string", fieldName: "lastName", value: "peter"}
 ]}
 ```
