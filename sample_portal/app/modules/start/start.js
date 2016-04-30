/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start', [])

  .config(function($routeProvider, $injector, i18nProvider, mwSidebarMenuProvider, mwIconProvider){

    $routeProvider
      .when('/start', {
        templateUrl: 'modules/start/templates/index.html',
        controller: 'StartIndexController',
        controllerAs: 'SICtrl',
        resolve: $injector.get('StartIndexControllerResolver'),
        cssClasses: 'apps index'
      });

    i18nProvider.addResource('modules/start/i18n');

    mwSidebarMenuProvider.getMenu().add({
      id: 'entry_1',
      label: 'JO',
      subEntries: [
        {
          id: 'entry_deep_1',
          url: '/start/entry',
          label: 'JO Deep',
          activeUrls: ['/start']
        },
        {
          id: 'entry_deep_2',
          url: '/start/entry_2',
          label: 'JO Deep 2'
        }
      ]
    });

    mwSidebarMenuProvider.getMenu().addEntry('xyz','/xyz','xyz');
    mwSidebarMenuProvider.setLogoUrl('/modules/main/assets/logo.png');

    mwIconProvider.register({
      id: 'fa',
      icons: {
        BLUE_TOOTH: 'fa-bluetooth',
        ANCHOR: 'fa-anchor',
        USER: 'fa-user'
      }
    });

    mwIconProvider.register({
      id: 'rln',
      fileUrl: 'modules/start/assets/icons.json'
    });

  });