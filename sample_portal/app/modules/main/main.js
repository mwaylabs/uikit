/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Main', [])

  .service('excpHandler', function($q, $timeout){
    return function(exception){
      var dfd = $q.defer();
      $timeout(function(){
        console.log(exception);
        dfd.resolve();
      },1000);
      return dfd.promise;
    };
  })

  .config(function ($routeProvider, i18nProvider, mwIconProvider, exceptionHandlerModalProvider) {

    i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
    i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');

    exceptionHandlerModalProvider.setModalOptions({
      successCallback: 'excpHandler'
    });

    $routeProvider

      .when('/', {redirectTo: '/start'});

    mwIconProvider.addIconSet({
      id: 'fa',
      classPrefix: 'fa',
      iconsUrl:'modules/main/icons/fa.json'
    });

  })

  .run(function($rootScope, $location, i18n){
    $rootScope.goTo = function(path){
      $location.path(path);
    };

    i18n.setLocale('de_DE');
  });