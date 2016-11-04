describe('Request', function () {
  var request = window.mwUI.Backbone.Utils.request,
      orgSync;

  beforeEach(function(){
    window.mwUI.Backbone.hostName = 'http://host-name';
    this.ajaxSpy = jasmine.createSpy('ajax spy');
    orgSync = window.Backbone.ajax;
    window.Backbone.ajax = this.ajaxSpy;
  });

  afterEach(function(){
    window.Backbone.ajax = orgSync;
  });

  it('calls backbone ajax', function(){
    request();

    expect(this.ajaxSpy).toHaveBeenCalled();
  });

  it('passes url, method and options to backbone ajax', function(){
    request('http://my-url', 'GET', {customOption: 1});

    expect(this.ajaxSpy).toHaveBeenCalledWith({url: 'http://my-url', type: 'GET', customOption:1});
  });

  it('prepends the hostName that was defined on backbone object when url is not a http link', function(){
    request('api/endpoint', 'GET');

    expect(this.ajaxSpy).toHaveBeenCalledWith({url: 'http://host-name/api/endpoint', type: 'GET'});
  });

  it('prepends the hostName of model instance when url is not a http link', function(){
    var Model = mwUI.Backbone.Model.extend({
      hostName: 'http://other-host-name'
    });
    var model = new Model();
    request('api/endpoint', 'GET', null, model);

    expect(this.ajaxSpy).toHaveBeenCalledWith({url: 'http://other-host-name/api/endpoint', type: 'GET', instance: model});
  });

  it('prepends the hostName of collection instance when url is not a http link', function(){
    var Collection = mwUI.Backbone.Collection.extend({
      hostName: 'http://other-host-name'
    });
    var collection = new Collection();
    request('api/endpoint', 'GET', null, collection);

    expect(this.ajaxSpy).toHaveBeenCalledWith({url: 'http://other-host-name/api/endpoint', type: 'GET', instance: collection});
  });
});