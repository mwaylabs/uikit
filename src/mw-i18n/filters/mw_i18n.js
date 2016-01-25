angular.module('mwUI.i18n')

  .filter('i18n', function (i18n) {

    function i18nFilter(translationKey, placeholder) {
      if (_.isString(translationKey)) {
        return i18n.get(translationKey, placeholder);
      } else if(_.isObject(translationKey)){
        return i18n.localize(translationKey);
      }
    }

    i18nFilter.$stateful = true;

    return i18nFilter;
  });