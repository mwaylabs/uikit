'use strict';

angular.module('mwHelper', [])

/**
 * @ngdoc directive
 * @name mwHelper.directive:mwStopPropagation
 * @element ANY
 * @param {string} mwStopPropagation the name of the event type
 *
 * @description
 * Stops Propagation of specified event for this element
 */
  .directive('mwStopPropagation', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwStopPropagation) {
          throw new Error('Directive mwStopPropagation: This directive must have an event name as attribute e.g. mw-stop-propagation="keyup"');
        }
        elm.on(attr.mwStopPropagation, function (event) {
          event.stopPropagation();
        });
      }
    };
  })

  .directive('mwPreventDefault', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwPreventDefault) {
          throw new Error('Directive mwPreventDefault: This directive must have an event name as attribute e.g. mw-prevent-default="click"');
        }
        elm.on(attr.mwPreventDefault, function (event) {
          event.preventDefault();
        });
      }
    };
  })


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
            console.warn('There can be only one focused field');
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

  .directive('mwDefaultFocus', function (mwDefaultFocusService) {
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
            mwDefaultFocusService.setFocus(id);
            el[0].focus();
            window.requestAnimFrame(setFocus);
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
  })

/**
 * @ngdoc directive
 * @name mwForm.directive:mwLeaveConfirmation
 * @element form
 * @description
 *
 * Opens a confirmation modal when the form has been edited and a the user wants to navigate to a new page
 *
 */

  .directive('mwLeaveConfirmation', function ($window, $document, $location, $rootScope, i18n, Modal) {
    return {
      scope: {
        alertBeforeLeave: '=mwLeaveConfirmation',
        text:'@'
      },
      link: function (scope) {

        var confirmationModal = Modal.create({
          templateUrl: 'modules/ui/templates/mwForm/mwLeaveConfirmation.html',
          scope: scope
        });

        // Prevent the original event so the routing will not be completed
        // Save the url where it should be navigated to in a temp variable
        var showConfirmModal = function (ev, next) {
          if (scope.alertBeforeLeave) {
            confirmationModal.show();
            ev.preventDefault();
            scope.next = next;
          }
        };

        // User wants to stay on the page
        scope.stay = function () {
          confirmationModal.hide();
        };

        // User really wants to navigate to that page which was saved before in a temp variable
        scope.continue = function () {
          if (scope.next) {
            //instead of scope.$off() we call the original eventhandler function
            scope.changeLocationOff();

            //hide the modal and navigate to the page
            confirmationModal.hide().then(function () {
                document.location.href=scope.next;
                scope.next = null;
            });
          }
        };

        //In case that just a hashchange event was triggered
        //Angular has no $off event unbinding so the original eventhandler is saved in a variable
        scope.changeLocationOff = $rootScope.$on('$locationChangeStart', showConfirmModal);

        //In case that the user clicks the refresh/back button or makes a hard url change
        $window.onbeforeunload = function () {
          if (scope.alertBeforeLeave && $rootScope.leaveConfirmationEnabled) {
            return scope.text;
          }
        };

        if(!angular.isDefined(scope.text)){
          throw new Error('Please specify a text in the text attribute');
        }

        $rootScope.leaveConfirmationEnabled = true;

      }
    };
  })

  //FIXME COMMENT IN TUTORIAL BADGES FOR PRIMARY BUTTONS SOMEDAY HAVE BEEN USES IN POLICY DETAILS VIEW
  .directive('mwTutorialTooltip', function (/*$compile, $timeout*/) {
    return {
      scope: {
        display: '=',
        text: '@mwTutorialTooltip',
        position: '@'
      },
      link: function (/*scope, el*/) {

//        var customCheckbox,
//          customCheckboxStateIndicator;
//
//        var render = function () {
//          customCheckbox = $compile('<div class="mw-tutorial clearfix btn-block" ng-class="position"></div>')(scope);
//          customCheckboxStateIndicator = $compile('<div class="tutorial-badge-wrapper show"><span ng-if="display" class="tutorial-badge">{{text}}</span></div>')(scope);
//
//          if(scope.position){
//            customCheckbox.addClass(scope.position);
//          }
//
//          el.wrap(customCheckbox);
//          customCheckboxStateIndicator.insertAfter(el);
//        };

//        $timeout(function () {
//          customCheckboxStateIndicator.removeClass('show');
//        }, 8000);

//        render();

      }
    };
  })

  .service('LayoutWatcher', function ($timeout, $window) {

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
  })

  .directive('mwSetFullScreenHeight', function (LayoutWatcher) {
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
  })


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

  .directive('mwRemoveXs', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  })

  .directive('mwRemoveMd', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone() || Detect.isTablet()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  })

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