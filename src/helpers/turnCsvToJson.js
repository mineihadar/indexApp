const fs = require("fs");
const Papa = require("papaparse");
const csvFilePath =
  "/Users/hadar/Desktop/Bezalel/Fifth Year/index-app/src/newer_info.csv";
const jsonFilePath = "./src/newer_info.json";

const csvfile = fs.createReadStream(csvFilePath);
const jsonFile = fs.createWriteStream(jsonFilePath);

console.log(`Parsing ${csvfile} into ${jsonFile}`);
var csvData = [];

Papa.parse(csvfile, {
  header: true,
  step: function (result) {
    csvData.push(result.data);
  },
  complete: function () {
    let jsonString = JSON.stringify(csvData);
    jsonFile.write(jsonString);
    console.log("Complete", csvData.length, "records.");
  },
});
