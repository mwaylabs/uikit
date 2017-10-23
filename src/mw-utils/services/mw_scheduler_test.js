'use strict';

describe('MwSchedulerTest', function () {
  var orgRequestAnimationFrame,
    tick;

  beforeEach(module('mwUI.Utils'));

  beforeEach(inject(function (mwScheduler) {
    this.subject = mwScheduler;
  }));

  beforeEach(function () {
    orgRequestAnimationFrame = window.requestAnimationFrame;
    var currentTs = +new Date();
    window.requestAnimationFrame = function (callback) {
      if(typeof tick==='function'){
        return;
      }
      //time in ms is actually the current timestamp
      //the original requestAnimationFrame is called with a timestamp, we use a mock timestamp
      //to mock the behaviour we are using tick function that accepts a mock timestamp
      tick = function (timeInMs) {
        for(var i=0;i<timeInMs;i++, currentTs++){
          callback(currentTs);
        }
      };
    };
  });

  afterEach(function () {
    window.requestAnimationFrame = orgRequestAnimationFrame;
    this.subject.reset();
    tick = null;
  });

  describe('testing taskrunner', function () {
    it('starts scheduler when adding a task', function () {
      var startSpy = spyOn(this.subject, 'start');
      this.subject.add(function () {
      }, 100);

      expect(startSpy).toHaveBeenCalled();
    });

    it('executes task after the time', function () {
      var spy = jasmine.createSpy('task');
      this.subject.add(spy, 100);

      tick(101);

      expect(spy).toHaveBeenCalled();
    });

    it('stops scheduler when all tasks have been executed', function () {
      this.subject.add(function () {
      }, 100);
      tick(101);

      var stepSpy = spyOn(this.subject, '_step');
      tick(101);

      expect(stepSpy).not.toHaveBeenCalled();
    });

    it('does not execute task before the time', function () {
      var spy = jasmine.createSpy('task');
      this.subject.add(spy, 100);

      tick(99);

      expect(spy).not.toHaveBeenCalled();
    });

    it('pauses the scheduler and does not execute tasks while paused', function () {
      var spy = jasmine.createSpy('task');
      this.subject.add(spy, 100);

      this.subject.stop();
      tick(1000);

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not start the scheduler when it was paused and add is called ', function () {
      var startSpy = spyOn(this.subject, 'start');
      this.subject.stop();

      this.subject.add(function () {
      }, 100);

      expect(startSpy).not.toHaveBeenCalled();
    });

    it('continues execution when starting the scheduler again', function () {
      var spy = jasmine.createSpy('task');
      var spy2 = jasmine.createSpy('task2');
      this.subject.add(spy, 100);
      this.subject.add(spy2, 200);
      this.subject.stop();
      tick(1000);

      this.subject.start();
      tick(50);
      tick(51);

      expect(spy).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe('testing task', function () {
    it('updates time of a task', function () {
      var spy = jasmine.createSpy('task');
      var task = this.subject.add(spy, 100);
      tick(100);

      task.set('executeInMs',200);
      tick(1);

      expect(spy).not.toHaveBeenCalled();
    });

    it('updates time of a task and executes it when new time has arrived', function () {
      var spy = jasmine.createSpy('task');
      var task = this.subject.add(spy, 100);
      tick(100);

      task.set('executeInMs',200);
      tick(101);

      expect(spy).toHaveBeenCalled();
    });

    it('kills task', function () {
      var spy = jasmine.createSpy('task');
      var task = this.subject.add(spy, 100);

      task.kill();
      tick(101);

      expect(spy).not.toHaveBeenCalled();
    });

    it('resets time', function () {
      var spy = jasmine.createSpy('task');
      var task = this.subject.add(spy, 100);
      tick(100);

      task.resetTime();
      tick(100);

      expect(spy).not.toHaveBeenCalled();
    });

    it('resets time and executes when time comes', function () {
      var spy = jasmine.createSpy('task');
      var task = this.subject.add(spy, 100);
      tick(100);

      task.resetTime();
      tick(101);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('testing service', function(){
    it('pauses runner when window becomes inactive', function(){
      this.subject.add(function () {
      }, 100);

      angular.element(window).triggerHandler('blur');

      expect(this.subject.isStopped()).toBeTruthy();
    });

    it('starts runner when window becomes active', function(){
      this.subject.add(function () {
      }, 100);
      angular.element(window).triggerHandler('blur');

      angular.element(window).triggerHandler('focus');

      expect(this.subject.isStopped()).toBeFalsy();
    });
  });

});