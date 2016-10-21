describe('Request', function () {
  var request = window.mwUI.Backbone.Utils.request,
      orgSync;

  beforeEach(function(){
    window.mwUI.Backbone.hostName = 'http://host-name';
    window.mwUI.Backbone.basePath ='api/v1/';
    this.ajaxSpy = jasmine.createSpy('ajax spy');
    orgSync = window.Backbone.ajax;
    window.Backbone.ajax = this.ajaxSpy;
    this.model = new mwUI.Backbone.Model();
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

  it('transforms endpoint into url', function(){
    request('/endpoint', 'GET');

    expect(this.ajaxSpy).toHaveBeenCalledWith({url: 'http://host-name/api/v1/endpoint', type: 'GET'});
  });
});