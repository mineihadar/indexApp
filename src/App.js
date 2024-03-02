import React, { useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import SketchGraph from "./processing/SketchFinalGraph";
import Dropdown from "./Dropdown";
function App() {
  const filter = {
    none: 0,
    same: 1,
    different: 2,
  };
  const [sameMom, setSameMom] = useState(filter.none);
  const [sameDad, setSameDad] = useState(filter.none);

  return (
    <div className='App'>
      <h1>hello</h1>
      <div style={{ display: "flex", marginLeft: "30px" }}>
        <Dropdown parent={"Mom"} setSameVar={setSameMom} filter={filter} />
        <Dropdown parent={"Dad"} setSameVar={setSameDad} filter={filter} />
        <p>{sameDad}</p>
        <p>{sameMom}</p>
      </div>
      <SketchGraph dad_score={sameDad} mom_score={sameMom} />
    </div>
  );
}

export default App;
