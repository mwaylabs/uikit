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
  'mwFileUpload'
]).config(['mwIconProvider', 'i18nProvider', 'mwValidationMessagesProvider', function(mwIconProvider, i18nProvider, mwValidationMessagesProvider){
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

  i18nProvider.addResource('mw-ui-rln-i18n', 'uikit-relution');

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
}]);
angular.module('mwUI.Relution')

  .directive('mwFormInput', function(){
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_input.html',
      link: function(){
        window.mwUI.Utils.shims.deprecationWarning('[mwFormInput] The directive mw-form-input has been renamed to mw-input-wrapper. Please use the new directive instead!');
      }
    };
  })

  .directive('mwFormWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_input.html',
      link: function () {
        window.mwUI.Utils.shims.deprecationWarning('[mwFormWrapper] The directive mw-form-wrapper does not exist anymore. Please use the directive mw-input-wrapper instead!');
      }
    };
  })

  .directive('mwFormCheckbox', function(){
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '=',
        badges: '@'
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_checkbox.html',
      link: function(scope) {
        window.mwUI.Utils.shims.deprecationWarning('[mwFormCheckbox] The directive mw-form-checkbox does not exist anymore. Please use the directive mw-input-wrapper instead!');

        if (scope.badges) {
          var formatBadges = function () {
            window.mwUI.Utils.shims.deprecationWarning('[mwFormCheckbox] The badges attribute of the deprecated mw-form-checkbox is not supported anymore. Please transclude the badges instead');
            scope.typedBadges = [];
            var splittedBadges = scope.badges.split(',');
            angular.forEach(splittedBadges, function (badge) {
              var type = 'info';
              if (badge.toLowerCase().indexOf('android') > -1) {
                type = 'android';
              }
              if (badge.toLowerCase().indexOf('ios') > -1) {
                type = 'info';
              }
              if (badge.toLowerCase().indexOf('knox') > -1) {
                type = 'knox';
              }
              if (badge.toLowerCase().indexOf('-knox-') > -1) {
                badge = 'KNOX';
                type = 'notsafe';
              }
              if (badge.toLowerCase().indexOf('knox') > -1 &&
                badge.toLowerCase().indexOf('android') > -1) {
                type = 'multi';
              }
              if (badge.toLowerCase().indexOf('deprecated') > -1 || badge.toLowerCase().indexOf('veraltet') > -1) {
                type = 'warning';
              }
              if (badge.toLowerCase().indexOf('removed') > -1 || badge.toLowerCase().indexOf('entfernt') > -1) {
                type = 'danger';
              }
              scope.typedBadges.push({
                text: badge,
                type: type
              });
            });
          };
          scope.$watch('badges', formatBadges);
        }
      }
    };
  })

  .directive('mwCustomCheckbox', function(){
    return {
      link: function(){
        window.mwUI.Utils.shims.deprecationWarning('[mwCustomCheckbox] The directive mw-custom-checkbox is deprecated. The custom checkbox is default now. You can remove this directive from the checkbox input element');
      }
    };
  })

  .directive('mwCustomRadio', function(){
    return {
      link: function(){
        window.mwUI.Utils.shims.deprecationWarning('[mwCustomRadio] The directive mw-custom-radio is deprecated. The custom radio box is default now. You can remove this directive from the radio input element');
      }
    };
  })

  .directive('mwCustomSelect', function(){
    return {
      link: function(){
        window.mwUI.Utils.shims.deprecationWarning('[mwCustomSelect] The directive mw-custom-select is deprecated. The custom selectbox is default now. You can remove this directive from the select input');
      }
    };
  })

  .directive('mwFormMultiSelect2', function () {
    return {
      scope: {
        mwCollection: '=',
        mwOptionsCollection: '=',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_multi_select_2.html',
      link: function (scope) {
        if (scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }
        window.mwUI.Utils.shims.deprecationWarning('[mwFormMultiSelect2] The directive mw-form-multi-select-2 is deprecated. It has been renamed to mw-checkbox-group. ' +
          'The new directive wont fetch the options collection automatically when it is empty');
      }
    };
  });
'use strict';

angular.module('mwComponents', ['ngSanitize','mwUI.Utils'])

  .directive('mwTextCollapse', ['$filter', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        mwTextCollapse: '@',
        length: '=',
        markdown: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwTextCollapse.html',
      link: function (scope) {
        scope.showButton = false;
        scope.defaultLength = 200;

        // show Button if text is longer than desired
        var setButtonVisibleState = function(){
          if (scope.mwTextCollapse.length > scope.defaultLength) {
            scope.showButton = true;
          } else {
            scope.showButton = false;
          }
        };

        // apply filter length to text
        scope.text = function () {
          return $filter('reduceStringTo')(
            scope.mwTextCollapse, scope.filterLength
          );
        };

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

        // overwrite default length with custom length
        if (scope.length && typeof scope.length === 'number') {
          scope.defaultLength = scope.length;
        }

        // set start length for filter
        scope.filterLength = scope.defaultLength;

        setButtonVisibleState();
        scope.$watch('mwTextCollapse', setButtonVisibleState);
      }
    };
  }])

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
  .directive('mwFilterableSearch', ['$timeout', '$animate', 'Loading', 'Detect', function ($timeout, $animate, Loading, Detect) {
    return {
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@'
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
  }])

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
  .directive('mwModalOnEnter', ['validateEnterKeyUp', function (validateEnterKeyUp) {
    return {
      restrict: 'A',
      require: '?^form',
      link: function (scope, elm, attr, ctrl) {
        elm.parents('.modal').first().on('keyup', function (event) {
          validateEnterKeyUp.clickIfValid(elm, event, ctrl);
        });
      }
    };
  }])

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

'use strict';

angular.module('mwComponentsBb', [])

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
  .service('ignoreKeyPress', function () {
    var ENTER_KEY = 13;
    return {
      ignoreEnterKey: function (event) {
        if (event.which === ENTER_KEY) {
          event.preventDefault();
        }
      }
    };
  })

  .directive('mwFilterableSearchBb', ['$timeout', 'ignoreKeyPress', function ($timeout, ignoreKeyPress) {
    return {
      scope: {
        collection: '=',
        mwListCollection: '=',
        property: '@',
        customUrlParameter: '@',
        mwDisabled: '=',
        placeholder: '@',
        inputSearchId: '@?'
      },
      templateUrl: 'uikit/templates/mwComponentsBb/mwFilterableSearch.html',
      link: function (scope, el) {
        scope.inputSearchId = scope.inputSearchId || 'mw_input_search_field';
        var inputEl = el.find('input'),
          collection,
          listCollectionFilter;

        var setFilterVal = function (val) {
          if (scope.customUrlParameter) {
            collection.filterable.customUrlParams[scope.customUrlParameter] = val;
          } else {
            var filter = {};
            filter[scope.property] = val;
            collection.filterable.setFilters(filter);

            if (listCollectionFilter) {
              listCollectionFilter.applySearchTerm(scope.property, val);
            }
          }
        };

        scope.viewModel = {
          searchVal: ''
        };

        scope.search = function () {
          scope.searching = true;
          //backup searched text to reset after fetch complete in case of search text was empty
          setFilterVal(scope.viewModel.searchVal);
          return collection.fetch().finally(function () {
            $timeout(function () {
              scope.searching = false;
            }, 500);
          });
        };

        scope.reset = function () {
          scope.viewModel.searchVal = '';
          scope.search();
        };

        scope.hasValue = function () {
          return inputEl.val().length > 0;
        };

        scope.keyUp = function (event) {
          ignoreKeyPress.ignoreEnterKey(event);
          scope.searching = true;
        };

        scope.focus = function () {
          inputEl.focus();
        };

        el.on('focus', 'input[type=text]', function () {
          el.children().addClass('is-focused');
        });

        el.on('blur', 'input[type=text]', function () {
          el.children().removeClass('is-focused');
        });

        el.on('mousedown touch', function(ev){
          var searchBtn = el.find('.trigger-search'),
              resetBtn = el.find('.reset-search');

          if(resetBtn.find(ev.target).length !== 0){
            scope.reset();
          } else if(searchBtn.find(ev.target).length !== 0){
            scope.search();
          }
        });

        if (scope.collection) {
          collection = scope.collection;
        } else if (scope.mwListCollection) {
          collection = scope.mwListCollection.getCollection();
          listCollectionFilter = scope.mwListCollection.getMwListCollectionFilter();
        }

        if (!(collection instanceof Backbone.Collection)) {
          throw new Error('[mwFilterableSearchBb] Either collection or mwCollection has to be set');
        }

        scope.$watch(function () {
          if (collection.filterable && scope.property) {
            return collection.filterable.filterValues[scope.property];
          }
        }, function (val) {
          if (val !== scope.viewModel.searchVal) {
            scope.viewModel.searchVal = val;
          }
        });
      }
    };
  }])

  .directive('mwVersionSelector', function () {
    return {
      restrict: 'A',
      scope: {
        currentVersionModel: '=',
        versionCollection: '=',
        versionNumberKey: '@',
        url: '@'
      },
      templateUrl: 'uikit/templates/mwComponentsBb/mwVersionSelector.html',
      link: function (scope) {
        scope.versionNumberKey = scope.versionNumberKey || 'versionNumber';
        scope.getUrl = function (uuid) {
          return scope.url.replace('VERSION_UUID', uuid);
        };
      }
    };
  });





/**
 * Created by zarges on 09/12/15.
 */
'use strict';
angular.module('mwUI.Relution')

  .directive('mwLeadingZero', function () {
    return {
      require: 'ngModel',
      link: function (scope, el, attrs, ngModel) {
        ngModel.$formatters.unshift(function (val) {
          if (val < 10) {
            return '0' + val;
          } else {
            return val;
          }
        });
      }
    };
  })

  .directive('mwDatePicker', ['$rootScope', '$compile', '$interval', '$timeout', 'i18n', function ($rootScope, $compile, $interval, $timeout, i18n) {
    return {
      templateUrl: 'uikit/templates/mwDatePicker/mwDatePicker.html',
      scope: {
        mwModel: '=',
        mwRequired: '=',
        mwChange: '&',
        showTimePicker: '=',
        disableDateInput:'=',
        options: '=',
        hideErrors: '=',
        placeholder: '@'
      },
      link: function (scope, el) {
        var _defaultDatePickerOptions = {
            clearBtn: !scope.mwRequired
          },
          _datePicker,
          _incrementInterval,
          _decrementInterval;

        scope.viewModel = {
          date: null,
          hours: null,
          minutes: null,
          datepickerIsOpened: false,
          showTimePicker: angular.isDefined(scope.showTimePicker) ? scope.showTimePicker : true,
          disableDateInput: angular.isDefined(scope.disableDateInput) ? scope.disableDateInput : false
        };


        scope.$watch('showTimePicker', function (newVal) {
          scope.viewModel.showTimePicker = newVal;
        });
        scope.$watch('disableDateInput', function (newVal) {
          scope.viewModel.disableDateInput = newVal;

        });

        scope.onFocus = function (event) {
          if (scope.viewModel.disableDateInput) {
            if (event && event.target) {
              event.target.blur();
            }
          }
        };

        scope.canChange = function (num, type) {
          var options = scope.options || {},
            currentDateTs = +new Date(scope.mwModel);

          num = num || 0;

          if (type === 'MINUTES') {
            num = num * 60 * 1000;
          } else if (type === 'HOURS') {
            num = num * 60 * 60 * 1000;
          }


          if (options.startDate) {
            var startDateTs = +new Date(options.startDate);
            // Num param is passed as parameter to check if the previous hour or minute can be set
            // It checks if decrement by one is possible
            if (num < 0) {
              return ( currentDateTs + num ) >= startDateTs;
            } else {
              // This block checks if the date is in valid date range
              // otherwise the increment button is disabled as well
              // The time is reset to 0 pm for the current date and the end date
              // Otherwise it won't be possible to change minutes when the initial minutes of the same day are below the startdate hours
              return new Date(currentDateTs).setHours(0, 0, 0, 0) >= new Date(startDateTs).setHours(0, 0, 0, 0);
            }
          }

          if (options.endDate) {
            var endDateTs = +new Date(options.endDate);
            // Num param is passed as parameter to check if the next hour or minute can be set
            // It checks if increment by one is possible
            if (num > 0) {
              return ( currentDateTs + num ) <= endDateTs;
            } else {
              // This block checks if the date is in valid date range
              // otherwise the decrement button is disabled as well
              // The time is reset to 0 pm for the current date and the end date
              // Otherwise it won't be possible to change hours when the initial hours of the same day are over the enddate hours
              return new Date(currentDateTs).setHours(0, 0, 0, 0) <= new Date(endDateTs).setHours(0, 0, 0, 0);
            }
          }

          return true;
        };

        scope.increment = function (attr, min, max) {
          var val = scope.viewModel[attr];
          if (val < max) {
            val++;
          } else {
            val = min;
          }
          scope.viewModel[attr] = val;
        };

        scope.startIncrementCounter = function () {
          var args = arguments;

          _incrementInterval = $interval(function () {
            scope.increment.apply(this, args);
          }.bind(this), 200);
        };

        scope.stopIncrementCounter = function () {
          $interval.cancel(_incrementInterval);
        };

        scope.decrement = function (attr, min, max) {
          var val = scope.viewModel[attr];
          if (val > min) {
            val--;
          } else {
            val = max;
          }
          scope.viewModel[attr] = val;
        };

        scope.startDecrementCounter = function () {
          var args = arguments;
          _decrementInterval = $interval(function () {
            scope.decrement.apply(this, args);
          }.bind(this), 200);
        };

        scope.stopDecrementCounter = function () {
          $interval.cancel(_decrementInterval);
        };

        var updateMwModel = function (datePicker) {
          $timeout(function () {
            if (datePicker.dates.length > 0) {
              var selectedDate = new Date(datePicker.getDate());

              if (scope.viewModel.hours) {
                selectedDate.setHours(scope.viewModel.hours);
              } else {
                scope.viewModel.hours = selectedDate.getHours();
              }

              if (scope.viewModel.minutes) {
                selectedDate.setMinutes(scope.viewModel.minutes);
              } else {
                scope.viewModel.minutes = selectedDate.getMinutes();
              }

              scope.mwModel = selectedDate;
              scope.viewModel.date = selectedDate.toLocaleDateString();
            } else {
              scope.viewModel.date = null;
              scope.viewModel.hours = null;
              scope.viewModel.minutes = null;
              scope.mwModel = null;
            }

            if(scope.mwChange){
              scope.mwChange({val: scope.mwModel});
            }
          });
        };

        var bindChangeListener = function (datepicker) {
          datepicker.on('changeDate', updateMwModel.bind(this, datepicker.data().datepicker));
          datepicker.on('show', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = true;
            });
          });
          datepicker.on('hide', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = false;
            });
          });
        };

        var setDateValue = function (el, date, datepicker) {
          if (date) {
            date = new Date(date);

            var parsedDateStr = date.toLocaleDateString(),
              hours = date.getHours(),
              minutes = date.getMinutes();

            el.val(parsedDateStr);
            scope.viewModel.hours = hours;
            scope.viewModel.minutes = minutes;
            scope.viewModel.date = parsedDateStr;

            datepicker.setDate(date);
            datepicker.update();
            // we need to set this val manually for the case that it is out of daterange
            // when we don't set it manually it will be empty because the datpicker sets
            // the textfield val only when it is in valid date range
            _datePicker.val(parsedDateStr);
          }
        };

        var checkIfDatepickerLibIsAvailable = function(datePickerEl){
          if(!datePickerEl.datepicker){
            throw new Error('bootstrap-sass-datepicker is not available. Make sure you included the javascript file');
          }
        };

        var setDatepicker = function (options) {
          var datePickerEl;

          if (_datePicker && _datePicker.data().datepicker) {
            _datePicker.data().datepicker.remove();
          }

          datePickerEl = el.find('.date-picker');
          checkIfDatepickerLibIsAvailable(datePickerEl);
          _datePicker = datePickerEl.datepicker(_.extend(_defaultDatePickerOptions, options));
          setDateValue(datePickerEl, scope.mwModel, _datePicker.data().datepicker);
          bindChangeListener(_datePicker);
        };

        var setDatepickerLanguage = function () {
          var locale = 'en';
          if (i18n.getActiveLocale().id === 'de_DE') {
            locale = 'de';
          }
          setDatepicker({
            language: locale
          });
        };
        $rootScope.$on('i18n:localeChanged', setDatepickerLanguage);
        setDatepickerLanguage();

        var _updater = function (val) {
          if (_datePicker && val) {
            updateMwModel(_datePicker.data().datepicker);
          }
        };
        scope.$watch('viewModel.minutes', _updater);
        scope.$watch('viewModel.hours', _updater);

        scope.$watchCollection('options', function (options) {
          if (options) {
            setDatepicker(options);
          }
        });

        el.on('mouseout', '.number-spinner', function () {
          scope.stopDecrementCounter();
          scope.stopIncrementCounter();
        });
      }
    };
  }]);
angular.module('mwFileUpload', [])

  .provider('mwFileUpload', function () {
    var _defaultConfig = {};

    this.setGlobalConfig = function (conf) {
      _.extend(_defaultConfig, conf);
    };

    this.$get = function () {
      return {
        getGlobalConfig: function () {
          return _defaultConfig;
        }
      };
    };

  })

  .directive('mwFileUpload', ['$q', '$timeout', '$filter', 'mwFileUpload', 'ResponseHandler', 'mwMimetype', 'i18n', function ($q, $timeout, $filter, mwFileUpload, ResponseHandler, mwMimetype, i18n) {
    return {
      restrict: 'A',
      scope: {
        url: '@',
        name: '@',
        model: '=?',
        attribute: '@',
        labelAttribute: '@',
        showFileName: '=',
        mwRequired: '=',
        validator: '@',
        text: '@',
        formData: '=',
        successCallback: '&',
        errorCallback: '&',
        stateChangeCallback: '&',
        fullScreen: '=',
        hiddenBtn: '=',
        showUploadBtnAlways: '=?',
        hasDropZone: '=?',
        hideCancelBtn: '=?',
        hideRemoveBtn: '=?',
        abortFlag: '=?',
        maxFileSizeByte: '=?'
      },
      require: '?^form',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUpload.html',
      link: function (scope, elm, attrs, formController) {
        scope.viewModel = {
          uploaderOptions: {},
          state: null,
          uploadProgress: 0,
          fileName: null,
          uploadError: null,
          isInvalid: false,
          dropZoneId: _.uniqueId('dropzone'),
          dropZoneElmement: null,
          documentDragOver: false,
          dropzoneDragOver: false,
          hasDropzone: false
        };

        var handleResponse = function (response, isError) {
          var ngResponse = {
            config: {
              method: response.type,
              url: response.url
            },
            data: response.result,
            headers: response.headers,
            status: response.xhr().status,
            statusText: response.xhr().statusText
          };
          var handler = ResponseHandler.handle(ngResponse, isError);
          if (handler) {
            return handler;
          } else if (isError) {
            return $q.reject(ngResponse);
          } else {
            return $q.when(ngResponse);
          }
        };

        var updateFileName = function () {
          var labelAttr = scope.labelAttribute || 'name';
          if (scope.model instanceof window.Backbone.Model) {
            scope.viewModel.fileName = scope.model.get(labelAttr);
          } else if (scope.model) {
            scope.viewModel.fileName = scope.model[labelAttr];
          } else {
            scope.viewModel.fileName = null;
          }
        };

        var updateModel = function (file) {
          if (scope.model instanceof Backbone.Model) {
            scope.model.set(scope.model.parse(file));
          } else if (scope.attribute) {
            scope.model = file[scope.attribute];
          } else {
            scope.model = file;
          }
          updateFileName();
        };

        var updateFile = function (xhr, response, file) {
          if (attrs.validator && !mwMimetype.checkMimeType(file.contentType, attrs.validator)) {
            if (response && response.message) {
              scope.uploadError = i18n.get('rlnUikit.mwFileUpload.invalidMimeType', {mimeType: attrs.validator});
              scope.viewModel.isInvalid = true;
              scope.viewModel.fileName = file.name;
              return;
            }
          }

          updateModel(file);

          handleResponse(xhr, false).then(function () {
            $timeout(scope.successCallback.bind(this, {result: file}));
          });
        };

        var setFormDirty = function () {
          if (formController) {
            formController.$setDirty();
          }
        };

        var triggerFileToBigError = function (files) {
          if (!files || !angular.isArray(files) || files.length === 0) {
            return;
          }
          var file = files[0];
          var actualFileSizeReadable = $filter('mwReadableFileSize')(file.size);
          var maxFileSizeReadable = $filter('mwReadableFileSize')(scope.maxFileSizeByte);
          var errorMsg = i18n.get('rlnUikit.mwFileUpload.fileTooLarge', {
            fileName: file.name,
            max: maxFileSizeReadable,
            actual: '(' + actualFileSizeReadable + ')'
          });
          $timeout(scope.errorCallback.bind(this, {
            result: {
              msg: errorMsg,
              code: 413,
              fileSize: file.size,
              fileName: file.name,
              fileType: file.type,
              maxFileSizeByte: scope.maxFileSizeByte
            }
          }));
          scope.viewModel.fileName = file.name;
          scope.viewModel.uploadError = errorMsg;
        };

        var updateUploaderOptions = function (options) {
          options = options || {};
          _.extend(scope.viewModel.uploaderOptions, options);
        };

        var setDropZone = function () {
          $timeout(function () {
            scope.viewModel.dropZoneElmement = elm.find('#' + scope.viewModel.dropZoneId);
          });
        };

        scope.abort = function () {
          scope.abortFlag = true;
        };

        scope.dragoverDocumentStateChange = function (newState) {
          if (newState === 'DOCUMENT_DRAG_OVER') {
            scope.viewModel.documentDragOver = true;
          } else {
            scope.viewModel.documentDragOver = false;
            scope.viewModel.dropzoneDragOver = false;
          }
        };

        scope.dragoverDropzoneStateChange = function (newState) {
          if (newState === 'DROPZONE_DRAG_OVER') {
            scope.viewModel.dropzoneDragOver = true;
          } else {
            scope.viewModel.dropzoneDragOver = false;
          }
        };

        scope.canShowUploadBtn = function () {
          return scope.viewModel.state !== 'UPLOADING' &&
            (!scope.viewModel.fileName || scope.showUploadBtnAlways || scope.hideRemoveBtn);
        };

        scope.canShowRemoveBtn = function () {
          return !scope.hideRemoveBtn && scope.viewModel.fileName;
        };

        /* progressData = {
            data:blueImpXhr,
            progress: progress,
            total: dataTotal,
            loaded: dataLoaded
         } */
        scope.onUploadProgress = function (progressData) {
          var fileName = '';
          if (!angular.isObject(progressData)) {
            return;
          }
          if (progressData.data && angular.isArray(progressData.data.files) && progressData.data.files[0]) {
            fileName = progressData.data.files[0].name;
          }
          scope.abortFlag = false;
          scope.viewModel.state = 'UPLOADING';
          scope.viewModel.isInvalid = true;
          scope.viewModel.uploadProgress = progressData.progress;
          scope.viewModel.uploadMessage = i18n.get('rlnUikit.mwFileUpload.uploading', {
            fileName: fileName
          });
          $timeout(scope.stateChangeCallback.bind(this, {
            data: progressData.data,
            progress: progressData.progress
          }));
        };

        /* data = {
           xhr: blueImpXhr,
           response: {}
           file: {}
         } */
        scope.onUploadSuccess = function (data) {
          scope.viewModel.state = 'DONE';
          scope.viewModel.uploadProgress = 0;
          updateFile(data.xhr, data.response, data.file);
          scope.viewModel.isInvalid = false;
          setFormDirty();
          $timeout(scope.successCallback.bind(this, {result: data.file}));
        };

        /* data = {
           type: FILE_TOO_BIG | SERVER | CUSTOM_VALIDATION_FAILED,
           xhr: blueImpXhr,
           result: {
             files: [] | null,
             response: {} | null
           }
         } */
        scope.onUploadError = function (data) {
          scope.viewModel.state = 'DONE';
          switch (data.type) {
            case 'FILE_TOO_BIG':
              triggerFileToBigError(data.result.files);
              break;
            case 'SERVER':
              break;
            case 'CUSTOM_VALIDATION_FAILED':
              break;
          }
          scope.viewModel.isInvalid = true;
          setFormDirty();
          $timeout(scope.errorCallback.bind(this, {result: data.response || {}}));
        };

        scope.onUploadAbort = function () {
          scope.viewModel.state = 'DONE';
          scope.viewModel.isInvalid = false;
        };

        scope.removeFile = function () {
          updateModel(null);
          scope.viewModel.isInvalid = false;
        };

        scope.$watch('url', function (val) {
          if (val) {
            updateUploaderOptions({
              url: val
            });
          }
        });

        scope.$watch('formData', function (val) {
          if (val) {
            updateUploaderOptions({
              formData: val
            });
          }
        }, true);

        scope.$watch('hasDropZone', function (val) {
          if (val) {
            scope.viewModel.hasDropZone = true;
            setDropZone();
          } else {
            scope.viewModel.hasDropZone = false;
          }
        });

        if (angular.isUndefined(scope.hasDropZone)) {
          scope.hasDropZone = true;
        }

        updateUploaderOptions(mwFileUpload.getGlobalConfig());

        scope.$watch('model', updateFileName);
      }
    };
  }]);
angular.module('mwFileUpload')

  .directive('mwFileUploadButton', ['$q', '$timeout', 'mwMimetype', function ($q, $timeout, mwMimetype) {
    return {
      restrict: 'A',
      scope: {
        uploaderOptions: '=?',
        maxFileSizeByte: '=?',
        dropZoneElement: '=?',
        onBeforeUploadCallback: '=?',
        onProgressCallback: '=?',
        onSuccessCallback: '=?',
        onErrorCallback: '=?',
        onAbortCallback: '=?',
        abortFlag: '=?',
        accepts: '@?',
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUploadButton.html',
      link: function (scope, elm) {

        var hiddenfileEl = elm.find('input[type=file]'),
          userHasCanceled = false,
          uploadXhr;

        scope.mimeTypeGroup = mwMimetype.getMimeTypeGroup(scope.accepts);

        scope.file = null;

        if (!scope.mimeTypeGroup) {
          scope.inputValidator = '*/*';
        } else {
          scope.inputValidator = scope.accepts;
        }

        var error = function (xhr, type, result) {
          if (typeof scope.onErrorCallback === 'function') {
            $timeout(scope.onErrorCallback.bind(this, {type: type, xhr: xhr, result: result}));
          }
        };

        var getFileFromResponse = function (response) {
          if (response && response.results && _.isArray(response.results) && response.results.length > 0) {
            response = response.results[0];
          }
          return response;
        };

        var success = function (xhr, result) {
          if (typeof scope.onSuccessCallback === 'function') {
            $timeout(scope.onSuccessCallback.bind(this, {
              xhr: xhr,
              file: getFileFromResponse(result),
              response: result
            }));
          }
        };

        var abort = function () {
          if (typeof scope.onAbortCallback === 'function') {
            $timeout(scope.onAbortCallback.bind(this));
          }
        };

        var stateChange = function (data) {
          if (data && typeof scope.onProgressCallback === 'function') {
            var dataLoaded = data.loaded;
            var dataTotal = data.total;
            var progress = parseInt(dataLoaded / dataTotal * 100, 10);
            $timeout(scope.onProgressCallback.bind(this, {
                data: data,
                progress: progress,
                total: dataTotal,
                loaded: dataLoaded
              }
            ));
          }
        };

        var validateFileSize = function (files) {
          var isValid = true;
          if (scope.maxFileSizeByte) {
            // check each file if it is too large to upload.
            angular.forEach(files, function (file) {
              if (file.size > scope.maxFileSizeByte) {
                isValid = false;
              }
            });
          }
          return isValid;
        };

        scope.abort = function () {
          if (uploadXhr) {
            userHasCanceled = true;
            uploadXhr.abort();
          }
        };

        hiddenfileEl.fileupload({
          url: scope.url,
          dataType: 'json',
          formData: scope.formData,
          autoUpload: false
        });

        hiddenfileEl.bind('fileuploadadd', function (e, data) {
          if (!data || !angular.isArray(data.files) || data.files.length === 0) {
            return;
          }
          scope.file = data.files;
          userHasCanceled = false;

          if (typeof scope.onBeforeUploadCallback === 'function') {
            var result = scope.onBeforeUploadCallback(data.files);
            if (result === false) {
              error(this, 'CUSTOM_VALIDATION_FAILED', {
                files: data.files,
                response: null
              });
              scope.file = null;
              return;
            }
          }

          if (!validateFileSize(data.files)) {
            error(this, 'FILE_TOO_BIG', {
              files: data.files,
              response: null
            });
            scope.file = null;
            return;
          }

          uploadXhr = data.submit();
        });

        hiddenfileEl.bind('fileuploadstart', function () {
          scope.abortFlag = false;
        });

        hiddenfileEl.bind('fileuploadprogress', function (e, data) {
          stateChange(data);
        });

        hiddenfileEl.bind('fileuploaddone', function (e, data) {
          success(data, data.result);
        });

        hiddenfileEl.bind('fileuploadfail', function (e, data) {
          if (!userHasCanceled) {
            scope.uploadError = data.statusText;
            error(this, 'SERVER', {
              files: null,
              response: data.responseJSON
            });
          } else {
            abort();
          }
        });

        scope.triggerUploadDialog = function () {
          /*Unbind listener to prevent loop, prevent bubbling of event does not work */
          elm.off('click', scope.triggerUploadDialog);
          /*Make sure to use selector to have correct reference because the blueimpfileuplaoder changes reference*/
          elm.find('input[type=file]').click();
          elm.on('click', scope.triggerUploadDialog);
        };

        /*
          {
            url: ''
            formData: {}
          }
        */
        scope.$watch('uploaderOptions', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', val);
          }
        }, true);

        scope.$watch('abortFlag', function (abortFlag) {
          if (abortFlag) {
            scope.abort();
          }
        });

        scope.$watch('dropZoneElement', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', {
              dropZone: val
            });
          }
        });

        elm.on('click', scope.triggerUploadDialog);

        scope.$on('$destroy', function () {
          elm.off('click', scope.triggerUploadDialog);
          /*Make sure to use selector to have correct reference because the blueimpfileuplaoder changes reference*/
          elm.find('input[type=file]').fileupload('destroy');
        });
      }
    };
  }]);
angular.module('mwFileUpload')

  .directive('mwFileUploadDragAndDrop', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUploadDragAndDrop.html',
      scope: {
        id: '@',
        onDocumentDragOverCallback: '=?',
        onDropzoneDragOverCallback: '=?',
        onDrop: '=?'
      },
      link: function (scope, el) {
        var timeout;

        var onDocumentDragOverChange = function (newState) {
          if (typeof scope.onDocumentDragOverCallback === 'function') {
            $timeout(scope.onDocumentDragOverCallback.bind(this, newState));
          }
        };

        var onDropZoneDragOverChange = function (newState) {
          if (typeof scope.onDropzoneDragOverCallback === 'function') {
            $timeout(scope.onDropzoneDragOverCallback.bind(this, newState));
          }
        };

        var onDrop = function () {
          if (typeof scope.onDrop === 'function') {
            $timeout(scope.onDrop.bind(this));
          }
          onDropZoneDragOverChange('DROPZONE_DRAG_LEAVE');
          onDocumentDragOverChange('DOCUMENT_DRAG_LEAVE');
        };

        var documentDragOver = function (e) {
          e.preventDefault();
          if (!timeout) {
            $timeout(function () {
              scope.isInDragState = true;
              onDocumentDragOverChange('DOCUMENT_DRAG_OVER');
            });
          }
          else {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function () {
            timeout = null;
            $timeout(function () {
              scope.isInDragState = false;
              if (!scope.isInDragOverState) {
                onDocumentDragOverChange('DOCUMENT_DRAG_LEAVE');
              }
            });
          }, 100);
        };

        var documentDrop = function (ev) {
          ev.preventDefault();
          onDrop();
        };

        var elDragOver = function () {
          $timeout(function () {
            scope.isInDragOverState = true;
            onDropZoneDragOverChange('DROPZONE_DRAG_OVER');
          });
        };

        var elDragLeave = function () {
          $timeout(function () {
            scope.isInDragOverState = false;
            onDropZoneDragOverChange('DROPZONE_DRAG_LEAVE');
          });
        };

        var initDragAndDrop = function () {
          /*
         * This implementation was found on https://github.com/blueimp/jQuery-File-Upload/wiki/Drop-zone-effects
         * The tricky part is the dragleave stuff when the user decides not to drop the file
         * You can not just use the dragleave event. This implemtation did solve the problem
         * It was a bit modified
         */
          angular.element(document).on('dragover', documentDragOver);
          el.on('dragover', elDragOver);
          el.on('dragleave', elDragLeave);
          angular.element(document).on('drop', documentDrop);
        };

        var deInitDragAndDrop = function () {
          angular.element(document).off('dragover', documentDragOver);
          el.off('dragover', elDragOver);
          el.off('dragleave', elDragLeave);
          angular.element(document).off('drop', documentDrop);
        };

        initDragAndDrop();

        scope.$on('$destroy', function () {
          deInitDragAndDrop();
        });
      }
    };
  }]);
angular.module('mwFileUpload')

  .service('mwMimetype', function () {

    return {
      application: [
        'application/atom+xml',
        'application/ecmascript',
        'application/EDIFACT',
        'application/json',
        'application/javascript',
        'application/octet-stream',
        'application/ogg',
        'application/pdf',
        'application/postscript',
        'application/rdf+xml',
        'application/rss+xml',
        'application/soap+xml',
        'application/font-woff',
        'application/xhtml+xml',
        'application/xml',
        'application/xml-dtd',
        'application/xop+xml',
        'application/zip',
        'application/x-pkcs12',
        'application/x-pkcs7-mime',
        'application/x-pkcs7-certificates',
        'application/*'
      ],

      audio: [
        'audio/basic',
        'audio/L24',
        'audio/mp4',
        'audio/mpeg',
        'audio/ogg',
        'audio/opus',
        'audio/vorbis',
        'audio/vnd.rn-realaudio',
        'audio/vnd.wave',
        'audio/webm',
        'audio/*'
      ],

      image: [
        'image/gif',
        'image/pjpeg',
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/*'
      ],

      video: [
        'video/mpeg',
        'video/mp4',
        'video/ogg',
        'video/quicktime',
        'video/webm',
        'video/x-matroska',
        'video/x-ms-wmv',
        'video/x-flv',
        'video/*'
      ],

      text: [
        'text/cmd',
        'text/css',
        'text/csv',
        'text/html',
        'text/javascript (Obsolete)',
        'text/plain',
        'text/vcard',
        'text/xml',
        'text/*'
      ],

      getMimeTypeGroup: function (mimeType) {
        if (this.text.indexOf(mimeType) !== -1) {
          return 'text';
        } else if (this.video.indexOf(mimeType) !== -1) {
          return 'video';
        } else if (this.image.indexOf(mimeType) !== -1) {
          return 'image';
        } else if (this.audio.indexOf(mimeType) !== -1) {
          return 'audio';
        } else if (this.application.indexOf(mimeType) !== -1) {
          return 'application';
        } else {
          return false;
        }
      },

      checkMimeType: function (is, should) {
        if (is === '*/*' || should === '*/*') {
          return true;
        } else {
          if (!this.getMimeTypeGroup(should)) {
            return is === should;
          } else {
            return this.getMimeTypeGroup(is) === this.getMimeTypeGroup(should);
          }
        }
      }
    };

  });
'use strict';

(function () {

  var addDefaultValidations = function () {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {

        var ngModelController = ctrl,
          skipTheFollowing = ['checkbox', 'radio', 'hidden', 'file'],
          dontSkipIt = skipTheFollowing.indexOf(attr.type) === -1,
          _maxlength = 255, // for input fields of all types
          _maxIntValue = 2147483647;

        // use higher maxLength for textareas
        if (!attr.type) {
          _maxlength = 4000;
        }

        // Don't overwrite existing values for ngMaxlength
        if (attr.type !== 'number' && ngModelController && dontSkipIt && !ngModelController.$validators.maxlength && !attr.ngMaxlength) {
          attr.$set('ngMaxlength', _maxlength);
          ngModelController.$validators.maxlength = function (modelValue, viewValue) {
            return (_maxlength < 0) || ngModelController.$isEmpty(modelValue) || (viewValue.length <= _maxlength);
          };
        }

        //set max value for number fields
        if (attr.type === 'number' && !ctrl.$validators.max) {
          attr.$set('max', _maxIntValue);
          ctrl.$validators.max = function (value) {
            return ctrl.$isEmpty(value) || angular.isUndefined(_maxIntValue) || value <= _maxIntValue;
          };
        }
      }
    };
  };


  angular.module('mwForm', [])

    /**
     * @ngdoc directive
     * @name mwForm.directive:mwMultiSelect
     * @element div
     * @description
     *
     * Can be used for a selectbox where multiple values can be selected
     * Generates checkboxes and pushes or removes values into an array
     *
     * @scope
     *
     * @param {expression} model Model where the selected values should be saved in
     * @param {expression} options Options which can be selected
     *
     */
    .directive('mwFormMultiSelect', function () {
      return {
        restrict: 'A',
        transclude: true,
        require: '^?form',
        scope: {
          model: '=',
          options: '=',
          query: '=filter',
          mwRequired: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormMultiSelect.html',
        controller: ['$scope', function ($scope) {

          if (!angular.isArray($scope.model)) {
            $scope.model = [];
          }

          if (angular.isArray($scope.options)) {
            var objOptions = {};
            $scope.options.forEach(function (option) {
              objOptions[option] = option;
            });

            $scope.options = objOptions;
          }

          $scope.getObjectSize = function (obj) {
            return _.size(obj);
          };

          $scope.filter = function (items) {
            var result = {};

            angular.forEach(items, function (value, key) {

              if (!$scope.query || !value || value.match($scope.query.toLowerCase()) || value.match($scope.query.toUpperCase())) {
                result[key] = value;
              }
            });
            return result;
          };

          $scope.toggleKeyIntoModelArray = function (key) {

            $scope.model = $scope.model || [];
            //Check if key is already in the model array
            //When user unselects a checkbox it will be deleted from the model array
            if ($scope.model.indexOf(key) >= 0) {
              // Delete key from model array
              $scope.model.splice($scope.model.indexOf(key), 1);
              // Delete model if no attribute is in there (for validation purposes)
              if ($scope.model.length === 0) {
                delete $scope.model;
              }
            } else {
              $scope.model.push(key);
            }
          };

        }],
        link: function (scope, el, attr, form) {

          scope.showRequiredMessage = function () {
            return ( (!scope.model || scope.model.length < 1) && scope.required);
          };

          scope.setDirty = function () {
            if (form) {
              form.$setDirty();
            }
          };
        }
      };
    })

    /**
     * @ngdoc directive
     * @name mwForm.directive:mwForm
     * @element form
     * @description
     *
     * Adds form specific behaviour
     *
     */
    .directive('form', function () {
      return {
        restrict: 'E',
        link: function (scope, el) {
          var noPasswordAutocomplete = angular.element(
            '<!-- fake fields are a workaround for chrome autofill getting the wrong fields -->' +
            '<input style="display:none" type="text" name="fakeusernameremembered"/>' +
            '<input style="display:none" type="password" name="fakepasswordremembered"/>'
          );

          el.prepend(noPasswordAutocomplete);
        }
      };
    })

    /**
     * @ngdoc directive
     * @name mwForm.directive:input
     * @restrict E
     * @description
     *
     * Extends the input[text] element, by adding class 'form-control' and
     * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
     *
     */
    .directive('input', addDefaultValidations)

    /**
     * @ngdoc directive
     * @name mwForm.directive:textarea
     * @restrict E
     * @description
     *
     * Extends the textarea element, by adding class 'form-control' and
     * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
     *
     */
    .directive('textarea', addDefaultValidations)

    /**
     * @ngdoc directive
     * @name mwForm.directive:mwPasswordToggler
     * @element input
     * @description
     *
     * Adds an eye button for password fields to show the password in clear text
     *
     */
    .directive('mwPasswordToggler', ['$compile', function ($compile) {
      return {
        restrict: 'A',
        link: function (scope, el) {

          var render = function () {
            var passwordWrapper = angular.element('<div class="mw-password-toggler input-group"></div>'),
              passwordToggleBtn = $compile(
                '<span class="input-group-addon toggler-btn clickable" ng-click="togglePassword()" ng-if="showToggler()">' +
                '<span ng-if="isPassword()" mw-icon="fa-eye"></span>' +
                '<span ng-if="!isPassword()" mw-icon="fa-eye-slash"></span>' +
                '</span>')(scope);

            el.wrap(passwordWrapper);
            passwordToggleBtn.insertAfter(el);
          };

          scope.isPassword = function () {
            return el.attr('type') === 'password';
          };

          scope.togglePassword = function () {
            if (scope.isPassword()) {
              el.attr('type', 'text');
            } else {
              el.attr('type', 'password');
            }
          };


          scope.showToggler = function () {
            return !el.is(':disabled');
          };

          // remove input group class when input is disabled so it is displaaed like a normal input element
          scope.$watch(scope.showToggler, function (showToggler) {
            var passwordWrapper = el.parent('.mw-password-toggler');
            if (showToggler) {
              passwordWrapper.addClass('input-group');
            } else {
              passwordWrapper.removeClass('input-group');
            }
          });

          render();
        }
      };
    }]);

})();



'use strict';

angular.module('mwFormBb', ['mwUI.i18n'])

  .directive('mwFormMultiSelectBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        model: '=',
        collection: '=',
        mwOptionsKey: '@',
        translationPrefix: '@',
        mwRequired: '=',
        disabledCollection: '='
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormMultiSelect.html',
      link: function (scope, el, attr, form) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (!(scope.collection instanceof Backbone.Collection)) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !(scope.disabledCollection instanceof Backbone.Collection)) {
          throw new Error('mwFormMultiSelect: disabledCollection attribuet has to be a collection');
        }

        //When user unselects a checkbox it will be deleted from the model array
        var removeFromModel = function (key) {
          if (scope.model.indexOf(key) >= 0) {
            // Delete key from model array
            scope.model.splice(scope.model.indexOf(key), 1);
            // Delete model if no attribute is in there (for validation purposes)
            if (scope.model.length === 0) {
              delete scope.model;
            }
            return true;
          }
          return false;
        };

        if (scope.disabledCollection) {
          //if a an item is in the disabledCollection it will be removed from the model
          scope.disabledCollection.each(function (disabledModel) {
            removeFromModel(disabledModel.get(scope.optionsKey));
          });
        }

        scope.isDisabled = function (model) {
          if (scope.disabledCollection) {
            return !!scope.disabledCollection.get(model);
          }
        };

        scope.toggleKeyIntoModelArray = function (key) {
          scope.model = scope.model || [];
          if (!removeFromModel(key)) {
            scope.model.push(key);
          }
        };

        scope.showRequiredMessage = function () {
          return ( (!scope.model || scope.model.length < 1) && scope.mwRequired);
        };

        scope.setDirty = function () {
          if (form) {
            form.$setDirty();
          }
        };
      }
    };
  })

  .directive('mwFormRadioGroupBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormRadioGroup.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }
      }
    };
  })

  .directive('mwFormSelectBb', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',            //defines option attribute as _the value_ - optional. if undefined, assumes "key" as key value
        mwOptionsLabelKey: '@',       //defines option attribute as _the label_
        mwOptionsLabelI18nPrefix: '@',//defines a directory for i18n texts as _the label_ - optional
        mwRequired: '=',              //determines, if a selection is required - optional, disables the _null option_
        mwDisabled: '=',              //determines, if the select-box is disabled
        mwChange: '&',
        mwPlaceholder: '@placeholder',
        mwNullLabel: '@',             //defines a string as _the label_ for _the null option_ - optional, only effective, if selection not required (mwRequired = false)
        mwAutoFetch: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormSelect.html',
      link: function (scope) {
        //if the optional options and label key are not set, specify a default value
        scope.optionsKey = scope.mwOptionsKey || 'key';
        scope.labelKey = scope.mwOptionsLabelKey || 'label';

        scope.viewModel = {
          val: ''
        };

        scope.getKey = function (optionModel) {
          return optionModel.get(scope.optionsKey);
        };

        scope.getLabel = function (optionModel) {
          //if a null option exists, label is the label key (specified in addNullOption)
          if(optionModel.get(scope.optionsKey) === null){
            return optionModel.get(scope.labelKey);
          } else { //for any other option, first check if label can be [i18n-prefix + optionsKey]...
            if(scope.mwOptionsLabelI18nPrefix){
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + scope.getKey(optionModel));
            } else { //...else label is, what get key returns (specified or default options key)
              return scope.getKey(optionModel);
            }
          }
        };

        scope.getSelectedModel = function (val) {
          var searchObj = {};

          searchObj[scope.optionsKey] = val;
          return scope.mwOptionsCollection.findWhere(searchObj);
        };

        var addNullOption = function () {
          if (!scope.mwRequired) {
            var nullOption = {},
                key = null,
                referenceObj = {};
            //create the null-option-object and a reference object with just the options-key
            referenceObj[scope.optionsKey] = key;
            nullOption[scope.optionsKey] = key;
            nullOption[scope.labelKey] = scope.mwNullLabel || '';

            //if the collection already contains a null Option, we don't override it.
            //By checking for the reference object, it just scans the collection for the options key
            if (!scope.mwOptionsCollection.findWhere(referenceObj)) {
              scope.mwOptionsCollection.add(nullOption);
            }
          }
        };

        if (scope.mwModel instanceof window.Backbone.Model) {
          // We need set it to null when it is undefined so the added null object will be selected
          scope.viewModel.val = scope.mwModel.get(scope.optionsKey) || null;
          scope.mwOptionsCollection.on('add', function () {
            if (scope.viewModel.val && scope.getSelectedModel(scope.viewModel.val)) {
              scope.mwModel.set(scope.getSelectedModel(scope.viewModel.val).toJSON());
            }
          });
          scope.$watch('viewModel.val', function (val) {
            if (val && scope.getSelectedModel(val)) {
              scope.mwModel.set(scope.getSelectedModel(val).toJSON());
            } else {
              scope.mwModel.clear();
            }
          });
        } else {
          // We need set it to null when it is undefined so the added null object will be selected
          scope.viewModel.val = scope.mwModel || null;
          scope.$watch('mwModel', function (val) {
            if (val || val === null) {
              scope.viewModel.val = val;
            }
          });
          scope.$watch('viewModel.val', function (val) {
            scope.mwModel = val;
          });
        }

        //auto fetch is default true
        if ((scope.mwAutoFetch || angular.isUndefined(scope.mwAutoFetch)) && scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }

        if (!scope.mwRequired) {
          //We are adding a null object so we can use a placeholder and a null option
          //It is not possible to use 2 options in ng-select when ng-options is in use
          //So we have to add it to the collection
          addNullOption();
          scope.mwOptionsCollection.on('reset sync', addNullOption, this);
        }
      }
    };
  }])

  .directive('mwMultiSelectBoxes', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwOptionsCollection: '=',
        mwCollection: '=',
        labelProperty: '@mwOptionsLabelKey',
        i18nPrefix: '@mwOptionsLabelI18nPrefix',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@hiddenFormElementName',
        placeholder: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwMultiSelectBoxes.html',
      link: function (scope) {
        scope.viewModel = {
          tmpModel: new scope.mwCollection.model()
        };

        //Add the last selected item (only added when explicitely requested)
        scope.mwCollection.on('addBeforeSave', function() {
          if (scope.viewModel && scope.viewModel.tmpModel && scope.viewModel.tmpModel !== null && !scope.viewModel.tmpModel.isNew()) {
            scope.mwCollection.add(scope.viewModel.tmpModel.toJSON());
          }
        });
        
        //add empty model on + button
        scope.add = function (model) {
          scope.mwCollection.add(model.toJSON());
        };

        //remove the specific model or the last (empty) one if model is not found
        scope.remove = function (model) {
          scope.mwCollection.remove(model);
        };

        //get label to show in select boxes
        scope.getLabel = function (model) {
          var label = scope.labelProperty ? model.get(scope.labelProperty) : model.get('key');
          if (scope.i18nPrefix) {
            return i18n.get(scope.i18nPrefix + '.' + label);
          }
        };

        scope.mwCollection.on('add', function (model) {
          scope.mwOptionsCollection.remove(model);
        });

        scope.mwCollection.on('remove', function (model) {
          scope.mwOptionsCollection.add(model.toJSON());
        });

        scope.mwCollection.each(function (model) {
          scope.mwOptionsCollection.remove(model);
        });

      }
    };
  }]);

'use strict';

(function () {

  var validateRegex = function (value, regex) {
    if (value) {
      return !!value.match(regex);
    } else {
      return true;
    }
  };

  angular.module('mwFormValidators', [])

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidatePhone
   * @element input
   * @description
   *
   * Adds validation for phone numbers.
   * Valid Examples are: +491234567 or 00491234567
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
    .directive('mwValidatePhone', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /^\+(?:[0-9]){6,14}[0-9]$/;

          var removeNonDigitValues = function (value) {
            if (value) {
              value = value.replace(/[^ 0-9+]/g, '');
            }
            return value;
          };

          var validateNumber = function (value) {
            return validateRegex(value, regex);
          };

          ngModel.$validators.phone = validateNumber;
          ngModel.$formatters.push(removeNonDigitValues);
        }
      };
    })

    .directive('mwValidateHex', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /^(0x)?([0-9A-Fa-f])+$/;

          var validateHex = function (value) {
            ngModel.$setValidity('hex', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validateHex);
          ngModel.$parsers.push(validateHex);
        }
      };
    })

    .directive('mwValidateCollectionOrModel', function () {
      return {
        restrict: 'A',
        scope: {
          mwModel: '=mwValidateCollectionOrModel',
          mwRequired: '=',
          mwKey: '@'
        },
        require: '^?form',
        template: '<input type="text" ng-required="mwRequired" ng-model="model.tmp" name="{{uId}}" style="display: none">',
        link: function (scope, el, attr, formController) {

          var key = scope.mwKey || 'uuid';

          scope.model = {};
          scope.uId = _.uniqueId('validator_');

          var setDirty = function(){
            if(formController){
              formController.$setDirty();
            }
          };

          var unwatch = scope.$watch('mwModel', function () {
            var val = scope.mwModel;
            if (val) {
              if (val instanceof window.Backbone.Collection) {
                val.on('add remove reset', function () {
                  if(val.length > 0){
                    scope.model.tmp = val.first().get(key);
                  } else {
                    scope.model.tmp = undefined;
                  }
                  setDirty();
                });
                if(val.length > 0){
                  scope.model.tmp = val.first().get(key);
                } else {
                  scope.model.tmp = undefined;
                }
              } else if (val instanceof window.Backbone.Model) {
                key = scope.mwKey || val.idAttribute;
                val.on('change:'+key, function () {
                  scope.model.tmp = val.get(key);
                  setDirty();
                });
                scope.model.tmp = val.get(key);
              } else {
                throw new Error('Value is neither a model nor a collection! Make its one of them', val);
              }
              unwatch();
            }
          });
        }
      };
    })

    .directive('mwValidatePlaceholder', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /\$\{.*\}/;


          var validatePlaceholder = function (value) {
            ngModel.$setValidity('placeholder', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validatePlaceholder);
          ngModel.$parsers.push(validatePlaceholder);
        }
      };
    })

    .directive('mwValidatePlaceholderOrMail', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+([.][a-zA-Z0-9_-]+)*[.][a-zA-Z0-9._-]+$/,
            placeholderRegex = /\$\{.+\}/;

          ngModel.$validators.emailOrPlaceholder = function(value){
            return !!(validateRegex(value, mailRegex) || validateRegex(value, placeholderRegex));
          };
        }
      };
    })

    .directive('mwValidateMatch', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ctrl) {
          var pwdWidget = elm.inheritedData('$formController')[attr.mwValidateMatch];

          ctrl.$parsers.push(function (value) {
            var isValid = false;
            if (value === pwdWidget.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });

          pwdWidget.$parsers.push(function (value) {
            var isValid = false;
            if (value === ctrl.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidateUniqueness
   * @element input
   * @description
   *
   * Adds validation of uniqueness for a given array of strings.
   *
   * @param {Array.<String>} mwValidateUniqueness Array of existing items to validate against
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
    .directive('mwValidateUniqueness', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var existingValues;

          scope.$watch(attr.mwValidateUniqueness, function (value) {
            existingValues = value;
          });

          /**
           * Add parser/formatter to model which checks if the model value is
           * a value that already exists and set validation state accordingly
           */
          var validateUniqueness = function (value) {
            var isValid = true;
            if (angular.isArray(existingValues) && existingValues.length > 0 && value && ngModel.$dirty) {
              isValid = (existingValues.indexOf(value) === -1);
            }
            ngModel.$setValidity('unique', isValid);
            return value;
          };
          ngModel.$parsers.unshift(validateUniqueness);
          ngModel.$formatters.unshift(validateUniqueness);
        }
      };
    })

    .config(['mwValidationMessagesProvider', function(mwValidationMessagesProvider){
      mwValidationMessagesProvider.registerValidator('withoutChars','errors.withoutChar');
      mwValidationMessagesProvider.registerValidator('withoutChar','errors.withoutChars');
    }])

    .directive('mwValidateWithoutChar', ['$parse', 'mwValidationMessages', 'i18n', function($parse, mwValidationMessages, i18n){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var validatorChars,
              validatorChar = attr.mwValidateWithoutChar;

          try{
            validatorChars = $parse(attr.mwValidateWithoutChar)(scope);
          } catch(err){}

          if(_.isArray(validatorChars)){
            mwValidationMessages.updateMessage('withoutChars', function(){
              return i18n.get('errors.withoutChars',{ chars: '"'+validatorChars.join('", "') + '"' });
            });

            ngModel.$validators.withoutChars = function(value){
              var valid = true;

              if(value){
                validatorChars.forEach(function(validatorChar){
                  if(valid){
                    valid = value.indexOf(validatorChar) < 0;
                  }
                });
              }

              return valid;
            };
          } else if(validatorChar){
            mwValidationMessages.updateMessage('withoutChar', function(){
              return i18n.get('errors.withoutChar',{ char: validatorChar });
            });

            ngModel.$validators.withoutChar = function(value){
              var valid = true;
              if(value){
                valid = value.indexOf(validatorChar) < 0;
              }
              return valid;
            };
          }
        }
      };
    }])

    .config(['mwValidationMessagesProvider', function(mwValidationMessagesProvider){
      mwValidationMessagesProvider.registerValidator('onlyWordChars','errors.onlyWordChars');
    }])

    .directive('mwValidateWordChars', function(){
      return {
        require: 'ngModel',
        link: function(scope, elm, attr, ngModel){
          ngModel.$validators.onlyWordChars = function(value){
            if(value){
              return !value.match(/\W/g);
            } else {
              return true;
            }
          };
        }
      };
    })

    .directive('mwValidateItunesOrHttpLink', function(){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var itunesOrHttpLinkRegex = /^(https?|itms|itms-apps):\/\/.+$/;
          ngModel.$validators.itunesOrHttpLink = function(value){
            return validateRegex(value, itunesOrHttpLinkRegex);
          };
        }
      };
    })

    .config(['mwValidationMessagesProvider', function(mwValidationMessagesProvider){
      mwValidationMessagesProvider.registerValidator('minValidDate','errors.minDate');
      mwValidationMessagesProvider.registerValidator('maxValidDate','errors.maxDate');
    }])

    .directive('mwValidateDate', ['mwValidationMessages', 'i18n', function(mwValidationMessages, i18n){
      return {
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel){

          ngModel.$validators.minValidDate = function(value){
            var minDate = scope.$eval(attrs.minDate),
              currentDateTs = +new Date(value),
              minDateTs = +new Date(minDate);

            return !minDate || !value || currentDateTs > minDateTs;
          };

          ngModel.$validators.maxValidDate = function(value){
            var maxDate = scope.$eval(attrs.maxDate),
              currentDateTs = +new Date(value),
              maxDateTs = +new Date(maxDate);

            return !maxDate || !value || currentDateTs < maxDateTs;
          };

          attrs.$observe('minDate', function(val){
            if(val){
              mwValidationMessages.updateMessage('minValidDate', function(){
                return i18n.get('errors.minValidDate',{ minDate: new Date( scope.$eval(val) ).toLocaleString() });
              });
            }
          });
          attrs.$observe('maxDate', function(val){
            if(val){
              mwValidationMessages.updateMessage('maxValidDate', function(){
                return i18n.get('errors.maxValidDate',{ maxDate: new Date( scope.$eval(val) ).toLocaleString() });
              });
            }
          });
        }
      };
    }]);

})();
'use strict';

angular.module('mwHelper', [])

  .directive('mwSetDirtyOn', function(){
    return {
      restrict: 'A',
      scope: {
        mwSetDirtyOn: '@'
      },
      require: '^form',
      link: function (scope, elm, attr, formCtrl) {
        elm.on(scope.mwSetDirtyOn, function(){
          formCtrl.$setDirty();
        });
      }
    };
  })

  .service('mwDefaultFocusService', function(){
    var MwDefaultFocusService = function(){
        var _registeredFocusFields = [];
        this.register = function(id, el){
          _registeredFocusFields.push({
            id: id,
            el: el,
            active: false
          });
        };

        var update = function(id, newObj){
          var inputField = _.findWhere(_registeredFocusFields,{id:id}),
            index = _.indexOf(_registeredFocusFields,inputField);
            if(index>=0){
              _registeredFocusFields[index] = newObj;
            }
        };

        this.setFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if(this.getFocusedField() && this.getFocusedField().id !== id){
            throw new Error('There can be only one focused field');
          }
          if(inputField){
            inputField.active = true;
            update(inputField);
          }
        };

        this.removeFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if (inputField){
            inputField.active = false;
            update(inputField);
          }
        };

        this.toggleFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if(inputField){
            inputField.active = !inputField.active;
            update(inputField);
          }
        };

        this.getFocusedField = function(){
          return _.findWhere(_registeredFocusFields,{active:true});
        };

        this.remove = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id}),
              index = _.indexOf(_registeredFocusFields,inputField);
          if(index>=0){
            _registeredFocusFields.splice(index,1);
          }
        };
    };

    return new MwDefaultFocusService();
  })

  .directive('mwDefaultFocus', ['mwDefaultFocusService', function (mwDefaultFocusService) {
    return {
      restrict: 'A',
      scope:{
        isFocused: '=mwDefaultFocus'
      },
      link: function (scope, el) {
        var id = _.uniqueId('focus_field');
        mwDefaultFocusService.register(id, el);

        var setFocus = function(){
          if(el.is(':focus')){
            return;
          } else {
            try{
              mwDefaultFocusService.setFocus(id);
              el[0].focus();
              window.requestAnimFrame(setFocus);
            } catch(err){
              console.warn(err);
            }

          }
        };

        scope.$watch('isFocused',function(isFocused){
          if(isFocused){
            window.requestAnimFrame(setFocus);
          } else {
            el[0].blur();
            mwDefaultFocusService.removeFocus(id);
          }
        });

        scope.$on('$destroy',function(){
          mwDefaultFocusService.remove(id);
        });
      }
    };
  }])

  .service('LayoutWatcher', ['$timeout', '$window', function ($timeout, $window) {

    var _callbacks = [];
    var _notify = function(){
      _callbacks.forEach(function(scopedCallback){
        scopedCallback.callback.apply(scopedCallback.scope);
      });
    };
    angular.element('body').on('DOMNodeInserted',_.throttle(_notify, 300));
    angular.element('body').on('DOMNodeRemoved',_.throttle(_notify, 300));
    angular.element($window).on('resize', _.throttle(_notify, 300));
    $timeout(_notify,500);
    return {
      registerCallback: function(cb,scope){
        if(typeof cb  === 'function'){
          var scopedCallback = {
            callback: cb,
            scope: scope
          };
          _callbacks.push(scopedCallback);
        } else {
          throw new Error('Callback has to be a function');
        }
      }
    };
  }])

  .directive('mwSetFullScreenHeight', ['LayoutWatcher', function (LayoutWatcher) {
    return {
      restrict: 'A',
      scope:{
        'subtractElements':'=',
        'offset':'@'
      },
      link: function (scope, el) {

        el.addClass('mw-full-screen-height');

        var setHeight = function(){
          var height = angular.element(window).height();

          scope.subtractElements.forEach(function(elIdentifier){
            var $el = angular.element(elIdentifier);
            if($el){
              var padding = {
                    top: parseInt($el.css('padding-top'),10),
                    bottom: parseInt($el.css('padding-bottom'),10)
                  };
              height -= $el.height();
              height -= padding.top;
              height -= padding.bottom;
            }
          });
          if(scope.offset){
            height -= scope.offset;
          }
          el.css('height',height);
        };

        LayoutWatcher.registerCallback(setHeight);

      }
    };
  }])


  .directive('mwInvertModelValue', function (){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attr, ngModelCtrl){
        var invert = function(value){
          if(typeof(value) === 'boolean') {
            return !value;
          }
          return value;
        };
        ngModelCtrl.$parsers.push(invert);
        ngModelCtrl.$formatters.push(invert);
      }
    };
  })

  .directive('mwRemoveXs', ['Detect', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  }])

  .directive('mwRemoveMd', ['Detect', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone() || Detect.isTablet()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwHelper.directive:mwAutofillCheck
   * @element ANY
   *
   * @description
   * Workaround for Firefox auto fill bug for input directives. Place this directive on a form tag.
   */
  .directive('mwAutofillCheck', ['$interval', function($interval){
    return {
      restrict: 'A',
      link: function( scope, elm ){
        var inputElements = elm.find('input');
        var stopInterval = null;

        inputElements.on('keyup', function(){
          if(stopInterval === null){
            stopInterval = $interval(function(){
              inputElements.trigger('input').trigger('change').trigger('keydown');
            }, 500);
          }
        });

        scope.$on('$destroy', function(){
          $interval.cancel(stopInterval);
        });
      }
    };
  }]);
/**
 * Created by zarges on 11/01/16.
 */
angular.module('mwUI.mwLayout', []);
/**
 * Created by zarges on 08/01/16.
 */
'use strict';

angular.module('mwUI.mwLayout')

  .provider('mwMenu', function () {

    var _entries = [];

    var Entry = function (url, label, icon, options) {
      this.url = url;
      this.label = label;
      this.icon = icon;

      this.options = _.extend({
        order: null,
        activeUrls: [url],
        subEntries: [],
        divider: false
      },options || {});

      this.isDivider = this.options.divider;

      if(!this.url && !options.divider){
        throw new Error('Url is a required constructor param');
      }

      return this;
    };

    _.extend(Entry.prototype, {
      isActive: function () {

      },
      getActive: function(){

      }
    });

    var SubEntry = function () {
      var superConstr = Entry.apply(this, arguments);
      return superConstr;
    };

    SubEntry.prototype = Object.create(Entry.prototype);
    SubEntry.prototype.constructor = SubEntry;

    var MainEntry = function (url, label, icon, options) {
      var superConstr = Entry.apply(this, arguments);
      this._subEntries = [];
      if (this.options.subEntries) {
        this.options.subEntries.forEach(function (entry) {
          this.registerSubEntry(entry.url,entry.label,entry.icon,options);
        }.bind(this));
      }
      return superConstr;
    };

    MainEntry.prototype = Object.create(Entry.prototype);
    MainEntry.prototype.constructor = MainEntry;

    _.extend(MainEntry.prototype, {
      addSubEntry: function (url, label, icon, options) {
        options = _.extend({order: this._subEntries.length}, options || {});
        var entry = new SubEntry(url, url, label, icon, options);

        if (_.findWhere(this._subEntries, {url: entry.url})) {
          throw new Error('Sub entry with the url ' + entry.url + ' already exists');
        } else {
          this._subEntries.push(entry);
        }
        return entry;
      },
      getSubEntries: function () {
        return this._subEntries;
      },
      getSubEntriesWithoutDividers: function(){
        return _.where(this._subEntries,{isDivider: false});
      },
      addDivider: function(id, label, icon, options){
        options = _.extend({order: this._subEntries.length}, options || {});
        options.divider = true;
        var entry = new SubEntry(id, null, label, icon, options);
        if (_.findWhere(this._subEntries, {id: entry.id})) {
          throw new Error('Entry with the id ' + entry.id + ' already exists');
        } else {
          this._subEntries.push(entry);
        }
      },
      getDividers: function(){
        return _.where(this._subEntries,{isDivider: true});
      }
    });

    this.$get =  function () {
      return {
        getEntries: function () {
          return _entries;
        },
        getActiveEntry: function(){

        },
        addEntry: function (url, label, icon, options) {
          options = _.extend({order: _entries.length}, options || {});
          var entry = new MainEntry(url, url, label, icon, options);

          if (_.findWhere(_entries, {url: entry.url})) {
            throw new Error('Entry with the url ' + entry.url + ' already exists');
          } else {
            _entries.push(entry);
          }
          return entry;
        },
        removeEntry: function (entry) {
          entry = _.findWhere(_entries, {id: entry.id || entry});
          if (!entry) {
            throw new Error('The entry could not be found');
          } else {
            _entries = _.without(_entries, entry);
          }
        }
      };
    };

  })

  .directive('mwMenu', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwLayout/mw_menu.html',
      link: function () {

      }
    };
  });
/**
 * Created by zarges on 27/05/15.
 */
'use strict';

angular.module('mwCollection', ['ngRoute', 'mwUI.Backbone', 'mwUI.Utils'])

  .service('MwListCollection', ['$q', 'MwListCollectionFilter', function ($q, MwListCollectionFilter) {

    var MwListCollection = function (collection, id) {

      var _collection = collection,
        _id = (id || collection.endpoint) + '_V1',
        _mwFilter = new MwListCollectionFilter(_id);

      this.getMwListCollectionFilter = function () {
        return _mwFilter;
      };

      this.getCollection = function () {
        return _collection;
      };

      this.fetch = function () {
        var mwListCollectionFilter = this.getMwListCollectionFilter();

        return $q.all([
          mwListCollectionFilter.fetchAppliedFilter(),
          mwListCollectionFilter.fetchAppliedSortOrder(),
          mwListCollectionFilter.fetchAppliedSearchTerm()
        ]).then(function (rsp) {
          var appliedFilter = rsp[0],
            sortOrder = rsp[1],
            searchTerm = rsp[2],
            filterValues = appliedFilter.get('filterValues');

          if (sortOrder.property) {
            _collection.filterable.setSortOrder(sortOrder.order + sortOrder.property);
          }

          if (searchTerm.val) {
            var searchTermFilter = {};
            searchTermFilter[searchTerm.attr] = searchTerm.val;
            try{
              _collection.filterable.setFilters(searchTermFilter);
            } catch (err){
              console.warn('[MwListCollection] The filter attribute '+searchTerm.attr+' for the searchterm '+searchTerm.val+' does not exist!');
              mwListCollectionFilter.clearAppliedSearchTerm();
            }
          }

          if (!appliedFilter.isNew()) {
            try{
              _collection.filterable.setFilters(filterValues);
            } catch(err){
              console.warn('[MwListCollection] Filter could not be applied!',err);
              mwListCollectionFilter.clearAppliedFilter();
            }
          }

          if (!mwListCollectionFilter.hasAppliedFilterOrSearchTerm()) {
            _collection.filterable.filterIsSet = false;
          }

          return _collection.fetch().then(function () {
            return this;
          }.bind(this));
        }.bind(this));
      };

      collection.on('change:sortOrder', function (sortOrder) {
        this.getMwListCollectionFilter().applySortOrder(sortOrder);
      }, this);
    };

    return MwListCollection;

  }]);
angular.module('mwCollection')

  .service('MwListCollectionFilter', ['$q', '$rootScope', '$location', '$route', 'mwUrlStorage', 'mwRuntimeStorage', 'FilterHoldersCollection', 'FilterHolderProvider', function ($q,
                                               $rootScope,
                                               $location,
                                               $route,
                                               mwUrlStorage,
                                               mwRuntimeStorage,
                                               FilterHoldersCollection,
                                               FilterHolderProvider) {

    var Filter = function (type) {

      var _type = type,
        _localFilterIdentifier = 'applied_filter_' + _type,
        _localSortOrderIdentifier = 'applied_sort_order_' + _type,
        _localSearchIdentifier = 'applied_search_' + _type,
        _filterHolders = new FilterHoldersCollection(null, type),
        _appliedFilter = FilterHolderProvider.createFilterHolder(),
        _appliedSearchTerm = {
          attr: null,
          val: null
        },
        _appliedSortOrder = {
          order: null,
          property: null
        };

      var setUrlQueryParams = function () {
        var searchFilter = {};

        if (!_appliedFilter.isNew()) {
          searchFilter.f = _appliedFilter.id;
        } else {
          searchFilter.f = null;
        }

        if (_appliedSearchTerm.val && _appliedSearchTerm.val.length > 0) {
          searchFilter.qAttr = _appliedSearchTerm.attr;
          searchFilter.q = _appliedSearchTerm.val;
        } else {
          searchFilter.qAttr = null;
          searchFilter.q = null;
        }

        if (_appliedSortOrder.property) {
          searchFilter.s = _appliedSortOrder.property;
          searchFilter.sOrder = _appliedSortOrder.order === '+' ? 'ASC' : 'DESC';
        }

        mwUrlStorage.setObject(searchFilter, {removeOnUrlChange: true});
      };

      var urlContainsFilters = function () {
        return (mwUrlStorage.getItem('q') && mwUrlStorage.getItem('qAttr')) || mwUrlStorage.getItem('f');
      };

      var urlContainsSortOrder = function () {
        return (mwUrlStorage.getItem('s'));
      };

      this.hasAppliedFilterOrSearchTerm = function () {
        return (_appliedSearchTerm.val && _appliedSearchTerm.val.length > 0) || !_appliedFilter.isNew();
      };

      this.getFilters = function () {
        return _filterHolders;
      };

      // FilterHolders save in backend
      this.fetchFilters = function () {
        if (_filterHolders.length > 0 || _filterHolders.fetched) {
          return $q.when(_filterHolders);
        } else {
          return _filterHolders.fetch().then(function () {
            _filterHolders.fetched = true;
            return _filterHolders;
          });
        }
      };

      this.saveFilter = function (filterModel) {
        _filterHolders.add(filterModel, {merge: true});
        return filterModel.save().then(function (savedModel) {
          _filterHolders.add(savedModel, {merge: true});
          return savedModel;
        });
      };

      this.deleteFilter = function (filterModel) {
        var id = filterModel.id;

        return filterModel.destroy().then(function () {
          if (id === _appliedFilter.id) {
            this.revokeFilter();
          }
        }.bind(this));
      };

      this.getAppliedFilter = function () {
        return _appliedFilter;
      };

      this.filterWasSetByUser = function (filter) {
        return this.fetchFilters().then(function () {
          return !!_filterHolders.findWhere({uuid: filter.uuid});
        }, function () {
          return false;
        });
      };

      this._getAppliedFilterFromUrl = function () {
        var filterUuid = mwUrlStorage.getItem('f');
        if (filterUuid) {
          return {uuid: filterUuid};
        } else {
          return null;
        }
      };

      // Filter that was applied and saved in local storage
      this.fetchAppliedFilter = function () {
        if (urlContainsFilters()) {
          var urlFilter = this._getAppliedFilterFromUrl();
          if (urlFilter) {
            return this.filterWasSetByUser(urlFilter).then(function (wasSetByUser) {
              if (wasSetByUser) {
                // Update localstorage filter
                this.applyFilter(_filterHolders.findWhere(urlFilter));
                return _appliedFilter;
              } else {
                // Do not update local storage but update appliedFilter
                return this.clearAppliedFilter();
              }
            }.bind(this));
          } else {
            return this.clearAppliedFilter();
          }
        } else if (_appliedFilter.get('uuid')) {
          return $q.when(_appliedFilter);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localFilterIdentifier)).then(function (appliedFilter) {
            if (appliedFilter) {
              return this.filterWasSetByUser(appliedFilter).then(function (wasSetByUser) {
                if (wasSetByUser) {
                  return this.applyFilter(appliedFilter);
                } else {
                  return _appliedFilter;
                }
              }.bind(this));
            } else {
              return _appliedFilter;
            }
          }.bind(this));
        }
      };

      this.clearAppliedFilter = function () {
        _appliedFilter.clear();
        return $q.when(mwRuntimeStorage.removeItem(_localFilterIdentifier)).then(function () {
          setUrlQueryParams();
          return _appliedFilter;
        });
      };

      this.applyFilter = function (filterModel) {
        var jsonFilter;
        if (filterModel instanceof Backbone.Model) {
          jsonFilter = filterModel.toJSON();
        } else if (_.isObject(filterModel)) {
          jsonFilter = filterModel;
        }

        if (jsonFilter && _appliedFilter.id !== jsonFilter.uuid) {
          _appliedFilter.set(jsonFilter);
          setUrlQueryParams();
          return $q.when(mwRuntimeStorage.setItem(_localFilterIdentifier, jsonFilter)).then(function () {
            return _appliedFilter;
          });
        } else {
          return $q.resolve(_appliedFilter);
        }
      };

      this.revokeFilter = function () {
        var promises = [];
        promises.push(this.clearAppliedFilter());
        promises.push(this.clearAppliedSearchTerm());
        return $q.all(promises);
      };

      this.getAppliedSortOrder = function () {
        return _appliedSortOrder;
      };

      this._getAppliedSortOrderFromUrl = function () {
        var property = mwUrlStorage.getItem('s'),
          order = mwUrlStorage.getItem('sOrder');

        if (property) {
          return {
            order: order === 'ASC' ? '+' : '-',
            property: property
          };
        } else {
          return null;
        }
      };

      // Sort order that was applied and saved in local storage
      this.fetchAppliedSortOrder = function () {
        if (urlContainsSortOrder()) {
          var urlSortOrder = this._getAppliedSortOrderFromUrl();
          return this.applySortOrder(urlSortOrder);
        } else if (_appliedSortOrder.order && _appliedSortOrder.property) {
          return $q.when(_appliedSortOrder);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localSortOrderIdentifier)).then(function (appliedSortOrder) {
            _appliedSortOrder = appliedSortOrder || {order: null, property: null};
            return _appliedSortOrder;
          });
        }
      };

      this.applySortOrder = function (sortOrderObj) {
        if (_.isString(sortOrderObj)) {
          var sortString = sortOrderObj.match(/([+-])(\w+)/);

          if (sortString && sortString.length === 3) {
            sortOrderObj = {
              order: sortString[1],
              property: sortString[2]
            };
          }
        }
        _appliedSortOrder = sortOrderObj;
        _appliedFilter.set(_appliedSortOrder);
        setUrlQueryParams();
        return $q.when(mwRuntimeStorage.setItem(_localSortOrderIdentifier, sortOrderObj)).then(function () {
          return sortOrderObj;
        });
      };

      this.revokeSortOrder = function () {
        _appliedSortOrder = {
          order: null,
          property: null
        };
        return mwRuntimeStorage.removeItem(_localSortOrderIdentifier).then(function () {
          setUrlQueryParams();
        });
      };

      this.clearAppliedSearchTerm = function () {
        _appliedSearchTerm = {
          attr: null,
          val: null
        };
        return $q.when(mwRuntimeStorage.removeItem(_localSearchIdentifier)).then(function () {
          setUrlQueryParams();
          return _appliedFilter;
        });
      };

      this.applySearchTerm = function (attr, searchTerm) {
        if (_appliedSearchTerm.val !== searchTerm && attr) {
          _appliedSearchTerm = {
            attr: attr,
            val: searchTerm && searchTerm.length > 0 ? searchTerm : null
          };
          setUrlQueryParams();
          return $q.when(mwRuntimeStorage.setItem(_localSearchIdentifier, _appliedSearchTerm)).then(function () {
            return _appliedSearchTerm;
          });
        } else {
          return $q.resolve(_appliedSearchTerm);
        }
      };

      this._getAppliedSearchTermFromUrl = function () {
        var searchAttr = mwUrlStorage.getItem('qAttr'),
          searchVal = mwUrlStorage.getItem('q');

        if (searchAttr && searchAttr.length > 0 && searchVal && searchVal.length > 0) {
          return {
            attr: searchAttr,
            val: searchVal
          };
        } else {
          return null;
        }
      };

      this.fetchAppliedSearchTerm = function () {
        if (urlContainsFilters()) {
          var urlSearchTerm = this._getAppliedSearchTermFromUrl();
          if (urlSearchTerm) {
            return this.applySearchTerm(urlSearchTerm.attr, urlSearchTerm.val);
          } else {
            return this.clearAppliedSearchTerm();
          }
        } else if (_appliedSearchTerm.val) {
          return $q.when(_appliedSearchTerm);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localSearchIdentifier)).then(function (appliedSearch) {
            appliedSearch = appliedSearch || {};
            return this.applySearchTerm(appliedSearch.attr, appliedSearch.val);
          }.bind(this));
        }

      };
    };

    return Filter;
  }])

  .service('FilterHolderProvider', ['FilterHolderModel', function (FilterHolderModel) {
    return {
      createFilterHolder: function () {
        return new FilterHolderModel(); // using new in MwListCollectionFilter above destroys testability
      }
    };
  }]);


'use strict';

angular.module('mwListable', [])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListable
 * @element table
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} selectable Instance of selectable for this listable item
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination.
 * @example
 * <doc:example>
 *   <doc:source>
 *    <table mw-listable
 *           selectable="selectable"
 *           filterable="filterable">
 *      <thead>
 *        <tr>
 *          <th mw-listable-header>A column</th>
 *        </tr>
 *      </thead>
 *      <tbody>
 *        <tr ng-repeat="item in filterable.items()">
 *          <td>Column content</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </doc:source>
 * </doc:example>
 */
    .directive('mwListable', ['$compile', '$window', '$document', function ($compile, $window, $document) {

      return {
        restrict: 'A',
        scope: {
          selectable: '=',
          filterable: '='
        },
        compile: function  (elm) {

          elm.append('<tfoot mw-listable-footer></tfoot>');

          return function (scope, elm) {
            elm.addClass('table table-striped mw-listable');

            /**
             * Infinite scrolling
             */
            var scrollCallback = function () {
              if(scope.filterable){
                if (w.scrollTop() >= (d.height() - w.height())*0.8) {
                  scope.filterable.loadMore();
                }
              }
            };
            var modalScrollCallback = function () {
              if(scope.filterable &&
                 modalBody[0].scrollHeight > 0 &&
                 (modalBody[0].scrollHeight - modalBody.scrollTop() - modalBody[0].clientHeight < 2)) {
                scope.filterable.loadMore();
              }
            };

            if(elm.parents('.modal').length){
              //filterable in modal
              var modalBody = elm.parents('.modal-body');

              // Register scroll callback
              modalBody.on('scroll', modalScrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                modalBody.off('scroll', modalScrollCallback);
              });
            } else {
              //filterable in document
              var w = angular.element($window);
              var d = angular.element($document);

              // Register scroll callback
              w.on('scroll', scrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                w.off('scroll', scrollCallback);
              });
            }
          };
        },
        controller: ['$scope', function ($scope) {
          var columns = $scope.columns = [];

          this.actionColumns = [];

          this.sort = function (property, order) {
            if($scope.filterable){
              $scope.filterable.setSortOrder(order + property);
            }
          };

          this.getSort = function () {
            if($scope.filterable){
              return $scope.filterable.sortOrder();
            }
          };

          this.registerColumn = function (scope) {
            columns.push(scope);
          };

          this.getColumns = function() {
            return columns;
          };

          this.getFilterable = function () {
            return $scope.filterable;
          };

          this.getSelectable = function () {
            return $scope.selectable;
          };

          this.toggleAll = function () {
            if ($scope.selectable.allSelected()) {
              $scope.selectable.unselectAll();
            } else {
              $scope.selectable.selectAll();
            }
          };

          this.isRadio = function(){
            if($scope.selectable){
              return $scope.selectable.isRadio();
            }
            return false;
          };
        }]
      };
    }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHead
 * @element thead
 * @description
 *
 * Displays amount of items from filterable and the amount of selected items of the selectable
 *
 */

  .directive('mwListableHead', ['$compile', function($compile) {
    return {
      require: '^mwListable',
      scope:{
        title:'@mwListableHead'
      },
      link: function(scope,el,attr,mwListable){
        scope.filterable = mwListable.getFilterable();
        scope.selectable = mwListable.getSelectable();

        var tmpl = '<tr>' +
          '<th colspan="20" class="listable-amount" ng-if="filterable.total()">' +
            '<span ng-if="selectable.selected().length>0">{{selectable.selected().length}}/{{filterable.total()}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
            '<span ng-if="!selectable || selectable.selected().length<1">{{filterable.total()}} {{title}}</span>' +
          '</th>' +
        '</tr>',
        $tmpl = angular.element(tmpl),
        compiled = $compile($tmpl);

        el.prepend($tmpl);
        compiled(scope);
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableFooter
 * @element tfoot
 * @description
 *
 * Displays footer with:
 * * loading spinner if list is loading
 * * 'none found' message if filterable is empty
 * * 'load more' button for pagination
 *
 */

    .directive('mwListableFooter', ['Loading', function(Loading) {
      return {
        require: '^mwListable',
        templateUrl: 'uikit/templates/mwListable/mwListableFooter.html',
        link: function(scope, elm, attr, mwListableCtrl) {
          scope.Loading = Loading;
          scope.columns = mwListableCtrl.getColumns();
        }
      };
    }])


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeader
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} sort Property key of the model to sort by
 */
    .directive('mwListableHeader', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          property: '@sort',
          width:'@',
          sortActive:'='
        },
        transclude: true,
        replace:true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeader.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          var ascending = '+',
              descending = '-';

          scope.toggleSortOrder = function () {
            if (scope.property) {
              var sortOrder = ascending; //default
              if (mwListableCtrl.getSort() === ascending + scope.property) {
                sortOrder = descending;
              }
              mwListableCtrl.sort(scope.property, sortOrder);
            }
          };

          scope.isSelected = function (prefix) {
            if(prefix){
              return mwListableCtrl.getSort() === prefix + scope.property;
            } else {
              return (mwListableCtrl.getSort() === '+' + scope.property || mwListableCtrl.getSort() === '-' + scope.property);
            }
          };

          if(scope.property){
            elm.find('.title').on('click',scope.toggleSortOrder);
          }

          mwListableCtrl.registerColumn(scope);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableColumnCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select item' checkbox in content.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableColumnCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          mwDisabled: '=',
          item: '='
        },
        templateUrl: 'uikit/templates/mwListable/mwListableColumnCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.selectable = mwListableCtrl.getSelectable();
          scope.radio = mwListableCtrl.isRadio();
          scope.click = function (item, $event) {
            $event.stopPropagation();
            scope.selectable.toggle(item);
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header.
 *
 * @scope
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeaderCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.radio = mwListableCtrl.isRadio();
          scope.filterable = mwListableCtrl.getFilterable();
          scope.selectable = mwListableCtrl.getSelectable();
          scope.toggleAll = mwListableCtrl.toggleAll;
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableRow
 * @element tr
 * @description
 *
 * Directive for table row. Adds click actions. And class 'selected' if row is selected.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableBodyRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        compile: function (elm) {

          elm.prepend('<td ng-if="selectable" mw-listable-column-checkbox mw-disabled="isDisabled()" item="item"></td>');

          return function (scope, elm, attr) {
            var selectedClass = 'selected';
            if(scope.selectable){
              elm.addClass('selectable');
            }

            elm.on('click', function () {
              if (scope.selectable && !scope.isDisabled(scope.item)) {
                scope.selectable.toggle(scope.item);
                scope.$apply();
              }
            });

            scope.$watch('selectable.isSelected(item)', function (value) {
              if(value) {
                elm.addClass(selectedClass);
              } else {
                elm.removeClass(selectedClass);
              }
            });

            scope.isDisabled = function () {
              return scope.$eval(attr.mwListableDisabled, { item: scope.item });
            };
          };
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderRow
 * @element tr
 * @description
 *
 * Directive for table header row. Adds mw-listable-header-checkbox if selectable is present and th tags for actionColumns.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        compile: function (elm) {
          elm.prepend('<th ng-if="selectable" mw-listable-header-checkbox width="1%"></th>');
          elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

          return function (scope, elm, attr, mwListableCtrl) {
            scope.selectable = mwListableCtrl.getSelectable();
            scope.actionColumns = mwListableCtrl.actionColumns;
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkEdit
 * @element td
 * @description
 *
 * Directive to add a button link to edit a dataset.
 *
 * @param {string} mwListableLinkEdit URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkEdit', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkEdit'
        },
        template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm"><span mw-icon="rln-icon edit"></span></a>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkShow
 * @element td
 * @description
 *
 * Directive to add a button link to show a dataset.
 *
 * @param {string} mwListableLinkShow URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkShow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkShow'
        },
        template: '<span mw-link-show="{{link}}"></span>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwRowIdentifier
 * @description
 *
 * Directive that adds title attribute to th and td elements. Used to hide columns in css for special branding
 *
 * @param {string} mwRowIdentifier the title to be used
 *
 */
    .directive('mwRowIdentifier', function () {
      return {
        restrict: 'A',
        link: function (scope, elm, attr) {
          if(attr.mwRowIdentifier){
            attr.$set('title', attr.mwRowIdentifier);
          }
        }
      };
    })
;
'use strict';

angular.module('mwMap', [])

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizard
 * @element div
 * @description
 *
 * Multiple wizard steps can be transcluded into this directive. This Directive handles the
 * registration of every single wizard step
 *
 * @param {wizard} mw-wizard Wizard instance created by the Wizard service.
 */
  .directive('mwMap', function () {
    return {
      restrict: 'A',
      scope: {
        centerLat: '=',
        centerLng: '=',
        zoom: '=',
        type:'@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwMap/mwMap.html',
      controller: ['$window', '$scope', 'LayoutWatcher', function ($window,$scope, LayoutWatcher) {
        if(!$window.ol){
          throw new Error('The directive mwMap needs the Openlayer 3 library. Make sure you included it!');
        }

        var openlayer = this.openlayer = $window.ol;


        var centerCoords = [$scope.lng || 9.178977, $scope.lat || 48.812951],
            zoom = $scope.zoom || 1,
            type = $scope.type || 'osm';

        var centerMap = function(){
          if($scope.centerLat && $scope.centerLng){
            $scope.map.getView().setCenter(openlayer.proj.transform([$scope.centerLng,$scope.centerLat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        var resize = function(){
          $scope.map.updateSize();
        };

        $scope.map = this.map = new openlayer.Map({
          layers: [
            new openlayer.layer.Tile({
              source: new openlayer.source.MapQuest({layer: type,minZoom:6})
            })
          ],
          ol3Logo:false,
          view: new openlayer.View({
            center: openlayer.proj.transform(centerCoords, 'EPSG:4326', 'EPSG:3857'),
            zoom: zoom,
            minZoom: 6
          })
        });

        $scope.$watch('zoom',function(value) {
          if (value) {
            $scope.map.getView().setZoom(value);
          }
        });

        $scope.$watch('centerLat',centerMap);
        $scope.$watch('centerLng',centerMap);

        LayoutWatcher.registerCallback(resize);

        $scope.$on('$destroy',function(){
          $scope.map.removeLayer();
          $scope.map.removeOverlay();
        });
      }],
      link:function(scope,el){
        scope.map.setTarget(el.find('#map')[0]);
      }
    };
  })

  .directive('mwMapMarker', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '='
      },
      require: '^mwMap',
      template: '<div class="marker"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
            openlayer = mwMapCtrl.openlayer,
            coords = [scope.lng || 0, scope.lat || 0];

        var marker = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            marker.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(marker);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$on('$destroy',function(){
          map.removeOverlay(marker);
        });
      }
    };
  })

  .directive('mwMapOverlay', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        display: '='
      },
      transclude: true,
      require: '^mwMap',
      template: '<div ng-transclude class="overlay mw-map-overlay"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0];

        var overlay = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el.find('.mw-map-overlay')[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            overlay.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(overlay);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$watch('display',function(display){
          if(display){
            map.addOverlay(overlay);
            setPosition();
          } else {
            map.removeOverlay(overlay);
          }
        });

        scope.$on('$destroy',function(){
          map.removeOverlay(overlay);
        });
      }
    };
  })

  .directive('mwMapCircle', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        radius: '=',
        fill: '@',
        stroke: '@',
        strokeWidth: '@'
      },
      require: '^mwMap',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0],
          radius = scope.radius || 1000,
          fill = scope.fill || 'rgba(255, 255, 255, .5)',
          stroke = scope.stroke || '#fff',
          strokeWidth = scope.strokeWidth || 3;

        map.on('postcompose', function(evt) {
          evt.vectorContext.setFillStrokeStyle(
            new openlayer.style.Fill({color: fill}),
            new openlayer.style.Stroke({color: stroke, width: strokeWidth}));
          evt.vectorContext.drawCircleGeometry(
            new openlayer.geom.Circle(openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'), radius));
        });
      }
    };
  });


'use strict';

angular.module('mwNav', [])

    .directive('mwNavbar', ['$location', function ($location) {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'uikit/templates/mwNav/mwNavbar.html',
        controller: function () {
          this.isActive = function (path, exact) {
            if(!path) {
              return false;
            }
            var newPath = path.substring(1);
            if(exact){
              return $location.path() === newPath;
            }
            return $location.path().indexOf(newPath) > -1;
          };
        }
      };
    }])

    .directive('mwNavbarContent', function () {
      return {
        transclude: true,
        replace: true,
        template: '<div class="navbar-collapse collapse" ng-transclude></div>',
        link: function(scope, elm) {
          scope.uncollapse = function() {
            if(elm.hasClass('in')) {
              elm.collapse('hide');
            }
          };
        }
      };
    })

    .directive('mwNavbarBrand', function () {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'uikit/templates/mwNav/mwNavbarBrand.html'
      };
    })

    .directive('mwNavbarItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="nav navbar-nav" ng-transclude></ul>',
        link: function (scope, elm, attr) {

          if(attr.mwNavbarItems) {
            elm.addClass('navbar-' + attr.mwNavbarItems);
          }

          elm.on('click', function () {
            if (elm.hasClass('in')) {
              elm.collapse('hide');
            }
          });
        }
      };
    })

    .directive('mwNavbarItem', ['$rootScope', function ($rootScope) {
      return {
        transclude: true,
        replace: true,
        scope: true,
        require: '^mwNavbar',
        template: '<li ng-class="{active: isActive}" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          var isActive = function () {
            scope.isActive = mwNavbarCtrl.isActive(elm.find('a').attr('href'));
          };
          isActive();
          $rootScope.$on('$routeChangeSuccess', isActive);

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    }])

    .directive('mwNavbarDropdown', ['$rootScope', function ($rootScope) {
      return {
        replace: true,
        require: '^mwNavbar',
        transclude: true,
        template: '<li ng-class="{active: isActive}" class="dropdown" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          var isActive = function () {
            var active = false;
            angular.forEach(scope.dropdownItems, function (path) {
              if (!active) {
                active = mwNavbarCtrl.isActive(path);
              }
            });
            scope.isActive = active;
          };
          isActive();
          $rootScope.$on('$routeChangeSuccess', isActive);
        },
        controller: ['$scope', function ($scope) {
          var dropdownItems = $scope.dropdownItems = [];
          this.register = function (path) {
            dropdownItems.push(path);
          };
        }]
      };
    }])

    .directive('mwNavbarDropdownTitle', function () {
      return {
        replace: true,
        transclude: true,
        template: '<a class="dropdown-toggle" data-toggle="dropdown"><span ng-transclude></span> <b class="caret"></b></a>'
      };
    })

    .directive('mwNavbarDropdownItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="dropdown-menu" ng-transclude></ul>'
      };
    })


    .directive('mwNavbarDropdownItem', ['$rootScope', function ($rootScope) {
      return {
        transclude: true,
        replace: true,
        scope: true,
        require: ['^mwNavbarDropdown', '^mwNavbar'],
        template: '<li ng-class="{active: isActive}" ng-transclude></li>',
        link: function (scope, elm, attr, ctrls) {
          var link = elm.find('a').attr('href'),
              mwNavbarDropdownItemsCtrl = ctrls[0],
              mwNavbarCtrl = ctrls[1];

          if(mwNavbarDropdownItemsCtrl){
            mwNavbarDropdownItemsCtrl.register(link);
          }

          var isActive = function () {
            scope.isActive = mwNavbarCtrl ? mwNavbarCtrl.isActive(link, true) : false;
          };
          isActive();

          $rootScope.$on('$routeChangeSuccess', isActive);

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    }]);
'use strict';

angular.module('mwPopover', [])

/**
 * Helper service for internal use to communicate between popover directives
 */
  .service('Popover', function () {
    this.contents = [];
  })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopoverContent
 * @element ANY
 *
 * @description
 * Provides content for a popup under the given key
 *
 * @param {String} mwPopoverContent ID where this content should be available
 *
 * @example
 <div mw-popover-content="anID">Content of the popover</div>
 */
  .directive('mwPopoverContent', ['$compile', 'Popover', function ($compile, Popover) {

    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.css('display', 'none');
        Popover.contents[attr.mwPopoverContent] = $compile(elm.html())(scope);
      }
    };
  }])


/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopover
 * @element ANY
 *
 * @description
 * Adds a popover for the current element (see Bootstrap 3 component)
 *
 * @param {String} mwPopover ID of mw-popover-content
 * @param {String} popoverTrigger how tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.
 * @param {String} popoverPosition how to position the tooltip - top | bottom | left | right | auto. When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.
 *
 * @example
 <div mw-popover-button="Click me to open the popover">Content of the popover</div>
 */
  .directive('mwPopover', ['$rootScope', '$templateRequest', '$compile', function ($rootScope, $templateRequest, $compile) {
    return {
      restrict: 'A',
      link: function (scope, el, attr) {

        var visible = false,
          content = '';

        var buildPopover = function () {
          el.popover('destroy');
          el.popover({
            trigger: attr.popoverTrigger || 'hover',
            title: attr.popoverTitle,
            html: true,
            placement: attr.popoverPosition,
            content: $compile(content.trim())(scope)
          });

          el.on('show.bs.popover', function () {
            visible = true;
          });
        };

        el.on('blur', function () {
          el.popover('hide');
        });

        //we need to set a default value here, see
        //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
        attr.popoverTitle = attr.popoverTitle || 'popoverTitle';
        attr.$observe('popoverTitle', buildPopover);

        if (attr.popoverUrl) {
          content = '<span rln-spinner></span>';
          $templateRequest(attr.popoverUrl).then(function (template) {
            content = template;
            buildPopover();
          });
          buildPopover();
        }

        attr.$observe('content', function (val) {
          if (val) {
            content = val;
            buildPopover();
          }
        });

        scope.$on('$destroy', function () {
          var popover = el.data('bs.popover');
          if(popover && popover.tip()){
            popover.tip().detach().remove();
          }
        });
      }
    };
  }])

;
'use strict';

angular.module('mwSidebar', [])

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarSelect
   * @element div
   * @description
   *
   * Creates a select input which provides possible values for a filtering.
   *
   * @param {filterable} filterable Filterable instance.
   * @param {expression} disabled If expression evaluates to true, input is disabled.
   * @param {string} property The name of the property on which the filtering should happen.
   */
  .directive('mwSidebarSelect', function () {
    return {
      transclude: true,
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@',
        persist: '='
      },
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarSelect.html',
      link: function (scope) {
        scope.$watch('filterable', function () {
          if (scope.filterable) {
            scope.model = scope.filterable.properties[scope.property];
            if (scope.persist) {
              scope.filterable.properties[scope.property].persist = scope.persist;
            }
          }
        });
      }
    };
  })

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarPanel
   * @element div
   * @description
   *
   * Directive for the filter panel.
   *
   * @param {boolean} affix Make the filterbar affix by listening on window scroll event and changing top position so that the filterbar can be postion relative instead of fixed
   * @param {number} offset If needed an offset to the top for example when a nav bar is over the sidebar that is not fixed.
   *
   */
  .directive('mwSidebarPanel', ['$document', '$window', function ($document, $window) {
    return {
      replace: true,
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarPanel.html',
      link: function (scope, el) {

        var windowEl = angular.element($window);

        var reposition = function () {
          var offsetTop = angular.element(el).offset().top,
            offsetHeaderTop = 0,
            newOffset = 0,
            spacer = 15, //Offset so the sidebar has some whitespce to the header
            scrollTop = $document.scrollTop();

          if(angular.element('*[mw-header]').length){
            offsetHeaderTop = angular.element('*[mw-header]').offset().top + angular.element('*[mw-header]').height();
          } else if(angular.element('*[mw-menu-top-bar]').length){
            offsetHeaderTop = angular.element('*[mw-menu-top-bar]').offset().top + angular.element('*[mw-menu-top-bar]').height();
          }

          newOffset = offsetTop - offsetHeaderTop - spacer;

          if(newOffset <= 10 ){
            //There is no element between sidebar and header so we can kill the scroll listener
            windowEl.off('scroll', throttledRepositionFn);
          } else if (scrollTop > newOffset) {
            angular.element(el).find('.content-container').css('top', offsetHeaderTop + spacer);
          } else if (scrollTop > 1) {
            angular.element(el).find('.content-container').css('top', offsetTop - scrollTop);
          } else {
            angular.element(el).find('.content-container').css('top', 'initial');
          }
        };

        var setMaxHeight = function () {
          var containerEl = el.find('.content-container'),
            windowHeight = windowEl.height(),
            containerElOffsetTop = el.offset().top,
            footerHeight = angular.element('body > footer').height(),
            padding = 20,
            maxHeight = windowHeight - containerElOffsetTop - footerHeight - padding;

          if (maxHeight > 0) {
            containerEl.css('max-height', maxHeight);
          } else {
            containerEl.css('max-height', 'initial');
          }
        };

        var throttledRepositionFn = _.throttle(reposition,10),
            throttledSetMaxHeight = _.throttle(setMaxHeight, 500);

        window.requestAnimFrame(setMaxHeight);
        setTimeout(setMaxHeight, 500);

        windowEl.on('resize', throttledSetMaxHeight);
        windowEl.on('scroll', throttledRepositionFn);

        scope.$on('$destroy', function(){
          windowEl.off('resize', throttledSetMaxHeight);
          windowEl.off('scroll', throttledRepositionFn);
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarActions
   * @element div
   * @description
   *
   * Container for actions
   *
   */
  .directive('mwSidebarActions', function () {
    return {
      transclude: true,
      scope: {
        title: '@mwTitle'
      },
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarActions.html'
    };
  })

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarFilters
   * @element div
   * @description
   *
   * Container for filters
   *
   */
  .directive('mwSidebarFilters', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarFilters.html',
      link: function (scope) {
        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.filterable.resetFilters();
            scope.filterable.applyFilters();
          }
        };

        if (scope.filterable && scope.filterable.hasPersistedFilters()) {
          scope.toggleFilters = true;
        }
      }
    };
  });



'use strict';

angular.module('mwSidebarBb', [])
  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarFilters
   * @element div
   * @description
   *
   * Container for filters
   *
   */
  .directive('mwSidebarFiltersBb', ['$timeout', 'FilterHolderModel', 'InvalidFilterModal', function ($timeout, FilterHolderModel, InvalidFilterModal) {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarFilters.html',
      controller: ['$scope', function ($scope) {
        this.getCollection = function () {
          return $scope.collection;
        };

        this.getFilterHolders = function () {
          return $scope.filterHolders;
        };

        this.changeFilter = function (property, value, isUrlParam) {
          if (isUrlParam) {
            $scope.collection.filterable.customUrlParams[property] = value;
            $scope.viewModel.tmpFilter.get('customUrlParams')[property] = value;
          } else {
            var filterVal = {};
            filterVal[property] = value;
            $scope.collection.filterable.setFilters(filterVal);
            $scope.viewModel.tmpFilter.set({ filter: $scope.collection.filterable.getFilters() });
            $scope.viewModel.tmpFilter.get('filterValues')[property] = value;
          }

          $scope.collection.fetch();
        };
      }],
      link: function (scope, el, attr) {

        scope.showFilterForm = scope.$eval(attr.showFilterForm);
        scope.mwListCollection = scope.$eval(attr.mwListCollection);
        scope.collection = scope.$eval(attr.collection);
        scope.isLoading = false;

        if (scope.mwListCollection) {

          var _filterAnimationDuration = 400;

          scope.collection = scope.mwListCollection.getCollection();
          scope.mwListCollectionFilter = scope.mwListCollection.getMwListCollectionFilter();
          scope.filters = scope.mwListCollectionFilter.getFilters();
          scope.appliedFilter = scope.mwListCollectionFilter.getAppliedFilter();

          scope.viewModel = {
            tmpFilter: new FilterHolderModel(),
            showFilterForm: false,
            canShowForm: false
          };

          if (scope.showFilterForm) {
            scope.viewModel.showFilterForm = true;
          }

          var setTotalAmount = function (filterModel) {
            var filterModelInCollection = scope.filters.get(filterModel),
              totalAmount = scope.collection.filterable.getTotalAmount();

            filterModel.set('totalAmount', totalAmount);
            if (filterModelInCollection) {
              filterModelInCollection.set('totalAmount', totalAmount);
            }
          };

          var filterCollection = function (filterModel) {
            scope.collection.filterable.resetFilters();
            scope.collection.filterable.setFilters(filterModel.get('filterValues'));
            return scope.mwListCollectionFilter.fetchAppliedSearchTerm().then(function (searchTerm) {
              if (searchTerm.val) {
                var searchTermFilter = {};
                searchTermFilter[searchTerm.attr] = searchTerm.val;
                scope.collection.filterable.setFilters(searchTermFilter);
              }
              return scope.collection.fetch().then(function () {
                setTotalAmount(filterModel);
              });
            });
          };

          var removeInvalidFilterKeys = function (filterModel, invalidFilterKeys) {
            var filterValues = filterModel.get('filterValues');

            invalidFilterKeys.forEach(function (invalidFilterKey) {
              delete filterValues[invalidFilterKey];
            });

            return filterModel;
          };

          scope.isFilterApplied = function (filter) {
            var appliedFilter = scope.mwListCollectionFilter.getAppliedFilter();
            if (filter) {
              return appliedFilter.id === filter.id;
            }
          };

          scope.saveFilter = function () {
            var filter;
            if (scope.viewModel.tmpFilter.isNew()) {
              filter = new FilterHolderModel(scope.viewModel.tmpFilter.toJSON());
            } else {
              filter = scope.viewModel.tmpFilter;
            }
            scope.mwListCollectionFilter.saveFilter(filter).then(function (filterModel) {
              scope.viewModel.showFilterForm = false;
              filterModel = scope.filters.get(filter);
              filterModel.set('invalid', false);
              scope.applyFilter(filterModel);
            });

          };

          scope.deleteFilter = function (filterModel) {
            var removeId = filterModel.id,
              appliedId = scope.appliedFilter.id;

            return scope.mwListCollectionFilter.deleteFilter(filterModel).then(function () {

              if (removeId === appliedId) {
                scope.revokeFilter();
              }
            });
          };

          scope.applyFilter = function (filterModel) {
            var invalidFilterKeys = scope.collection.filterable.getInvalidFilterKeys(filterModel.get('filterValues'));

            if (!filterModel.get('invalid')) {
              filterCollection(filterModel);
              scope.mwListCollectionFilter.applyFilter(filterModel);
            } else {
              var invalidFilterModal = new InvalidFilterModal();
              invalidFilterModal.setScopeAttributes({
                filterModel: filterModel,
                modifyAction: function () {
                  $timeout(function () {
                    scope.editFilter(filterModel);
                  });
                }
              });
              invalidFilterModal.show();
            }
          };

          scope.revokeFilter = function () {
            scope.mwListCollectionFilter.revokeFilter().then(function () {
              scope.collection.filterable.resetFilters();
              scope.collection.fetch();
              scope.appliedFilter.clear();
            });
          };

          scope.addFilter = function () {
            var emptyFilter = new FilterHolderModel();

            scope.viewModel.canShowForm = true;
            scope.viewModel.tmpFilter.clear();
            scope.viewModel.tmpFilter.set(emptyFilter.toJSON());
            scope.viewModel.showFilterForm = true;
            $timeout(function () {
              filterCollection(scope.viewModel.tmpFilter);
            }, _filterAnimationDuration);
          };

          scope.editFilter = function (filterModel) {
            scope.viewModel.canShowForm = true;
            scope.viewModel.tmpFilter.clear();
            scope.viewModel.tmpFilter.set(filterModel.toJSON());
            scope.viewModel.showFilterForm = true;
            $timeout(function () {
              filterCollection(filterModel);
            }, _filterAnimationDuration);
          };

          scope.cancelFilterEdit = function () {
            scope.viewModel.showFilterForm = false;
            if (!scope.appliedFilter.id || scope.appliedFilter.id !== scope.viewModel.tmpFilter.id) {
              $timeout(function () {
                scope.applyFilter(scope.appliedFilter);
              }, _filterAnimationDuration);
            }
          };

          scope.filtersAreApplied = function () {
            return (_.size(scope.viewModel.tmpFilter.get('filterValues')) > 0);
          };

          scope.mwListCollectionFilter.fetchFilters().then(function (mwListCollectionFilter) {
            mwListCollectionFilter.each(function (filterModel) {
              var invalidFilterKeys = scope.collection.filterable.getInvalidFilterKeys(filterModel.get('filterValues'));
              if (invalidFilterKeys.length > 0) {
                filterModel.set('invalid', true);
                removeInvalidFilterKeys(filterModel, invalidFilterKeys);
              }
            });
          });
          scope.mwListCollectionFilter.fetchAppliedFilter().then(function (filterModel) {
            setTotalAmount(filterModel);
          });
        } else if (scope.collection) {
          // TODO ADD OLD IMPLEMENTATION
          console.warn('The scope attribute collection is deprecated please use the mwCollection instead');
          scope.viewModel = {
            showFilterForm: true,
            canShowForm: true,
            tmpFilter: new FilterHolderModel()
          };
        } else {
          throw new Error('please pass a collection or mwCollection as scope attribute');
        }

        scope.collection.on('request', function () {
          scope.isLoading = true;
        });
        scope.collection.on('sync error remove', function () {
          scope.isLoading = false;
        });
      }
    };
  }])

  .factory('InvalidFilterModal', ['Modal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/templates/mwSidebarBb/mwInvalidFilterModal.html',
      controller: 'InvalidFilterModalController',
      dismissible: false
    });
  }])

  .controller('InvalidFilterModalController', ['$scope', function ($scope) {
    $scope.modify = function () {
      if (typeof $scope.modifyAction === 'function') {
        $scope.modifyAction();
        $scope.hideModal();
      } else {
        throw new Error('[InvalidFilterModal] modifyAction has to be a function. Set callback function via modal.setScopeAttributes({modifyAction:...}');
      }
    };

    // User really wants to navigate to that page which was saved before in a temp variable
    $scope.delete = function () {
      if ($scope.filterModel) {
        $scope.filterModel.destroy();
        $scope.hideModal();
      } else {
        throw new Error('[InvalidFilterModal] The scope attribute filterModel has to be a valid filterModel. Set it via modal.setScopeAttributes({filterModel:...})');
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarSelect
   * @element div
   * @description
   *
   * Creates a select input which provides possible values for a filtering.
   *
   * label: as default model.attributes.key will be used. If one of the following is specified it will be used. If two or more are specified the one which stands higher will be used:
   * - labelTransformFn
   * - labelProperty
   * - translationPrefix
   *
   * @param {collection} collection with option models. by default model.attributes.key will be called as key label
   * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
   * @param {string} property The name of the property on which the filtering should happen.
   * @param {string} placeholder The name of the default selected label with an empty value.
   * @param {expression} persist If true, filter will be saved in runtime variable
   * @param {string} keyProperty property of model to use instead of models.attribute.key property
   * @param {string | object} labelProperty property of model to use instead of model.attributes.key poperty. If it is an object it will be translated with i18n service.
   * @param {function} labelTransformFn function to use. Will be called with model as parameter.
   * @param {string} translationPrefix prefix to translate the label with i18n service (prefix + '.' + model.attributes.key).
   */
  .directive('mwSidebarSelectBb', ['i18n', function (i18n) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        options: '=',
        placeholder: '@',
        mwDisabled: '=',
        keyProperty: '@',
        labelProperty: '@',
        labelTransformFn: '=',
        translationPrefix: '@',
        translationSuffix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, mwSidebarFiltersBbCtrl) {

        scope.viewModel = {};

        //set key function for select key
        scope.key = function (model) {
          if (angular.isDefined(scope.keyProperty)) {
            return model.attributes[scope.keyProperty];
          } else {
            return model.attributes.key;
          }
        };

        scope.collection = mwSidebarFiltersBbCtrl.getCollection();

        //set label function fo select label
        scope.label = function (model) {
          //translate with i18n service if translationPrefix is defined
          var label = scope.key(model);
          if (scope.translationPrefix && scope.translationSuffix) {
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model) + '.' + scope.translationSuffix);
          } else if (scope.translationSuffix) {
            label = i18n.get(scope.key(model) + '.' + scope.translationSuffix);
          } else if (scope.translationPrefix) {
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model));
          }
          return label;
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          mwSidebarFiltersBbCtrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };

        if (angular.isDefined(scope.labelProperty)) {
          scope.label = function (model) {
            //translate if value is a translation object
            if (angular.isObject(model.attributes[scope.labelProperty])) {
              return i18n.localize(model.attributes[scope.labelProperty]);
            }
            return model.attributes[scope.labelProperty];
          };
        }

        if (angular.isDefined(scope.labelTransformFn)) {
          scope.label = scope.labelTransformFn;
        }

        scope.$watch('collection.filterable.filterValues.' + scope.property, function (val) {
          if (val && val.length > 0) {
            scope.viewModel.val = val;
          } else {
            scope.viewModel.val = null;
          }
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarNumberInputBb
   * @element div
   * @description
   *
   * Creates a number input to filter for integer values.
   *
   * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
   * @param {string} property The name of the property on which the filtering should happen.
   * @param {string} placeholder The name of the default selected label with an empty value.
   * @param {expression} persist If true, filter will be saved in runtime variable
   * @param {string} customUrlParameter If set, the filter will be set as a custom url parameter in the collection's filterable
   */

  .directive('mwSidebarInputBb', function () {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        type: '@',
        property: '@',
        placeholder: '@',
        mwDisabled: '=',
        customUrlParameter: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarInput.html',
      link: function (scope, elm, attr, mwSidebarFiltersBbCtrl) {

        scope.viewModel = {};

        scope._type = scope.type || 'text';

        scope.collection = mwSidebarFiltersBbCtrl.getCollection();

        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          mwSidebarFiltersBbCtrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };

        scope.$watch('collection.filterable.filterValues.' + scope.property, function (val) {
          if (val && val.length > 0) {
            scope.viewModel.val = val;
          } else {
            scope.viewModel.val = null;
          }
        });
      }
    };
  })


  /**
   * @ngdoc directive
   * @name mwSidebar.directive:mwSidebarNumberInputBb
   * @element div
   * @description
   *
   * Creates a number input to filter for integer values.
   *
   * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
   * @param {string} property The name of the property on which the filtering should happen.
   * @param {string} placeholder The name of the default selected label with an empty value.
   * @param {expression} persist If true, filter will be saved in runtime variable
   * @param {string} customUrlParameter If set, the filter will be set as a custom url parameter in the collection's filterable
   */

  .directive('mwSidebarNumberInputBb', function () {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        placeholder: '@',
        mwDisabled: '=',
        customUrlParameter: '@',
        min: '@',
        max: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarNumberInput.html',
      link: function (scope, elm, attr, ctrl) {

        scope.viewModel = {};

        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };
      }
    };
  })

  .directive('mwSidebarDateRangeBb', ['$timeout', '$rootScope', 'i18n', function ($timeout, $rootScope, i18n) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        fromProperty: '@',
        toProperty: '@',
        mwDisabled: '=',
        customUrlParameter: '@',
        min: '@',
        max: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarDateRange.html',
      link: function (scope, elm, attr, ctrl) {
        var _datePicker;
        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.setFromDate = function (val) {
          scope.viewModel.oldFrom = val;
          ctrl.changeFilter(scope.fromProperty, val);
        };

        scope.setToDate = function (val) {
          scope.viewModel.oldTo = val;
          ctrl.changeFilter(scope.toProperty, val);
        };

        scope.viewModel = {
          oldFrom: null,
          oldTo: null
        }
        var _defaultDatePickerOptions = {
          inputs: elm.find('.actualrange'),
          clearBtn: true,
          format: 'dd.mm.yyyy',
          endDate: scope.max,
          startDate: scope.min
        }
        var updateMwModel = function (datepicker) {
          if (isFinite(datepicker.dates[0]) && isFinite(datepicker.dates[1])) {
            if (scope.oldFrom === null || scope.viewModel.oldFrom.toUTCString() !== datepicker.dates[0].toUTCString()) {
              scope.setFromDate(datepicker.dates[0]);
              $timeout(function () {
                elm.find('.actualrange')[1].focus();
              });
            } else {
              scope.setToDate(datepicker.dates[1]);

              $timeout(function () {
                elm.find('.actualrange').first().focus();
              });
            }
          } else if (isFinite(datepicker.dates[0])) {
            scope.setFromDate(datepicker.dates[0]);
            $timeout(function () {
              elm.find('.actualrange')[1].focus();
            });
          } else if (isFinite(datepicker.dates[1])) {
            scope.setToDate(datepicker.dates[1]);

            $timeout(function () {
              elm.find('.actualrange').first().focus();
            });
          }
        }
        var bindChangeListener = function (datepicker) {
          datepicker.on('changeDate', updateMwModel.bind(this, datepicker.data().datepicker));
          datepicker.on('show', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = true;
            });
          });
          datepicker.on('hide', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = false;
            });
          });
        };

        var checkIfDatepickerLibIsAvailable = function (datePickerEl) {
          if (!datePickerEl.datepicker) {
            throw new Error('bootstrap-sass-datepicker is not available. Make sure you included the javascript file');
          }
        };

        var setDatepicker = function (options) {
          var datePickerEl;

          if (_datePicker && _datePicker.data().datepicker) {
            _datePicker.data().datepicker.remove();
          }

          datePickerEl = elm.find('.input-daterange');
          checkIfDatepickerLibIsAvailable(datePickerEl);
          _datePicker = datePickerEl.datepicker(_.extend(_defaultDatePickerOptions, options));
          bindChangeListener(_datePicker);
        };
        setDatepicker();
      }
    };
  }]);



angular.module("mwUI.Relution").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit/templates/deprecated/mw_form_checkbox.html',
    "<div><div ng-if=\"!typedBadges || typedBadges.length===0\" mw-checkbox-wrapper label=\"{{label}}\" tooltip=\"{{tooltip}}\"><div ng-transclude></div></div><div ng-if=\"typedBadges && typedBadges.length>0\" mw-checkbox-wrapper><label style=\"float: left\"><div ng-transclude class=\"input-holder\"></div><span class=\"text-holder\" style=\"padding-left: 5px\">{{ label }}</span> <span ng-if=\"tooltip\" mw-icon=\"rln-icon support\" tooltip=\"{{ tooltip }}\"></span></label><div class=\"badges-holder\" style=\"float: left; margin-top: -6px\"><span ng-repeat=\"badge in typedBadges\" mw-badge=\"{{badge.type}}\" style=\"top: 0\">{{ badge.text }}</span></div></div></div>"
  );


  $templateCache.put('uikit/templates/deprecated/mw_form_input.html',
    "<div><div mw-input-wrapper label=\"{{label}}\" tooltip=\"{{tooltip}}\" hide-errors=\"hideErrors\"><div ng-transclude style=\"width:100%\"></div></div></div>"
  );


  $templateCache.put('uikit/templates/deprecated/mw_form_multi_select_2.html',
    "<div mw-checkbox-group mw-collection=\"mwCollection\" mw-options-collection=\"mwOptionsCollection\" mw-options-label-key=\"{{mwOptionsLabelKey}}\" mw-options-label-i18n-prefix=\"{{mwOptionsLabelI18nPrefix}}\" mw-required=\"mwRequired\" mw-disabled=\"mwDisabled\"></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/_mwMarkdownPreviewPopoper.html',
    "<div class=\"mw-markdown-preview-popover\"><p>{{ 'markdownTooltip.description' | i18n }}</p><h1>#{{ 'markdownTooltip.level1Header' | i18n }}</h1><h2>##{{ 'markdownTooltip.level2Header' | i18n }}</h2>{{ 'markdownTooltip.list' | i18n }}<ul><li>* {{ 'markdownTooltip.item' | i18n }} 1</li><li>* {{ 'markdownTooltip.item' | i18n }} 2</li><li>* {{ 'markdownTooltip.item' | i18n }} 3</li></ul><ol><li>1. {{ 'markdownTooltip.item' | i18n }}</li><li>2. {{ 'markdownTooltip.item' | i18n }}</li><li>3. {{ 'markdownTooltip.item' | i18n }}</li></ol><p>{{ 'markdownTooltip.link' | i18n }}</p></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwAlert.html',
    "<div class=\"alert alert-dismissable alert-{{ type }}\"><div ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwFilterableSearch.html',
    "<div class=\"row mw-filterable-search\"><div class=\"col-md-12\"><div class=\"input-group\"><input type=\"text\" placeholder=\"{{ 'common.search' | i18n }}\" class=\"form-control\" ng-keyup=\"search($event)\" ng-model=\"model.value\" ng-disabled=\"mwDisabled\"> <span class=\"input-group-addon filterable-search-btn\" ng-click=\"search()\"><span ng-show=\"searching\" class=\"search-indicator\"></span> <span ng-hide=\"(searching || model.value.length>0) || isMobile\" mw-icon=\"search\"></span> <span ng-if=\"(model.value.length>0 && !searching) && !isMobile\" mw-icon=\"rln-icon add\" class=\"red rotate-45\" ng-click=\"reset()\"></span></span></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwHeader.html',
    "<div class=\"mw-header\"><div ng-if=\"showBackButton\" class=\"back-btn clickable\" data-text=\"{{'common.back' | i18n}}\" ng-click=\"back()\"><span mw-icon=\"fa-angle-left\"></span></div><div class=\"title-holder\"><span mw-icon=\"{{mwTitleIcon}}\" class=\"header-icon\" ng-if=\"mwTitleIcon\"></span><div ng-if=\"mwBreadCrumbs\" mw-bread-crumbs-holder><div ng-repeat=\"breadCrumb in mwBreadCrumbs\" mw-bread-crumb url=\"{{breadCrumb.url}}\" title=\"{{breadCrumb.title}}\" show-arrow=\"true\"></div></div><h1 class=\"lead page-title\" ng-click=\"refresh()\">{{title}}</h1></div><div ng-if=\"warningCondition\" class=\"warnin-content\" mw-tooltip=\"{{ warningText }}\"><span class=\"text-warning\" mw-icon=\"fa-warning\"></span> <span class=\"popover-container\"></span></div><div class=\"additional-content-holder\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwMarkdownPreview.html',
    "<div class=\"toggler text-right text-muted\"><span ng-click=\"showPreview = !showPreview\" title=\"Show Markdown Preview\">{{ showPreview ? 'common.hidePreview' : 'common.showMarkdownPreview' | i18n }}</span> <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\"><span mw-popover=\"markdownTooltip\" popover-url=\"uikit/templates/mwComponents/_mwMarkdownPreviewPopoper.html\" popover-trigger=\"hover\" popover-position=\"bottom\" popover-title=\"Markdown Syntax\"><span mw-icon=\"fa-question-circle\"></span></span></a></div><div ng-if=\"showPreview\" class=\"preview\" mw-markdown=\"mwModel\"></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwOptionGroup.html',
    "<div class=\"mw-option-group panel panel-default\"><fieldset ng-disabled=\"mwDisabled\"><div class=\"panel-body\"><span ng-transclude></span><label class=\"options-container display-inline clickable\" ng-class=\"{'with-icon':icon}\" for=\"{{randomId}}\"><div class=\"clearfix\"><div ng-if=\"icon\" class=\"col-md-1 icon-holder\"><span mw-icon=\"{{icon}}\"></span></div><div class=\"description\" ng-class=\"{'col-md-11': icon, 'col-md-12': !icon}\"><h4>{{title}}</h4><p>{{description}}</p></div></div></label></div></fieldset></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwPanel.html',
    "<div class=\"panel panel-default\"><div class=\"panel-body\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwSortIndicator.html',
    "<span class=\"sort-indicators\"><i ng-show=\"!isActive\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isActive && !isReversed\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isActive && isReversed\" mw-icon=\"fa-sort-desc\"></i></span>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwTextCollapse.html',
    "<div ng-if=\"markdown\"><div mw-markdown=\"text()\"></div><a ng-if=\"showButton\" ng-click=\"toggleLength()\" style=\"cursor: pointer\">{{ showLessOrMore() | i18n }}</a></div><div ng-if=\"!markdown\"><span class=\"line-break\">{{ text() }}</span> <a ng-if=\"showButton\" ng-click=\"toggleLength()\" style=\"cursor: pointer\">{{ showLessOrMore() | i18n }}</a></div>"
  );


  $templateCache.put('uikit/templates/mwComponentsBb/mwFilterableSearch.html',
    "<div class=\"row mw-filterable-search\" ng-class=\"{'has-value':hasValue()}\"><div class=\"input-holder input-group\"><span class=\"input-group-addon clickable trigger-search\" ng-click=\"focus()\"><span mw-icon=\"fa-search\" ng-class=\"{searching:searching}\" class=\"search-icon\"></span></span> <span ng-click=\"reset()\" mw-icon=\"rln-icon close_cross\" class=\"input-group-addon reset-icon red clickable reset-search\"></span> <input type=\"text\" placeholder=\"{{placeholder || ('common.search' | i18n)}}\" ng-keyup=\"keyUp($event)\" ng-model=\"viewModel.searchVal\" ng-change=\"search($event)\" ng-model-options=\"{ debounce: 500 }\" id=\"{{searchInputId}}\" ng-disabled=\"mwDisabled\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponentsBb/mwVersionSelector.html',
    "<div class=\"btn-group mw-version-selector\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"descriptor\">Version</span> <span class=\"descriptor-sm\">V.</span> {{currentVersionModel.attributes[versionNumberKey]}} <span ng-if=\"currentVersionModel.attributes.published\" mw-icon=\"rln-icon published\"></span></button><ul class=\"version-dropdown dropdown-menu pull-right\" style=\"min-width:100%\" role=\"menu\"><li ng-repeat=\"version in versionCollection.models\" ng-class=\"{active:(version.attributes.uuid === currentVersionModel.attributes.uuid)}\"><a ng-href=\"{{getUrl(version.attributes.uuid)}}\">{{version.attributes[versionNumberKey]}} <span ng-if=\"version.attributes.published\" mw-icon=\"rln-icon published\"></span></a></li></ul></div>"
  );


  $templateCache.put('uikit/templates/mwDatePicker/mwDatePicker.html',
    "<div class=\"mw-date-picker clearfix\" ng-class=\"{'datepicker-visible': viewModel.datepickerIsOpened, 'has-time-picker': viewModel.showTimePicker}\" ng-form><div class=\"input-group date-picker-holder\"><div class=\"input-group-addon\"><span class=\"fa fa-calendar\"></span></div><input type=\"text\" class=\"date-picker pull-left\" ng-focus=\"onFocus($event)\" placeholder=\"{{placeholder}}\"></div><div class=\"time-picker-holder\" ng-if=\"viewModel.showTimePicker\"><div class=\"time-picker-icon\"><span class=\"fa fa-clock-o\"></span></div><fieldset ng-disabled=\"!viewModel.date\"><div class=\"number-spinner-holder hours\"><input type=\"number\" min=\"0\" max=\"23\" ng-model=\"viewModel.hours\" ng-disabled=\"!canChange(1,'HOURS') && !canChange(-1,'HOURS')\" mw-leading-zero> <button class=\"btn btn-default btn-link number-spinner increment clickable\" ng-mousedown=\"startIncrementCounter('hours', 0, 23)\" ng-mouseup=\"stopIncrementCounter()\" ng-click=\"increment('hours', 0, 23)\" tabindex=\"-1\" ng-disabled=\"!canChange(1,'HOURS')\"><span class=\"fa fa-angle-up\"></span></button> <button class=\"btn btn-default btn-link number-spinner decrement clickable\" ng-mousedown=\"startDecrementCounter('hours', 0, 23)\" ng-mouseup=\"stopDecrementCounter()\" ng-click=\"decrement('hours', 0, 23)\" tabindex=\"-1\" ng-disabled=\"!canChange(-1, 'HOURS')\"><span class=\"fa fa-angle-down\"></span></button></div><div class=\"number-spinner-holder minutes\"><input type=\"number\" min=\"0\" max=\"59\" ng-model=\"viewModel.minutes\" ng-disabled=\"!canChange(1,'MINUTES') && !canChange(-1,'MINUTES')\" mw-leading-zero> <button class=\"btn btn-default btn-link number-spinner increment clickable\" ng-mousedown=\"startIncrementCounter('minutes', 0, 59)\" ng-mouseup=\"stopIncrementCounter()\" ng-click=\"increment('minutes', 0, 59)\" tabindex=\"-1\" ng-disabled=\"!canChange(1,'MINUTES')\"><span class=\"fa fa-angle-up\"></span></button> <button class=\"btn btn-default btn-link number-spinner decrement clickable\" ng-mousedown=\"startDecrementCounter('minutes', 0, 59)\" ng-mouseup=\"stopDecrementCounter()\" ng-click=\"decrement('minutes', 0, 59)\" tabindex=\"-1\" ng-disabled=\"!canChange(-1,'MINUTES')\"><span class=\"fa fa-angle-down\"></span></button></div></fieldset></div><div ng-hide=\"hideErrors\" mw-form-input><input type=\"hidden\" name=\"dateValidator\" ng-model=\"mwModel\" ng-required=\"mwRequired\" mw-validate-date min-date=\"options.startDate\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwFileUpload/mwFileUpload.html',
    "<div ng-form=\"file\" class=\"mw-file-upload\" ng-class=\"{\n" +
    "  'drag-start':viewModel.documentDragOver,\n" +
    "  'drag-over':viewModel.dropzoneDragOver,\n" +
    "  'full-screen':fullScreen,\n" +
    "  'hidden-btn':hiddenBtn,\n" +
    "  'UPLOADING': viewModel.state == 'UPLOADING',\n" +
    "  'DONE': viewModel.state != 'UPLOADING'\n" +
    "  }\"><div class=\"upload-container\"><div class=\"upload-info panel panel-primary\">{{viewModel.uploadMessage}}<div class=\"state-indicator\"><div class=\"progress\" ng-style=\"{width: viewModel.uploadProgress + '%'}\"></div></div></div><div ng-if=\"!hideCancelBtn && viewModel.state == 'UPLOADING'\" class=\"btn btn-danger\" ng-click=\"abort()\">{{'rlnUikit.mwFileUpload.abort' | i18n}}</div><button ng-show=\"canShowUploadBtn()\" type=\"button\" class=\"btn btn-primary btn-upload hidden-on-drag upload-btn\" mw-file-upload-button accepts=\"{{validator}}\" drop-zone-element=\"viewModel.dropZoneElmement\" max-file-size-byte=\"maxFileSizeByte\" on-progress-callback=\"onUploadProgress\" on-success-callback=\"onUploadSuccess\" on-error-callback=\"onUploadError\" on-abort-callback=\"onUploadAbort\" abort-flag=\"abortFlag\" uploader-options=\"viewModel.uploaderOptions\"><span mw-icon=\"rln-icon upload\"></span> {{ text || ('rlnUikit.mwFileUpload.upload' | i18n) }}</button><div ng-show=\"viewModel.state != 'UPLOADING'\" class=\"upload-btn\" style=\"width: 100%\"><div ng-if=\"viewModel.hasDropZone\" mw-file-upload-drag-and-drop id=\"{{viewModel.dropZoneId}}\" on-document-drag-over-callback=\"dragoverDocumentStateChange\" on-dropzone-drag-over-callback=\"dragoverDropzoneStateChange\" on-drop=\"onDrop\"></div><div ng-if=\"viewModel.fileName\" class=\"hidden-on-drag selected-file-info\"><p ng-if=\"showFileName\" class=\"filename panel panel-default\"><span mw-icon=\"fa-file-o\"></span> {{viewModel.fileName}}</p><button ng-show=\"canShowRemoveBtn()\" type=\"button\" class=\"btn btn-danger\" ng-click=\"removeFile()\"><span mw-icon=\"rln-icon delete\"></span> {{'rlnUikit.mwFileUpload.remove' | i18n }}</button></div></div></div><input type=\"text\" class=\"hidden\" ng-model=\"viewModel.fileName\" ng-required=\"mwRequired\" mw-set-dirty-on-model-change mw-custom-error-validator=\"{{viewModel.uploadError}}\" mw-is-valid=\"!viewModel.isInvalid\"></div>"
  );


  $templateCache.put('uikit/templates/mwFileUpload/mwFileUploadButton.html',
    "<input type=\"file\" name=\"file\" accept=\"{{accepts}}\" class=\"hidden mw-file-upload-button\" ng-model=\"file\"> <span ng-transclude></span>"
  );


  $templateCache.put('uikit/templates/mwFileUpload/mwFileUploadDragAndDrop.html',
    "<div class=\"drop-zone\" id=\"\"><div class=\"content\"><span mw-icon=\"fa-file-o\"></span><h3>{{'rlnUikit.mwFileUpload.dropFiles' | i18n}}</h3></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormActions.html',
    "<div class=\"mw-form mw-actions\"><div class=\"btn-group\"><button type=\"button\" class=\"btn btn-danger\" ng-if=\"hasCancel && _showCancel\" ng-disabled=\"form.$pristine && executeDefaultCancel\" ng-click=\"cancelFacade()\"><span mw-icon=\"rln-icon close_cross\"></span> <span class=\"action-text cancel\">{{ 'common.cancel' | i18n }}</span></button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"saveFacade()\" ng-if=\"hasSave && _showSave\" ng-disabled=\"form.$invalid || isLoading() || (form.$pristine && executeDefaultCancel)\"><span mw-icon=\"rln-icon check\"></span> <span class=\"action-text save\">{{ 'common.save' | i18n }}</span></button></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormMultiSelect.html',
    "<div ng-form><div ng-class=\"{'has-error': showRequiredMessage()}\"><div class=\"checkbox\" ng-repeat=\"(key,value) in filter(options)\"><label><input type=\"checkbox\" name=\"selectOption\" ng-checked=\"model.indexOf(key) >= 0\" ng-click=\"toggleKeyIntoModelArray(key); setDirty()\"> {{ value }}</label></div><div mw-form-input><input type=\"hidden\" name=\"requireChecker\" ng-model=\"model[0]\" ng-required=\"mwRequired\"></div><!--<div ng-class=\"col-sm-12\">--><!--<span class=\"help-block\" ng-show=\"showRequiredMessage()\">{{'errors.isRequired' | i18n}}</span>--><!--</div>--><div ng-show=\"getObjectSize(filter(options)) == 0\" ng-transclude></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwLeaveConfirmation.html',
    "<div mw-modal title=\"{{'common.confirmModal.title' | i18n}}\"><div mw-modal-body><p>{{ text }}</p></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" ng-click=\"continue()\">{{'common.confirmModal.continue' | i18n }}</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"stay()\">{{'common.confirmModal.stay' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormMultiSelect.html',
    "<div ng-form><div class=\"checkbox\" ng-repeat=\"item in collection.models\"><label><input type=\"checkbox\" name=\"selectOption\" ng-disabled=\"isDisabled(item)\" ng-checked=\"model.indexOf(item.attributes.key) >= 0\" ng-click=\"toggleKeyIntoModelArray(item.attributes.key); setDirty()\"> {{ translationPrefix + '.' + item.attributes.key | i18n }}</label></div><div mw-form-input><input type=\"hidden\" name=\"requireChecker\" ng-model=\"model[0]\" ng-required=\"mwRequired\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormRadioGroup.html',
    "<form class=\"mw-form mw-form-radio-group\"><div ng-repeat=\"option in mwOptionsCollection.models\"><label><input type=\"radio\" name=\"radio_group_item\" ng-value=\"option.get(optionsKey)\" mw-custom-radio ng-model=\"$parent.mwModel\" ng-disabled=\"mwDisabled\"> <span ng-if=\"option.get(mwOptionsLabelKey) && !mwOptionsLabelI18nPrefix\">{{option.get(mwOptionsLabelKey)}}</span> <span ng-if=\"option.get(mwOptionsLabelKey) && mwOptionsLabelI18nPrefix\">{{mwOptionsLabelI18nPrefix+'.'+option.get(mwOptionsLabelKey) | i18n}}</span></label></div></form><input type=\"hidden\" name=\"{{name}}\" ng-model=\"mwModel\" required>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormSelect.html',
    "<select class=\"form-control mw-form-select\" mw-custom-select ng-model=\"viewModel.val\" ng-change=\"mwChange({selectedModel:getSelectedModel(viewModel.val)})\" ng-options=\"getKey(option) as getLabel(option) for option in mwOptionsCollection.models\" ng-disabled=\"mwDisabled\" ng-required=\"mwRequired\" name=\"{{name}}\"><option ng-if=\"mwPlaceholder\" value=\"\" disabled>{{mwPlaceholder}}</option></select>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwMultiSelectBoxes.html',
    "<div class=\"mw-multi-select-boxes\"><div class=\"selected-items\" ng-if=\"mwCollection.models.length>0\"><ul class=\"col-xs-7 col-sm-8 col-md-9\"><li ng-repeat=\"model in mwCollection.models\"><span><span mw-icon=\"rln-icon delete\" class=\"clickable\" ng-click=\"remove(model)\"></span></span> <span>{{getLabel(model)}}</span></li></ul></div><div class=\"row selector\"><div class=\"col-xs-7 col-sm-8 col-md-9\"><select ng-options=\"getLabel(item) for item in mwOptionsCollection.models\" mw-custom-select ng-model=\"viewModel.tmpModel\" ng-disabled=\"mwDisabled\"></select></div><div class=\"col-xs-5 col-sm-4 col-md-3 toggle-btns\"><button ng-click=\"add(viewModel.tmpModel)\" ng-disabled=\"mwDisabled || !viewModel.tmpModel.id\" class=\"btn btn-primary add\"><span mw-icon=\"fa-plus\"></span></button></div></div><input type=\"hidden\" ng-model=\"requiredValue\" ng-required=\"mwRequired\" name=\"{{hiddenFormElementName || 'mwMultiSelectBoxes'}}\"></div>"
  );


  $templateCache.put('uikit/templates/mwLayout/mw_menu.html',
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableColumnCheckbox.html',
    "<input ng-if=\"!radio\" type=\"checkbox\" ng-click=\"click(item, $event)\" ng-disabled=\"mwDisabled || false\" ng-checked=\"selectable.isSelected(item)\"> <input ng-if=\"radio\" type=\"radio\" name=\"{{selectable.id}}\" ng-click=\"click(item, $event)\" ng-disabled=\"mwDisabled || false\" ng-checked=\"selectable.isSelected(item)\">"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableFooter.html',
    "<tr><td colspan=\"{{ columns.length + 4 }}\"><div ng-if=\" (!filterable.items() && filterable) || (filterable.items().length < filterable.total() && Loading.isLoading()) \"><div rln-spinner></div></div><div ng-if=\"filterable.items().length < 1\" class=\"text-center\"><p class=\"lead\">{{ 'common.noneFound' | i18n }}</p></div><button ng-if=\"filterable.items().length < filterable.total() && !Loading.isLoading()\" class=\"btn btn-default btn-lg col-md-12\" ng-click=\"filterable.loadMore()\">{{ 'common.loadMore' | i18n }}</button></td></tr>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableHeader.html',
    "<th ng-class=\"{ clickable: property, 'sort-active':(property && isSelected())||sortActive }\"><span ng-if=\"property\" ng-click=\"toggleSortOrder()\" class=\"sort-indicators\"><i ng-show=\"property && !isSelected()\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isSelected('-')\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isSelected('+')\" mw-icon=\"fa-sort-desc\"></i></span> <span ng-transclude class=\"title\"></span></th>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableHeaderCheckbox.html',
    "<input type=\"checkbox\" ng-if=\"!radio && (!filterable || filterable.items().length > 0)\" ng-click=\"toggleAll()\" ng-checked=\"selectable.allSelected()\" ng-disabled=\"selectable.allDisabled()\">"
  );


  $templateCache.put('uikit/templates/mwMap/mwMap.html',
    "<div><div id=\"map\" class=\"olMap\"></div><div ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwNav/mwNavbar.html',
    "<div class=\"navbar navbar-default navbar-fixed-top\" ng-transclude></div>"
  );


  $templateCache.put('uikit/templates/mwNav/mwNavbarBrand.html',
    "<div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\"><span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#/\" ng-transclude></a></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarActions.html',
    "<div class=\"mw-sidebar-actions\"><div ng-if=\"title\" class=\"section-title\">{{ title }}</div><div ng-transclude></div><hr></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarFilters.html',
    "<div class=\"mw-sidebar-filters\"><div class=\"filter-toggler margin-top-10\"><a class=\"clickable btn btn-default btn-block\" ng-click=\"toggleFilters = !toggleFilters; resetFiltersOnClose()\"><span class=\"fa fa-times toggle-indicator rotate-45\" ng-class=\"{'red active':toggleFilters}\"></span> <span ng-if=\"toggleFilters\">{{'common.removeFilters' | i18n}}</span> <span ng-if=\"!toggleFilters\">{{'common.addFilter' | i18n}}</span></a></div><div ng-if=\"toggleFilters\" ng-transclude class=\"filters animate-height\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarPanel.html',
    "<div class=\"sidebar\" compile-callback><div ng-transclude class=\"content-container\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarSelect.html',
    "<div class=\"row\"><div class=\"col-md-12\"><select class=\"form-control\" mw-custom-select ng-model=\"model.value\" ng-change=\"filterable.applyFilters()\" ng-options=\"key as value for (key, value) in model.all\" ng-disabled=\"mwDisabled\"></select></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwInvalidFilterModal.html',
    "<div mw-modal title=\"{{'rlnUikit.mwSidebar.invalidFilterModal.title' | i18n}}\"><div mw-modal-body><p>{{'rlnUikit.mwSidebar.invalidFilterModal.description' | i18n:{name: filterModel.get('name')} }}</p></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'rlnUikit.cancel' | i18n }}</button> <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delete()\">{{'rlnUikit.mwSidebar.invalidFilterModal.delete' | i18n }}</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"modify()\">{{'rlnUikit.mwSidebar.invalidFilterModal.modify' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarDateRange.html',
    "<div class=\"mw-sidebar-date-range row\"><div class=\"col-md-12\"><div ng-class=\"{'datepicker-visible': viewModel.datepickerIsOpened, 'has-time-picker': viewModel.showTimePicker}\" ng-form><div class=\"input-group date-picker-holder input-daterange\"><div class=\"input-group-addon\"><span class=\"fa fa-calendar\"></span></div><input type=\"text\" class=\"form-control actualrange\" placeholder=\"{{'common.fromDate' | i18n}}\"><div class=\"input-group-addon\">-</div><input type=\"text\" class=\"form-control actualrange\" placeholder=\"{{'common.toDate' | i18n}}\"></div></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarFilters.html',
    "<div class=\"mw-sidebar-filters\" ng-class=\"{'form-active':viewModel.showFilterForm, 'form-in-active':!viewModel.showFilterForm}\"><div ng-if=\"mwListCollection\" class=\"btn-group btn-block persisted-filters\"><button class=\"btn btn-default btn-block dropdown-toggle\" ng-class=\"{hidden:viewModel.showFilterForm}\" data-toggle=\"dropdown\"><span mw-icon=\"rln-icon filter_add\"></span> <span class=\"filter-name\">{{appliedFilter.get('name') || ('common.applyQuickFilter' | i18n) }}</span></button><ul class=\"filter-dropdown dropdown-menu\" style=\"min-width:100%\" role=\"menu\"><li ng-class=\"{'active':appliedFilter.isNew()}\" class=\"filter\"><a mw-prevent-default=\"click\" ng-click=\"revokeFilter()\" class=\"btn btn-link\">{{'common.unFiltered' | i18n}}</a><div ng-if=\"appliedFilter.isNew()\" class=\"pull-right action-btns hidden-xs hidden-sm\"><div ng-if=\"isLoading\"><div mw-spinner></div></div></div></li><li ng-repeat=\"filter in filters.models\" ng-if=\"!(filter.get('invalid') && !filter.canModifyFilter())\" ng-class=\"{'active':isFilterApplied(filter), 'invalid': filter.get('invalid')}\" class=\"filter\"><a mw-prevent-default=\"click\" ng-click=\"applyFilter(filter)\" class=\"btn btn-link\"><span ng-if=\"filter.get('isPublic') && filter.canCreatePublicFilter()\" mw-icon=\"fa-globe\" tooltip=\"{{'common.filterIsPublic' | i18n}}\"></span> <span ng-if=\"!filter.get('isPublic') && filter.canCreatePublicFilter()\" mw-icon=\"fa-lock\" tooltip=\"{{'common.filterIsPrivate' | i18n}}\"></span> <span class=\"filter-name\">{{filter.get('name')}}</span> <span ng-if=\"filter.get('invalid')\" class=\"invalid-icon\" mw-icon=\"mwUI.warning\" tooltip=\"{{'rlnUikit.mwSidebar.invalidFilterModal.description' | i18n:{name: filter.get('name')} }}\"></span></a><div ng-if=\"appliedFilter.id===filter.id || filter.get('invalid')\" class=\"pull-right action-btns hidden-xs hidden-sm\"><div ng-if=\"!isLoading && filter.canModifyFilter()\"><button class=\"btn btn-link edit\" ng-click=\"editFilter(filter)\"><span mw-icon=\"rln-icon edit\"></span></button> <button class=\"btn btn-link delete\" ng-click=\"deleteFilter(filter)\"><span mw-icon=\"rln-icon delete\"></span></button></div><div ng-if=\"isLoading\"><div mw-spinner></div></div></div></li><li class=\"filter\"><a mw-prevent-default=\"click\" ng-click=\"addFilter(filter)\" class=\"btn btn-link\"><span mw-icon=\"rln-icon add\"></span> {{'common.addFilter' | i18n}}</a></li></ul></div><div class=\"form\" ng-if=\"viewModel.showFilterForm\"><div ng-transclude></div><div ng-if=\"mwListCollection && filtersAreApplied()\" class=\"panel panel-default margin-top-10 quickfilter-form\"><div class=\"panel-body\"><p>{{'common.saveQuickFilter' | i18n}}</p><div class=\"filter-name\"><span ng-if=\"viewModel.tmpFilter.get('isPublic') && viewModel.tmpFilter.canCreatePublicFilter()\" mw-icon=\"fa-globe\" tooltip=\"{{'common.filterIsPublic' | i18n}}\"></span> <span ng-if=\"!viewModel.tmpFilter.get('isPublic') && viewModel.tmpFilter.canCreatePublicFilter()\" mw-icon=\"fa-lock\" tooltip=\"{{'common.filterIsPrivate' | i18n}}\"></span> <input type=\"text\" placeholder=\"{{'common.quickFilterName' | i18n}}\" ng-model=\"viewModel.tmpFilter.attributes.name\"></div><div ng-if=\"viewModel.tmpFilter.canCreatePublicFilter()\" class=\"public-filter margin-top-10\"><p><label><input type=\"checkbox\" ng-model=\"isPublic\" mw-model=\"viewModel.tmpFilter\"> {{'common.saveQuickFilterPublic' | i18n}}</label><span mw-icon=\"fa-question-circle\" tooltip=\"{{'common.saveQuickFilterPublicTooltip' | i18n}}\"></span></p><hr></div><div class=\"margin-top-10\"><button class=\"btn btn-danger\" ng-click=\"cancelFilterEdit()\">{{'common.cancel' | i18n}}</button> <button class=\"btn btn-primary\" ng-disabled=\"!viewModel.tmpFilter.isValid()\" ng-click=\"saveFilter()\">{{'common.save' | i18n}}</button></div></div></div><div ng-if=\"mwListCollection && !filtersAreApplied()\" class=\"margin-top-10\"><button class=\"btn btn-danger btn-block\" ng-click=\"cancelFilterEdit()\">{{'common.cancel' | i18n}}</button></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarNumberInput.html',
    "<div class=\"row\"><div class=\"col-md-12 form-group\" ng-class=\"{'has-error': !isValid()}\" style=\"margin-bottom: 0\"><input type=\"number\" ng-if=\"!customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" min=\"{{min}}\" max=\"{{max}}\" ng-model-options=\"{ debounce: 500 }\"><input type=\"number\" ng-if=\"customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" min=\"{{min}}\" max=\"{{max}}\" ng-model-options=\"{ debounce: 500 }\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarSelect.html',
    "<div class=\"row\"><div class=\"col-md-12\"><select ng-if=\"!customUrlParameter\" class=\"form-control\" mw-custom-select ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-options=\"key(model) as label(model) for model in options.models\" ng-disabled=\"mwDisabled\"><option value=\"\">{{ placeholder }}</option></select><select ng-if=\"customUrlParameter\" class=\"form-control\" mw-custom-select ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-options=\"key(model) as label(model) for model in options.models\" ng-disabled=\"mwDisabled\"><option value=\"\">{{ placeholder }}</option></select></div></div>"
  );
}]);
angular.module("mwUI.Relution").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit-relution/mw-ui-rln-i18n/de_DE.json',
    "{ \"rlnUikit\": { \"cancel\": \"Abbrechen\", \"mwFileUpload\": { \"dropFiles\": \"Datei hier hin ziehen um diese hochzuladen\", \"upload\": \"Datei auswählen\", \"remove\": \"Entfernen\", \"invalidMimeType\": \"Die hochgeladene Datei ist ungültig. Der vorgegebene Mime-Type is {{mimeType}}\", \"abort\": \"Upload abbrechen\", \"uploading\": \"{{fileName}} wird hochgeladen...\", \"fileTooLarge\": \"{{fileName}} {{actual}} übersteigt die maximal erlaubte Dateigröße von {{max}}\" }, \"mwSidebar\": { \"invalidFilterModal\": { \"title\": \"Der Filter ist nicht mehr gültig\", \"description\": \"Der Filter \\\"{{name}}\\\" enthält Filter Attribute die entweder nicht mehr verfügbar sind oder geändert wurden. Der Filter kann daher nicht mehr verwendet werden. Sie können den Filter entweder bearbeiten, sodass dieser wieder verwendet werden kann oder löschen.\", \"delete\": \"Filter löschen\", \"modify\": \"Filter bearbeiten\" } } } }"
  );


  $templateCache.put('uikit-relution/mw-ui-rln-i18n/en_US.json',
    "{ \"rlnUikit\": { \"cancel\": \"Cancel\", \"mwFileUpload\": { \"dropFiles\": \"Drop your file here to upload it\", \"upload\": \"Select file\", \"remove\": \"Remove\", \"invalidMimeType\": \"The uploaded file is invalid. Mime-Type has to be {{mimeType}}\", \"abort\": \"Abort upload\", \"uploading\": \"Uploading {{fileName}}...\", \"fileTooLarge\": \"{{fileName}} {{actual}} is exceeding the maximum allowed file-size {{max}}\" }, \"mwSidebar\": { \"invalidFilterModal\": { \"title\": \"The filter is invalid\", \"description\": \"The filter \\\"{{name}}\\\" contains filter attributes that are either not available anymore or have been changed. Therefore the filter does not work anymore. You can either modify the filter to make it work again or delete it.\", \"delete\": \"Delete filter\", \"modify\": \"Modify filter\" } } } }"
  );
}]);
/**
 * @license AngularJS v1.5.7
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   Sanitizes an html string by stripping all potentially dangerous tokens.
 *
 *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string.
 *
 *   The whitelist for URL sanitization of attribute values is configured using the functions
 *   `aHrefSanitizationWhitelist` and `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider
 *   `$compileProvider`}.
 *
 *   The input may also contain SVG markup if this is enabled via {@link $sanitizeProvider}.
 *
 * @param {string} html HTML input.
 * @returns {string} Sanitized HTML.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */


/**
 * @ngdoc provider
 * @name $sanitizeProvider
 *
 * @description
 * Creates and configures {@link $sanitize} instance.
 */
function $SanitizeProvider() {
  var svgEnabled = false;

  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    if (svgEnabled) {
      angular.extend(validElements, svgElements);
    }
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe:/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];


  /**
   * @ngdoc method
   * @name $sanitizeProvider#enableSvg
   * @kind function
   *
   * @description
   * Enables a subset of svg to be supported by the sanitizer.
   *
   * <div class="alert alert-warning">
   *   <p>By enabling this setting without taking other precautions, you might expose your
   *   application to click-hijacking attacks. In these attacks, sanitized svg elements could be positioned
   *   outside of the containing element and be rendered over other elements on the page (e.g. a login
   *   link). Such behavior can then result in phishing incidents.</p>
   *
   *   <p>To protect against these, explicitly setup `overflow: hidden` css rule for all potential svg
   *   tags within the sanitized content:</p>
   *
   *   <br>
   *
   *   <pre><code>
   *   .rootOfTheIncludedContent svg {
   *     overflow: hidden !important;
   *   }
   *   </code></pre>
   * </div>
   *
   * @param {boolean=} flag Enable or disable SVG support in the sanitizer.
   * @returns {boolean|ng.$sanitizeProvider} Returns the currently configured value if called
   *    without an argument or self for chaining otherwise.
   */
  this.enableSvg = function(enableSvg) {
    if (angular.isDefined(enableSvg)) {
      svgEnabled = enableSvg;
      return this;
    } else {
      return svgEnabled;
    }
  };
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = toMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = toMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = toMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, toMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, toMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

// SVG Elements
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
// Note: the elements animate,animateColor,animateMotion,animateTransform,set are intentionally omitted.
// They can potentially allow for arbitrary javascript to be executed. See #11290
var svgElements = toMap("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph," +
        "hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline," +
        "radialGradient,rect,stop,svg,switch,text,title,tspan");

// Blocked Elements (will be stripped)
var blockedElements = toMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = toMap("background,cite,href,longdesc,src,xlink:href");

var htmlAttrs = toMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
    'scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,' +
    'valign,value,vspace,width');

// SVG attributes (without "id" and "name" attributes)
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
var svgAttrs = toMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
    'baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,' +
    'cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,' +
    'font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,' +
    'height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,' +
    'marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,' +
    'max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,' +
    'path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,' +
    'requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,' +
    'stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,' +
    'stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,' +
    'stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,' +
    'underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,' +
    'width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,' +
    'xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan', true);

var validAttrs = angular.extend({},
                                uriAttrs,
                                svgAttrs,
                                htmlAttrs);

function toMap(str, lowercaseKeys) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) {
    obj[lowercaseKeys ? angular.lowercase(items[i]) : items[i]] = true;
  }
  return obj;
}

var inertBodyElement;
(function(window) {
  var doc;
  if (window.document && window.document.implementation) {
    doc = window.document.implementation.createHTMLDocument("inert");
  } else {
    throw $sanitizeMinErr('noinert', "Can't create an inert html document");
  }
  var docElement = doc.documentElement || doc.getDocumentElement();
  var bodyElements = docElement.getElementsByTagName('body');

  // usually there should be only one body element in the document, but IE doesn't have any, so we need to create one
  if (bodyElements.length === 1) {
    inertBodyElement = bodyElements[0];
  } else {
    var html = doc.createElement('html');
    inertBodyElement = doc.createElement('body');
    html.appendChild(inertBodyElement);
    doc.appendChild(html);
  }
})(window);

/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser(html, handler) {
  if (html === null || html === undefined) {
    html = '';
  } else if (typeof html !== 'string') {
    html = '' + html;
  }
  inertBodyElement.innerHTML = html;

  //mXSS protection
  var mXSSAttempts = 5;
  do {
    if (mXSSAttempts === 0) {
      throw $sanitizeMinErr('uinput', "Failed to sanitize html because the input is unstable");
    }
    mXSSAttempts--;

    // strip custom-namespaced attributes on IE<=11
    if (window.document.documentMode) {
      stripCustomNsAttrs(inertBodyElement);
    }
    html = inertBodyElement.innerHTML; //trigger mXSS
    inertBodyElement.innerHTML = html;
  } while (html !== inertBodyElement.innerHTML);

  var node = inertBodyElement.firstChild;
  while (node) {
    switch (node.nodeType) {
      case 1: // ELEMENT_NODE
        handler.start(node.nodeName.toLowerCase(), attrToMap(node.attributes));
        break;
      case 3: // TEXT NODE
        handler.chars(node.textContent);
        break;
    }

    var nextNode;
    if (!(nextNode = node.firstChild)) {
      if (node.nodeType == 1) {
        handler.end(node.nodeName.toLowerCase());
      }
      nextNode = node.nextSibling;
      if (!nextNode) {
        while (nextNode == null) {
          node = node.parentNode;
          if (node === inertBodyElement) break;
          nextNode = node.nextSibling;
          if (node.nodeType == 1) {
            handler.end(node.nodeName.toLowerCase());
          }
        }
      }
    }
    node = nextNode;
  }

  while (node = inertBodyElement.firstChild) {
    inertBodyElement.removeChild(node);
  }
}

function attrToMap(attrs) {
  var map = {};
  for (var i = 0, ii = attrs.length; i < ii; i++) {
    var attr = attrs[i];
    map[attr.name] = attr.value;
  }
  return map;
}


/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function(value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value) {
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.join('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator) {
  var ignoreCurrentElement = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs) {
      tag = angular.lowercase(tag);
      if (!ignoreCurrentElement && blockedElements[tag]) {
        ignoreCurrentElement = tag;
      }
      if (!ignoreCurrentElement && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key) {
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out('>');
      }
    },
    end: function(tag) {
      tag = angular.lowercase(tag);
      if (!ignoreCurrentElement && validElements[tag] === true && voidElements[tag] !== true) {
        out('</');
        out(tag);
        out('>');
      }
      if (tag == ignoreCurrentElement) {
        ignoreCurrentElement = false;
      }
    },
    chars: function(chars) {
      if (!ignoreCurrentElement) {
        out(encodeEntities(chars));
      }
    }
  };
}


/**
 * When IE9-11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1' attribute to declare
 * ns1 namespace and prefixes the attribute with 'ns1' (e.g. 'ns1:xlink:foo'). This is undesirable since we don't want
 * to allow any of these custom attributes. This method strips them all.
 *
 * @param node Root element to process
 */
function stripCustomNsAttrs(node) {
  if (node.nodeType === window.Node.ELEMENT_NODE) {
    var attrs = node.attributes;
    for (var i = 0, l = attrs.length; i < l; i++) {
      var attrNode = attrs[i];
      var attrName = attrNode.name.toLowerCase();
      if (attrName === 'xmlns:ns1' || attrName.lastIndexOf('ns1:', 0) === 0) {
        node.removeAttributeNode(attrNode);
        i--;
        l--;
      }
    }
  }

  var nextNode = node.firstChild;
  if (nextNode) {
    stripCustomNsAttrs(nextNode);
  }

  nextNode = node.nextSibling;
  if (nextNode) {
    stripCustomNsAttrs(nextNode);
  }
}



// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports `http/https/ftp/mailto` and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (`_blank|_self|_parent|_top`) or named frame to open links in.
 * @param {object|function(url)} [attributes] Add custom attributes to the link element.
 *
 *    Can be one of:
 *
 *    - `object`: A map of attributes
 *    - `function`: Takes the url as a parameter and returns a map of attributes
 *
 *    If the map of attributes contains a value for `target`, it overrides the value of
 *    the target parameter.
 *
 *
 * @returns {string} Html-linkified and {@link $sanitize sanitized} text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <th>Filter</th>
           <th>Source</th>
           <th>Rendered</th>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithSingleURL | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithSingleURL | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="linky-custom-attributes">
          <td>linky custom attributes</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="script.js">
       angular.module('linkyExample', ['ngSanitize'])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
             'another@somewhere.org,\n'+
             'and one more: ftp://127.0.0.1/.';
           $scope.snippetWithSingleURL = 'http://angularjs.org/';
         }]);
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithSingleURL | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });

       it('should optionally add custom attributes', function() {
        expect(element(by.id('linky-custom-attributes')).
            element(by.binding("snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-custom-attributes a')).getAttribute('rel')).toEqual('nofollow');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,
      MAILTO_REGEXP = /^mailto:/i;

  var linkyMinErr = angular.$$minErr('linky');
  var isString = angular.isString;

  return function(text, target, attributes) {
    if (text == null || text === '') return text;
    if (!isString(text)) throw linkyMinErr('notstring', 'Expected string but received: {0}', text);

    var attributesFn =
      angular.isFunction(attributes) ? attributes :
      angular.isObject(attributes) ? function getAttributesObject() {return attributes;} :
      function getEmptyAttributesObject() {return {};};

    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/www/mailto then assume mailto
      if (!match[2] && !match[4]) {
        url = (match[3] ? 'http://' : 'mailto:') + url;
      }
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      var key, linkAttributes = attributesFn(url);
      html.push('<a ');

      for (key in linkAttributes) {
        html.push(key + '="' + linkAttributes[key] + '" ');
      }

      if (angular.isDefined(target) && !('target' in linkAttributes)) {
        html.push('target="',
                  target,
                  '" ');
      }
      html.push('href="',
                url.replace(/"/g, '&quot;'),
                '">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

;/*! showdown 27-08-2015 */
(function(){
/**
 * Created by Tivie on 13-07-2015.
 */

function getDefaultOpts(simple) {
  'use strict';

  var defaultOptions = {
    omitExtraWLInCodeBlocks: {
      default: false,
      describe: 'Omit the default extra whiteline added to code blocks',
      type: 'boolean'
    },
    noHeaderId: {
      default: false,
      describe: 'Turn on/off generated header id',
      type: 'boolean'
    },
    prefixHeaderId: {
      default: false,
      describe: 'Specify a prefix to generated header ids',
      type: 'string'
    },
    headerLevelStart: {
      default: false,
      describe: 'The header blocks level start',
      type: 'integer'
    },
    parseImgDimensions: {
      default: false,
      describe: 'Turn on/off image dimension parsing',
      type: 'boolean'
    },
    simplifiedAutoLink: {
      default: false,
      describe: 'Turn on/off GFM autolink style',
      type: 'boolean'
    },
    literalMidWordUnderscores: {
      default: false,
      describe: 'Parse midword underscores as literal underscores',
      type: 'boolean'
    },
    strikethrough: {
      default: false,
      describe: 'Turn on/off strikethrough support',
      type: 'boolean'
    },
    tables: {
      default: false,
      describe: 'Turn on/off tables support',
      type: 'boolean'
    },
    tablesHeaderId: {
      default: false,
      describe: 'Add an id to table headers',
      type: 'boolean'
    },
    ghCodeBlocks: {
      default: true,
      describe: 'Turn on/off GFM fenced code blocks support',
      type: 'boolean'
    },
    tasklists: {
      default: false,
      describe: 'Turn on/off GFM tasklist support',
      type: 'boolean'
    },
    smoothLivePreview: {
      default: false,
      describe: 'Prevents weird effects in live previews due to incomplete input',
      type: 'boolean'
    }
  };
  if (simple === false) {
    return JSON.parse(JSON.stringify(defaultOptions));
  }
  var ret = {};
  for (var opt in defaultOptions) {
    if (defaultOptions.hasOwnProperty(opt)) {
      ret[opt] = defaultOptions[opt].default;
    }
  }
  return ret;
}

/**
 * Created by Tivie on 06-01-2015.
 */

// Private properties
var showdown = {},
    parsers = {},
    extensions = {},
    globalOptions = getDefaultOpts(true),
    flavor = {
      github: {
        omitExtraWLInCodeBlocks:   true,
        prefixHeaderId:            'user-content-',
        simplifiedAutoLink:        true,
        literalMidWordUnderscores: true,
        strikethrough:             true,
        tables:                    true,
        tablesHeaderId:            true,
        ghCodeBlocks:              true,
        tasklists:                 true
      },
      vanilla: getDefaultOpts(true)
    };

/**
 * helper namespace
 * @type {{}}
 */
showdown.helper = {};

/**
 * TODO LEGACY SUPPORT CODE
 * @type {{}}
 */
showdown.extensions = {};

/**
 * Set a global option
 * @static
 * @param {string} key
 * @param {*} value
 * @returns {showdown}
 */
showdown.setOption = function (key, value) {
  'use strict';
  globalOptions[key] = value;
  return this;
};

/**
 * Get a global option
 * @static
 * @param {string} key
 * @returns {*}
 */
showdown.getOption = function (key) {
  'use strict';
  return globalOptions[key];
};

/**
 * Get the global options
 * @static
 * @returns {{}}
 */
showdown.getOptions = function () {
  'use strict';
  return globalOptions;
};

/**
 * Reset global options to the default values
 * @static
 */
showdown.resetOptions = function () {
  'use strict';
  globalOptions = getDefaultOpts(true);
};

/**
 * Set the flavor showdown should use as default
 * @param {string} name
 */
showdown.setFlavor = function (name) {
  'use strict';
  if (flavor.hasOwnProperty(name)) {
    var preset = flavor[name];
    for (var option in preset) {
      if (preset.hasOwnProperty(option)) {
        globalOptions[option] = preset[option];
      }
    }
  }
};

/**
 * Get the default options
 * @static
 * @param {boolean} [simple=true]
 * @returns {{}}
 */
showdown.getDefaultOptions = function (simple) {
  'use strict';
  return getDefaultOpts(simple);
};

/**
 * Get or set a subParser
 *
 * subParser(name)       - Get a registered subParser
 * subParser(name, func) - Register a subParser
 * @static
 * @param {string} name
 * @param {function} [func]
 * @returns {*}
 */
showdown.subParser = function (name, func) {
  'use strict';
  if (showdown.helper.isString(name)) {
    if (typeof func !== 'undefined') {
      parsers[name] = func;
    } else {
      if (parsers.hasOwnProperty(name)) {
        return parsers[name];
      } else {
        throw Error('SubParser named ' + name + ' not registered!');
      }
    }
  }
};

/**
 * Gets or registers an extension
 * @static
 * @param {string} name
 * @param {object|function=} ext
 * @returns {*}
 */
showdown.extension = function (name, ext) {
  'use strict';

  if (!showdown.helper.isString(name)) {
    throw Error('Extension \'name\' must be a string');
  }

  name = showdown.helper.stdExtName(name);

  // Getter
  if (showdown.helper.isUndefined(ext)) {
    if (!extensions.hasOwnProperty(name)) {
      throw Error('Extension named ' + name + ' is not registered!');
    }
    return extensions[name];

    // Setter
  } else {
    // Expand extension if it's wrapped in a function
    if (typeof ext === 'function') {
      ext = ext();
    }

    // Ensure extension is an array
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExtension = validate(ext, name);

    if (validExtension.valid) {
      extensions[name] = ext;
    } else {
      throw Error(validExtension.error);
    }
  }
};

/**
 * Gets all extensions registered
 * @returns {{}}
 */
showdown.getAllExtensions = function () {
  'use strict';
  return extensions;
};

/**
 * Remove an extension
 * @param {string} name
 */
showdown.removeExtension = function (name) {
  'use strict';
  delete extensions[name];
};

/**
 * Removes all extensions
 */
showdown.resetExtensions = function () {
  'use strict';
  extensions = {};
};

/**
 * Validate extension
 * @param {array} extension
 * @param {string} name
 * @returns {{valid: boolean, error: string}}
 */
function validate(extension, name) {
  'use strict';

  var errMsg = (name) ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
    ret = {
      valid: true,
      error: ''
    };

  if (!showdown.helper.isArray(extension)) {
    extension = [extension];
  }

  for (var i = 0; i < extension.length; ++i) {
    var baseMsg = errMsg + ' sub-extension ' + i + ': ',
        ext = extension[i];
    if (typeof ext !== 'object') {
      ret.valid = false;
      ret.error = baseMsg + 'must be an object, but ' + typeof ext + ' given';
      return ret;
    }

    if (!showdown.helper.isString(ext.type)) {
      ret.valid = false;
      ret.error = baseMsg + 'property "type" must be a string, but ' + typeof ext.type + ' given';
      return ret;
    }

    var type = ext.type = ext.type.toLowerCase();

    // normalize extension type
    if (type === 'language') {
      type = ext.type = 'lang';
    }

    if (type === 'html') {
      type = ext.type = 'output';
    }

    if (type !== 'lang' && type !== 'output') {
      ret.valid = false;
      ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang" or "output"';
      return ret;
    }

    if (ext.filter) {
      if (typeof ext.filter !== 'function') {
        ret.valid = false;
        ret.error = baseMsg + '"filter" must be a function, but ' + typeof ext.filter + ' given';
        return ret;
      }

    } else if (ext.regex) {
      if (showdown.helper.isString(ext.regex)) {
        ext.regex = new RegExp(ext.regex, 'g');
      }
      if (!ext.regex instanceof RegExp) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' +
          typeof ext.regex + ' given';
        return ret;
      }
      if (showdown.helper.isUndefined(ext.replace)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
        return ret;
      }

    } else {
      ret.valid = false;
      ret.error = baseMsg + 'extensions must define either a "regex" property or a "filter" method';
      return ret;
    }

    if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
      ret.valid = false;
      ret.error = baseMsg + 'output extensions must define a filter property';
      return ret;
    }
  }
  return ret;
}

/**
 * Validate extension
 * @param {object} ext
 * @returns {boolean}
 */
showdown.validateExtension = function (ext) {
  'use strict';

  var validateExtension = validate(ext, null);
  if (!validateExtension.valid) {
    console.warn(validateExtension.error);
    return false;
  }
  return true;
};

/**
 * showdownjs helper functions
 */

if (!showdown.hasOwnProperty('helper')) {
  showdown.helper = {};
}

/**
 * Check if var is string
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isString = function isString(a) {
  'use strict';
  return (typeof a === 'string' || a instanceof String);
};

/**
 * ForEach helper function
 * @static
 * @param {*} obj
 * @param {function} callback
 */
showdown.helper.forEach = function forEach(obj, callback) {
  'use strict';
  if (typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i], i, obj);
    }
  }
};

/**
 * isArray helper function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isArray = function isArray(a) {
  'use strict';
  return a.constructor === Array;
};

/**
 * Check if value is undefined
 * @static
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 */
showdown.helper.isUndefined = function isUndefined(value) {
  'use strict';
  return typeof value === 'undefined';
};

/**
 * Standardidize extension name
 * @static
 * @param {string} s extension name
 * @returns {string}
 */
showdown.helper.stdExtName = function (s) {
  'use strict';
  return s.replace(/[_-]||\s/g, '').toLowerCase();
};

function escapeCharactersCallback(wholeMatch, m1) {
  'use strict';
  var charCodeToEscape = m1.charCodeAt(0);
  return '~E' + charCodeToEscape + 'E';
}

/**
 * Callback used to escape characters when passing through String.replace
 * @static
 * @param {string} wholeMatch
 * @param {string} m1
 * @returns {string}
 */
showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

/**
 * Escape characters in a string
 * @static
 * @param {string} text
 * @param {string} charsToEscape
 * @param {boolean} afterBackslash
 * @returns {XML|string|void|*}
 */
showdown.helper.escapeCharacters = function escapeCharacters(text, charsToEscape, afterBackslash) {
  'use strict';
  // First we have to escape the escape characters so that
  // we can build a character class out of them
  var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

  if (afterBackslash) {
    regexString = '\\\\' + regexString;
  }

  var regex = new RegExp(regexString, 'g');
  text = text.replace(regex, escapeCharactersCallback);

  return text;
};

/**
 * POLYFILLS
 */
if (showdown.helper.isUndefined(console)) {
  console = {
    warn: function (msg) {
      'use strict';
      alert(msg);
    },
    log: function (msg) {
      'use strict';
      alert(msg);
    }
  };
}

/**
 * Created by Estevao on 31-05-2015.
 */

/**
 * Showdown Converter class
 * @class
 * @param {object} [converterOptions]
 * @returns {Converter}
 */
showdown.Converter = function (converterOptions) {
  'use strict';

  var
      /**
       * Options used by this converter
       * @private
       * @type {{}}
       */
      options = {},

      /**
       * Language extensions used by this converter
       * @private
       * @type {Array}
       */
      langExtensions = [],

      /**
       * Output modifiers extensions used by this converter
       * @private
       * @type {Array}
       */
      outputModifiers = [],

      /**
       * The parser Order
       * @private
       * @type {string[]}
       */
      parserOrder = [
        'githubCodeBlocks',
        'hashHTMLBlocks',
        'stripLinkDefinitions',
        'blockGamut',
        'unescapeSpecialChars'
      ];

  _constructor();

  /**
   * Converter constructor
   * @private
   */
  function _constructor() {
    converterOptions = converterOptions || {};

    for (var gOpt in globalOptions) {
      if (globalOptions.hasOwnProperty(gOpt)) {
        options[gOpt] = globalOptions[gOpt];
      }
    }

    // Merge options
    if (typeof converterOptions === 'object') {
      for (var opt in converterOptions) {
        if (converterOptions.hasOwnProperty(opt)) {
          options[opt] = converterOptions[opt];
        }
      }
    } else {
      throw Error('Converter expects the passed parameter to be an object, but ' + typeof converterOptions +
      ' was passed instead.');
    }

    if (options.extensions) {
      showdown.helper.forEach(options.extensions, _parseExtension);
    }
  }

  /**
   * Parse extension
   * @param {*} ext
   * @param {string} [name='']
   * @private
   */
  function _parseExtension(ext, name) {

    name = name || null;
    // If it's a string, the extension was previously loaded
    if (showdown.helper.isString(ext)) {
      ext = showdown.helper.stdExtName(ext);
      name = ext;

      // LEGACY_SUPPORT CODE
      if (showdown.extensions[ext]) {
        console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' +
          'Please inform the developer that the extension should be updated!');
        legacyExtensionLoading(showdown.extensions[ext], ext);
        return;
      // END LEGACY SUPPORT CODE

      } else if (!showdown.helper.isUndefined(extensions[ext])) {
        ext = extensions[ext];

      } else {
        throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
      }
    }

    if (typeof ext === 'function') {
      ext = ext();
    }

    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExt = validate(ext, name);
    if (!validExt.valid) {
      throw Error(validExt.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;

        case 'output':
          outputModifiers.push(ext[i]);
          break;

        default:
          // should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * LEGACY_SUPPORT
   * @param {*} ext
   * @param {string} name
   */
  function legacyExtensionLoading(ext, name) {
    if (typeof ext === 'function') {
      ext = ext(new showdown.Converter());
    }
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }
    var valid = validate(ext, name);

    if (!valid.valid) {
      throw Error(valid.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;
        case 'output':
          outputModifiers.push(ext[i]);
          break;
        default:// should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * Converts a markdown string into HTML
   * @param {string} text
   * @returns {*}
   */
  this.makeHtml = function (text) {
    //check if text is not falsy
    if (!text) {
      return text;
    }

    var globals = {
      gHtmlBlocks:     [],
      gUrls:           {},
      gTitles:         {},
      gDimensions:     {},
      gListLevel:      0,
      hashLinkCounts:  {},
      langExtensions:  langExtensions,
      outputModifiers: outputModifiers,
      converter:       this
    };

    // attacklab: Replace ~ with ~T
    // This lets us use tilde as an escape char to avoid md5 hashes
    // The choice of character is arbitrary; anything that isn't
    // magic in Markdown will work.
    text = text.replace(/~/g, '~T');

    // attacklab: Replace $ with ~D
    // RegExp interprets $ as a special character
    // when it's in a replacement string
    text = text.replace(/\$/g, '~D');

    // Standardize line endings
    text = text.replace(/\r\n/g, '\n'); // DOS to Unix
    text = text.replace(/\r/g, '\n'); // Mac to Unix

    // Make sure text begins and ends with a couple of newlines:
    text = '\n\n' + text + '\n\n';

    // detab
    text = showdown.subParser('detab')(text, options, globals);

    // stripBlankLines
    text = showdown.subParser('stripBlankLines')(text, options, globals);

    //run languageExtensions
    showdown.helper.forEach(langExtensions, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    // Run all registered parsers
    for (var i = 0; i < parserOrder.length; ++i) {
      var name = parserOrder[i];
      text = parsers[name](text, options, globals);
    }

    // attacklab: Restore dollar signs
    text = text.replace(/~D/g, '$$');

    // attacklab: Restore tildes
    text = text.replace(/~T/g, '~');

    // Run output modifiers
    showdown.helper.forEach(outputModifiers, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    return text;
  };

  /**
   * Set an option of this Converter instance
   * @param {string} key
   * @param {*} value
   */
  this.setOption = function (key, value) {
    options[key] = value;
  };

  /**
   * Get the option of this Converter instance
   * @param {string} key
   * @returns {*}
   */
  this.getOption = function (key) {
    return options[key];
  };

  /**
   * Get the options of this Converter instance
   * @returns {{}}
   */
  this.getOptions = function () {
    return options;
  };

  /**
   * Add extension to THIS converter
   * @param {{}} extension
   * @param {string} [name=null]
   */
  this.addExtension = function (extension, name) {
    name = name || null;
    _parseExtension(extension, name);
  };

  /**
   * Use a global registered extension with THIS converter
   * @param {string} extensionName Name of the previously registered extension
   */
  this.useExtension = function (extensionName) {
    _parseExtension(extensionName);
  };

  /**
   * Set the flavor THIS converter should use
   * @param {string} name
   */
  this.setFlavor = function (name) {
    if (flavor.hasOwnProperty(name)) {
      var preset = flavor[name];
      for (var option in preset) {
        if (preset.hasOwnProperty(option)) {
          options[option] = preset[option];
        }
      }
    }
  };

  /**
   * Remove an extension from THIS converter.
   * Note: This is a costly operation. It's better to initialize a new converter
   * and specify the extensions you wish to use
   * @param {Array} extension
   */
  this.removeExtension = function (extension) {
    if (!showdown.helper.isArray(extension)) {
      extension = [extension];
    }
    for (var a = 0; a < extension.length; ++a) {
      var ext = extension[a];
      for (var i = 0; i < langExtensions.length; ++i) {
        if (langExtensions[i] === ext) {
          langExtensions[i].splice(i, 1);
        }
      }
      for (var ii = 0; ii < outputModifiers.length; ++i) {
        if (outputModifiers[ii] === ext) {
          outputModifiers[ii].splice(i, 1);
        }
      }
    }
  };

  /**
   * Get all extension of THIS converter
   * @returns {{language: Array, output: Array}}
   */
  this.getAllExtensions = function () {
    return {
      language: langExtensions,
      output: outputModifiers
    };
  };
};

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('anchors', function (text, config, globals) {
  'use strict';

  var writeAnchorTag = function (wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
    if (showdown.helper.isUndefined(m7)) {
      m7 = '';
    }
    wholeMatch = m1;
    var linkText = m2,
        linkId = m3.toLowerCase(),
        url = m4,
        title = m7;

    if (!url) {
      if (!linkId) {
        // lower-case and turn embedded newlines into spaces
        linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
        url = globals.gUrls[linkId];
        if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
          title = globals.gTitles[linkId];
        }
      } else {
        if (wholeMatch.search(/\(\s*\)$/m) > -1) {
          // Special case for explicit empty url
          url = '';
        } else {
          return wholeMatch;
        }
      }
    }

    url = showdown.helper.escapeCharacters(url, '*_', false);
    var result = '<a href="' + url + '"';

    if (title !== '' && title !== null) {
      title = title.replace(/"/g, '&quot;');
      title = showdown.helper.escapeCharacters(title, '*_', false);
      result += ' title="' + title + '"';
    }

    result += '>' + linkText + '</a>';

    return result;
  };

  // First, handle reference-style links: [link text] [id]
  /*
   text = text.replace(/
   (							// wrap whole match in $1
   \[
   (
   (?:
   \[[^\]]*\]		// allow brackets nested one level
   |
   [^\[]			// or anything else
   )*
   )
   \]

   [ ]?					// one optional space
   (?:\n[ ]*)?				// one optional newline followed by spaces

   \[
   (.*?)					// id = $3
   \]
   )()()()()					// pad remaining backreferences
   /g,_DoAnchors_callback);
   */
  text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeAnchorTag);

  //
  // Next, inline-style links: [link text](url "optional title")
  //

  /*
   text = text.replace(/
   (						// wrap whole match in $1
   \[
   (
   (?:
   \[[^\]]*\]	// allow brackets nested one level
   |
   [^\[\]]			// or anything else
   )
   )
   \]
   \(						// literal paren
   [ \t]*
   ()						// no id, so leave $3 empty
   <?(.*?)>?				// href = $4
   [ \t]*
   (						// $5
   (['"])				// quote char = $6
   (.*?)				// Title = $7
   \6					// matching quote
   [ \t]*				// ignore any spaces/tabs between closing quote and )
   )?						// title is optional
   \)
   )
   /g,writeAnchorTag);
   */
  text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
                      writeAnchorTag);

  //
  // Last, handle reference-style shortcuts: [link text]
  // These must come last in case you've also got [link test][1]
  // or [link test](/foo)
  //

  /*
   text = text.replace(/
   (                // wrap whole match in $1
   \[
   ([^\[\]]+)       // link text = $2; can't contain '[' or ']'
   \]
   )()()()()()      // pad rest of backreferences
   /g, writeAnchorTag);
   */
  text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

  return text;

});

showdown.subParser('autoLinks', function (text, options) {
  'use strict';

  //simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,

  var simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi,
      delimUrlRegex   = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi,
      simpleMailRegex = /\b(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)\b/gi,
      delimMailRegex  = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;

  text = text.replace(delimUrlRegex, '<a href=\"$1\">$1</a>');
  text = text.replace(delimMailRegex, replaceMail);
  //simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,
  // Email addresses: <address@domain.foo>

  if (options.simplifiedAutoLink) {
    text = text.replace(simpleURLRegex, '<a href=\"$1\">$1</a>');
    text = text.replace(simpleMailRegex, replaceMail);
  }

  function replaceMail(wholeMatch, m1) {
    var unescapedStr = showdown.subParser('unescapeSpecialChars')(m1);
    return showdown.subParser('encodeEmailAddress')(unescapedStr);
  }

  return text;
});

/**
 * These are all the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', function (text, options, globals) {
  'use strict';

  // we parse blockquotes first so that we can have headings and hrs
  // inside blockquotes
  text = showdown.subParser('blockQuotes')(text, options, globals);
  text = showdown.subParser('headers')(text, options, globals);

  // Do Horizontal Rules:
  var key = showdown.subParser('hashBlock')('<hr />', options, globals);
  text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key);
  text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key);
  text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, key);

  text = showdown.subParser('lists')(text, options, globals);
  text = showdown.subParser('codeBlocks')(text, options, globals);
  text = showdown.subParser('tables')(text, options, globals);

  // We already ran _HashHTMLBlocks() before, in Markdown(), but that
  // was to escape raw HTML in the original Markdown source. This time,
  // we're escaping the markup we've just created, so that we don't wrap
  // <p> tags around block-level tags.
  text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
  text = showdown.subParser('paragraphs')(text, options, globals);

  return text;

});

showdown.subParser('blockQuotes', function (text, options, globals) {
  'use strict';

  /*
   text = text.replace(/
   (								// Wrap whole match in $1
   (
   ^[ \t]*>[ \t]?			// '>' at the start of a line
   .+\n					// rest of the first line
   (.+\n)*					// subsequent consecutive lines
   \n*						// blanks
   )+
   )
   /gm, function(){...});
   */

  text = text.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function (wholeMatch, m1) {
    var bq = m1;

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"
    bq = bq.replace(/^[ \t]*>[ \t]?/gm, '~0'); // trim one level of quoting

    // attacklab: clean up hack
    bq = bq.replace(/~0/g, '');

    bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
    bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
    bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

    bq = bq.replace(/(^|\n)/g, '$1  ');
    // These leading spaces screw with <pre> content, so we need to fix that:
    bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
      var pre = m1;
      // attacklab: hack around Konqueror 3.5.4 bug:
      pre = pre.replace(/^  /mg, '~0');
      pre = pre.replace(/~0/g, '');
      return pre;
    });

    return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
  });
  return text;
});

/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', function (text, options, globals) {
  'use strict';

  /*
   text = text.replace(text,
   /(?:\n\n|^)
   (								// $1 = the code block -- one or more lines, starting with a space/tab
   (?:
   (?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
   .*\n+
   )+
   )
   (\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
   /g,function(){...});
   */

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '~0';

  var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
  text = text.replace(pattern, function (wholeMatch, m1, m2) {
    var codeblock = m1,
        nextChar = m2,
        end = '\n';

    codeblock = showdown.subParser('outdent')(codeblock);
    codeblock = showdown.subParser('encodeCode')(codeblock);
    codeblock = showdown.subParser('detab')(codeblock);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

    if (options.omitExtraWLInCodeBlocks) {
      end = '';
    }

    codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

/**
 *
 *   *  Backtick quotes are used for <code></code> spans.
 *
 *   *  You can use multiple backticks as the delimiters if you want to
 *     include literal backticks in the code span. So, this input:
 *
 *         Just type ``foo `bar` baz`` at the prompt.
 *
 *       Will translate to:
 *
 *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
 *
 *    There's no arbitrary limit to the number of backticks you
 *    can use as delimters. If you need three consecutive backticks
 *    in your code, use four for delimiters, etc.
 *
 *  *  You can use spaces to get literal backticks at the edges:
 *
 *         ... type `` `bar` `` ...
 *
 *       Turns to:
 *
 *         ... type <code>`bar`</code> ...
 */
showdown.subParser('codeSpans', function (text) {
  'use strict';

  //special case -> literal html code tag
  text = text.replace(/(<code[^><]*?>)([^]*?)<\/code>/g, function (wholeMatch, tag, c) {
    c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
    c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
    c = showdown.subParser('encodeCode')(c);
    return tag + c + '</code>';
  });

  /*
   text = text.replace(/
   (^|[^\\])					// Character before opening ` can't be a backslash
   (`+)						// $2 = Opening run of `
   (							// $3 = The code block
   [^\r]*?
   [^`]					// attacklab: work around lack of lookbehind
   )
   \2							// Matching closer
   (?!`)
   /gm, function(){...});
   */
  text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
    function (wholeMatch, m1, m2, m3) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
      c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
      c = showdown.subParser('encodeCode')(c);
      return m1 + '<code>' + c + '</code>';
    }
  );

  return text;
});

/**
 * Convert all tabs to spaces
 */
showdown.subParser('detab', function (text) {
  'use strict';

  // expand first n-1 tabs
  text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

  // replace the nth with two sentinels
  text = text.replace(/\t/g, '~A~B');

  // use the sentinel to anchor our regex so it doesn't explode
  text = text.replace(/~B(.+?)~A/g, function (wholeMatch, m1) {
    var leadingText = m1,
        numSpaces = 4 - leadingText.length % 4;  // g_tab_width

    // there *must* be a better way to do this:
    for (var i = 0; i < numSpaces; i++) {
      leadingText += ' ';
    }

    return leadingText;
  });

  // clean up sentinels
  text = text.replace(/~A/g, '    ');  // g_tab_width
  text = text.replace(/~B/g, '');

  return text;

});

/**
 * Smart processing for ampersands and angle brackets that need to be encoded.
 */
showdown.subParser('encodeAmpsAndAngles', function (text) {
  'use strict';
  // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
  // http://bumppo.net/projects/amputator/
  text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

  // Encode naked <'s
  text = text.replace(/<(?![a-z\/?\$!])/gi, '&lt;');

  return text;
});

/**
 * Returns the string, with after processing the following backslash escape sequences.
 *
 * attacklab: The polite way to do this is with the new escapeCharacters() function:
 *
 *    text = escapeCharacters(text,"\\",true);
 *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
 *
 * ...but we're sidestepping its use of the (slow) RegExp constructor
 * as an optimization for Firefox.  This function gets called a LOT.
 */
showdown.subParser('encodeBackslashEscapes', function (text) {
  'use strict';
  text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
  text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback);
  return text;
});

/**
 * Encode/escape certain characters inside Markdown code runs.
 * The point is that in code, these characters are literals,
 * and lose their special Markdown meanings.
 */
showdown.subParser('encodeCode', function (text) {
  'use strict';

  // Encode all ampersands; HTML entities are not
  // entities within a Markdown code span.
  text = text.replace(/&/g, '&amp;');

  // Do the angle bracket song and dance:
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');

  // Now, escape characters that are magic in Markdown:
  text = showdown.helper.escapeCharacters(text, '*_{}[]\\', false);

  // jj the line above breaks this:
  //---
  //* Item
  //   1. Subitem
  //            special char: *
  // ---

  return text;
});

/**
 *  Input: an email address, e.g. "foo@example.com"
 *
 *  Output: the email address as a mailto link, with each character
 *    of the address encoded as either a decimal or hex entity, in
 *    the hopes of foiling most address harvesting spam bots. E.g.:
 *
 *    <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
 *       x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
 *       &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
 *
 *  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
 *  mailing list: <http://tinyurl.com/yu7ue>
 *
 */
showdown.subParser('encodeEmailAddress', function (addr) {
  'use strict';

  var encode = [
    function (ch) {
      return '&#' + ch.charCodeAt(0) + ';';
    },
    function (ch) {
      return '&#x' + ch.charCodeAt(0).toString(16) + ';';
    },
    function (ch) {
      return ch;
    }
  ];

  addr = 'mailto:' + addr;

  addr = addr.replace(/./g, function (ch) {
    if (ch === '@') {
      // this *must* be encoded. I insist.
      ch = encode[Math.floor(Math.random() * 2)](ch);
    } else if (ch !== ':') {
      // leave ':' alone (to spot mailto: later)
      var r = Math.random();
      // roughly 10% raw, 45% hex, 45% dec
      ch = (
        r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch)
      );
    }
    return ch;
  });

  addr = '<a href="' + addr + '">' + addr + '</a>';
  addr = addr.replace(/">.+:/g, '">'); // strip the mailto: from the visible part

  return addr;
});

/**
 * Within tags -- meaning between < and > -- encode [\ ` * _] so they
 * don't conflict with their use in Markdown for code, italics and strong.
 */
showdown.subParser('escapeSpecialCharsWithinTagAttributes', function (text) {
  'use strict';

  // Build a regex to find HTML tags and comments.  See Friedl's
  // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
  var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

  text = text.replace(regex, function (wholeMatch) {
    var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, '$1`');
    tag = showdown.helper.escapeCharacters(tag, '\\`*_', false);
    return tag;
  });

  return text;
});

/**
 * Handle github codeblocks prior to running HashHTML so that
 * HTML contained within the codeblock gets escaped properly
 * Example:
 * ```ruby
 *     def hello_world(x)
 *       puts "Hello, #{x}"
 *     end
 * ```
 */
showdown.subParser('githubCodeBlocks', function (text, options, globals) {
  'use strict';

  // early exit if option is not enabled
  if (!options.ghCodeBlocks) {
    return text;
  }

  text += '~0';

  text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (wholeMatch, language, codeblock) {
    var end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

    codeblock = showdown.subParser('encodeCode')(codeblock);
    codeblock = showdown.subParser('detab')(codeblock);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

    codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals);
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;

});

showdown.subParser('hashBlock', function (text, options, globals) {
  'use strict';
  text = text.replace(/(^\n+|\n+$)/g, '');
  return '\n\n~K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
});

showdown.subParser('hashElement', function (text, options, globals) {
  'use strict';

  return function (wholeMatch, m1) {
    var blockText = m1;

    // Undo double lines
    blockText = blockText.replace(/\n\n/g, '\n');
    blockText = blockText.replace(/^\n/, '');

    // strip trailing blank lines
    blockText = blockText.replace(/\n+$/g, '');

    // Replace the element text with a marker ("~KxK" where x is its key)
    blockText = '\n\n~K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

    return blockText;
  };
});

showdown.subParser('hashHTMLBlocks', function (text, options, globals) {
  'use strict';

  // attacklab: Double up blank lines to reduce lookaround
  text = text.replace(/\n/g, '\n\n');

  // Hashify HTML blocks:
  // We only want to do this for block-level HTML tags, such as headers,
  // lists, and tables. That's because we still want to wrap <p>s around
  // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
  // phrase emphasis, and spans. The list of tags we're looking for is
  // hard-coded:
  //var block_tags_a =
  // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside';
  // var block_tags_b =
  // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside';

  // First, look for nested blocks, e.g.:
  //   <div>
  //     <div>
  //     tags for inner block must be indented.
  //     </div>
  //   </div>
  //
  // The outermost tags must start at the left margin for this to match, and
  // the inner nested divs must be indented.
  // We need to do this before the next, more liberal match, because the next
  // match will start at the first `<div>` and stop at the first `</div>`.

  // attacklab: This regex can be expensive when it fails.
  /*
   var text = text.replace(/
   (						// save in $1
   ^					// start of line  (with /m)
   <($block_tags_a)	// start tag = $2
   \b					// word break
   // attacklab: hack around khtml/pcre bug...
   [^\r]*?\n			// any number of lines, minimally matching
   </\2>				// the matching end tag
   [ \t]*				// trailing spaces/tabs
   (?=\n+)				// followed by a newline
   )						// attacklab: there are sentinel newlines at end of document
   /gm,function(){...}};
   */
  text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,
                      showdown.subParser('hashElement')(text, options, globals));

  //
  // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
  //

  /*
   var text = text.replace(/
   (						// save in $1
   ^					// start of line  (with /m)
   <($block_tags_b)	// start tag = $2
   \b					// word break
   // attacklab: hack around khtml/pcre bug...
   [^\r]*?				// any number of lines, minimally matching
   </\2>				// the matching end tag
   [ \t]*				// trailing spaces/tabs
   (?=\n+)				// followed by a newline
   )						// attacklab: there are sentinel newlines at end of document
   /gm,function(){...}};
   */
  text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside|address|audio|canvas|figure|hgroup|output|video)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,
                      showdown.subParser('hashElement')(text, options, globals));

  // Special case just for <hr />. It was easier to make a special case than
  // to make the other regex more complicated.

  /*
   text = text.replace(/
   (						// save in $1
   \n\n				// Starting after a blank line
   [ ]{0,3}
   (<(hr)				// start tag = $2
   \b					// word break
   ([^<>])*?			//
   \/?>)				// the matching end tag
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // Special case for standalone HTML comments:

  /*
   text = text.replace(/
   (						// save in $1
   \n\n				// Starting after a blank line
   [ ]{0,3}			// attacklab: g_tab_width - 1
   <!
   (--[^\r]*?--\s*)+
   >
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // PHP and ASP-style processor instructions (<?...?> and <%...%>)

  /*
   text = text.replace(/
   (?:
   \n\n				// Starting after a blank line
   )
   (						// save in $1
   [ ]{0,3}			// attacklab: g_tab_width - 1
   (?:
   <([?%])			// $2
   [^\r]*?
   \2>
   )
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // attacklab: Undo double lines (see comment at top of this function)
  text = text.replace(/\n\n/g, '\n');
  return text;

});

showdown.subParser('headers', function (text, options, globals) {
  'use strict';

  var prefixHeader = options.prefixHeaderId,
      headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart),

  // Set text-style headers:
  //	Header 1
  //	========
  //
  //	Header 2
  //	--------
  //
      setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text = text.replace(setextRegexH1, function (wholeMatch, m1) {

    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  text = text.replace(setextRegexH2, function (matchFound, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart + 1,
      hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  // atx-style headers:
  //  # Header 1
  //  ## Header 2
  //  ## Header 2 with closing hashes ##
  //  ...
  //  ###### Header 6
  //
  text = text.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function (wholeMatch, m1, m2) {
    var span = showdown.subParser('spanGamut')(m2, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
        hLevel = headerLevelStart - 1 + m1.length,
        header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

    return showdown.subParser('hashBlock')(header, options, globals);
  });

  function headerId(m) {
    var title, escapedId = m.replace(/[^\w]/g, '').toLowerCase();

    if (globals.hashLinkCounts[escapedId]) {
      title = escapedId + '-' + (globals.hashLinkCounts[escapedId]++);
    } else {
      title = escapedId;
      globals.hashLinkCounts[escapedId] = 1;
    }

    // Prefix id to prevent causing inadvertent pre-existing style matches.
    if (prefixHeader === true) {
      prefixHeader = 'section';
    }

    if (showdown.helper.isString(prefixHeader)) {
      return prefixHeader + title;
    }
    return title;
  }

  return text;
});

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
showdown.subParser('images', function (text, options, globals) {
  'use strict';

  var inlineRegExp    = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g,
      referenceRegExp = /!\[(.*?)][ ]?(?:\n[ ]*)?\[(.*?)]()()()()()/g;

  function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title) {

    var gUrls   = globals.gUrls,
        gTitles = globals.gTitles,
        gDims   = globals.gDimensions;

    linkId = linkId.toLowerCase();

    if (!title) {
      title = '';
    }

    if (url === '' || url === null) {
      if (linkId === '' || linkId === null) {
        // lower-case and turn embedded newlines into spaces
        linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(gUrls[linkId])) {
        url = gUrls[linkId];
        if (!showdown.helper.isUndefined(gTitles[linkId])) {
          title = gTitles[linkId];
        }
        if (!showdown.helper.isUndefined(gDims[linkId])) {
          width = gDims[linkId].width;
          height = gDims[linkId].height;
        }
      } else {
        return wholeMatch;
      }
    }

    altText = altText.replace(/"/g, '&quot;');
    altText = showdown.helper.escapeCharacters(altText, '*_', false);
    url = showdown.helper.escapeCharacters(url, '*_', false);
    var result = '<img src="' + url + '" alt="' + altText + '"';

    if (title) {
      title = title.replace(/"/g, '&quot;');
      title = showdown.helper.escapeCharacters(title, '*_', false);
      result += ' title="' + title + '"';
    }

    if (width && height) {
      width  = (width === '*') ? 'auto' : width;
      height = (height === '*') ? 'auto' : height;

      result += ' width="' + width + '"';
      result += ' height="' + height + '"';
    }

    result += ' />';

    return result;
  }

  // First, handle reference-style labeled images: ![alt text][id]
  text = text.replace(referenceRegExp, writeImageTag);

  // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")
  text = text.replace(inlineRegExp, writeImageTag);

  return text;
});

showdown.subParser('italicsAndBold', function (text, options) {
  'use strict';

  if (options.literalMidWordUnderscores) {
    //underscores
    // Since we are consuming a \s character, we need to add it
    text = text.replace(/(^|\s|>|\b)__(?=\S)([^]+?)__(?=\b|<|\s|$)/gm, '$1<strong>$2</strong>');
    text = text.replace(/(^|\s|>|\b)_(?=\S)([^]+?)_(?=\b|<|\s|$)/gm, '$1<em>$2</em>');
    //asterisks
    text = text.replace(/\*\*(?=\S)([^]+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(?=\S)([^]+?)\*/g, '<em>$1</em>');

  } else {
    // <strong> must go first:
    text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>');
    text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
  }
  return text;
});

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
showdown.subParser('lists', function (text, options, globals) {
  'use strict';

  /**
   * Process the contents of a single ordered or unordered list, splitting it
   * into individual list items.
   * @param {string} listStr
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function processListItems (listStr, trimTrailing) {
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".
    globals.gListLevel++;

    // trim trailing blank lines:
    listStr = listStr.replace(/\n{2,}$/, '\n');

    // attacklab: add sentinel to emulate \z
    listStr += '~0';

    var rgx = /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
        isParagraphed = (/\n[ \t]*\n(?!~0)/.test(listStr));

    listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
      checked = (checked && checked.trim() !== '');
      var item = showdown.subParser('outdent')(m4, options, globals),
          bulletStyle = '';

      // Support for github tasklists
      if (taskbtn && options.tasklists) {
        bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
        item = item.replace(/^[ \t]*\[(x| )?]/m, function () {
          var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
          if (checked) {
            otp += ' checked';
          }
          otp += '>';
          return otp;
        });
      }
      // m1 - Leading line or
      // Has a double return (multi paragraph) or
      // Has sublist
      if (m1 || (item.search(/\n{2,}/) > -1)) {
        item = showdown.subParser('githubCodeBlocks')(item, options, globals);
        item = showdown.subParser('blockGamut')(item, options, globals);
      } else {
        // Recursion for sub-lists:
        item = showdown.subParser('lists')(item, options, globals);
        item = item.replace(/\n$/, ''); // chomp(item)
        if (isParagraphed) {
          item = showdown.subParser('paragraphs')(item, options, globals);
        } else {
          item = showdown.subParser('spanGamut')(item, options, globals);
        }
      }
      item =  '\n<li' + bulletStyle + '>' + item + '</li>\n';
      return item;
    });

    // attacklab: strip sentinel
    listStr = listStr.replace(/~0/g, '');

    globals.gListLevel--;

    if (trimTrailing) {
      listStr = listStr.replace(/\s+$/, '');
    }

    return listStr;
  }

  /**
   * Check and parse consecutive lists (better fix for issue #142)
   * @param {string} list
   * @param {string} listType
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function parseConsecutiveLists(list, listType, trimTrailing) {
    // check if we caught 2 or more consecutive lists by mistake
    // we use the counterRgx, meaning if listType is UL we look for UL and vice versa
    var counterRxg = (listType === 'ul') ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm,
      subLists = [],
      result = '';

    if (list.search(counterRxg) !== -1) {
      (function parseCL(txt) {
        var pos = txt.search(counterRxg);
        if (pos !== -1) {
          // slice
          result += '\n\n<' + listType + '>' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n\n';

          // invert counterType and listType
          listType = (listType === 'ul') ? 'ol' : 'ul';
          counterRxg = (listType === 'ul') ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm;

          //recurse
          parseCL(txt.slice(pos));
        } else {
          result += '\n\n<' + listType + '>' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n\n';
        }
      })(list);
      for (var i = 0; i < subLists.length; ++i) {

      }
    } else {
      result = '\n\n<' + listType + '>' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n\n';
    }

    return result;
  }

  // attacklab: add sentinel to hack around khtml/safari bug:
  // http://bugs.webkit.org/show_bug.cgi?id=11231
  text += '~0';

  // Re-usable pattern to match any entire ul or ol list:
  var wholeList = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

  if (globals.gListLevel) {
    text = text.replace(wholeList, function (wholeMatch, list, m2) {
      var listType = (m2.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
      return parseConsecutiveLists(list, listType, true);
    });
  } else {
    wholeList = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    //wholeList = /(\n\n|^\n?)( {0,3}([*+-]|\d+\.)[ \t]+[\s\S]+?)(?=(~0)|(\n\n(?!\t| {2,}| {0,3}([*+-]|\d+\.)[ \t])))/g;
    text = text.replace(wholeList, function (wholeMatch, m1, list, m3) {

      var listType = (m3.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
      return parseConsecutiveLists(list, listType);
    });
  }

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

/**
 * Remove one level of line-leading tabs or spaces
 */
showdown.subParser('outdent', function (text) {
  'use strict';

  // attacklab: hack around Konqueror 3.5.4 bug:
  // "----------bug".replace(/^-/g,"") == "bug"
  text = text.replace(/^(\t|[ ]{1,4})/gm, '~0'); // attacklab: g_tab_width

  // attacklab: clean up hack
  text = text.replace(/~0/g, '');

  return text;
});

/**
 *
 */
showdown.subParser('paragraphs', function (text, options, globals) {
  'use strict';

  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');

  var grafs = text.split(/\n{2,}/g),
      grafsOut = [],
      end = grafs.length; // Wrap <p> tags

  for (var i = 0; i < end; i++) {
    var str = grafs[i];

    // if this is an HTML marker, copy it
    if (str.search(/~K(\d+)K/g) >= 0) {
      grafsOut.push(str);
    } else if (str.search(/\S/) >= 0) {
      str = showdown.subParser('spanGamut')(str, options, globals);
      str = str.replace(/^([ \t]*)/g, '<p>');
      str += '</p>';
      grafsOut.push(str);
    }
  }

  /** Unhashify HTML blocks */
  end = grafsOut.length;
  for (i = 0; i < end; i++) {
    // if this is a marker for an html block...
    while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
      var blockText = globals.gHtmlBlocks[RegExp.$1];
      blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs
      grafsOut[i] = grafsOut[i].replace(/~K\d+K/, blockText);
    }
  }

  return grafsOut.join('\n\n');
});

/**
 * Run extension
 */
showdown.subParser('runExtension', function (ext, text, options, globals) {
  'use strict';

  if (ext.filter) {
    text = ext.filter(text, globals.converter, options);

  } else if (ext.regex) {
    // TODO remove this when old extension loading mechanism is deprecated
    var re = ext.regex;
    if (!re instanceof RegExp) {
      re = new RegExp(re, 'g');
    }
    text = text.replace(re, ext.replace);
  }

  return text;
});

/**
 * These are all the transformations that occur *within* block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('spanGamut', function (text, options, globals) {
  'use strict';

  text = showdown.subParser('codeSpans')(text, options, globals);
  text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
  text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

  // Process anchor and image tags. Images must come first,
  // because ![foo][f] looks like an anchor.
  text = showdown.subParser('images')(text, options, globals);
  text = showdown.subParser('anchors')(text, options, globals);

  // Make links out of things like `<http://example.com/>`
  // Must come after _DoAnchors(), because you can use < and >
  // delimiters in inline links like [this](<url>).
  text = showdown.subParser('autoLinks')(text, options, globals);
  text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);
  text = showdown.subParser('italicsAndBold')(text, options, globals);
  text = showdown.subParser('strikethrough')(text, options, globals);

  // Do hard breaks:
  text = text.replace(/  +\n/g, ' <br />\n');

  return text;

});

showdown.subParser('strikethrough', function (text, options) {
  'use strict';

  if (options.strikethrough) {
    text = text.replace(/(?:~T){2}([^~]+)(?:~T){2}/g, '<del>$1</del>');
  }

  return text;
});

/**
 * Strip any lines consisting only of spaces and tabs.
 * This makes subsequent regexs easier to write, because we can
 * match consecutive blank lines with /\n+/ instead of something
 * contorted like /[ \t]*\n+/
 */
showdown.subParser('stripBlankLines', function (text) {
  'use strict';
  return text.replace(/^[ \t]+$/mg, '');
});

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 * Link defs are in the form: ^[id]: url "optional title"
 *
 * ^[ ]{0,3}\[(.+)\]: // id = $1  attacklab: g_tab_width - 1
 * [ \t]*
 * \n?                  // maybe *one* newline
 * [ \t]*
 * <?(\S+?)>?          // url = $2
 * [ \t]*
 * \n?                // maybe one newline
 * [ \t]*
 * (?:
 * (\n*)              // any lines skipped = $3 attacklab: lookbehind removed
 * ["(]
 * (.+?)              // title = $4
 * [")]
 * [ \t]*
 * )?                 // title is optional
 * (?:\n+|$)
 * /gm,
 * function(){...});
 *
 */
showdown.subParser('stripLinkDefinitions', function (text, options, globals) {
  'use strict';

  var regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '~0';

  text = text.replace(regex, function (wholeMatch, linkId, url, width, height, blankLines, title) {
    linkId = linkId.toLowerCase();
    globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url);  // Link IDs are case-insensitive

    if (blankLines) {
      // Oops, found blank lines, so it's not a title.
      // Put back the parenthetical statement we stole.
      return blankLines + title;

    } else {
      if (title) {
        globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
      }
      if (options.parseImgDimensions && width && height) {
        globals.gDimensions[linkId] = {
          width:  width,
          height: height
        };
      }
    }
    // Completely remove the definition from the text
    return '';
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

showdown.subParser('tables', function (text, options, globals) {
  'use strict';

  var table = function () {

    var tables = {},
        filter;

    tables.th = function (header, style) {
      var id = '';
      header = header.trim();
      if (header === '') {
        return '';
      }
      if (options.tableHeaderId) {
        id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
      }
      header = showdown.subParser('spanGamut')(header, options, globals);
      if (!style || style.trim() === '') {
        style = '';
      } else {
        style = ' style="' + style + '"';
      }
      return '<th' + id + style + '>' + header + '</th>';
    };

    tables.td = function (cell, style) {
      var subText = showdown.subParser('spanGamut')(cell.trim(), options, globals);
      if (!style || style.trim() === '') {
        style = '';
      } else {
        style = ' style="' + style + '"';
      }
      return '<td' + style + '>' + subText + '</td>';
    };

    tables.ths = function () {
      var out = '',
          i = 0,
          hs = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      for (i; i < hs.length; i += 1) {
        out += tables.th(hs[i], style[i]) + '\n';
      }

      return out;
    };

    tables.tds = function () {
      var out = '',
          i = 0,
          ds = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      for (i; i < ds.length; i += 1) {
        out += tables.td(ds[i], style[i]) + '\n';
      }
      return out;
    };

    tables.thead = function () {
      var out,
          hs = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      out = '<thead>\n';
      out += '<tr>\n';
      out += tables.ths.apply(this, [hs, style]);
      out += '</tr>\n';
      out += '</thead>\n';
      return out;
    };

    tables.tr = function () {
      var out,
        cs = [].slice.apply(arguments[0]),
        style = [].slice.apply(arguments[1]);

      out = '<tr>\n';
      out += tables.tds.apply(this, [cs, style]);
      out += '</tr>\n';
      return out;
    };

    filter = function (text) {
      var i = 0,
        lines = text.split('\n'),
        line,
        hs,
        out = [];

      for (i; i < lines.length; i += 1) {
        line = lines[i];
        // looks like a table heading
        if (line.trim().match(/^[|].*[|]$/)) {
          line = line.trim();

          var tbl = [],
              align = lines[i + 1].trim(),
              styles = [],
              j = 0;

          if (align.match(/^[|][-=|: ]+[|]$/)) {
            styles = align.substring(1, align.length - 1).split('|');
            for (j = 0; j < styles.length; ++j) {
              styles[j] = styles[j].trim();
              if (styles[j].match(/^[:][-=| ]+[:]$/)) {
                styles[j] = 'text-align:center;';

              } else if (styles[j].match(/^[-=| ]+[:]$/)) {
                styles[j] = 'text-align:right;';

              } else if (styles[j].match(/^[:][-=| ]+$/)) {
                styles[j] = 'text-align:left;';
              } else {
                styles[j] = '';
              }
            }
          }
          tbl.push('<table>');
          hs = line.substring(1, line.length - 1).split('|');

          if (styles.length === 0) {
            for (j = 0; j < hs.length; ++j) {
              styles.push('text-align:left');
            }
          }
          tbl.push(tables.thead.apply(this, [hs, styles]));
          line = lines[++i];
          if (!line.trim().match(/^[|][-=|: ]+[|]$/)) {
            // not a table rolling back
            line = lines[--i];
          } else {
            line = lines[++i];
            tbl.push('<tbody>');
            while (line.trim().match(/^[|].*[|]$/)) {
              line = line.trim();
              tbl.push(tables.tr.apply(this, [line.substring(1, line.length - 1).split('|'), styles]));
              line = lines[++i];
            }
            tbl.push('</tbody>');
            tbl.push('</table>');
            // we are done with this table and we move along
            out.push(tbl.join('\n'));
            continue;
          }
        }
        out.push(line);
      }
      return out.join('\n');
    };
    return {parse: filter};
  };

  if (options.tables) {
    var tableParser = table();
    return tableParser.parse(text);
  } else {
    return text;
  }
});

/**
 * Swap back in all the special characters we've hidden.
 */
showdown.subParser('unescapeSpecialChars', function (text) {
  'use strict';

  text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
    var charCodeToReplace = parseInt(m1);
    return String.fromCharCode(charCodeToReplace);
  });
  return text;
});

var root = this;

// CommonJS/nodeJS Loader
if (typeof module !== 'undefined' && module.exports) {
  module.exports = showdown;

// AMD Loader
} else if (typeof define === 'function' && define.amd) {
  define('showdown', function () {
    'use strict';
    return showdown;
  });

// Regular Browser loader
} else {
  root.showdown = showdown;
}
}).call(this);
//# sourceMappingURL=showdown.js.map
/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

return $.widget;

} ) );

/*
 * jQuery File Upload Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, require, window, document, location, Blob, FormData */

;(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'jquery-ui/ui/widget'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(
            require('jquery'),
            require('./vendor/jquery.ui.widget')
        );
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Detect file input support, based on
    // http://viljamis.com/blog/2012/file-upload-support-on-mobile/
    $.support.fileInput = !(new RegExp(
        // Handle devices which give false positives for the feature detection:
        '(Android (1\\.[0156]|2\\.[01]))' +
            '|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' +
            '|(w(eb)?OSBrowser)|(webOS)' +
            '|(Kindle/(1\\.0|2\\.[05]|3\\.0))'
    ).test(window.navigator.userAgent) ||
        // Feature detection for all other devices:
        $('<input type="file"/>').prop('disabled'));

    // The FileReader API is not actually used, but works as feature detection,
    // as some Safari versions (5?) support XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads.
    // window.XMLHttpRequestUpload is not available on IE10, so we check for
    // window.ProgressEvent instead to detect XHR2 file upload capability:
    $.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;

    // Detect support for Blob slicing (required for chunked uploads):
    $.support.blobSlice = window.Blob && (Blob.prototype.slice ||
        Blob.prototype.webkitSlice || Blob.prototype.mozSlice);

    // Helper function to create drag handlers for dragover/dragenter/dragleave:
    function getDragHandler(type) {
        var isDragOver = type === 'dragover';
        return function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var dataTransfer = e.dataTransfer;
            if (dataTransfer && $.inArray('Files', dataTransfer.types) !== -1 &&
                    this._trigger(
                        type,
                        $.Event(type, {delegatedEvent: e})
                    ) !== false) {
                e.preventDefault();
                if (isDragOver) {
                    dataTransfer.dropEffect = 'copy';
                }
            }
        };
    }

    // The fileupload widget listens for change events on file input fields defined
    // via fileInput setting and paste or drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files using
    // the fileupload API.
    // By default, files added via file input selection, paste, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {

        options: {
            // The drop target element(s), by the default the complete document.
            // Set to null to disable drag & drop support:
            dropZone: $(document),
            // The paste target element(s), by the default undefined.
            // Set to a DOM node or jQuery object to enable file pasting:
            pasteZone: undefined,
            // The file input field(s), that are listened to for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty,
            // can be a string or an array of strings:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // The following option limits the number of files uploaded with one
            // XHR request to keep the request size under or equal to the defined
            // limit in bytes:
            limitMultiFileUploadSize: undefined,
            // Multipart file uploads add a number of bytes to each uploaded file,
            // therefore the following option adds an overhead for each file used
            // in the limitMultiFileUploadSize configuration:
            limitMultiFileUploadSizeOverhead: 512,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // Set the following option to the location of a redirect url on the
            // origin server, for cross-domain iframe transport uploads:
            redirect: undefined,
            // The parameter name for the redirect url, sent as part of the form
            // data and set to 'redirect' if this option is empty:
            redirectParamName: undefined,
            // Set the following option to the location of a postMessage window,
            // to enable postMessage transport uploads:
            postMessage: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,
            // Interval in milliseconds to calculate and trigger progress events:
            progressInterval: 100,
            // Interval in milliseconds to calculate progress bitrate:
            bitrateInterval: 500,
            // By default, uploads are started automatically when adding files:
            autoUpload: true,

            // Error and info messages:
            messages: {
                uploadedBytes: 'Uploaded bytes exceed file size'
            },

            // Translation function, gets the message key to be translated
            // and an object with context specific data as arguments:
            i18n: function (message, context) {
                message = this.messages[message] || message.toString();
                if (context) {
                    $.each(context, function (key, value) {
                        message = message.replace('{' + key + '}', value);
                    });
                }
                return message;
            },

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uploads, else
            // once for each file selection.
            //
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows you to override plugin options as well as define ajax settings.
            //
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            //
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                if (data.autoUpload || (data.autoUpload !== false &&
                        $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },

            // Other callbacks:

            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);

            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);

            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);

            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);

            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);

            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);

            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);

            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);

            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);

            // Callback for change events of the fileInput(s):
            // change: function (e, data) {}, // .bind('fileuploadchange', func);

            // Callback for paste events to the pasteZone(s):
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);

            // Callback for drop events of the dropZone(s):
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);

            // Callback for dragover events of the dropZone(s):
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // Callback for the start of each chunk upload request:
            // chunksend: function (e, data) {}, // .bind('fileuploadchunksend', func);

            // Callback for successful chunk uploads:
            // chunkdone: function (e, data) {}, // .bind('fileuploadchunkdone', func);

            // Callback for failed (abort or error) chunk uploads:
            // chunkfail: function (e, data) {}, // .bind('fileuploadchunkfail', func);

            // Callback for completed (success, abort or error) chunk upload requests:
            // chunkalways: function (e, data) {}, // .bind('fileuploadchunkalways', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false,
            timeout: 0
        },

        // A list of options that require reinitializing event listeners and/or
        // special initialization code:
        _specialOptions: [
            'fileInput',
            'dropZone',
            'pasteZone',
            'multipart',
            'forceIframeTransport'
        ],

        _blobSlice: $.support.blobSlice && function () {
            var slice = this.slice || this.webkitSlice || this.mozSlice;
            return slice.apply(this, arguments);
        },

        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (now, loaded, interval) {
                var timeDiff = now - this.timestamp;
                if (!this.bitrate || !interval || timeDiff > interval) {
                    this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
                    this.loaded = loaded;
                    this.timestamp = now;
                }
                return this.bitrate;
            };
        },

        _isXHRUpload: function (options) {
            return !options.forceIframeTransport &&
                ((!options.multipart && $.support.xhrFileUpload) ||
                $.support.xhrFormDataFileUpload);
        },

        _getFormData: function (options) {
            var formData;
            if ($.type(options.formData) === 'function') {
                return options.formData(options.form);
            }
            if ($.isArray(options.formData)) {
                return options.formData;
            }
            if ($.type(options.formData) === 'object') {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _initProgressObject: function (obj) {
            var progress = {
                loaded: 0,
                total: 0,
                bitrate: 0
            };
            if (obj._progress) {
                $.extend(obj._progress, progress);
            } else {
                obj._progress = progress;
            }
        },

        _initResponseObject: function (obj) {
            var prop;
            if (obj._response) {
                for (prop in obj._response) {
                    if (obj._response.hasOwnProperty(prop)) {
                        delete obj._response[prop];
                    }
                }
            } else {
                obj._response = {};
            }
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var now = ((Date.now) ? Date.now() : (new Date()).getTime()),
                    loaded;
                if (data._time && data.progressInterval &&
                        (now - data._time < data.progressInterval) &&
                        e.loaded !== e.total) {
                    return;
                }
                data._time = now;
                loaded = Math.floor(
                    e.loaded / e.total * (data.chunkSize || data._progress.total)
                ) + (data.uploadedBytes || 0);
                // Add the difference from the previously loaded state
                // to the global loaded counter:
                this._progress.loaded += (loaded - data._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(
                    now,
                    this._progress.loaded,
                    data.bitrateInterval
                );
                data._progress.loaded = data.loaded = loaded;
                data._progress.bitrate = data.bitrate = data._bitrateTimer.getBitrate(
                    now,
                    loaded,
                    data.bitrateInterval
                );
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger(
                    'progress',
                    $.Event('progress', {delegatedEvent: e}),
                    data
                );
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger(
                    'progressall',
                    $.Event('progressall', {delegatedEvent: e}),
                    this._progress
                );
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    // Make sure the progress event properties get copied over:
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options);
                });
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _isInstanceOf: function (type, obj) {
            // Cross-frame instanceof check
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        },

        _initXHRData: function (options) {
            var that = this,
                formData,
                file = options.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = options.multipart || !$.support.xhrFileUpload,
                paramName = $.type(options.paramName) === 'array' ?
                    options.paramName[0] : options.paramName;
            options.headers = $.extend({}, options.headers);
            if (options.contentRange) {
                options.headers['Content-Range'] = options.contentRange;
            }
            if (!multipart || options.blob || !this._isInstanceOf('File', file)) {
                options.headers['Content-Disposition'] = 'attachment; filename="' +
                    encodeURI(file.uploadName || file.name) + '"';
            }
            if (!multipart) {
                options.contentType = file.type || 'application/octet-stream';
                options.data = options.blob || file;
            } else if ($.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    // window.postMessage does not allow sending FormData
                    // objects, so we just add the File/Blob objects to
                    // the formData array and let the postMessage window
                    // create the FormData object out of this array:
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({
                            name: paramName,
                            value: options.blob
                        });
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({
                                name: ($.type(options.paramName) === 'array' &&
                                    options.paramName[index]) || paramName,
                                value: file
                            });
                        });
                    }
                } else {
                    if (that._isInstanceOf('FormData', options.formData)) {
                        formData = options.formData;
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value);
                        });
                    }
                    if (options.blob) {
                        formData.append(
                            paramName,
                            options.blob,
                            file.uploadName || file.name
                        );
                    } else {
                        $.each(options.files, function (index, file) {
                            // This check allows the tests to run with
                            // dummy objects:
                            if (that._isInstanceOf('File', file) ||
                                    that._isInstanceOf('Blob', file)) {
                                formData.append(
                                    ($.type(options.paramName) === 'array' &&
                                        options.paramName[index]) || paramName,
                                    file,
                                    file.uploadName || file.name
                                );
                            }
                        });
                    }
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },

        _initIframeSettings: function (options) {
            var targetHost = $('<a></a>').prop('href', options.url).prop('host');
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
            // Add redirect url to form data on cross-domain uploads:
            if (options.redirect && targetHost && targetHost !== location.host) {
                options.formData.push({
                    name: options.redirectParamName || 'redirect',
                    value: options.redirect
                });
            }
        },

        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
                if (options.postMessage) {
                    // Setting the dataType to postmessage enables the
                    // postMessage transport:
                    options.dataType = 'postmessage ' + (options.dataType || '');
                }
            } else {
                this._initIframeSettings(options);
            }
        },

        _getParamName: function (options) {
            var fileInput = $(options.fileInput),
                paramName = options.paramName;
            if (!paramName) {
                paramName = [];
                fileInput.each(function () {
                    var input = $(this),
                        name = input.prop('name') || 'files[]',
                        i = (input.prop('files') || [1]).length;
                    while (i) {
                        paramName.push(name);
                        i -= 1;
                    }
                });
                if (!paramName.length) {
                    paramName = [fileInput.prop('name') || 'files[]'];
                }
            } else if (!$.isArray(paramName)) {
                paramName = [paramName];
            }
            return paramName;
        },

        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
                // If the given file input doesn't have an associated form,
                // use the default widget file input's form:
                if (!options.form.length) {
                    options.form = $(this.options.fileInput.prop('form'));
                }
            }
            options.paramName = this._getParamName(options);
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type ||
                ($.type(options.form.prop('method')) === 'string' &&
                    options.form.prop('method')) || ''
                ).toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT' &&
                    options.type !== 'PATCH') {
                options.type = 'POST';
            }
            if (!options.formAcceptCharset) {
                options.formAcceptCharset = options.form.attr('accept-charset');
            }
        },

        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // jQuery 1.6 doesn't provide .state(),
        // while jQuery 1.8+ removed .isRejected() and .isResolved():
        _getDeferredState: function (deferred) {
            if (deferred.state) {
                return deferred.state();
            }
            if (deferred.isResolved()) {
                return 'resolved';
            }
            if (deferred.isRejected()) {
                return 'rejected';
            }
            return 'pending';
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Adds convenience methods to the data callback argument:
        _addConvenienceMethods: function (e, data) {
            var that = this,
                getPromise = function (args) {
                    return $.Deferred().resolveWith(that, args).promise();
                };
            data.process = function (resolveFunc, rejectFunc) {
                if (resolveFunc || rejectFunc) {
                    data._processQueue = this._processQueue =
                        (this._processQueue || getPromise([this])).then(
                            function () {
                                if (data.errorThrown) {
                                    return $.Deferred()
                                        .rejectWith(that, [data]).promise();
                                }
                                return getPromise(arguments);
                            }
                        ).then(resolveFunc, rejectFunc);
                }
                return this._processQueue || getPromise([this]);
            };
            data.submit = function () {
                if (this.state() !== 'pending') {
                    data.jqXHR = this.jqXHR =
                        (that._trigger(
                            'submit',
                            $.Event('submit', {delegatedEvent: e}),
                            this
                        ) !== false) && that._onSend(e, this);
                }
                return this.jqXHR || that._getXHRPromise();
            };
            data.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort();
                }
                this.errorThrown = 'abort';
                that._trigger('fail', null, this);
                return that._getXHRPromise(false);
            };
            data.state = function () {
                if (this.jqXHR) {
                    return that._getDeferredState(this.jqXHR);
                }
                if (this._processQueue) {
                    return that._getDeferredState(this._processQueue);
                }
            };
            data.processing = function () {
                return !this.jqXHR && this._processQueue && that
                    ._getDeferredState(this._processQueue) === 'pending';
            };
            data.progress = function () {
                return this._progress;
            };
            data.response = function () {
                return this._response;
            };
        },

        // Parses the Range header from the server response
        // and returns the uploaded bytes:
        _getUploadedBytes: function (jqXHR) {
            var range = jqXHR.getResponseHeader('Range'),
                parts = range && range.split('-'),
                upperBytesPos = parts && parts.length > 1 &&
                    parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1;
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            options.uploadedBytes = options.uploadedBytes || 0;
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes,
                mcs = options.maxChunkSize || fs,
                slice = this._blobSlice,
                dfd = $.Deferred(),
                promise = dfd.promise(),
                jqXHR,
                upload;
            if (!(this._isXHRUpload(options) && slice && (ub || ($.type(mcs) === 'function' ? mcs(options) : mcs) < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = options.i18n('uploadedBytes');
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // The chunk upload method:
            upload = function () {
                // Clone the options object for each chunk upload:
                var o = $.extend({}, options),
                    currentLoaded = o._progress.loaded;
                o.blob = slice.call(
                    file,
                    ub,
                    ub + ($.type(mcs) === 'function' ? mcs(o) : mcs),
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                o.chunkSize = o.blob.size;
                // Expose the chunk bytes position range:
                o.contentRange = 'bytes ' + ub + '-' +
                    (ub + o.chunkSize - 1) + '/' + fs;
                // Process the upload data (the blob and potential form data):
                that._initXHRData(o);
                // Add progress listeners for this chunk upload:
                that._initProgressListener(o);
                jqXHR = ((that._trigger('chunksend', null, o) !== false && $.ajax(o)) ||
                        that._getXHRPromise(false, o.context))
                    .done(function (result, textStatus, jqXHR) {
                        ub = that._getUploadedBytes(jqXHR) ||
                            (ub + o.chunkSize);
                        // Create a progress event if no final progress event
                        // with loaded equaling total has been triggered
                        // for this chunk:
                        if (currentLoaded + o.chunkSize - o._progress.loaded) {
                            that._onProgress($.Event('progress', {
                                lengthComputable: true,
                                loaded: ub - o.uploadedBytes,
                                total: ub - o.uploadedBytes
                            }), o);
                        }
                        options.uploadedBytes = o.uploadedBytes = ub;
                        o.result = result;
                        o.textStatus = textStatus;
                        o.jqXHR = jqXHR;
                        that._trigger('chunkdone', null, o);
                        that._trigger('chunkalways', null, o);
                        if (ub < fs) {
                            // File upload not yet complete,
                            // continue with the next chunk:
                            upload();
                        } else {
                            dfd.resolveWith(
                                o.context,
                                [result, textStatus, jqXHR]
                            );
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        o.jqXHR = jqXHR;
                        o.textStatus = textStatus;
                        o.errorThrown = errorThrown;
                        that._trigger('chunkfail', null, o);
                        that._trigger('chunkalways', null, o);
                        dfd.rejectWith(
                            o.context,
                            [jqXHR, textStatus, errorThrown]
                        );
                    });
            };
            this._enhancePromise(promise);
            promise.abort = function () {
                return jqXHR.abort();
            };
            upload();
            return promise;
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
                // Set timer for global bitrate progress calculation:
                this._bitrateTimer = new this._BitrateTimer();
                // Reset the global progress values:
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0;
            }
            // Make sure the container objects for the .response() and
            // .progress() methods on the data object are available
            // and reset to their initial state:
            this._initResponseObject(data);
            this._initProgressObject(data);
            data._progress.loaded = data.loaded = data.uploadedBytes || 0;
            data._progress.total = data.total = this._getTotal(data.files) || 1;
            data._progress.bitrate = data.bitrate = 0;
            this._active += 1;
            // Initialize the global progress values:
            this._progress.loaded += data.loaded;
            this._progress.total += data.total;
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            var total = options._progress.total,
                response = options._response;
            if (options._progress.loaded < total) {
                // Create a progress event if no final progress event
                // with loaded equaling total has been triggered:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: total,
                    total: total
                }), options);
            }
            response.result = options.result = result;
            response.textStatus = options.textStatus = textStatus;
            response.jqXHR = options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            var response = options._response;
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._progress.loaded -= options._progress.loaded;
                this._progress.total -= options._progress.total;
            }
            response.jqXHR = options.jqXHR = jqXHR;
            response.textStatus = options.textStatus = textStatus;
            response.errorThrown = options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
        },

        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            // jqXHRorResult, textStatus and jqXHRorError are added to the
            // options object via done and fail callbacks
            this._trigger('always', null, options);
        },

        _onSend: function (e, data) {
            if (!data.submit) {
                this._addConvenienceMethods(e, data);
            }
            var that = this,
                jqXHR,
                aborted,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function () {
                    that._sending += 1;
                    // Set timer for bitrate progress calculation:
                    options._bitrateTimer = new that._BitrateTimer();
                    jqXHR = jqXHR || (
                        ((aborted || that._trigger(
                            'send',
                            $.Event('send', {delegatedEvent: e}),
                            options
                        ) === false) &&
                        that._getXHRPromise(false, options.context, aborted)) ||
                        that._chunkedUpload(options) || $.ajax(options)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        that._sending -= 1;
                        that._active -= 1;
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (that._getDeferredState(nextSlot) === 'pending') {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                        if (that._active === 0) {
                            // The stop callback is triggered when all uploads have
                            // been completed, equivalent to the global ajaxStop event:
                            that._trigger('stop');
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.then(send);
                } else {
                    this._sequence = this._sequence.then(send, send);
                    pipe = this._sequence;
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    aborted = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(options.context, aborted);
                        }
                        return send();
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },

        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data),
                files = data.files,
                filesLength = files.length,
                limit = options.limitMultiFileUploads,
                limitSize = options.limitMultiFileUploadSize,
                overhead = options.limitMultiFileUploadSizeOverhead,
                batchSize = 0,
                paramName = this._getParamName(options),
                paramNameSet,
                paramNameSlice,
                fileSet,
                i,
                j = 0;
            if (!filesLength) {
                return false;
            }
            if (limitSize && files[0].size === undefined) {
                limitSize = undefined;
            }
            if (!(options.singleFileUploads || limit || limitSize) ||
                    !this._isXHRUpload(options)) {
                fileSet = [files];
                paramNameSet = [paramName];
            } else if (!(options.singleFileUploads || limitSize) && limit) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < filesLength; i += limit) {
                    fileSet.push(files.slice(i, i + limit));
                    paramNameSlice = paramName.slice(i, i + limit);
                    if (!paramNameSlice.length) {
                        paramNameSlice = paramName;
                    }
                    paramNameSet.push(paramNameSlice);
                }
            } else if (!options.singleFileUploads && limitSize) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < filesLength; i = i + 1) {
                    batchSize += files[i].size + overhead;
                    if (i + 1 === filesLength ||
                            ((batchSize + files[i + 1].size + overhead) > limitSize) ||
                            (limit && i + 1 - j >= limit)) {
                        fileSet.push(files.slice(j, i + 1));
                        paramNameSlice = paramName.slice(j, i + 1);
                        if (!paramNameSlice.length) {
                            paramNameSlice = paramName;
                        }
                        paramNameSet.push(paramNameSlice);
                        j = i + 1;
                        batchSize = 0;
                    }
                }
            } else {
                paramNameSet = paramName;
            }
            data.originalFiles = files;
            $.each(fileSet || files, function (index, element) {
                var newData = $.extend({}, data);
                newData.files = fileSet ? element : [element];
                newData.paramName = paramNameSet[index];
                that._initResponseObject(newData);
                that._initProgressObject(newData);
                that._addConvenienceMethods(e, newData);
                result = that._trigger(
                    'add',
                    $.Event('add', {delegatedEvent: e}),
                    newData
                );
                return result;
            });
            return result;
        },

        _replaceFileInput: function (data) {
            var input = data.fileInput,
                inputClone = input.clone(true),
                restoreFocus = input.is(document.activeElement);
            // Add a reference for the new cloned file input to the data argument:
            data.fileInputClone = inputClone;
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // If the fileInput had focus before it was detached,
            // restore focus to the inputClone.
            if (restoreFocus) {
                inputClone.focus();
            }
            // Avoid memory leaks with the detached file input:
            $.cleanData(input.unbind('remove'));
            // Replace the original file input element in the fileInput
            // elements set with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
            // If the widget has been initialized on the file input itself,
            // override this.element with the file input clone:
            if (input[0] === this.element[0]) {
                this.element = inputClone;
            }
        },

        _handleFileTreeEntry: function (entry, path) {
            var that = this,
                dfd = $.Deferred(),
                entries = [],
                dirReader,
                errorHandler = function (e) {
                    if (e && !e.entry) {
                        e.entry = entry;
                    }
                    // Since $.when returns immediately if one
                    // Deferred is rejected, we use resolve instead.
                    // This allows valid files and invalid items
                    // to be returned together in one set:
                    dfd.resolve([e]);
                },
                successHandler = function (entries) {
                    that._handleFileTreeEntries(
                        entries,
                        path + entry.name + '/'
                    ).done(function (files) {
                        dfd.resolve(files);
                    }).fail(errorHandler);
                },
                readEntries = function () {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {
                            successHandler(entries);
                        } else {
                            entries = entries.concat(results);
                            readEntries();
                        }
                    }, errorHandler);
                };
            path = path || '';
            if (entry.isFile) {
                if (entry._file) {
                    // Workaround for Chrome bug #149735
                    entry._file.relativePath = path;
                    dfd.resolve(entry._file);
                } else {
                    entry.file(function (file) {
                        file.relativePath = path;
                        dfd.resolve(file);
                    }, errorHandler);
                }
            } else if (entry.isDirectory) {
                dirReader = entry.createReader();
                readEntries();
            } else {
                // Return an empty list for file system items
                // other than files or directories:
                dfd.resolve([]);
            }
            return dfd.promise();
        },

        _handleFileTreeEntries: function (entries, path) {
            var that = this;
            return $.when.apply(
                $,
                $.map(entries, function (entry) {
                    return that._handleFileTreeEntry(entry, path);
                })
            ).then(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _getDroppedFiles: function (dataTransfer) {
            dataTransfer = dataTransfer || {};
            var items = dataTransfer.items;
            if (items && items.length && (items[0].webkitGetAsEntry ||
                    items[0].getAsEntry)) {
                return this._handleFileTreeEntries(
                    $.map(items, function (item) {
                        var entry;
                        if (item.webkitGetAsEntry) {
                            entry = item.webkitGetAsEntry();
                            if (entry) {
                                // Workaround for Chrome bug #149735:
                                entry._file = item.getAsFile();
                            }
                            return entry;
                        }
                        return item.getAsEntry();
                    })
                );
            }
            return $.Deferred().resolve(
                $.makeArray(dataTransfer.files)
            ).promise();
        },

        _getSingleFileInputFiles: function (fileInput) {
            fileInput = $(fileInput);
            var entries = fileInput.prop('webkitEntries') ||
                    fileInput.prop('entries'),
                files,
                value;
            if (entries && entries.length) {
                return this._handleFileTreeEntries(entries);
            }
            files = $.makeArray(fileInput.prop('files'));
            if (!files.length) {
                value = fileInput.prop('value');
                if (!value) {
                    return $.Deferred().resolve([]).promise();
                }
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                files = [{name: value.replace(/^.*\\/, '')}];
            } else if (files[0].name === undefined && files[0].fileName) {
                // File normalization for Safari 4 and Firefox 3:
                $.each(files, function (index, file) {
                    file.name = file.fileName;
                    file.size = file.fileSize;
                });
            }
            return $.Deferred().resolve(files).promise();
        },

        _getFileInputFiles: function (fileInput) {
            if (!(fileInput instanceof $) || fileInput.length === 1) {
                return this._getSingleFileInputFiles(fileInput);
            }
            return $.when.apply(
                $,
                $.map(fileInput, this._getSingleFileInputFiles)
            ).then(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _onChange: function (e) {
            var that = this,
                data = {
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            this._getFileInputFiles(data.fileInput).always(function (files) {
                data.files = files;
                if (that.options.replaceFileInput) {
                    that._replaceFileInput(data);
                }
                if (that._trigger(
                        'change',
                        $.Event('change', {delegatedEvent: e}),
                        data
                    ) !== false) {
                    that._onAdd(e, data);
                }
            });
        },

        _onPaste: function (e) {
            var items = e.originalEvent && e.originalEvent.clipboardData &&
                    e.originalEvent.clipboardData.items,
                data = {files: []};
            if (items && items.length) {
                $.each(items, function (index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        data.files.push(file);
                    }
                });
                if (this._trigger(
                        'paste',
                        $.Event('paste', {delegatedEvent: e}),
                        data
                    ) !== false) {
                    this._onAdd(e, data);
                }
            }
        },

        _onDrop: function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var that = this,
                dataTransfer = e.dataTransfer,
                data = {};
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                this._getDroppedFiles(dataTransfer).always(function (files) {
                    data.files = files;
                    if (that._trigger(
                            'drop',
                            $.Event('drop', {delegatedEvent: e}),
                            data
                        ) !== false) {
                        that._onAdd(e, data);
                    }
                });
            }
        },

        _onDragOver: getDragHandler('dragover'),

        _onDragEnter: getDragHandler('dragenter'),

        _onDragLeave: getDragHandler('dragleave'),

        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop,
                    // event.preventDefault() on dragenter is required for IE10+:
                    dragenter: this._onDragEnter,
                    // dragleave is not required, but added for completeness:
                    dragleave: this._onDragLeave
                });
                this._on(this.options.pasteZone, {
                    paste: this._onPaste
                });
            }
            if ($.support.fileInput) {
                this._on(this.options.fileInput, {
                    change: this._onChange
                });
            }
        },

        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, 'dragenter dragleave dragover drop');
            this._off(this.options.pasteZone, 'paste');
            this._off(this.options.fileInput, 'change');
        },

        _destroy: function () {
            this._destroyEventHandlers();
        },

        _setOption: function (key, value) {
            var reinit = $.inArray(key, this._specialOptions) !== -1;
            if (reinit) {
                this._destroyEventHandlers();
            }
            this._super(key, value);
            if (reinit) {
                this._initSpecialOptions();
                this._initEventHandlers();
            }
        },

        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input[type="file"]') ?
                        this.element : this.element.find('input[type="file"]');
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput);
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone);
            }
            if (!(options.pasteZone instanceof $)) {
                options.pasteZone = $(options.pasteZone);
            }
        },

        _getRegExp: function (str) {
            var parts = str.split('/'),
                modifiers = parts.pop();
            parts.shift();
            return new RegExp(parts.join('/'), modifiers);
        },

        _isRegExpOption: function (key, value) {
            return key !== 'url' && $.type(value) === 'string' &&
                /^\/.*\/[igm]{0,3}$/.test(value);
        },

        _initDataAttributes: function () {
            var that = this,
                options = this.options,
                data = this.element.data();
            // Initialize options set via HTML5 data-attributes:
            $.each(
                this.element[0].attributes,
                function (index, attr) {
                    var key = attr.name.toLowerCase(),
                        value;
                    if (/^data-/.test(key)) {
                        // Convert hyphen-ated key to camelCase:
                        key = key.slice(5).replace(/-[a-z]/g, function (str) {
                            return str.charAt(1).toUpperCase();
                        });
                        value = data[key];
                        if (that._isRegExpOption(key, value)) {
                            value = that._getRegExp(value);
                        }
                        options[key] = value;
                    }
                }
            );
        },

        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers();
        },

        // This method is exposed to the widget API and allows to query
        // the number of active uploads:
        active: function () {
            return this._active;
        },

        // This method is exposed to the widget API and allows to query
        // the widget upload progress.
        // It returns an object with loaded, total and bitrate properties
        // for the running uploads:
        progress: function () {
            return this._progress;
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            var that = this;
            if (!data || this.options.disabled) {
                return;
            }
            if (data.fileInput && !data.files) {
                this._getFileInputFiles(data.fileInput).always(function (files) {
                    data.files = files;
                    that._onAdd(null, data);
                });
            } else {
                data.files = $.makeArray(data.files);
                this._onAdd(null, data);
            }
        },

        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files or fileInput property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                if (data.fileInput && !data.files) {
                    var that = this,
                        dfd = $.Deferred(),
                        promise = dfd.promise(),
                        jqXHR,
                        aborted;
                    promise.abort = function () {
                        aborted = true;
                        if (jqXHR) {
                            return jqXHR.abort();
                        }
                        dfd.reject(null, 'abort', 'abort');
                        return promise;
                    };
                    this._getFileInputFiles(data.fileInput).always(
                        function (files) {
                            if (aborted) {
                                return;
                            }
                            if (!files.length) {
                                dfd.reject();
                                return;
                            }
                            data.files = files;
                            jqXHR = that._onSend(null, data);
                            jqXHR.then(
                                function (result, textStatus, jqXHR) {
                                    dfd.resolve(result, textStatus, jqXHR);
                                },
                                function (jqXHR, textStatus, errorThrown) {
                                    dfd.reject(jqXHR, textStatus, errorThrown);
                                }
                            );
                        }
                    );
                    return this._enhancePromise(promise);
                }
                data.files = $.makeArray(data.files);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }

    });

}));

/*
 * jQuery Iframe Transport Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, require, window, document, JSON */

;(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(require('jquery'));
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Helper variable to create unique names for the transport iframes:
    var counter = 0,
        jsonAPI = $,
        jsonParse = 'parseJSON';

    if ('JSON' in window && 'parse' in JSON) {
      jsonAPI = JSON;
      jsonParse = 'parse';
    }

    // The iframe transport accepts four additional options:
    // options.fileInput: a jQuery collection of file input fields
    // options.paramName: the parameter name for the file form data,
    //  overrides the name property of the file input field(s),
    //  can be a string or an array of strings.
    // options.formData: an array of objects with name and value properties,
    //  equivalent to the return data of .serializeArray(), e.g.:
    //  [{name: 'a', value: 1}, {name: 'b', value: 2}]
    // options.initialIframeSrc: the URL of the initial iframe src,
    //  by default set to "javascript:false;"
    $.ajaxTransport('iframe', function (options) {
        if (options.async) {
            // javascript:false as initial iframe src
            // prevents warning popups on HTTPS in IE6:
            /*jshint scripturl: true */
            var initialIframeSrc = options.initialIframeSrc || 'javascript:false;',
            /*jshint scripturl: false */
                form,
                iframe,
                addParamChar;
            return {
                send: function (_, completeCallback) {
                    form = $('<form style="display:none;"></form>');
                    form.attr('accept-charset', options.formAcceptCharset);
                    addParamChar = /\?/.test(options.url) ? '&' : '?';
                    // XDomainRequest only supports GET and POST:
                    if (options.type === 'DELETE') {
                        options.url = options.url + addParamChar + '_method=DELETE';
                        options.type = 'POST';
                    } else if (options.type === 'PUT') {
                        options.url = options.url + addParamChar + '_method=PUT';
                        options.type = 'POST';
                    } else if (options.type === 'PATCH') {
                        options.url = options.url + addParamChar + '_method=PATCH';
                        options.type = 'POST';
                    }
                    // IE versions below IE8 cannot set the name property of
                    // elements that have already been added to the DOM,
                    // so we set the name along with the iframe HTML markup:
                    counter += 1;
                    iframe = $(
                        '<iframe src="' + initialIframeSrc +
                            '" name="iframe-transport-' + counter + '"></iframe>'
                    ).bind('load', function () {
                        var fileInputClones,
                            paramNames = $.isArray(options.paramName) ?
                                    options.paramName : [options.paramName];
                        iframe
                            .unbind('load')
                            .bind('load', function () {
                                var response;
                                // Wrap in a try/catch block to catch exceptions thrown
                                // when trying to access cross-domain iframe contents:
                                try {
                                    response = iframe.contents();
                                    // Google Chrome and Firefox do not throw an
                                    // exception when calling iframe.contents() on
                                    // cross-domain requests, so we unify the response:
                                    if (!response.length || !response[0].firstChild) {
                                        throw new Error();
                                    }
                                } catch (e) {
                                    response = undefined;
                                }
                                // The complete callback returns the
                                // iframe content document as response object:
                                completeCallback(
                                    200,
                                    'success',
                                    {'iframe': response}
                                );
                                // Fix for IE endless progress bar activity bug
                                // (happens on form submits to iframe targets):
                                $('<iframe src="' + initialIframeSrc + '"></iframe>')
                                    .appendTo(form);
                                window.setTimeout(function () {
                                    // Removing the form in a setTimeout call
                                    // allows Chrome's developer tools to display
                                    // the response result
                                    form.remove();
                                }, 0);
                            });
                        form
                            .prop('target', iframe.prop('name'))
                            .prop('action', options.url)
                            .prop('method', options.type);
                        if (options.formData) {
                            $.each(options.formData, function (index, field) {
                                $('<input type="hidden"/>')
                                    .prop('name', field.name)
                                    .val(field.value)
                                    .appendTo(form);
                            });
                        }
                        if (options.fileInput && options.fileInput.length &&
                                options.type === 'POST') {
                            fileInputClones = options.fileInput.clone();
                            // Insert a clone for each file input field:
                            options.fileInput.after(function (index) {
                                return fileInputClones[index];
                            });
                            if (options.paramName) {
                                options.fileInput.each(function (index) {
                                    $(this).prop(
                                        'name',
                                        paramNames[index] || options.paramName
                                    );
                                });
                            }
                            // Appending the file input fields to the hidden form
                            // removes them from their original location:
                            form
                                .append(options.fileInput)
                                .prop('enctype', 'multipart/form-data')
                                // enctype must be set as encoding for IE:
                                .prop('encoding', 'multipart/form-data');
                            // Remove the HTML5 form attribute from the input(s):
                            options.fileInput.removeAttr('form');
                        }
                        form.submit();
                        // Insert the file input fields at their original location
                        // by replacing the clones with the originals:
                        if (fileInputClones && fileInputClones.length) {
                            options.fileInput.each(function (index, input) {
                                var clone = $(fileInputClones[index]);
                                // Restore the original name and form properties:
                                $(input)
                                    .prop('name', clone.prop('name'))
                                    .attr('form', clone.attr('form'));
                                clone.replaceWith(input);
                            });
                        }
                    });
                    form.append(iframe).appendTo(document.body);
                },
                abort: function () {
                    if (iframe) {
                        // javascript:false as iframe src aborts the request
                        // and prevents warning popups on HTTPS in IE6.
                        // concat is used to avoid the "Script URL" JSLint error:
                        iframe
                            .unbind('load')
                            .prop('src', initialIframeSrc);
                    }
                    if (form) {
                        form.remove();
                    }
                }
            };
        }
    });

    // The iframe transport returns the iframe content document as response.
    // The following adds converters from iframe to text, json, html, xml
    // and script.
    // Please note that the Content-Type for JSON responses has to be text/plain
    // or text/html, if the browser doesn't include application/json in the
    // Accept header, else IE will show a download dialog.
    // The Content-Type for XML responses on the other hand has to be always
    // application/xml or text/xml, so IE properly parses the XML response.
    // See also
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Setup#content-type-negotiation
    $.ajaxSetup({
        converters: {
            'iframe text': function (iframe) {
                return iframe && $(iframe[0].body).text();
            },
            'iframe json': function (iframe) {
                return iframe && jsonAPI[jsonParse]($(iframe[0].body).text());
            },
            'iframe html': function (iframe) {
                return iframe && $(iframe[0].body).html();
            },
            'iframe xml': function (iframe) {
                var xmlDoc = iframe && iframe[0];
                return xmlDoc && $.isXMLDoc(xmlDoc) ? xmlDoc :
                        $.parseXML((xmlDoc.XMLDocument && xmlDoc.XMLDocument.xml) ||
                            $(xmlDoc.body).html());
            },
            'iframe script': function (iframe) {
                return iframe && $.globalEval($(iframe[0].body).text());
            }
        }
    });

}));
