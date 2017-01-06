describe('mwUi Menu', function () {
  var menu;

  beforeEach(function(){
    menu = new window.mwUI.Menu.MwMenu();
  });

  describe('registration of items', function () {

    describe('register entry', function () {

      it('adds an entry', function () {
        menu.addEntry('a', '/my/link', 'My Link');

        expect(menu.length === 1);
      });

      it('registers an entry with options', function () {
        menu.addEntry('a', '/my/link', 'My Link', {
          icon: 'xyz',
          activeUrls: ['*/abc/*', '/my/link']
        });

        expect(menu.first().get('icon') === 'xyz');
        expect(menu.first().get('activeUrls').length === 2);
      });

      it('registers an entry without a label but an icon', function () {
        menu.addEntry('a', '/my/link', null, {
          icon: 'xyz',
          activeUrls: ['*/abc/*', '/my/link']
        });

        expect(menu.length === 1);
      });

      it('registers an entry without an url but subentries', function () {
        menu.addEntry('a', null, 'abc', {
          subEntries: [{
            id: 'abc',
            url: 'xyz',
            label: 'Abc'
          }]
        });

        expect(menu.length === 1);
      });

      it('registers multiple entries at once', function () {
        menu.add([
          {
            id: 'a',
            url: '/abc',
            label: 'A'
          },
          {
            id: 'b',
            url: '/def',
            label: 'B'
          }
        ]);

        expect(menu.length).toBe(2);
      });

    });

    describe('register entry with subEntries', function () {
      it('transforms subentries into collection on registration', function () {
        menu.addEntry('a', '/test', 'abc', {
          subEntries: [
            {
              id: 'abc_sub',
              url: '/test/sub-1',
              label: 'Abc Sub 1'
            },
            {
              id: 'abc_sub_2',
              url: '/test/sub-2',
              label: 'Abc Sub 2'
            }
          ]
        });

        expect(menu.first().get('subEntries') instanceof Backbone.Collection).toBeTruthy();
        expect(menu.first().get('subEntries').length).toBe(2);
        expect(menu.first().get('subEntries').first().get('id')).toMatch('abc_sub');
        expect(menu.first().get('subEntries').last().get('label')).toMatch('Abc Sub 2');
      });
    });

    describe('register a divider', function () {
      it('should possible to add a divider', function () {
        menu.addDivider('a');

        expect(menu.length === 1);
      });

      it('should possible to add a divider with options', function () {
        menu.addDivider('a', {
          label: 'My Divider'
        });

        expect(menu.first().get('label')).toMatch('My Divider');
      });
    });

    describe('register mixed entries (entry and divider)', function () {
      it('should be possible to register multiple entries and dividers at once', function () {
        menu.add([
          {
            id: 'a',
            url: '/abc',
            label: 'A'
          },
          {
            id: 'b'
          },
          {
            id: 'c',
            url: '/def',
            label: 'C'
          }
        ]);

        expect(menu.length).toBe(3);
      });

      it('should be possible to register multiple entries and dividers with a label at once', function () {
        menu.add([
          {
            id: 'a',
            url: '/abc',
            label: 'A'
          },
          {
            id: 'b',
            label: 'B',
            type: 'DIVIDER'
          },
          {
            id: 'c',
            url: '/def',
            label: 'C'
          }
        ]);

        expect(menu.length).toBe(3);
      });
    });

  });

  describe('error handling for registration of entry and divider', function () {
    it('should throw an error when neither a label nor an icon are specified', function () {
      expect(function () {
        menu.addEntry('a', '/my/link', null, {});
      }).toThrow();
    });

    it('should throw an error adding multiple dividers and entries and the type can not be determined', function () {
      expect(function () {
        menu.add([
          {
            id: 'a',
            url: '/abc',
            label: 'A'
          },
          {
            id: 'b',
            label: 'B'
          }
        ]);
      }).toThrow();
    });

    it('should throw an error when an entry with the same id has already been registered', function () {
      expect(function () {
        menu.addEntry('a', '/a', 'A');
        menu.addEntry('a', '/b', 'B');
      }).toThrow();

      expect(function () {
        menu.reset();
        menu.addDivider('a');
        menu.addDivider('a');
      }).toThrow();

      expect(function () {
        menu.reset();
        menu.addEntry('a', '/a');
        menu.addDivider('a');
      }).toThrow();

      expect(function () {
        menu.reset();
        menu.add([
          {
            id: 'a',
            url: '/abc',
            label: 'A'
          },
          {
            id: 'a'
          }
        ]);
      }).toThrow();
    });
  });

  describe('get entries in correct order', function () {
    it('returns entries in order they where registered when no order was set manually', function () {
      menu.addEntry('a', '/my/link', 'My Link');
      menu.addEntry('b', '/my/link2', 'My Link');
      menu.addEntry('c', '/my/link3', 'My Link');

      expect(menu.at(0).get('id')).toMatch('a');
      expect(menu.at(1).get('id')).toMatch('b');
      expect(menu.at(2).get('id')).toMatch('c');
    });

    it('returns entries in order that was specified', function () {
      menu.addEntry('a', '/my/link', 'My Link', {order: 3});
      menu.addEntry('b', '/my/link2', 'My Link', {order: 1});
      menu.addEntry('c', '/my/link3', 'My Link', {order: 2});

      expect(menu.at(0).get('id')).toMatch('b');
      expect(menu.at(1).get('id')).toMatch('c');
      expect(menu.at(2).get('id')).toMatch('a');
    });

    it('returns entries in order that was specified and puts those with a specified to the end when order is positive number', function () {
      menu.addEntry('a', '/my/link', 'My Link', {order: 1});
      menu.addEntry('b', '/my/link2', 'My Link');
      menu.addEntry('c', '/my/link3', 'My Link');
      menu.addEntry('d', '/my/link4', 'My Link', {order: 2});
      menu.addEntry('e', '/my/link5', 'My Link');

      expect(menu.at(0).get('id')).toMatch('b');
      expect(menu.at(1).get('id')).toMatch('c');
      expect(menu.at(2).get('id')).toMatch('e');
      expect(menu.at(3).get('id')).toMatch('a');
      expect(menu.at(4).get('id')).toMatch('d');
    });

    it('puts entries with negative order to the beginning and put all without an order behind them in the order they where registered ', function () {
      menu.addEntry('a', '/my/link', 'My Link');
      menu.addEntry('b', '/my/link2', 'My Link');
      menu.addEntry('c', '/my/link3', 'My Link', {order: -1});
      menu.addEntry('d', '/my/link4', 'My Link', {order: -2});
      menu.addEntry('e', '/my/link5', 'My Link');

      expect(menu.at(0).get('id')).toMatch('d');
      expect(menu.at(1).get('id')).toMatch('c');
      expect(menu.at(2).get('id')).toMatch('a');
      expect(menu.at(3).get('id')).toMatch('b');
      expect(menu.at(4).get('id')).toMatch('e');
    });
  });

  describe('get active entries', function () {

    it('sets top level entry active on url match', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A'
        },
        {
          id: 'b'
        },
        {
          id: 'c',
          url: '/def',
          label: 'B'
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/abc').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/def') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/def').get('id')).toMatch('c');
    });

    it('sets sub entry active on url match', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          subEntries: [
            {
              id: 'a1',
              url: '/abc/a1',
              label: 'A1'
            },
            {
              id: 'a2',
              url: '/abc/a2',
              label: 'A2'
            }
          ]
        }
      ]);

      expect(menu.first().get('subEntries').getActiveEntryForUrl('/abc/a1') instanceof Backbone.Model).toBeTruthy();
      expect(menu.first().get('subEntries').getActiveEntryForUrl('/abc/a1').get('id')).toMatch('a1');
      expect(menu.first().get('subEntries').getActiveEntryForUrl('/abc/a2') instanceof Backbone.Model).toBeTruthy();
      expect(menu.first().get('subEntries').getActiveEntryForUrl('/abc/a2').get('id')).toMatch('a2');
    });

    it('sets top level entry active when one of its sub entries is active ', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          subEntries: [
            {
              id: 'a1',
              url: '/abc/a1',
              label: 'A1'
            },
            {
              id: 'a2',
              url: '/abc/a2',
              label: 'A2'
            }
          ]
        },
        {
          id: 'b',
          url: '/def',
          label: 'B',
          subEntries: [
            {
              id: 'b1',
              url: '/def/b1',
              label: 'B1'
            },
            {
              id: 'b2',
              url: '/def/b2',
              label: 'B2'
            }
          ]
        },
        {
          id: 'c',
          label: 'C',
          subEntries: [
            {
              id: 'c1',
              url: '/ghi/c1',
              label: 'B1'
            },
            {
              id: 'c2',
              url: '/ghi/c2',
              label: 'C2'
            }
          ]
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc/a1').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/abc/a2').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/def/b1').get('id')).toMatch('b');
      expect(menu.getActiveEntryForUrl('/def/b2').get('id')).toMatch('b');
      expect(menu.getActiveEntryForUrl('/ghi/c1').get('id')).toMatch('c');
      expect(menu.getActiveEntryForUrl('/ghi/c2').get('id')).toMatch('c');
    });

    it('gets the active subEntry from the toplevel entry', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A'
        },
        {
          id: 'b',
          url: '/def',
          label: 'B',
          subEntries: [
            {
              id: 'b1',
              url: '/def/b1',
              label: 'B1'
            }
          ]
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc').get('subEntries').getActiveEntryForUrl('/abc')).toBeNull();
      expect(menu.getActiveEntryForUrl('/def/b1').get('subEntries').getActiveEntryForUrl('/def/b1').get('id')).toMatch('b1');

    });

    it('returns if entry is active', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A'
        },
        {
          id: 'b',
          url: '/def',
          label: 'B'
        }
      ]);

      expect(menu.get('a').isActiveForUrl('/abc')).toBeTruthy();
      expect(menu.get('b').isActiveForUrl('/abc')).toBeFalsy();
      expect(menu.get('b').isActiveForUrl('/def')).toBeTruthy();
    });

  });

  describe('get active entries when setting the activeUrls attribute', function () {

    it('sets top level entry active when url matches on of the defined active urls', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          activeUrls: [
            '/abc/123',
            '/abc/123/xyz'
          ]
        },
        {
          id: 'b'
        },
        {
          id: 'c',
          url: '/def',
          label: 'B',
          activeUrls: [
            '/xyz'
          ]
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc/123') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/abc/123').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/abc/123/xyz') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/abc/123/xyz').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/def') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/def').get('id')).toMatch('c');
      expect(menu.getActiveEntryForUrl('/xyz').get('id')).toMatch('c');
    });

    it('sets top level entry active when url matches on of the defined active urls and active urls has wildcards', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          activeUrls: [
            '/abc/*'
          ]
        },
        {
          id: 'b',
          url: '/def',
          label: 'B',
          activeUrls: [
            '/xyz/:id/zyx'
          ]
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/abc/123/xyz').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/def') instanceof Backbone.Model).toBeTruthy();
      expect(menu.getActiveEntryForUrl('/def').get('id')).toMatch('b');
      expect(menu.getActiveEntryForUrl('/xyz/125425/zyx').get('id')).toMatch('b');
      expect(menu.getActiveEntryForUrl('/xyz/125425/435')).toBeNull();
    });

    it('sets sub entry active when url matches on of the defined active urls', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          subEntries: [
            {
              id: 'a1',
              url: '/abc/def',
              label: 'A1',
              activeUrls: [
                '/abc/def/abc',
                '/abc/def/123'
              ]
            },
            {
              id: 'a2',
              url: '/abc/ghi',
              label: 'A2',
              activeUrls: [
                '/abc/ghi/abc',
                '/abc/ghi/:id/hij'
              ]
            }
          ]
        },
        {
          id: 'b',
          url: '/def',
          label: 'B',
          subEntries: [
            {
              id: 'b1',
              url: '/def',
              label: 'A1',
              activeUrls: [
                '/def/*'
              ]
            }
          ]
        }
      ]);

      expect(menu.first().getActiveSubEntryForUrl('/abc/def').get('id')).toMatch('a1');
      expect(menu.first().getActiveSubEntryForUrl('/abc/def/abc').get('id')).toMatch('a1');
      expect(menu.first().getActiveSubEntryForUrl('/abc/def/123').get('id')).toMatch('a1');
      expect(menu.get('b').getActiveSubEntryForUrl('/def').get('id')).toMatch('b1');
      expect(menu.get('b').getActiveSubEntryForUrl('/def/abc').get('id')).toMatch('b1');
    });

    it('sets top entry active when url matches on of the defined sube entries active urls', function () {
      menu.add([
        {
          id: 'a',
          url: '/abc',
          label: 'A',
          subEntries: [
            {
              id: 'a1',
              url: '/abc/def',
              label: 'A1',
              activeUrls: [
                '/abc/def/*'
              ]
            }
          ]
        }
      ]);

      expect(menu.getActiveEntryForUrl('/abc/def').get('id')).toMatch('a');
      expect(menu.getActiveEntryForUrl('/abc/def/123').get('id')).toMatch('a');
    });

  });

});
