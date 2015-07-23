describe('mwMarkdown', function () {
  var $compile,
    $rootScope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('btford.markdown'));
  beforeEach(module('mwUI'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  var markdownWithError = '<h1>dfgdfg</ <#h1 hjhtjhsd';


  it('should convert transcluded text to markdown', function () {
    var elt = angular.element('<mw-markdown>*hi*</mw-markdown>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('<p><em>hi</em></p>');

    var elt = angular.element('<div mw-markdown>*hi*</div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('<p><em>hi</em></p>');
  });

  it('should not convert transcluded text with error to markdown', function () {
    var elt = angular.element('<mw-markdown>' + markdownWithError + '</mw-markdown>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('<p>dfgdfg</p>');
  });

  it('should convert text as attribute to markdown', function () {
    var elt = angular.element('<div mw-markdown="hey"></div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('');

    $rootScope.hey = "*hi*";
    $rootScope.$apply();
    expect(elt.html()).toBe('<p><em>hi</em></p>');
  });

  it('should not convert text with error as attribute to markdown', function () {
    var elt = angular.element('<div mw-markdown="hey"></div>');
    $compile(elt)($rootScope);
    $rootScope.hey = markdownWithError;
    $rootScope.$apply();
    expect(elt.html()).toBe('&lt;h1&gt;dfgdfg&lt;/ &lt;#h1 hjhtjhsd');
  });

  it('should sanitize text', function () {
    var elt = angular.element('<div mw-markdown><script>window.hacked = true;</script></div mw-markdown>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('<p>window.hacked = true;</p>');
    expect(window.hacked).toBeUndefined();
  });

});
