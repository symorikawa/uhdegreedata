/* globals uhdata, totalDegrees */

describe("total degrees", function() {
  var noAward=[{name: "oldData"},{name: "testData"}];
  var stringAward=[{AWARDS: "false"},{AWARDS: "hello"}];

  it("should return 48186 when passed all uh data for last 5 years", function() {
    expect(totalDegrees(uhdata)).toEqual(48186);
  });

  // test to make sure that totalDegrees throws a descriptive error when:
  // (a) a record is missing the AWARDS field, and
  // (b) an AWARDS field contains a non-integer value.
  it("should return an appropriate error when AWARDS field is missing ", function() {
    expect(function() {
      totalDegrees(noAward);
    }).toThrowError("Object AWARDS field is missing");
  });
  it("should return an appropriate error when AWARDS field is not an integer", function() {
    expect(function() {
      totalDegrees(stringAward);
    }).toThrowError("Object AWARDS field is not an integer");
  });


});
