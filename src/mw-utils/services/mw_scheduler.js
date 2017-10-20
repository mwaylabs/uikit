window.mwUI.Utils.Scheduler = {};

window.mwUI.Utils.Scheduler.Task = window.mwUI.Backbone.Model.extend({
  _updateOriginalSleep: function () {
    if (_.isNumber(this.get('executeInMs'))) {
      this.set('originalSleepTime', this.get('executeInMs'));
    }
  },
  decrementTime: function (time) {
    time = time || 1;
    var currentSleepTime = this.get('executeInMs');
    this.set({executeInMs: currentSleepTime - time}, {silent: true});
  },
  canBeExecuted: function () {
    return this.get('executeInMs') <= 0;
  },
  execute: function () {
    this.get('callback').apply(this.get('scope'));
    if (this.collection) {
      this.collection.remove(this);
    }
  },
  resetTime: function () {
    this.set('executeInMs', this.get('originalSleepTime'));
  },
  initialize: function () {
    this.on('change:executeInMs', this._updateOriginalSleep, this);
    this._updateOriginalSleep();
  }
});

window.mwUI.Utils.Scheduler.TaskRunner = window.mwUI.Backbone.Collection.extend({
  _timer: false,
  _stopped: false,
  _startTime: null,
  _prevValue: null,
  model: window.mwUI.Utils.Scheduler.Task,
  _step: function (timestamp) {
    var progress, delta;

    if (this.isStopped()) {
      return;
    }

    if (!this._startTime) {
      this._startTime = timestamp;
    }

    progress = timestamp - this._startTime;
    delta = this._prevValue ? progress - this._prevValue : progress;

    if (this.length > 0) {
      this.secureEach(function (task) {
        if (task.canBeExecuted()) {
          task.execute();
        } else {
          task.decrementTime(delta);
        }
      });

      this._prevValue = progress;
      window.requestAnimationFrame(this._step.bind(this));
    }
  },
  start: function () {
    this._stopped = false;
    this._startTime = null;
    this._prevValue = null;
    if (this.length > 0) {
      window.requestAnimationFrame(this._step.bind(this));
    }
  },
  isRunning: function () {
    return this.length > 0 && !this._stopped;
  },
  isStopped: function () {
    return this._stopped;
  },
  stop: function () {
    this._stopped = true;
  },
  add: function (task, executeInMs, id, scope) {
    if (typeof task === 'function') {
      task = new window.mwUI.Utils.Scheduler.Task({
        id: id || _.uniqueId('task'),
        callback: task,
        executeInMs: executeInMs,
        scope: scope || window
      });
    }

    mwUI.Backbone.Collection.prototype.add.call(this, task);

    if (task && !_.isFunction(task.get('callback'))) {
      throw new Error('[mwScheduler] Task has to be a function');
    }

    if (!this.isStopped()) {
      this.start();
    }

    return task;
  },
  remove: function (task) {
    var existingTask = this.findWhere({callback: task});
    return mwUI.Backbone.Collection.prototype.remove.call(this, existingTask || task);
  },
  get: function (task) {
    if (typeof task === 'function') {
      return this.findWhere({callback: task});
    } else {
      return mwUI.Backbone.Collection.prototype.get.apply(this, arguments);
    }
  }
});

angular.module('mwUI.Utils')

  .service('mwScheduler', function () {
    var scheduler = new window.mwUI.Utils.Scheduler.TaskRunner();

    angular.element(document).on('visibilitychange', function () {
      if (document.hidden) {
        scheduler.stop();
      } else {
        scheduler.start();
      }
    }.bind(this));

    angular.element(window).on('blur', scheduler.stop);
    angular.element(window).on('focus', scheduler.start);

    return scheduler;
  });