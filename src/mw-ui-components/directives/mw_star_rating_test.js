describe('mwStarRating', function () {
  var $compile;
  var $rootScope;
  var el;
  var scope;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.UiComponents'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();

    el = $compile('<span mw-rating="currentRating" max="maxRating"></span>')(scope);
  }));

  // fa-star: empty star
  // fa-star-o: filled star
  // fa-star-half-full: half filled star

  it('should have a default rating of 0 out of 5 possible stars', function () {
    scope.$digest();

    expect($rootScope.currentRating).toBeUndefined();
    expect($rootScope.maxRating).toBeUndefined();

    expect(el.find('.fa-star').length).toBe(0);
    expect(el.find('.fa-star-o').length).toBe(5);
    expect(el.find('.fa-star-half-full').length).toBe(0);
  });

  it('should have 0 stars on negative rating', function () {
    $rootScope.currentRating = -1;
    $rootScope.maxRating = 10;
    scope.$digest();

    expect(el.find('.fa-star').length).toBe(0);
    expect(el.find('.fa-star-o').length).toBe(10);
    expect(el.find('.fa-star-half-full').length).toBe(0);
  });

  it('should have 0 stars on invalid rating', function () {
    $rootScope.currentRating = 'sdffgdfgdfg';
    scope.$digest();

    expect(el.find('.fa-star').length).toBe(0);
    expect(el.find('.fa-star-o').length).toBe(5);
    expect(el.find('.fa-star-half-full').length).toBe(0);
  });

  it('should have a rating with a half star when Math.floor(rating) >= 0.5 ', function () {
    $rootScope.currentRating = 4.5;
    $rootScope.maxRating = 10;
    scope.$digest();

    expect(el.find('.fa-star').length).toBe(4);
    expect(el.find('.fa-star-o').length).toBe(5);
    expect(el.find('.fa-star-half-full').length).toBe(1);
  });

  it('should not exceed the maximum possible rating', function () {
    $rootScope.currentRating = 9999999999999;
    $rootScope.maxRating = 3;
    scope.$digest();

    expect(el.find('.fa-star').length).toBe(3);
    expect(el.find('.fa-star-o').length).toBe(0);
    expect(el.find('.fa-star-half-full').length).toBe(0);
  });

});
