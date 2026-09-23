const { paBinary, paBinaryData } = require('../pa-all.js');

test('Binary Star Orbit', () => {
    expect(paBinary.binaryStarOrbit(1, 1, 1980, paBinaryData.binaryStarNames.etaCor)).toStrictEqual([318.5, 0.41]);
});