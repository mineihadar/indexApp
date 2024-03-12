import React, { useState } from "react";
import "./radiobuttondad.css";
const RadioButtonDad = ({ selectedOption, setSelectedOption }) => {
  const options = {
    0: {
      heb: "ללא",
    },
    1: {
      heb: "דמיון",
    },
    2: {
      heb: "שוני",
    },
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  return (
    <div className='eight-option-radio'>
      <div className='options-container'>
        <div className='option-row'>
          {[0, 1, 2].map((option) => (
            <label key={option} className='option-label'>
              <input
                type='radio'
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className='option-radio-dad'
              />
              <span className='option-text' checked={selectedOption === option}>
                {options[option]["heb"]}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadioButtonDad;
