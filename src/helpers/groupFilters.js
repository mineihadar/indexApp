const info = require("../info.json");

export function groupFilters(filters) {
  const groups = {};
  let groupIndex = 0;
  for (let ans of info) {
    const filterAnswers = filters.map((filter) => ans[filter]).join("&");
    if (!groups.hasOwnProperty(filterAnswers)) {
      groups[filterAnswers] = groupIndex;
      groupIndex++;
    }
  }
  return groups;
}
