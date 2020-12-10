const Helpers = require('../utils/helpers.js');

describe('check', () => {
  test('test', () =>{ expect('test').toBe('test')});

  test('if monthly average is an object', () => {
    expect(Helpers.checkYearlyAverages({Jan: 5.1, Feb: 5.8, Mar: 8.6, Apr: 10, May: 11, Jun: 12, Jul: 13, Aug: 14, Sep: 15, Oct: 12, Nov: 11, Dec: 7})).toStrictEqual({Jan: 5.1, Feb: 5.8, Mar: 8.6, Apr: 10, May: 11, Jun: 12, Jul: 13, Aug: 14, Sep: 15, Oct: 12, Nov: 11, Dec: 7});
  });
  test('if monthly average is not an object', () => {
    expect(Helpers.checkYearlyAverages([5.1, 5.8, 8.6, 10, 11, 12, 13, 14, 15, 12, 11, 7])).toBeFalsy();
  });

  test('if geohash has correct length', () => {
    expect(Helpers.checkGeohashLength('gkp')).toStrictEqual('gkp');
  });
  test('if geohash does not have correct length', () => {
    expect(Helpers.checkGeohashLength('gkpgkpebp6mb4')).toBeFalsy();
  });

  test('if geohash contains only letters or digits', () => {
    expect(Helpers.checkGeohashFormat('gkp15')).toStrictEqual('gkp15');
  });
  test('if geohash does not contain only letters or digits', () => {
    expect(Helpers.checkGeohashFormat('gkpgkpe_%4')).toBeFalsy();
  });

});