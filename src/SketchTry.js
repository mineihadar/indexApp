import React from "react";
import Sketch from "react-p5";
import info from "./info.json";

export default () => {
  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(1500, 800).parent(canvasParentRef);

    //table = p5.loadTable("cidades.csv", "csv");
  };

  function generateRect(p5) {
    for (var i = 0; i < info.length; i++) {
      let height = info[i].Closeness_To_Dad * 100;
      p5.fill(123, 243, 123);
      p5.noStroke();
      p5.rect(i * 25 + 30, 100, 10, height);
    }
  }

  const draw = (p5, show = true) => {
    p5.background(255, 124, 134);
    show && generateRect(p5);
  };

  return <Sketch setup={setup} draw={draw} />;
};
