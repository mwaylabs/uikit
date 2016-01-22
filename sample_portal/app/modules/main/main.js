/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Main', [])

  .config(function ($routeProvider) {

    $routeProvider

      .when('/', {redirectTo: '/start'});

  })

  .run(function($rootScope, $location){
    $rootScope.goTo = function(path){
      $location.path(path);
    };
  });