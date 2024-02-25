const fs = require("fs");

const jsonFilePath = "./src/new_info.json";
const info = require("../new_info.json");

//const jsonFile = fs.createWriteStream(jsonFilePath);

const categories = [
  "Social_Work_Place_",
  "Work_Life_Balance_",
  "Social_Influence_",
  "Diversed_Job_",
  "Office_Nature_",
  "Job_Security_",
  "Specific_Training_",
  "Social_Benefits_",
  "Working_Hours_",
];

parents = ["Dad", "Mom"];

for (obj of info) {
  for (person of parents) {
    let grade = 0;
    var differences = categories.map((category) =>
      Math.abs(obj[category + person] - Math.abs(obj[category + "Child"]))
    );
    let categoryGrade =
      obj["Work_Category_Child"] === obj["Work_Category_" + person] ? 0 : 4;
    differences.push(categoryGrade);
    differences.forEach((difference) => (grade += difference));
    var difference = ((100 * grade) / 18).toFixed(2);
    var similarity = (100 - difference).toFixed(2);
    obj["Similarity_" + person] = similarity;
    obj["Difference_" + person] = difference;
  }
}
let jsonString = JSON.stringify(info);
//jsonFile.write(jsonString);

fs.writeFile(jsonFilePath, jsonString, function (err) {
  if (err) {
    console.log(err);
  }
});
