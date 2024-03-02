import React from "react";

export default ({ parent, setSameVar, filter }) => {
  const changeFilter = (e) => {
    setSameVar(filter[e.target.value]);
  };

  return (
    <div>
      <select name='filter' id='filter' onChange={changeFilter}>
        <option value='none'>None {parent}</option>
        <option value='same'>Similar To {parent}</option>
        <option value='different'>Different From {parent}</option>
      </select>
    </div>
  );
};
