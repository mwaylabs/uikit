'use strict';

angular.module('mwComponents', ['ngSanitize','btford.markdown','mwUI.Utils'])

  .directive('mwTextCollapse', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        mwTextCollapse: '@',
        length: '=',
        markdown: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwTextCollapse.html',
      link: function (scope) {
        // set default length
        if (scope.length && typeof scope.length === 'number') {
          scope.defaultLength = scope.length;
        } else {
          scope.defaultLength = 200;
        }

        // set start length for filter
        scope.filterLength = scope.defaultLength;

        // apply filter length to text
        scope.text = function () {
          return $filter('reduceStringTo')(
            scope.mwTextCollapse, scope.filterLength
          );
        };

        // show Button if text is longer than desired
        scope.showButton = false;
        if (scope.mwTextCollapse.length > scope.defaultLength) {
          scope.showButton = true;
        }

        // set button to "show more" or "show less"
        scope.showLessOrMore = function () {
          if (scope.filterLength === scope.defaultLength) {
            return 'common.showMore';
          } else {
            return 'common.showLess';
          }
        };

        // collapse/expand text by setting filter length
        scope.toggleLength = function () {
          if (scope.filterLength === scope.defaultLength) {
            delete scope.filterLength;
          } else {
            scope.filterLength = scope.defaultLength;
          }
        };
      }
    };
  })

  /**
   * @ngdoc directive
   * @name mwComponents.directive:mwFilterableSearch
   * @element div
   * @description
   *
   * Creates a search field to filter by in the sidebar. Search is triggered on keypress 'enter'.
   *
   * @param {filterable} filterable Filterable instance.
   * @param {expression} disabled If expression evaluates to true, input is disabled.
   * @param {string} property The name of the property on which the filtering should happen.
   */
  .directive('mwFilterableSearch', function ($timeout, $animate, Loading, Detect) {
    return {
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@'
//        loading: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwFilterableSearch.html',
      link: function (scope, elm) {
        $animate.enabled(false, elm.find('.search-indicator'));
        scope.model = scope.filterable.properties[scope.property];
        scope.inputLength = 0;
        scope.isMobile = Detect.isMobile();

        var timeout;

        var search = function () {
          return scope.filterable.applyFilters();
        };

        var throttler = function () {
          scope.searching = true;

          $timeout.cancel(timeout);

          timeout = $timeout(function () {

            search().then(function () {
              $timeout.cancel(timeout);
              scope.searching = false;
            }, function () {
              scope.searching = false;
            });

          }, 500);
        };

        scope.search = function (event) {

          if (!event || event.keyCode === 13) {
            search();
          } else {

            if (!scope.isMobile) {
              throttler();
            }
          }
        };

        scope.reset = function () {
          scope.model.value = '';
          search();
        };
      }
    };
  })

  .service('mwMarkdown', function () {
    var converter = new window.showdown.Converter({
      headerLevelStart: 3,
      smoothLivePreview: true,
      extensions: [function () {
        return [
          // Replace escaped @ symbols
          {type: 'lang', regex: '•', replace: '-'},
          {
            type: 'lang', filter: function (text) {
            return text.replace(/https?:\/\/\S*/g, function (link) {
              return '<' + link + '>';
            });
          }
          }
        ];
      }]
    });
    return {
      convert: function (val) {
        return converter.makeHtml(val);
      }
    };
  })


  .directive('mwMarkdownPreview', function () {
    return {
      scope: {
        mwModel: '=mwMarkdownPreview'
      },
      templateUrl: 'uikit/templates/mwComponents/mwMarkdownPreview.html',
      link: function (scope, elm) {
        elm.addClass('mw-markdown-preview');
      }
    };
  })


  .directive('mwMarkdown', ['$sanitize', 'mwMarkdown', function ($sanitize, mwMarkdown) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        var convertText = function(text){
          try {
            var html = text ? $sanitize(mwMarkdown.convert(text)) : '';
            element.html(html);
          } catch (e) {
            element.text(text);
          }
        };

        if (attrs.mwMarkdown) {
          scope.$watch(attrs.mwMarkdown, function (newVal) {
            convertText(newVal);
          });
        } else {
          convertText(element.text());
        }
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwModal.directive:mwModalOnEnter
   * @element button
   * @description
   * Adds ability to trigger button with enter key. Checks validation if button is part of a form.
   */
  .directive('mwModalOnEnter', function (validateEnterKeyUp) {
    return {
      restrict: 'A',
      require: '?^form',
      link: function (scope, elm, attr, ctrl) {
        elm.parents('.modal').first().on('keyup', function (event) {
          validateEnterKeyUp.clickIfValid(elm, event, ctrl);
        });
      }
    };
  })

  .service('validateEnterKeyUp', function () {
    return {
      clickIfValid: function (element, event, controller) {
        if (event.keyCode === 13 && event.target.nodeName !== 'SELECT' && !event.isDefaultPrevented()) {
          if ((controller && controller.$valid) || !controller) {
            element.click();
          }
        }
      }
    };
  });
