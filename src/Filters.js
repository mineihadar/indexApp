import React, { useState } from "react";

export default function MultiSelect({
  options = ["Closeness_To_Mom", "Closeness_To_Dad"],
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div>
      <label>Select options:</label>
      <select multiple value={selectedOptions} onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>Selected options: {selectedOptions.join(", ")}</p>
    </div>
  );
}
