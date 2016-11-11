describe('Concat url parts', function () {
  var concatUrlParts = window.mwUI.Backbone.Utils.concatUrlParts;

  it('appends multiple arguments to one string', function(){
    var str1 = 'abc',
        str2 = 'def',
        str3 = 'xyz',
        result = concatUrlParts(str1, str2, str3);

    expect(result).toMatch(str1);
    expect(result).toMatch(str2);
    expect(result).toMatch(str3);
  });

  it('inserts a slash between strings', function(){
    var str1 = 'abc',
      str2 = 'def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch(str1+'/'+str2);
  });

  it('cuts unnecessary slashes', function(){
    var str1 = 'abc/',
      str2 = '/def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('abc/def');
  });

  it('does not add a slash at the first position', function(){
    var str1 = 'abc',
      str2 = '/def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('abc/def');
  });

  it('does not remove the slash at the first position', function(){
    var str1 = '/abc',
      str2 = '/def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('/abc/def');
  });

  it('does not remove slashes in string arguments', function(){
    var str1 = '/abc',
      str2 = '/def/ghi/jkl',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('/abc/def/ghi/jkl');
  });

  it('does not remove slash when the arguments before are empty strings', function(){
    var str1 = '',
      str2 = '',
      str3 = '/test',
      result = concatUrlParts(str1, str2, str3);

    expect(result).toBe('/test');
  });

  it('does not add two slashes to the first position', function(){
    var str1 = '/',
      str2 = '/def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('/def');
  });


  it('does not append a slash at the end', function(){
    var str1 = 'abc',
      str2 = 'def',
      result = concatUrlParts(str1, str2);

    expect(_.last(result)).not.toBe('/');
  });

});