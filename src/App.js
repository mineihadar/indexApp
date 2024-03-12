import React, { useState } from "react";
import "./App.css";
import SketchGraph from "./processing/SketchFinalFinalGraph";
import Dropdown from "./Dropdown";
import Menu from "./components/Menu";
import RadioButton from "./components/RadioButton";

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
      <Menu />
      <RadioButton />
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
