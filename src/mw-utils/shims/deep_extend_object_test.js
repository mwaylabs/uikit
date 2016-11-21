/**
 * Created by zarges on 29/05/15.
 */
describe('mwUI utils deep extend object', function () {

  beforeEach(module('mwUI.Utils'));

  beforeEach(function () {
    this.deepExtend = mwUI.Utils.shims.deepExtendObject;
  });

  it('extends object with properties of another object', function () {
    var obj1 = {a: 1, b: 2, c: 3},
      obj2 = {d: 4, e: 5};

    this.deepExtend(obj1, obj2);

    expect(obj1.d).toBe(4);
    expect(obj1.e).toBe(5);
  });

  it('extends object with properties of another object and replaces them when they already exist', function () {
    var obj1 = {a: 1, b: 2, c: 3},
      obj2 = {d: 4, e: 5, a:10};

    this.deepExtend(obj1, obj2);

    expect(obj1.a).toBe(10);
  });

  it('extends nested object with properties of another object and replaces them when they already exist', function () {
    var obj1 = {a: 1, b: {a: 1, b: {a: 1}}},
      obj2 = {b: {b: {a: 2, b: 3}}, c:3};

    this.deepExtend(obj1, obj2);

    expect(obj1.a).toBe(1);
    expect(obj1.b.a).toBe(1);
    expect(obj1.b.b.a).toBe(2);
    expect(obj1.b.b.b).toBe(3);
  });

  it('throws error when you try to overwrite a nested object with a string', function () {
    var obj1 = {a: 1, b: {a: 1, b: {a: 1}}},
      obj2 = {b: 'b'},
      throwFn = function(){
        this.deepExtend(obj1, obj2);
      }.bind(this);

    expect(throwFn).toThrow();
  });


});