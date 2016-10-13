angular.module('mwUI.Relution', [
  'mwUI',
  'ngSanitize',
  'mwCollection',
  'mwListable',
  'mwForm',
  'mwFormBb',
  'mwComponents',
  'mwComponentsBb',
  'mwSidebar',
  'mwSidebarBb',
  'mwFormValidators',
  'mwNav',
  'mwPopover',
  'mwHelper',
  'mwMap',
  'mwFilters',
  'mwFileUpload'
]).config(function(mwIconProvider, mwValidationMessagesProvider){
  'use strict';

  mwIconProvider.getIconSet('mwUI').replaceIcons({
    cross: 'rln-icon close_cross',
    question: 'rln-icon support'
  });

  mwValidationMessagesProvider.registerValidator('hex','errors.hex');
  mwValidationMessagesProvider.registerValidator('unique','errors.notUnique');
  mwValidationMessagesProvider.registerValidator('match','errors.doesNotMatch');
  mwValidationMessagesProvider.registerValidator('emailOrPlaceholder','errors.emailOrPlaceholder');
  mwValidationMessagesProvider.registerValidator('itunesOrHttpLink','errors.itunesOrHttpLink');

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

var shownDeprecationWarnings = [];
window.uiDeprecationWarning = function(message){
  if(shownDeprecationWarnings.indexOf(message) === -1){
    console.warn(message);
    shownDeprecationWarnings.push(message);
  }
};