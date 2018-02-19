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

        scope.$on('$destroy', function(){
          elm.off();
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
  })

  .service('LayoutWatcher', function ($timeout, $window) {

    var _callbacks = [];
    var _notify = function(){
      _callbacks.forEach(function(scopedCallback){
        scopedCallback.callback.apply(scopedCallback.scope);
      });
    };
    var _throttledNotify = _.throttle(_notify, 300);
    angular.element('body').on('DOMNodeInserted',_throttledNotify);
    angular.element('body').on('DOMNodeRemoved',_throttledNotify);
    angular.element($window).on('resize', _throttledNotify);
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
          inputElements.off();
        });
      }
    };
  }]);