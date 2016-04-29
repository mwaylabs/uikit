/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start', [])

  .config(function($routeProvider, $injector, i18nProvider, ResponseHandlerProvider){

    i18nProvider.addResource('modules/start/i18n');

    $routeProvider
      .when('/start', {
        templateUrl: 'modules/start/templates/index.html',
        controller: 'StartIndexController',
        controllerAs: 'SICtrl',
        resolve: $injector.get('StartIndexControllerResolver'),
        cssClasses: 'start index'
      })

      .when('/start/details', {
        templateUrl: 'modules/start/templates/show.html',
        controller: 'StartDetailsController',
        controllerAs: 'SDCtrl',
        resolve: $injector.get('StartDetailsControllerResolver'),
        cssClasses: 'start details'
      });

    ResponseHandlerProvider.registerAction('*/start/i18n/*',function(rsp){
      console.log('i18n file retrieved!', rsp.data)
    },{
      methods: ['GET'],
      onSuccess: true
    })

  });