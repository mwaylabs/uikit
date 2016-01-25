/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Main', [])

  .config(function ($routeProvider, i18nProvider) {

    i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
    i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');

    $routeProvider

      .when('/', {redirectTo: '/start'});

  })

  .run(function($rootScope, $location, i18n){
    $rootScope.goTo = function(path){
      $location.path(path);
    };

    i18n.setLocale('de_DE');
  });