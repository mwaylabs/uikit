describe('Get url', function () {
  var getUrl = window.mwUI.Backbone.Utils.getUrl;

  it('returns url with the defined hostName and basePath', function(){
    window.mwUI.Backbone.hostName = 'http://host-name';
    window.mwUI.Backbone.basePath ='api/v1/';
    var result = getUrl();

    expect(result).toBe('http://host-name/api/v1');
  });

  it('returns relative url when hostName is defined as empty string', function(){
    window.mwUI.Backbone.hostName = '';
    window.mwUI.Backbone.basePath ='api/v1/';
    var result = getUrl();

    expect(result).toBe('api/v1');
  });

  it('returns absolute url when hostName is defined as slash', function(){
    window.mwUI.Backbone.hostName = '/';
    window.mwUI.Backbone.basePath ='api/v1/';
    var result = getUrl();

    expect(result).toBe('/api/v1');
  });

  it('returns relative url when neither hostName nor basePath are defined', function(){
    window.mwUI.Backbone.hostName = null;
    window.mwUI.Backbone.basePath = null;
    var result = getUrl();

    expect(result).toBe('');
  });

  describe('of a model', function(){
    beforeEach(function () {
      window.mwUI.Backbone.hostName = 'http://host-name';
      window.mwUI.Backbone.basePath ='api/v1/';
      this.model = new window.mwUI.Backbone.Model();
      this.collection = new window.mwUI.Backbone.Collection();
    });

    it('returns url for a model with the global hostName and basePath when model did not define them', function(){
      expect(getUrl(this.model)).toBe('http://host-name/api/v1');
    });

    it('returns url with hostName and basePath that are defined in the model', function(){
      this.model.hostName = 'http://other-host';
      this.model.basePath = 'api';

      expect(getUrl(this.model)).toBe('http://other-host/api');
    });

    it('returns url for a collection with the global hostName and basePath when collection did not define them', function(){
      expect(getUrl(this.collection)).toBe('http://host-name/api/v1');
    });

    it('returns url with hostName and basePath that are defined in the collection', function(){
      this.collection.hostName = 'http://other-host';
      this.collection.basePath = 'api';

      expect(getUrl(this.collection)).toBe('http://other-host/api');
    });

  });

});