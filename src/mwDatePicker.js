/**
 * Created by zarges on 09/12/15.
 */
'use strict';
angular.module('mwUI')

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
    }
  })

  .directive('mwDatePicker', function ($rootScope, $compile, $interval, $timeout, i18n) {
    return {
      templateUrl: 'uikit/templates/mwDatePicker.html',
      scope: {
        mwModel: '=',
        mwRequired: '=',
        showTimePicker: '=',
        options: '='
      },
      link: function(scope, el){
        var _defaultDatePickerOptions = {
            clearBtn: !scope.mwRequired
          },
          _datePicker,
          _incrementInterval,
          _decrementInterval;

        scope.viewModel = {
          date: null,
          hours: null,
          minutes: null
        };

        scope.canChange = function(num, type){
          var options = scope.options || {},
              currentDateTs = +new Date(scope.mwModel);

          if(type === 'MINUTES'){
            num = num * 60 * 1000;
          } else if(type === 'HOURS'){
            num = num * 60 * 60 * 1000;
          }

          if(options.startDate && num < 0){
            return  ( currentDateTs + num ) >= +new Date(options.startDate);
          }

          if(options.endDate && num > 0){
            return  ( currentDateTs + num ) <= +new Date(options.endDate);
          }

          return true;
        };

        scope.increment = function(attr, min, max){
          var val = scope.viewModel[attr];

          if(val<max){
            val++;
          } else {
            val = min;
          }
          scope.viewModel[attr] = val;
        };

        scope.startIncrementCounter = function(){
          var args = arguments;

          _incrementInterval = $interval(function(){
            scope.increment.apply(this,args);
          }.bind(this),200);
        };

        scope.stopIncrementCounter = function(){
          $interval.cancel(_incrementInterval);
        };

        scope.decrement = function(attr, min, max){
          var val = scope.viewModel[attr];
          if(val>min){
            val--;
          } else {
            val = max;
          }
          scope.viewModel[attr] = val;
        };

        scope.startDecrementCounter = function(){
          var args = arguments;
          _decrementInterval = $interval(function(){
            scope.decrement.apply(this,args);
          }.bind(this),200);
        };

        scope.stopDecrementCounter = function(){
          $interval.cancel(_decrementInterval);
        };

        var updateMwModel = function(datePicker){
          $timeout(function(){
            if(datePicker.dates.length > 0 ){
              var selectedDate = new Date(datePicker.getDate());

              if(scope.viewModel.hours){
                selectedDate.setHours(scope.viewModel.hours);
              } else {
                scope.viewModel.hours = selectedDate.getHours();
              }

              if(scope.viewModel.minutes){
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
          });
        };

        var bindChangeListener = function(datepicker){
          datepicker.on('changeDate', updateMwModel.bind(this, datepicker.data().datepicker));
        };

        var setDateValue = function(el, date, datepicker){
          if(date){
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
          }
        };

        var setDatepicker = function(options){
          var datePickerEl;

          if(_datePicker && _datePicker.data().datepicker){
            _datePicker.data().datepicker.remove();
          }

          datePickerEl = el.find('.date-picker');
          _datePicker = datePickerEl.datepicker(_.extend(_defaultDatePickerOptions,options));
          setDateValue(datePickerEl, scope.mwModel, _datePicker.data().datepicker);
          bindChangeListener(_datePicker);
        };

        var setDatepickerLanguage = function(){
          var locale = 'en';
          if(i18n.getActiveLocale().id === 'de_DE'){
            locale = 'de';
          }
          setDatepicker({
            language: locale
          });
        };
        $rootScope.$on('i18n:localeChanged', setDatepickerLanguage);
        setDatepickerLanguage();

        var _updater = function(val){
          if(_datePicker && val){
            updateMwModel(_datePicker.data().datepicker);
          }
        };
        scope.$watch('viewModel.minutes', _updater);
        scope.$watch('viewModel.hours', _updater);

        scope.$watchCollection('options', function(options){
          if(options){
            setDatepicker(options);
          }
        });

        el.on('mouseout', '.number-spinner', function(){
          scope.stopDecrementCounter();
          scope.stopIncrementCounter();
        });
      }
    };
  });