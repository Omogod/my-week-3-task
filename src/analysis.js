const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here

  const trips = await getTrips();
  // console.log(trips)

  let cashCount = 0;
  let nonCashCount = 0;
  let cashAmount = 0;
  let nonCashAmount = 0;
  let driverTrips = {};
  let driverEarnings = {};
  let driverIds = [];

  trips.map((trip) => {
    // get driver ids
    if (!driverIds.includes(trip.driverID)) {
      driverIds.push(trip.driverID);
    }

    // count the number of cash and non-cash trips
    if (trip["isCash"]) {
      cashCount += 1;
      cashAmount += parseFloat(
        String(trip["billedAmount"]).split(",").join("")
      );
    } else {
      nonCashCount += 1;
      nonCashAmount += parseFloat(
        String(trip["billedAmount"]).split(",").join("")
      );
    }

    // console.log(cashCount)

    // console.log(nonCashCount)

    // console.log(cashAmount)
    // console.log(nonCashAmount)

    // check if driverID exists in the object. to get most trips by driver
    if (driverTrips[trip.driverID]) {
      driverTrips[trip.driverID] += 1;
    }

    //if key does not exist, create it and set value to 1
    else {
      driverTrips[trip.driverID] = 1;
    }

    //to get most earnings by driver
    if (driverEarnings[trip.driverID]) {
      driverEarnings[trip.driverID] += parseFloat(
        String(trip["billedAmount"]).split(",").join("")
      );
    } else {
      driverEarnings[trip.driverID] = parseFloat(
        String(trip["billedAmount"]).split(",").join("")
      );
    }
  });

  // get driversId/details from the getDriver function and push them into the driverDetails array

  let driverDetails = [];
  for (let driverId of driverIds) {
    driverDetails.push(getDriver(driverId));
  }

  let moreThanOneVehicleCount = 0;
  let promiseDriverInfos = await Promise.allSettled(driverDetails);

  //getting drivers status that are fulfilled
  let fulfilledDriverInfos = promiseDriverInfos.filter(
    (driverInfo) => driverInfo.status === "fulfilled"
  );

  //to get drivers with more than one vehicle

  for (let driverInfo in fulfilledDriverInfos) {
    if (fulfilledDriverInfos[driverInfo].value.vehicleID.length > 1) {
      moreThanOneVehicleCount += 1;
    }
  }

  //to get the driver with the most trips

  let highestTrips = Object.values(driverTrips);
  let maxTrips = Math.max(...highestTrips);
  let index = highestTrips.indexOf(maxTrips);

  //to get the driver with the most earnings
  let highestEarnings = Object.values(driverEarnings);
  let maxEarnings = Math.max(...highestEarnings);
  let position = highestEarnings.indexOf(maxEarnings);

  let result = {};
  result["noOfCashTrips"] = cashCount;

  result["noOfNonCashTrips"] = nonCashCount;

  result["billedTotal"] = Number((cashAmount + nonCashAmount).toFixed(2));

  result["cashBilledTotal"] = +cashAmount.toFixed(2);

  result["nonCashBilledTotal"] = +nonCashAmount.toFixed(2);

  result["noOfDriversWithMoreThanOneVehicle"] = moreThanOneVehicleCount;

  result["mostTripsByDriver"] = {};

  result["mostTripsByDriver"]["name"] =
    fulfilledDriverInfos[index].value["name"];

  result["mostTripsByDriver"]["email"] =
    fulfilledDriverInfos[index].value["email"];

  result["mostTripsByDriver"]["phone"] =
    fulfilledDriverInfos[index].value["phone"];

  result["mostTripsByDriver"]["noOfTrips"] = maxTrips;
  result["mostTripsByDriver"]["totalAmountEarned"] = highestEarnings[index];

  result["highestEarningDriver"] = {};

  result["highestEarningDriver"]["name"] =
    fulfilledDriverInfos[position].value["name"];

  result["highestEarningDriver"]["email"] =
    fulfilledDriverInfos[position].value["email"];

  result["highestEarningDriver"]["phone"] =
    fulfilledDriverInfos[position].value["phone"];

  result["highestEarningDriver"]["noOfTrips"] = highestTrips[position];
  result["highestEarningDriver"]["totalAmountEarned"] = maxEarnings;

  return result;
}
analysis();

module.exports = analysis;
