/**
 * functions for analysis of a dataset of UH degree awards
 * Created by Sy on 9/28/2015.
 */

/* globals _, uhdata */
/* exported testdata, maxDegrees, totalDegrees, addDegrees, percentageHawaiian, totalDegreesByYear, listCampuses,
listCampusDegrees, doctoralDegreePrograms */

/**
 * small test dataset from uh dataset
 * @type {Array.<T>|string|Blob|ArrayBuffer}
 */
var testdata = uhdata.slice(0,3);
var noAward=[{name: "testData"}];
var stringAward=[{AWARDS: "hello"}];
/**
 * a function to calculate the total number of degrees awarded by UH Campuses
 * @param data the dataset
 * @returns sum of all awarded degrees
 */
function totalDegrees(data) {
  if (!_.every(data, hasAward)) {
    throw new Error("Object AWARDS field is missing");
  }
  return _.reduce(_.filter(data, "AWARDS"), addDegrees, 0);
}
/**
 * helper function to determine if a record contains a AWARDS field
 * @param record Record to examine
 * @returns {boolean} True if has a AWARDS field
 */
function hasAward(record){
  return record.hasOwnProperty("AWARDS");
}
console.log(totalDegrees(noAward));
console.log(totalDegrees(stringAward));
console.log(totalDegrees(uhdata));
/**
 * helper function to add add all degrees in a list
 * @param memo the memory to hold the return value
 * @param record the particular entry
 * @returns the total awarded degrees from the given list
 */
function addDegrees(memo, record){
  if(isNaN(record["AWARDS"])){
    throw new Error("Object AWARDS field is not an integer");
  }
  return memo+=record["AWARDS"];
}

/**
 * returns the percentage of degrees awarded to HAWAIIAN_LEGACY vs total degrees awarded
 * @param data the dataset
 * @returns percentage of degrees awarded to Hawaiian students
 */
function percentageHawaiian(data){
  return numHawaiian(data)/totalDegrees(data)*100;
}

/**
 * function to calculate the total number of degrees awarded to students of HAWAIIAN_LEGACY
 * @param data the uh dataset
 * @returns returns sum of degrees awarded to Hawaiian students
 */
function numHawaiian(data){
  return _.reduce(_.filter(_.where(data,{HAWAIIAN_LEGACY:"HAWAIIAN"}), "AWARDS"), addDegrees, 0);
}

/**
 * calculates the total number of degrees awarded in the passed year.
 * @param data the dataset
 * @param year the year to look at
 * @returns the total number of degrees awarded in the given year
 */
function totalDegreesByYear(data, year){
  return _.reduce(filterByYear(data, year), addDegrees, 0);
}

/**
 * function to filter out irrelevant data by year
 * @param data the dataset
 * @param year the year to filter by
 * @returns sublist of the given list
 */
function filterByYear(data, year){
  return _.where(data, {FISCAL_YEAR: year});
}

/**
 * produces a duplicate-free list of campuses that appear in the dataset
 * @param data the dataset
 * @returns array of strings of campuses
 */
function listCampuses(data){
  return _.unique(mapCampus(data));
}

/**
 * Creates a list of all campuses in the dataset with duplicates
 * @param data the dataset
 * @returns array of strings of campuses
 */
function mapCampus(data){
  return _.map(data, "CAMPUS");
}

/**
 * produces a list of campuses and the degrees awarded by each one
 * @param data the data set
 * @returns returns an object where the property keys are campuses and the values are the number of degrees awarded by
 * the campus
 */
function listCampusDegrees(data){
  return _.mapObject(groupByCampus(data), listCampDegHelper);
}

/**
 * helper function to reduce the degrees awarded of each campus
 * @param val list of degree awards for a particular campus
 * @returns sum of the awarded degrees from a particular campus
 */
function listCampDegHelper(val){
  return _.reduce(val, addDegrees, 0);
}

/**
 * groups data by campus name
 * @param data the dataset
 * @returns returns an object with campus names as keys and a list of appropriate records as values
 */
function groupByCampus(data){
  return _.groupBy(data, "CAMPUS");
}

/**
 * calculates the greatest number of degrees awarded in one year
 * @param data the dataset
 * @returns the highest number of degrees awarded in any one year
 */
function maxDegrees(data){
  return _.max(_.mapObject(groupByYear(data), maxDegHelper));
}

/**
 * reducing helper function for each year
 * @param val list of awards for a particular year
 * @returns returns the sum of the degrees awarded for a particular year
 */
function maxDegHelper(val){
  return _.reduce(val, addDegrees, 0);
}

/**
 * groups records according to year
 * @param data the dataset
 * @returns object with year as keys and a list of records from that year as values
 */
function groupByYear(data){
  return _.groupBy(data, "FISCAL_YEAR");
}

/**
 * produces a duplicate-free list of programs that offer doctoral degree.
 * @param data the dataset
 * @returns return an array of strings of programs that offer doctoral degrees.
 */
function doctoralDegreePrograms(data){
  return _.unique(_.pluck(_.where(data, {OUTCOME: "Doctoral Degrees"}), "CIP_DESC"));
}
