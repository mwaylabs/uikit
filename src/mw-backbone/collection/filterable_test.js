fdescribe('Filterable', function () {

  beforeEach(function () {
    var fetch = this.fetchSpy = jasmine.createSpy('fetch');
    this.collection = new (mwUI.Backbone.Collection.extend({
      fetch: fetch
    }) )();
    this.filterableOptions = {
      filterValues: {
        test: null
      },
      filterDefinition: function () {
        return ( new mwUI.Backbone.Filter() ).string('test', this.filterValues.test);
      }
    };
    this.Filterable = mwUI.Backbone.Filterable;
  });

  describe('testing inital filtervalues', function () {
    beforeEach(function () {
      this.opts = _.extend({}, this.filterableOptions, {
        filterValues: {
          test: 'xxx'
        }
      });
      this.filterable = new this.Filterable(this.collection, this.opts);
    });

    it('returns initial filter values', function () {
      expect(this.filterable.getInitialFilterValues()).toEqual({
        test: 'xxx'
      });
    });

    it('initialises filter with filter values', function () {
      expect(this.filterable.getFilters()).toEqual({
        type: 'string',
        fieldName: 'test',
        value: 'xxx'
      });
    });

    it('updates filtervalues when calling set filters', function () {
      this.filterable.setFilters({
        test: 'abc'
      });

      expect(this.filterable.getFilters()).toEqual({
        type: 'string',
        fieldName: 'test',
        value: 'abc'
      });
    });

    it('resets filter to initial filter values when calling reset', function () {
      this.filterable.setFilters({
        test: 'abc'
      });

      this.filterable.resetFilters();

      expect(this.filterable.getFilters()).toEqual({
        type: 'string',
        fieldName: 'test',
        value: 'xxx'
      });
    });

    it('updates intitial filter values', function () {
      var newInitialFilterValues = {
        test: '123',
        xyz: 'blaa'
      };
      this.filterable.setInitialFilterValues(newInitialFilterValues);

      expect(this.filterable.getInitialFilterValues()).toEqual(newInitialFilterValues);
    });

    it('does not overwrite other initial filters', function () {
      this.filterable.setInitialFilterValues({
        xyz: 'blaa'
      });

      expect(this.filterable.getInitialFilterValues()).toEqual({
        test: 'xxx',
        xyz: 'blaa'
      });
    });

    it('does not overwrite initial filters when filter is set', function () {
      this.filterable.setInitialFilterValues({
        xyz: 'blaa'
      });

      this.filterable.setFilters({
        xyz: 'xxx'
      });

      expect(this.filterable.getInitialFilterValues().xyz).toMatch('blaa');
    });

    it('does not overwrite initial filters when filter is set and resetfilters is called', function () {
      this.filterable.setInitialFilterValues({
        xyz: 'blaa'
      });
      this.filterable.setFilters({
        xyz: 'xxx'
      });

      this.filterable.resetFilters();

      expect(this.filterable.getInitialFilterValues().xyz).toMatch('blaa');
    });

    it('uses updated initial filters', function () {
      this.filterable.setInitialFilterValues({
        test: '123'
      });

      this.filterable.resetFilters();

      expect(this.filterable.getFilters()).toEqual({
        type: 'string',
        fieldName: 'test',
        value: '123'
      });
    });

    it('resets filtervalues to updated initial filters', function () {
      this.filterable.setInitialFilterValues({
        test: '123'
      });

      this.filterable.setFilters({
        test: 'abc'
      });
      this.filterable.resetFilters();

      expect(this.filterable.getFilters()).toEqual({
        type: 'string',
        fieldName: 'test',
        value: '123'
      });
    });
  });
});