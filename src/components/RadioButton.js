import React, { useState } from "react";
import "./radiobutton.css";
const RadioButton = ({
  name,
  id,
  value,
  checked,
  text,
  selectedOption,
  setSelectedOption,
}) => {
  const options = {
    1: {
      value: "None",
      heb: "ללא",
    },
    2: {
      value: "Sex",
      heb: "מין",
    },
    3: {
      value: "Age",
      heb: "גיל",
    },
    4: {
      value: "Work_Category_Child",
      heb: "עבודה ילד",
    },
    5: {
      value: "Work_Category_Mom",
      heb: "עבודה אמא",
    },
    6: {
      value: "Work_Category_Dad",
      heb: "עבודה אבא",
    },
    7: {
      value: "Closeness_To_Dad",
      heb: "קרבה אבא",
    },
    8: {
      value: "Closeness_To_Mom",
      heb: "קרבה אמא",
    },
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  return (
    <div className='eight-option-radio'>
      <div className='options-container'>
        <div className='option-row'>
          {[1, 2, 3].map((option) => (
            <label key={option} className='option-label'>
              <input
                type='radio'
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className='option-radio'
              />
              <span className='option-text' checked={selectedOption === option}>
                {options[option]["heb"]}
              </span>
            </label>
          ))}
        </div>
        <div className='option-row'>
          {[4, 5, 6].map((option) => (
            <label key={option} className='option-label'>
              <input
                type='radio'
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className='option-radio'
              />
              <span className='option-text'> {options[option]["heb"]}</span>
            </label>
          ))}
        </div>
        <div className='option-row'>
          {[7, 8].map((option) => (
            <label key={option} className='option-label'>
              <input
                type='radio'
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className='option-radio'
              />
              <span className='option-text'> {options[option]["heb"]}</span>
            </label>
          ))}
        </div>
      </div>
      <p className='selected-option'>Selected Option: {selectedOption}</p>
    </div>
  );
};

export default RadioButton;
