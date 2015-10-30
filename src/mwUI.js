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
  'mwFilters'
]).config(function(){
  'use strict';
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