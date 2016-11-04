describe('Get url', function () {
  var getUrl = window.mwUI.Backbone.Utils.getUrl;

  beforeEach(function(){
    this.Model = mwUI.Backbone.Model.extend({
      endpoint: 'test'
    });
    this.model = new this.Model();
  });

  it('throws error when first argument is neither model nor collection', function(){
    expect(getUrl).toThrow();
  });

  it('accepts model as argument', function(){
    var getUrlWithModelArg = function(){
      getUrl(this.model);
    }.bind(this);

    expect(getUrlWithModelArg).not.toThrow();
  });

  it('accepts collection as argument', function(){
    var Collection = window.mwUI.Backbone.Collection.extend({
      endpoint: 'test'
    });
    var getUrlWithCollectionArg = function(){
      getUrl(new Collection());
    }.bind(this);

    expect(getUrlWithCollectionArg).not.toThrow();
  });

  it('throws error when no endpoint is defined', function(){
    var getUrlWithCollectionArg = function(){
      getUrl(new window.mwUI.Backbone.Collection());
    }.bind(this),
    getUrlWithModelArg = function(){
      getUrl(new window.mwUI.Backbone.Model());
    }.bind(this);

    expect(getUrlWithCollectionArg).toThrow();
    expect(getUrlWithModelArg).toThrow();
  });

  it('returns url with the defined hostName and basePath', function(){
    this.model.hostName = 'http://host-name';
    this.model.basePath ='api/v1/';
    var result = getUrl(this.model);

    expect(result).toBe('http://host-name/api/v1/test');
  });

  it('returns relative url when hostName is defined as empty string', function(){
    this.model.hostName = '';
    this.model.basePath ='api/v1/';
    var result = getUrl(this.model);

    expect(result).toBe('api/v1/test');
  });

  it('returns absolute url when hostName is defined as slash', function(){
    this.model.hostName = '/';
    this.model.basePath ='api/v1/';
    var result = getUrl(this.model);

    expect(result).toBe('/api/v1/test');
  });

  it('returns relative url when neither hostName nor basePath are defined', function(){
    this.model.hostName = null;
    this.model.basePath = null;
    var result = getUrl(this.model);

    expect(result).toBe('test');
  });
});