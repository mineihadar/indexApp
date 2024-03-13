import React, { useState, useEffect } from "react";
import "./App.css";
import SketchGraph from "./processing/SketchFinalFinalGraph";
import Dropdown from "./Dropdown";
import Menu from "./components/Menu";
import RadioButton from "./components/RadioButton";
import RadioButtonMom from "./components/RadioButtonMom";
import RadioButtonDad from "./components/RadioButtonDad";
import Legend from "./components/Legend";
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
        <div style={{ height: "120px" }}></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                right: "650px",
                top: "860px",
              }}>
              <Legend
                text='את.ה'
                color='#7D498E'
                size='25px'
                isOutline={false}
              />
              <Legend
                text='סינון'
                color='#fdfdfd'
                size='25px'
                isOutline={false}
              />
              <Legend
                text='כל השאר'
                color='none'
                size='25px'
                isOutline={false}
              />
            </div>
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
          </div>
          <SketchGraph
            dad_score={sameDad}
            mom_score={sameMom}
            order_val={selectedCluster}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
