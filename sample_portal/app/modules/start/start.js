/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start', [])

  .config(function($routeProvider, $injector, i18nProvider){

    i18nProvider.addResource('modules/start/i18n');

    $routeProvider
      .when('/start', {
        templateUrl: 'modules/start/templates/index.html',
        controller: 'StartIndexController',
        resolve: $injector.get('StartIndexControllerResolver'),
        cssClasses: 'apps index'
      });

  });