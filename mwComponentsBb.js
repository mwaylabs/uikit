'use strict';

angular.module('mwComponentsBb', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwPanel
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#panels Bootstraps Panel}.
 *
 * @param {string} mwPanel Panel title
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-panel="Panel title">
 *      Panel content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwPanelBb', function () {
    return {
      restrict: 'A',
      replace: true,
      require: '^?dashboardModule',
      scope: {
        title: '@mwPanel'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwPanel.html',
      link: function(scope, elm, attr, ctrl){
        if(ctrl){
          scope.isDashboardModule = true;
          scope.showCloseButton = ctrl.numberOfModules > 1;
          scope.closeModule = ctrl.closeModule;
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwSortIndicator
 * @element span
 * @description
 *
 * Displays a sort indicator. Arrow up when sort is active and not reversed arrow down vise versa.
 *
 * @param {boolean} isActive display an arrow up or down when true otherwise an up and down arrow
 * @param {boolean} isReversed display an arrow up or down
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-sort-indicator is-active="true" is-reversed="false"></div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwSortIndicatorBb', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        isActive: '=',
        isReversed: '='
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwSortIndicator.html'
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwAlert
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#alerts Bootstraps Alert}.
 *
 * @param {string} mwAlert Alert type. Can be one of the following:
 *
 * - warning
 * - danger
 * - success
 * - info
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-alert="warning">
 *      Alert content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwAlertBb', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '@mwAlert'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwAlert.html'
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwHeader
 * @element div
 * @description
 *
 * Header bar for content pages.
 *
 * @param {string} title Header title
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-header title="A nice page">
 *      Header content, Buttons etc...
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwHeaderBb', function ($location, $route) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        showBackButton: '@',
        warningText: '@',
        warningCondition: '='
      },
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwHeader.html',
      link: function (scope, el, attrs, ctrl, $transclude) {

        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.navbar-header').addClass('no-buttons');
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        scope.back = function () {
          if (attrs.url) {
            $location.path(attrs.url);
          } else {
            window.history.back();
          }
        };

        if (scope.warningText) {
          el.find('.header-popover').popover({
            trigger: 'hover',
            placement: 'bottom',
            container: el.find('.popover-container')
          });
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwIcon
 * @element span
 * @description
 *
 * Wrapper for bootstrap glyphicons.
 *
 * @param {string} mwIcon Glyphicon class suffix. Example suffix for 'glyphicon glyphicon-search' is 'search'
 * @param {string} tooltip Optional string which will be displayed as a tooltip when hovering over the icon
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-icon="search"></span>
 *    <span mw-icon="search" tooltip="This is a tooltip"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwIconBb', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: { mwIcon: '@'},
      template: function (elm, attr) {
        var isBootstrap = angular.isArray(attr.mwIcon.match(/^fa-/));
        if (isBootstrap) {
          return '<i class="fa {{mwIcon}}"></i>';
        } else {
          return '<span class="glyphicon glyphicon-{{mwIcon}}"></span>';
        }
      },
      link: function (scope, el, attr) {
        if (attr.tooltip) {
          el.popover({
            trigger: 'hover',
            placement: 'bottom',
            content: attr.tooltip,
            container: 'body'
          });

          attr.$observe('tooltip', function (newVal) {
            el.popover('destroy');
            el.popover({
              trigger: 'hover',
              placement: 'bottom',
              content: newVal,
              container: 'body'
            });
          });
        }

      }
    };
  })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:rlnTooltip
 * @element span
 *
 * @description
 * Creates a tooltip element using Bootstraps popover component.
 *
 * @param {String} mwTooltip Content of the tooltip
 *
 * @example
 <span mw-tooltip="foobar"></span>
 */
  .directive('mwTooltipBb', function () {
    return {
      restrict: 'A',
      scope: {
        text: '@mwTooltip'
      },
      template: '<span mw-icon="question-sign" tooltip="{{ text }}"></span>',
      compile: function (elm, attr) {
        if (attr.mwTooltipIcon) {
          elm.find('span').attr('mw-icon', attr.mwTooltipIcon);
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwBadge
 * @element span
 * @description
 *
 * Wrapper for bootstrap labels.
 *
 * @param {string} mwBadge label class suffix. Example: suffix for 'label label-info' is 'search'
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-badge="info"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwBadgeBb', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: { mwBadge: '@' },
      transclude: true,
      template: '<span class="mw-badge label label-{{mwBadge}}" ng-transclude></span>'
    };
  })

  .directive('mwEmptyStateBb', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: { mwBadge: '@' },
      transclude: true,
      template: '<div class="mw-empty-state"> <img src="images/logo-grey.png"><h2 ng-transclude class="lead"></h2> </div>'
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
  .directive('mwFilterableSearchBb', function ($timeout, Loading, Detect) {
    return {
      transclude: true,
      scope: {
        collection: '=',
        property: '@',
        customUrlParameter: '@',
        mwDisabled: '='
      },
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwFilterableSearch.html',
      link: function (scope) {

        scope.inputLength = 0;
        scope.isMobile = Detect.isMobile();

        var timeout;

        var search = function () {
          return scope.collection.fetch();
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

            if(!scope.isMobile){
              throttler();
            }
          }
        };

        scope.reset = function () {
          if(scope.customUrlParameter) {
            scope.collection.filterable.customUrlParams[scope.customUrlParameter] = '';
          } else {
            scope.collection.filterable.filterValues[scope.property] = '';
          }
        };

        scope.hideSearchIcon = function() {
          if(!scope.collection){
            return false;
          }
          var filterable = scope.collection.filterable;
          if(scope.searching || scope.isMobile) {
            return true;
          }
          return scope.customUrlParameter ? filterable.customUrlParams[scope.customUrlParameter].length > 0 : filterable.filterValues[scope.property].length > 0;
        };

        scope.showResetIcon = function() {
          if(!scope.collection || !scope.isMobile){
            return false;
          }
          if(scope.customUrlParameter){
            return scope.collection.filterable.customUrlParams[scope.customUrlParameter].length > 0 && !scope.searching;
          } else {
            return scope.collection.filterable.filterValues[scope.property].length > 0 && !scope.searching;
          }
        };

        Loading.registerDoneCallback(function(){
          scope.loading = false;
        });

        scope.loading = Loading.isLoading();
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwRating
 * @element span
 * @description
 *
 * Converts a rating number into stars
 *
 * @param {number | expression} mwRating rating score
 * @param {number} max the maximun number of stars
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-rating="3"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwRatingBb', function () {
    return {
      restrict: 'A',
      scope: true,
      template: '<i ng-repeat="star in stars" ng-class="star.state" class="fa"></i>',
      link: function (scope, elm, attr) {

        elm.addClass('mw-star-rating');

        scope.stars = [];
        var starsMax = scope.$eval(attr.max);

        var buildStars = function (rating) {
          scope.stars = [];

          rating = (rating > starsMax) ? starsMax : rating;
          rating = (rating < 0) ? 0 : rating;

          for (var i = 0; i < Math.floor(rating); i++) {
            scope.stars.push({state: 'fa-star'});
          }

          if (rating - Math.floor(rating) >= 0.5) {
            scope.stars.push({state: 'fa-star-half-full'});
          }

          while (attr.max && scope.stars.length < starsMax) {
            scope.stars.push({state: 'fa-star-o'});
          }
        };

        attr.$observe('mwRating', function (value) {
          buildStars(scope.$eval(value));
        });

      }
    };
  })


  .directive('mwButtonHelpBb', function (i18n) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm) {
        var popup;
        elm.addClass('mwButtonHelp');
        var helpIcon = angular.element('<div>').addClass('help-icon glyphicon glyphicon-question-sign');
        elm.prepend(helpIcon);

        helpIcon.hover(function () {
          buildPopup();
          var targetOffset = angular.element(this).offset();
          angular.element('body').append(popup);
          popup.css('top', targetOffset.top - (popup.height() / 2) + 10 - angular.element(document).scrollTop());
          popup.css('left', targetOffset.left + 40);
        }, function () {
          angular.element('body > .mwButtonPopover').remove();
        });

        var buildPopup = function () {
          popup = angular.element('<div>' + scope.helpText + '<ul></ul></div>').addClass('mwButtonPopover popover');
          angular.forEach(scope.hintsToShow, function (hint) {
            popup.find('ul').append('<li>' + hint.text + '</li>');
          });
        };

        scope.$watch('hintsToShow', function (newVal) {
          if (newVal.length) {
            helpIcon.show();
          } else {
            helpIcon.hide();
          }
        });

        scope.$on('$destroy', function () {
          if (popup) {
            popup.remove();
          }
        });
      },
      controller: function ($scope) {
        $scope.registeredHints = [];
        $scope.hintsToShow = [];
        $scope.helpText = i18n.get('common.buttonHelp');
        $scope.$on('i18n:localeChanged', function () {
          $scope.helpText = i18n.get('common.buttonHelp');
        });

        var showHelp = function () {
          $scope.hintsToShow = [];
          angular.forEach($scope.registeredHints, function (registered) {
            if (registered.condition) {
              $scope.hintsToShow.push(registered);
            }
          });
        };

        //check if any condition changes
        this.register = function (registered) {
          $scope.$watch(function () {
            return registered.condition;
          }, showHelp);
          $scope.registeredHints.push(registered);
        };


      }
    };
  })

  .directive('mwButtonHelpConditionBb', function () {
    return {
      restrict: 'A',
      require: '^mwButtonHelpBb',
      scope: {
        condition: '=mwButtonHelpCondition',
        text: '@mwButtonHelpText'
      },
      link: function (scope, elm, attr, ctrl) {
        ctrl.register(scope);
      }
    };
  })

  .directive('mwOptionGroupBb', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        mwDisabled: '='
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwOptionGroup.html',
      link: function (scope, el) {
        scope.randomId = _.uniqueId('option_group_');
        el.find('input').attr('id', scope.randomId);
      }

    };
  })


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwToggle
 * @element span
 * @description
 *
 * Displays a toggle button to toggle a boolean value
 *
 * @param {expression} mwModel model
 * @param {function} mwChange the function which should be executed when the value has changed
 *
 */
  .directive('mwToggleBb', function () {
    return {
      scope: {
        mwModel:'=',
        mwDisabled: '=',
        mwChange:'&'
      },
      replace:true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwToggle.html',
      link: function (scope) {

        scope.toggle = function(value){
          if(scope.mwModel !== value){
            scope.mwModel = !scope.mwModel;
            scope.mwChange({value: scope.mwModel});
          }
        };
      }
    };
  });

