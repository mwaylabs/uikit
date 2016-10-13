'use strict';
window.mwUI.Utils.shims.domObserver = function (el, callback, config) {

  var observer = new MutationObserver(function (mutations) {
      callback.call(this, mutations);
    }),
    node = (el instanceof angular.element) ? el[0] : el;

  config = config || {
      attributes: true,
      childList: true, characterData: true
    };

  observer.observe(node, config);

  return observer;
};