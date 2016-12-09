describe('Collection Selectable', function () {

  beforeEach(function () {
    this.filter = new mwUI.Backbone.Filter();
  });

  describe('dateRange Filter', function(){
    it('returns dateRange filter when min and max are defined', function(){
      var filter = this.filter.dateRange('xxx', 1, 5);

      expect(filter).toEqual({
        type: 'dateRange',
        fieldName: 'xxx',
        min: 1,
        max: 5
      });
    });

    it('returns dateRange filter with only min value set when only min is defined', function(){
      var filter = this.filter.dateRange('xxx', 1);

      expect(filter).toEqual({
        type: 'dateRange',
        fieldName: 'xxx',
        min: 1
      });
    });

    it('returns dateRange filter with only max value set when only min is defined', function(){
      var filter = this.filter.dateRange('xxx', null, 5);

      expect(filter).toEqual({
        type: 'dateRange',
        fieldName: 'xxx',
        max: 5
      });
    });

    it('returns no dateRange filter when neither min nor max is defined', function(){
      var filter = this.filter.dateRange('xxx');

      expect(filter).toEqual(null);
    });
  });

  describe('longRange Filter', function(){
    it('returns longRange filter when min and max are defined', function(){
      var filter = this.filter.longRange('xxx', 1, 5);

      expect(filter).toEqual({
        type: 'longRange',
        fieldName: 'xxx',
        min: 1,
        max: 5
      });
    });

    it('returns longRange filter with only min value set when only min is defined', function(){
      var filter = this.filter.longRange('xxx', 1);

      expect(filter).toEqual({
        type: 'longRange',
        fieldName: 'xxx',
        min: 1
      });
    });

    it('returns longRange filter with only max value set when only min is defined', function(){
      var filter = this.filter.longRange('xxx', null, 5);

      expect(filter).toEqual({
        type: 'longRange',
        fieldName: 'xxx',
        max: 5
      });
    });

    it('returns no longRange filter when neither min nor max is defined', function(){
      var filter = this.filter.longRange('xxx');

      expect(filter).toEqual(null);
    });
  });

});