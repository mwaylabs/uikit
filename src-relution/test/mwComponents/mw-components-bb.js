describe('mwComponentsBb', function() {
  var ignoreKeyPress;

  beforeEach(function() {
    module('mwUI');
    module('mwComponentsBb');
  });

  beforeEach(inject(function(_ignoreKeyPress_) {
    ignoreKeyPress = _ignoreKeyPress_;
  }));

  describe('ignoreKeyPress', function() {
    var event;

    beforeEach(function() {
      event = {
        defaultPrevented : false,
        preventDefault: function() {
          this.defaultPrevented = true;
        }
      }
    });

    it('can ignore the enter key', function() {
      event.which = 13;

      ignoreKeyPress.ignoreEnterKey(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('does not ignore non enter key', function() {
      event.which = 14;

      ignoreKeyPress.ignoreEnterKey(event);

      expect(event.defaultPrevented).toBe(false);
    });
  });
})