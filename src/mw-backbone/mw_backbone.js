/**
 * Created by zarges on 15/02/16.
 */
window.mwUI.Backbone = {
  baseUrl: '',
  Selectable: {},
  concatUrlParts: function () {
    var concatUrl = '';
    _.forEach(arguments, function (url) {
      url = url.replace(/^\//, '');
      url = url.replace(/\/$/, '');
      concatUrl += ( url + ('/') );
    });
    return concatUrl;
  }
};

angular.module('mwUI.Backbone', []);


// @include ./model/nested_model.js
// @include ./model/selectable.js
// @include ./model/selectable_model.js
// @include ./model/mw_model.js

// @include ./collection/filter.js
// @include ./collection/filterable.js
// @include ./collection/filterable_collection.js
// @include ./collection/selectable.js
// @include ./collection/selectable_collection.js
// @include ./collection/mw_collection.js

// @include mw_backbone_config.js