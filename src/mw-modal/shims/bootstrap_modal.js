/* jshint ignore:start */
// This is the orginal bootstrap backdrop implementation with the only
// modification that the element can be defined as parameter where the backdrop should be placed
$.fn.modal.Constructor.prototype.backdrop = function (callback, holderEl) {
  var animate = this.$element.hasClass('fade') ? 'fade' : '';

  if (this.isShown && this.options.backdrop) {
    var doAnimate = $.support.transition && animate;

    this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
      .appendTo(holderEl);

    this.$backdrop.on('click', $.proxy(function (e) {
      if (e.target !== e.currentTarget) {
        return;
      }
      this.options.backdrop == 'static'
        ? this.$element[0].focus.call(this.$element[0])
        : this.hide.call(this)
    }, this));

    if (doAnimate) {
      this.$backdrop[0].offsetWidth;
    } // force reflow

    this.$backdrop.addClass('in');

    if (!callback) return;

    doAnimate ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (!this.isShown && this.$backdrop) {
    this.$backdrop.removeClass('in');

    $.support.transition && this.$element.hasClass('fade') ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (callback) {
    callback()
  }
};
/* jshint ignore:end */