describe('Get url with endpoint', function () {
  var getUrlWithEndpoint = window.mwUI.Backbone.Utils.getUrlWithEndpoint;

  beforeEach(function(){
    this.model = new mwUI.Backbone.Model();
    this.collection = new mwUI.Backbone.Collection();
  });

  describe('of model', function(){
    it('throws error when no endpoint', function(){
      var errorFn = function(){
        getUrlWithEndpoint(this.model);
      };

      expect(errorFn).toThrow();
    });

    it('attaches endpoint to url that has the hostName and the basePath', function(){
      this.model.hostName = 'http://host-name';
      this.model.basePath = 'api';
      this.model.endpoint = '/endpoint';

      expect(getUrlWithEndpoint(this.model)).toBe('http://host-name/api/endpoint');
    });
  });

  describe('of collection', function(){
    it('throws error when no endpoint', function(){
      var errorFn = function(){
        getUrlWithEndpoint(this.collection);
      };

      expect(errorFn).toThrow();
    });

    it('attaches endpoint to url that has the hostName and the basePath', function(){
      this.collection.hostName = 'http://host-name';
      this.collection.basePath = 'api';
      this.collection.endpoint = '/endpoint';

      expect(getUrlWithEndpoint(this.collection)).toBe('http://host-name/api/endpoint');
    });
  });
});