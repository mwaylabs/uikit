(function(root, angular){
  'use strict';

  angular.module('mwUI', [
    'ngSanitize',
    'mwModal',
    'mwWizard',
    'mwCollection',
    'mwListable',
    'mwListableBb',
    'mwForm',
    'mwFormBb',
    'mwComponents',
    'mwComponentsBb',
    'mwTabs',
    'mwSidebar',
    'mwSidebarBb',
    'mwFormValidators',
    'mwNav',
    'mwPopover',
    'mwHelper',
    'mwMap',
    'mwI18n',
    'mwResponseHandler',
    'mwResponseToastHandler',
    'mwFilters',
    'mwFileUpload'
  ]).config(function(){

    window.requestAnimFrame = (function () {
      return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    window.ieVersion = (function () {
      if (new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(navigator.userAgent) !== null) {
        return parseFloat(RegExp.$1);
      } else {
        return false;
      }
    })();

  });

  root.mwUI = {};

  // @include ./mwBackbone/mw_backbone.js

  // @include ./mwFileUpload/mwFileUpload.js
  // @include ./mwFileUpload/mwMimeType.js

  // @include ./filters.js
  // @include ./mwComponents.js
  // @include ./mwComponentsBb.js
  // @include ./mwDatePicker.js
  // @include ./mwForm.js
  // @include ./mwFormBb.js
  // @include ./mwFormValidators.js
  // @include ./mwHelper.js
  // @include ./mwI18n.js
  // @include ./mwListable.js
  // @include ./mwListableBb.js
  // @include ./mwListCollection.js
  // @include ./mwListCollectionFilter.js
  // @include ./mwMap.js
  // @include ./mwModal.js
  // @include ./mwNav.js
  // @include ./mwPopover.js
  // @include ./mwResponseHandler.js
  // @include ./mwResponseToastHandler.js
  // @include ./mwSidebar.js
  // @include ./mwSidebarBb.js
  // @include ./mwTabs.js
  // @include ./mwToast.js
  // @include ./mwWizard.js

})(window, angular);