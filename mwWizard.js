'use strict';

angular.module('mwWizard', [])

/**
 *
 * @ngdoc object
 * @name mwWizard.Wizard
 * @description
 *
 * The wizard service handles the wizzard. The wizzard can be accessed from controlelr to navigate from step
 * to step. This service is depandant of the mwWizard and mwWizardStep directive. By transluding multiple
 * mwWizardStep directives into the mwWizard directive the Wizard service is populated with steps. BY calling the
 * functions back(), next(), goTo(num) the wizard service hides the currently active steps and displays the next step
 *
 * The wizard has to be initialized with the function createWizard(id). The function returns a a wizard object
 *
 *
 */
  .service('Wizard', function () {

    var wizards = [];

    var Wizard = function (id) {

      var _steps = [],
        _currentlyActive = 0,
        _id = id;

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._registerStep = function (step) {
        if (_steps.length < 1) {
          step._isActive = true;
        }
        _steps.push(step);
      };

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._unRegisterStep = function (step) {
        var stepIndexPosition = _.indexOf(_steps,step);
        if(stepIndexPosition>=0){
          _steps.splice(stepIndexPosition,0);
        } else {
          throw new Error('The step you tried to remove did not exist');
        }
      };

      this.destroy = function(){
        var self = this;
        _steps.forEach(function(step){
          self._unRegisterStep(step);
        });
      };

      this.getId = function () {
        return _id;
      };

      this.getCurrentStep = function () {
        return _currentlyActive;
      };

      this.getTotalStepAmount = function () {
        return _steps.length;
      };

      this.hasNextStep = function () {
        return this.getCurrentStep() < this.getTotalStepAmount() - 1;
      };

      this.hasPreviousStep = function () {
        return this.getCurrentStep() > 0;
      };

      /*
       * name next()
       * @description
       * Navigates to the next step of the currently active step
       */
      this.next = function () {
        this.goTo(_currentlyActive + 1);
      };

      /*
       * name back()
       * @description
       * Navigates to the previous step of the currently active step
       */
      this.back = function () {
        this.goTo(_currentlyActive - 1);
      };


      /*
       * name goTo()
       * @description
       * Goto a specific step number
       *
       * @params {integer} number of the step where you want to navigate to
       */
      this.goTo = function (num) {
        _steps[_currentlyActive]._isActive = false;
        if (num >= _steps.length) {
          throw new Error('Step ' + (num + 1) + ' is not available');
        } else {
          _steps[num]._isActive = true;
          _currentlyActive = num;
        }
      };

    };

    /*
     * name findWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id but throws NO error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var findWizard = function (id) {
      var _wizard = null;
      wizards.forEach(function (wizard) {
        if (wizard.getId === id) {
          _wizard = wizard;
        }
      });
      return _wizard;
    };

    /*
     * name getWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id and throws an error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var getWizard = function (id) {
      var _wizard = findWizard(id);
      if (!_wizard) {
        throw new Error('The wizard with the id ' + id + ' does not exist');
      } else {
        return _wizard;
      }

    };

    /*
     * name createWizard
     * @description
     * Creates an instance of Wizard. Throws an error when wizzard with the id
     * could not be found or is not initialized yet
     *
     * @param {string} id Unique identifier of the Wizard
     * @returns {object} wizard returns wizard object
     */
    var createWizard = function (id) {
      if (findWizard(id)) {
        throw new Error('The wizard with the id ' + id + ' is already existing');
      } else {
        var wizard = new Wizard(id);
        wizards.push(wizard);
        return wizard;
      }
    };

    //Public interface of the service
    return {
      createWizard: createWizard,
      getWizard: getWizard
    };

  })

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
  .directive('mwWizard', function () {
    return {
      restrict: 'A',
      scope: {
        wizard: '=mwWizard'
      },
      transclude: true,
      template: '<div ng-transclude></div>',
      controller: function ($scope) {

        var wizard = $scope.wizard;

        this.registerStep = function (step) {
          wizard._registerStep(step);
        };

        $scope.$on('$destroy',function(){
          wizard.destroy();
        });

      }
    };
  })

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizardStep
 * @element div
 * @description
 *
 * Registers itself as a step in the mwWizard directive. The Wizard services handles the show and hide of
 * this directive
 *
 */
  .directive('mwWizardStep', function () {
    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      require: '^mwWizard',
      template: '<div ng-transclude ng-if="_isActive" ng-transclude></div>',
      link: function (scope, el, attr, mwWizardCtrl) {
        scope._isActive = false;
        mwWizardCtrl.registerStep(scope);

        scope.$on('$destroy',function(){
          //el.remove();
        });
      }
    };
  });

