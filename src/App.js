import React, { useState, useEffect } from "react";
import "./App.css";
import SketchGraph from "./processing/SketchFinalFinalGraph";
import Dropdown from "./Dropdown";
import Menu from "./components/Menu";
import RadioButton from "./components/RadioButton";
import RadioButtonMom from "./components/RadioButtonMom";
import RadioButtonDad from "./components/RadioButtonDad";
function App() {
  const filter = {
    none: 0,
    same: 1,
    different: 2,
  };
  const [sameMom, setSameMom] = useState(filter.none);
  const [sameDad, setSameDad] = useState(filter.none);

  useEffect(() => setSelectedCluster("None"), [sameDad, sameMom]);
  const [selectedCluster, setSelectedCluster] = useState("None");
  return (
    <div className='App'>
      <div className='background-image'>
        <Menu />
        <RadioButtonMom
          selectedOption={sameMom}
          setSelectedOption={setSameMom}
        />
        <RadioButtonDad
          selectedOption={sameDad}
          setSelectedOption={setSameDad}
        />
        <RadioButton
          selectedOption={selectedCluster}
          setSelectedOption={setSelectedCluster}
        />
        <SketchGraph
          dad_score={sameDad}
          mom_score={sameMom}
          order_val={selectedCluster}
        />
      </div>
    </div>
  );
}

export default App;
