# mwUI.Backbone

This module makes the model and colelction provided byBackboneJS compatible 
with AngularJS and offers extra BackboneJS functionalities like a nested model, 
a selectable and a filterable.

## Content
- collection
    - [filter](./collection/filter_doc.md)
    - [filterable](./collection/filter_doc.md)
    - filterable collection
    - mw collection
    - selectable
    - selectable collection
- directives
    - mw collection
    - mw model
- model
    - mw model
    - nested model
    - selectable
    - selectable model
    
## Dependencies to other modules
None     

## Why should I use BackboneJS for my AngularJS project
You may asking why adding another dependency to your project.
Sure angular offers its `$http service to make ajax requests to obtain data
from an API. 
But when working with a REST-ful API you will find yourself copying the
same boilerplate code from service to service:
```
angular.module('myApp')
  .factory('Resource', function($http){
     var apiUrl = '/resources'
     return {
         getResources: function(){
           return $http.get(apiUrl)
         },
         getResource: function(id) {
           return $http.get(apiUrl+'/'+id);
         },
         create: function(resource) {
           return $http.post(apiUrl, resource);
         },
         update: function(resource) {
           return $http.put(apiUrl+'/'+resource.id, resource);
         },
         delete: function(id){
           return $http.delete(apiUrl+'/'+id);
         }
     }
  });
```
Those are the typical actions that your application will most likely perform
when it deals with data from an external resource.
As soon as you start repetitiously copy boilerplate code something is 
rotten in your application architecture.


The solution for this boilerplate code is to use the model and collection
provided by BackboneJS.

## Advantages of using BackboneJS
First of all your boilerplate code will disappear. The models and 
collections of BackboneJS are made for REST APIs. 
The code from above will become this:
```
var Resource = Backbone.Model.extend({
  urlRoot: '/resources'
});

var Resources = Backbone.Collection.extend({
  url: '/resources'
  model: Resource
});
```

The angular service returns just plain json objects that it has obtained 
from the external resource. It does not keep track of the data, it just 
returns it to whoever has asked for it.
Imagine the case you have a user object and you 
want to have a function that returns the full name of the user 
`firstname lastname`. You would either deal with it in the template directly 
or add a function to your service that looks like this:
```
angular.module('myApp')
  .factory('User', function($http){
     var apiUrl = '/users'
     return {
         getUsers: function(){...},
         getUser: function(id) {...},
         create: function(user) {...},
         update: function(user) {...},
         delete: function(id){...},
         getFullName: function(user){
           return user.firstname + ' ' + user.lastname 
         }
     }
  });
```
You always need to pass the user object into the `getFullName` function 
so the function can concat the `firstname` with the `lastname`.
However the BackboneJS model keeps track of its data so you can do it the object
oriented way. You can add a method that does not need any arguments 
because it already has the required data:
```
var User = Backbone.Model.extend({
  urlRoot: '/resources'
  getFullName: function(){
    return this.get('firstname') + ' ' + this.get('lastname');
  }
});
```
By using BackboneJS the data logic is extracted from any angular logic.
A new layer is born—the data layer.
AngularJS is still responsible for any ui logic but the data will be provided 
by the BackboneJS powered data layer.
You can rip out this data layer from you AngularJS application and use it for
other applications as well. The data layer can be seen as a small 
JavaScript SDK for your API.
More information to that topic can be found in this [blogpost](http://blog.mwaysolutions.com/2015/05/07/backbonejs-meets-angularjs/)