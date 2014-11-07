'use strict';

angular.module('mwComponents', [])

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
  .directive('mwPanel', function () {
    return {
      restrict: 'A',
      replace: true,
      require: '^?dashboardModule',
      scope: {
        title: '@mwPanel'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwPanel.html',
      link: function (scope, elm, attr, ctrl) {
        if (ctrl) {
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
  .directive('mwSortIndicator', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        isActive: '=',
        isReversed: '='
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwSortIndicator.html'
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
  .directive('mwAlert', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '@mwAlert'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwAlert.html'
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
  .directive('mwHeader', function ($location, $route, $rootScope) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        showBackButton: '@',
        warningText: '@',
        warningCondition: '='
      },
      templateUrl: 'modules/ui/templates/mwComponents/mwHeader.html',
      link: function (scope, el, attrs, ctrl, $transclude) {

        $rootScope.siteTitleDetails = scope.title;

        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.navbar-header').addClass('no-buttons');
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        scope.back = function () {
          if (scope.url) {
            $location.path(scope.url);
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
  .directive('mwIcon', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        mwIcon: '@',
        placement: '@'
      },
      template: function (elm, attr) {
        var isBootstrap = angular.isArray(attr.mwIcon.match(/^fa-/));
        if (isBootstrap) {
          return '<i class="fa {{mwIcon}}"></i>';
        } else {
          return '<i class="glyphicon glyphicon-{{mwIcon}}"></i>';
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
              placement: scope.placement || 'bottom',
              content: newVal,
              container: 'body'
            });
          });
        }

        if (!scope.mwIcon) {
          scope.$watch('mwIcon', function (newVal) {
            if (newVal) {
              var template,
                isBootstrap = angular.isArray(scope.mwIcon.match(/^fa-/));
              if (isBootstrap) {
                template = '<i class="fa {{mwIcon}}"></i>';
              } else {
                template = '<i class="glyphicon glyphicon-{{mwIcon}}"></i>';
              }
              el.replaceWith($compile(template)(scope));
            }
          });
        }

        scope.$on('$destroy',function(){
          if (attr.tooltip) {
            el.popover('destroy');
          }
        });

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
  .directive('mwTooltip', function () {
    return {
      restrict: 'A',
      scope: {
        text: '@mwTooltip',
        placement: '@'
      },
      replace: true,
      template: '<span class="mw-tooltip"><span mw-icon="question-sign" tooltip="{{ text }}" placement="{{ placement }}"></span></span>',
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
  .directive('mwBadge', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: { mwBadge: '@' },
      transclude: true,
      template: '<span class="mw-badge label label-{{mwBadge}}" ng-transclude></span>'
    };
  })

  .directive('mwEmptyState', function () {
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
  .directive('mwFilterableSearch', function ($timeout, Loading, Detect) {
    return {
      transclude: true,
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@'
//        loading: '='
      },
      templateUrl: 'modules/ui/templates/mwComponents/mwFilterableSearch.html',
      link: function (scope) {
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

//        Loading.registerDoneCallback(function(){
//          scope.loading = false;
//        });
//
//        scope.loading = Loading.isLoading();
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
  .directive('mwRating', function () {
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


  .directive('mwButtonHelp', function (i18n) {
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
          popup.css('left', (targetOffset.left + 40));
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

  .directive('mwButtonHelpCondition', function () {
    return {
      restrict: 'A',
      require: '^mwButtonHelp',
      scope: {
        condition: '=mwButtonHelpCondition',
        text: '@mwButtonHelpText'
      },
      link: function (scope, elm, attr, ctrl) {
        ctrl.register(scope);
      }
    };
  })

  .directive('mwOptionGroup', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        mwDisabled: '='
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwOptionGroup.html',
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
  .directive('mwToggle', function ($timeout) {
    return {
      scope: {
        mwModel: '=',
        mwDisabled: '=',
        mwChange: '&'
      },
      replace: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwToggle.html',
      link: function (scope) {
        scope.toggle = function (value) {
          if (scope.mwModel !== value) {
            scope.mwModel = !scope.mwModel;
            $timeout(function () {
              scope.mwChange({value: scope.mwModel});
            });
          }
        };
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwTimeline
 * @element div
 * @description
 *
 * Vertical timeline Is the container element for timeline entries
 *
 */
  .directive('mwTimeline', function () {
    return {
      transclude: true,
      replace: true,
      template: '<div class="mw-timeline timeline clearfix"><hr class="vertical-line"><div class="content" ng-transclude></div></div>'
    };
  })

  .directive('mwTimelineFieldset', function ($q) {
    return {
      scope: {
        mwTitle: '@',
        collapsable: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'modules/ui/templates/mwComponents/mwTimelineFieldset.html',
      controller: function ($scope) {
        $scope.entries = [];
        this.register = function (entry) {
          if (!_.findWhere($scope.entries, {$id: entry.$id})) {
            $scope.entries.push(entry);
          }
        };
        $scope.entriesVisible = true;
        $scope.toggleEntries = function () {
          if (!$scope.collapsable) {
            return;
          }
          var toggleEntryHideFns = [];
          $scope.entries.forEach(function (entry) {
            if ($scope.entriesVisible) {
              toggleEntryHideFns.push(entry.hide());
            } else {
              toggleEntryHideFns.push(entry.show());
            }
          });
          if (!$scope.entriesVisible) {
            $scope.entriesVisible = !$scope.entriesVisible;
          } else {
            $q.all(toggleEntryHideFns).then(function () {
              $scope.entriesVisible = !$scope.entriesVisible;
            });
          }
        };
      }
    };
  })

  .directive('mwTimelineEntry', function ($q) {
    return {
      transclude: true,
      replace: true,
      template: '<li class="timeline-entry"><span class="bubble"></span><div ng-transclude></div></li>',
      scope: true,
      require: '^mwTimelineFieldset',
      link: function (scope, el, attrs, mwTimelineFieldsetController) {
        mwTimelineFieldsetController.register(scope);

        scope.hide = function () {
          var dfd = $q.defer();
          el.fadeOut('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };

        scope.show = function () {
          var dfd = $q.defer();
          el.fadeIn('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };
      }

    };
  })


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwDraggable
 * @description
 *
 * Offers drag and drop functionality on any element. Data can be set with the mwDragData parameter.
 * The drop callback of the mwDroppable element will receive this data.
 *
 */
  .directive('mwDraggable', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDragData: '=',
        //We can not use camelcase because *-start is a reserved word from angular!
        mwDragstart: '&',
        mwDragend: '&',
        mwDropEffect: '@'
      },
      link: function (scope, el) {

        el.attr('draggable', true);
        el.addClass('draggable', true);

        if (scope.mwDragstart) {
          el.on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData('text', JSON.stringify(scope.mwDragData));
            event.originalEvent.dataTransfer.effectAllowed = scope.mwDropEffect;
            $timeout(function () {
              scope.mwDragstart({event: event, dragData: scope.mwDragData});
            });
          });
        }


        el.on('dragend', function (event) {
          if (scope.mwDragend) {
            $timeout(function () {
              scope.mwDragend({event: event});
            });
          }
        });
      }
    };
  })

  .directive('mwDroppable', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDropData: '=',
        mwDragenter: '&',
        mwDragleave: '&',
        mwDragover: '&',
        mwDrop: '&',
        disableDrop: '='
      },
      link: function (scope, el) {

        el.addClass('droppable');

        var getDragData = function (event) {
          var text = event.originalEvent.dataTransfer.getData('text');
          if (text) {
            return JSON.parse(text);
          }
        };

        if (scope.mwDragenter) {
          el.on('dragenter', function (event) {
            if (scope.disableDrop !== true) {
              el.addClass('drag-over');
            }
            $timeout(function () {
              scope.mwDragenter({event: event});
            });
          });
        }

        if (scope.mwDragleave) {
          el.on('dragleave', function (event) {
            el.removeClass('drag-over');
            $timeout(function () {
              scope.mwDragleave({event: event});
            });
          });
        }

        if (scope.mwDrop) {
          el.on('drop', function (event) {
            el.removeClass('drag-over');
            if (event.stopPropagation) {
              event.stopPropagation(); // stops the browser executing other event listeners which are maybe deined in parent elements.
            }
            var data = getDragData(event);
            $timeout(function () {
              scope.mwDrop({
                event: event,
                dragData: data,
                dropData: scope.mwDropData
              });
            });
            return false;
          });
        }

        // Necessary. Allows us to drop.
        var handleDragOver = function (ev) {
          if (scope.disableDrop !== true) {
            if (ev.preventDefault) {
              ev.preventDefault();
            }
            return false;
          }
        };
        el.on('dragover', handleDragOver);

        if (scope.mwDragover) {
          el.on('dragover', function (event) {
            $timeout(function () {
              scope.mwDragover({event: event});
            });
          });
        }
      }
    };
  })

  .directive('mwTextCollapse', function () {
    return {
      restrict: 'A',
      scope: {
        mwTextCollapse: '@',
        length: '='
      },
      template: '<span>{{ mwTextCollapse | reduceStringTo:filterLength }}' +
        ' <a ng-if="showButton" ng-click="toggleLength()" style=\"cursor: pointer\">{{ ((_length !== filterLength) ? \'common.showLess\' : \'common.showMore\') | i18n}}</a></span>',
      link: function (scope) {
        var defaultLength = 200;
        scope._length = scope.filterLength = (scope.length && typeof scope.length === 'number') ? scope.length : defaultLength;
        scope.showButton = scope.mwTextCollapse.length > scope._length;
        scope.toggleLength = function () {
          scope.filterLength = (scope.filterLength !== scope._length) ? scope._length : undefined;
        };
      }
    };
  })


  .directive('mwInfiniteScroll', function ($window, $document) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection = scope.$eval(attrs.collection),
          loading = false,
          scrollFn,
          scrollEl;

        if (!collection || (collection && !collection.filterable)) {
          return;
        }

        var scrollCallback = function () {
          if (!loading && scrollEl.scrollTop() >= ((d.height() - scrollEl.height()) - 100) && collection.filterable.hasNextPage()) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };
        var modalScrollCallback = function () {
          if (!loading &&
            collection.filterable.hasNextPage() &&
            scrollEl[0].scrollHeight > 0 &&
            (scrollEl[0].scrollHeight - scrollEl.scrollTop() - scrollEl[0].clientHeight < 2)) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        if (el.parents('.modal').length) {
          //element in modal
          scrollEl = el.parents('.modal-body');
          scrollFn = modalScrollCallback;
        }
        else {
          //element in window
          var d = angular.element($document);
          scrollEl = angular.element($window);
          scrollFn = scrollCallback;
        }

        // Register scroll callback
        scrollEl.on('scroll', scrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollEl.off('scroll', scrollFn);
        });

      }
    };
  })

  .directive('mwViewChangeLoader', function ($rootScope) {
    return {
      replace: true,
      template: '<div class="mw-view-change-loader"><div class="spinner"></div></div>',
      link: function (scope, el) {



        var loadingInAnimationIsInProgress = false,
          routeChangeDone = false,
          transitionDuration = el.css('transition-duration') || el.css('-moz-transition-duration') || el.css('-webkit-transition-duration') || el.css('-o-transition-duration') || 1;

        transitionDuration = parseFloat(transitionDuration,10);

        /* ie 9 does not support transation events and therefor it does not work*/
        if(window.ieVersion===9){
          return;
        }

        var forceClassRemoval = function(){
          setTimeout(function(){
            if(el.hasClass('loading-out') || el.hasClass('loading-in')){
              //console.log('[ADD_LOADING_OUT_CLASS:SETTIMOUT'+(transitionDuration*1000)+']','FORCE CLASS REMOVAL',transitionDuration*1000+(transitionDuration*200));
            }
            el.removeClass('loading-in');
            el.removeClass('loading-out');
            loadingInAnimationIsInProgress = false;
          },transitionDuration*1000+(transitionDuration*100));
        };

        var addLoadingOutClass = function () {
          if (!el.hasClass('loading-in') || loadingInAnimationIsInProgress) {
            //console.log('[ADD_LOADING_OUT_CLASS:if condition failed]',!el.hasClass('loading-in')?'Has no loading-in class':'--',loadingInAnimationIsInProgress?'Loading-in animation is arleady in progress':'');
            return;
          }
          el.addClass('loading-out');
          window.requestAnimFrame(function () {
            //console.log('[ADD_LOADING_OUT_CLASS]','Adding loading-out class');
            el.removeClass('loading-in');
            forceClassRemoval();
          });
        };

        el.on('transitionend WebkitTransitionEnd otransitionend oTransitionEnd', function () {
          if(el.hasClass('loading-out')){
            //console.log('[TRANSITION_END_EVENT]','Loading-out class is set and im removing loading-in and loading-out class now');
            el.removeClass('loading-out');
          } else if(el.hasClass('loading-in')){
            //console.log('[TRANSITION_END_EVENT]','Loading-in class is set and ' +(routeChangeDone?'routechange is done so im calling addLoadingOutClass':'routechange is not ready yet so im doing nothing'));
            loadingInAnimationIsInProgress = false;
            if (routeChangeDone) {
              addLoadingOutClass();
            }
          } else {
            //console.log('[TRANSITION_END_EVENT]','Neither loading-in nor loading-out class is set');
          }
        });

        $rootScope.$on('$routeChangeStart', function (event, current) {
          //console.log('--------------------');
          if (current.disableLoader || loadingInAnimationIsInProgress) {
            //console.log('[ROUTE_CHANGE_START_EVENT:if condition failed]',current.disableLoader?'Loader is disabled':'--',loadingInAnimationIsInProgress?'Loading-in animation is already running':'');
            return;
          }
          routeChangeDone = false;
          loadingInAnimationIsInProgress = true;
          window.requestAnimFrame(function () {
            //console.log('[ROUTE_CHANGE_START_EVENT]','Adding loading-in class');
            el.addClass('loading-in');
          });
        });
        $rootScope.$on('$routeChangeSuccess', function () {
          //console.log('[ROUTE_CHANGE_DONE_EVENT]');
          routeChangeDone = true;
          addLoadingOutClass();
        });
        $rootScope.$on('$routeChangeError', function () {
          //console.log('[ROUTE_CHANGE_ERROR_EVENT]');
          routeChangeDone = true;
          addLoadingOutClass();
        });
      }
    };
  });


