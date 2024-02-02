import React, { useState } from "react";
import Sketch from "react-p5";
import info from "./info.json";
// import myInfo from "./myInfo.json";

// Constance
let regularDotRadius = 3;
let regularDotSpeed = 0.05;
let myDotRadius = 5;
let myDotSpeed = 0.01;

// bg color
let bgColor;
let dotInitializeColor;
let myDotColor;
let optionsColors = [];

// general
let first = true;

// array of dots
// allDots[0]- me!
let allDots = [];

class DotCoords {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// our circle object
class DotObject {

  constructor(x, y, r, color, s) {
    this.cur_coords = new DotCoords(x, y);
    this.next_coords = new DotCoords(x, y);
    this.cur_index = 0;
    this.r = r;
    this.color = color;
    this.speed = s;
  }

  updateCurCoords(newCoords){
    this.next_coords = newCoords;
  }

  drawThisDot(p5){
    p5.fill(this.color);
    p5.ellipse(this.cur_coords.x, this.cur_coords.y, this.r * 2, this.r * 2);
  }
}

export default () => {

  // State controlled by button press
  const [isOrderDots, setIsOrderDots] = useState(false);

  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(1500, 800).parent(canvasParentRef);
    bgColor = p5.color(252, 236, 210);
    dotInitializeColor = p5.color(255);
    myDotColor = p5.color(0);
    optionsColors.push(p5.color(228, 171, 135));
    optionsColors.push(p5.color(176, 186, 135));
    optionsColors.push(p5.color(156, 113, 136));
    optionsColors.push(p5.color(82, 129, 184));
    optionsColors.push(p5.color(197, 149, 96));
    //TODO need different colors

    optionsColors.push(p5.color(228, 171, 135));
    optionsColors.push(p5.color(176, 186, 135));
    optionsColors.push(p5.color(156, 113, 136));
    optionsColors.push(p5.color(82, 129, 184));
    optionsColors.push(p5.color(197, 149, 96));

    optionsColors.push(p5.color(228, 171, 135));
    optionsColors.push(p5.color(176, 186, 135));
    optionsColors.push(p5.color(156, 113, 136));
    optionsColors.push(p5.color(82, 129, 184));
    optionsColors.push(p5.color(197, 149, 96));

    optionsColors.push(p5.color(228, 171, 135));
    optionsColors.push(p5.color(176, 186, 135));
    optionsColors.push(p5.color(156, 113, 136));
    optionsColors.push(p5.color(82, 129, 184));
    optionsColors.push(p5.color(197, 149, 96));

    optionsColors.push(p5.color(228, 171, 135));
    optionsColors.push(p5.color(176, 186, 135));
    optionsColors.push(p5.color(156, 113, 136));
    optionsColors.push(p5.color(82, 129, 184));
    optionsColors.push(p5.color(197, 149, 96));
    p5.background(bgColor);

  };

  /**
   * choose the coordinates in circle, according the index of the dot
   * (in witch circle it need to be) and the amount of circles
   * @param p5
   * @param shapeAmount
   * @param shapeIndex - the index of the circle that the dot need to be in
   * @returns {DotCoords}
   */
  function chooseCoordsOnShape(p5, shapeAmount, shapeIndex) {
    // choose offset on the shape (which is for now- a circle) according to amount of shapes
    let offsetX =  p5.width * ( (shapeIndex + 1) / (shapeAmount + 1));
    let offsetY =  p5.height / 2;

    // choose random x,y on a circle
    // TODO maybe the size can be better
    let radius = p5.random(10, (p5.width / (3 * shapeAmount))  ); // Adjust the radius range as needed
    let angle = p5.random(0, p5.TWO_PI);

    // Convert polar coordinates to Cartesian coordinates
    let x = offsetX + radius * p5.cos(angle);
    let y = offsetY + radius * p5.sin(angle);

    return new DotCoords(x, y,);
  }

  /**
   * initialize dots with default colors and radius
   * making sure they are not overlapping
   * @param p5
   * @param dotsAmount - the amount of dots to initialize
   */
  function initializeDots(p5, dotsAmount) {
    let d;
    let curDotCoords;

    // create a dot for my answers
    curDotCoords = chooseCoordsOnShape(p5, 1, 0);
    allDots.push(new DotObject(curDotCoords.x, curDotCoords.y, myDotRadius, myDotColor, myDotSpeed));


    // create a dot for each person
    // initialize all dots and add to an array
    for (let i=0; i<dotsAmount ;i++){

      let overlapping = true;
      while (overlapping === true){
        // assuming not overlapping
        overlapping = false;

        // get coords for this dot
        curDotCoords = chooseCoordsOnShape(p5, 1, 0);

        // see if the coords won't create a dot that is overlapping with other dots
        for (let j = 0; j < allDots.length; j++){
          let other = allDots[j];
          d = p5.dist(curDotCoords.x, curDotCoords.y, other.cur_coords.x, other.cur_coords.y);
          // overlap
          if (d < regularDotRadius + other.r) {
            overlapping = true;
            break;
          }
        }

      }

      // found coords that are not overlapping! create a new dot
      allDots.push(new DotObject(curDotCoords.x, curDotCoords.y, regularDotRadius, dotInitializeColor, regularDotSpeed));
    }

    // draw all the dots
    initDrawDots(p5);
  }

  /**
   * draw all the dots according to cur_coords
   * @param p5
   */
  function initDrawDots(p5){
    // draw the dots
    p5.noStroke();
    for (let i = 0; i < allDots.length; i++) {
      p5.fill(allDots[i].color);
      allDots[i].drawThisDot(p5);
    }
  }

  /**
   * check if the dot needs to be moved, calculate the new location and redraw it
   * @param p5
   */
  function drawDots(p5){
    for (let i=0; i<allDots.length; i++){
      // check if this dot need to be updated

      let dot = allDots[i];
      // Move the point towards point B
      let deltaX = dot.next_coords.x - dot.cur_coords.x;
      let deltaY = dot.next_coords.y - dot.cur_coords.y;
      dot.cur_coords.x += deltaX * dot.speed;
      dot.cur_coords.y += deltaY * dot.speed;
      dot.drawThisDot(p5);
    }
  }

  /**
   * choose new coords for a dot
   * @param p5
   * @param dot - dot object
   * @param shapeAmount - amount of shapes that this filter applies
   * @param dotIndexInAllDots - the index of this dot in the allDots array
   * (to check if not overlapping with dots that are already have new coords)
   */
  function updateDotNewPosition(p5, dot, shapeAmount, dotIndexInAllDots){
    let newDotCoords;
    let d;
    let overlapping = true;

    while (overlapping === true){
      // assuming not overlapping
      overlapping = false;

      // get new coords for this dot
      newDotCoords = chooseCoordsOnShape(p5, shapeAmount, dot.cur_index);

      // see if the coords won't create a dot that is overlapping with other dots
      for (let j = 0; j < dotIndexInAllDots; j++){
        let other = allDots[j];
        d = p5.dist(newDotCoords.x, newDotCoords.y, other.cur_coords.x, other.cur_coords.y);
        // overlap
        if (d < dot.r + other.r) {
          overlapping = true;
          break;
        }
      }
    }

    // found coords that are not overlapping! change the coords
    dot.updateCurCoords(newDotCoords);
  }


  function filterDots(p5, propertyToAccess) {
    // what is the variety of answers and ho many of each
    let answers = [];
    for (let i = 0; i < info.length; i++) {
      let curIndex = answers.indexOf(info[i][propertyToAccess]);
      if (curIndex === -1){
        answers.push(info[i][propertyToAccess]);
      }
    }

    // update first dot
    allDots[0].cur_index = answers.indexOf(info[0][propertyToAccess]);
    // updateDotCoords
    updateDotNewPosition(p5, allDots[0], answers.length, 0);

    // update all the coords
    for (let i=0; i<allDots.length - 1; i++) {
      // update the index for this dot
      allDots[i + 1].cur_index = answers.indexOf(info[i][propertyToAccess]);

      // updateDotCoords
      updateDotNewPosition(p5, allDots[i + 1], answers.length, i);
      // change dot color
      allDots[i + 1].color = optionsColors[allDots[i + 1].cur_index];
    }
  }

  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      show && initializeDots(p5, info.length);
      first = false;
    }

    if (isOrderDots) {
      show && filterDots(p5, "Work_Type_Child");
      setIsOrderDots(false);
    }

    //draw
    p5.background(bgColor);
    drawDots(p5);

    // TODO try with different colors for each circle
    // TODO do I output the colors? do i get the colors?
    // TODO how to do multiple filters?
    // TODO how do i get the filter?
  };

  return (
      <div>
        <button onClick={() => setIsOrderDots(true)}>Rearrange</button>
        <Sketch setup={setup} draw={draw} />
      </div>
  );};
