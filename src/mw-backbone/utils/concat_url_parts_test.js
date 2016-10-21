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

  it('appends a slash between the strings', function(){
    var str1 = 'abc',
      str2 = 'def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch(str1+'/'+str2);
  });

  it('cut unnecessary slashes so that it is a valid url', function(){
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

  it('does not two slashes to the first position', function(){
    var str1 = '/',
      str2 = '/def',
      result = concatUrlParts(str1, str2);

    expect(result).toMatch('/def');
  });


  it('does not append a slash at the end', function(){
    var str1 = 'abc',
      str2 = 'def',
      result = concatUrlParts(str1, str2);

    expect(result[result.length]).not.toBe('/');
  });

});