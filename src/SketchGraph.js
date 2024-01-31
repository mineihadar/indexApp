import React from "react";
import Sketch from "react-p5";
import info from "./info.json";

// Constance
let regularDotRadius = 3;
let regularDotSpeed = 0.05;

// bg color
let bgColor;
let dotInitializeColor;

// initialize dots
let first = true;
let second = false; // control with outer filter

// array of dots
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
    this.onTheWay = false; // TODO do we need this?
    this.r = r;
    this.color = color;
    this.speed = s;
  }

  updateCurCoords(newCoords){
    this.next_coords = newCoords;
  }

  drawThisDot(p5){
    p5.ellipse(this.cur_coords.x, this.cur_coords.y, this.r * 2, this.r * 2);
  }
}

export default () => {
  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(1500, 800).parent(canvasParentRef);
    bgColor = p5.color(235, 145, 52);
    dotInitializeColor = p5.color(255);

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
    // TODO redo this- the size and offsets need to be more clear
    let offsetX =  p5.width * ( (shapeIndex + 1) / (shapeAmount + 1));
    let offsetY =  p5.height / 2;

    // choose random x,y on a circle
    let radius = p5.random(10, (p5.width / (2 * shapeAmount)) - 50); // Adjust the radius range as needed
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

  function arrangeCircles(p5) {

    // what is the variety of answers and ho many of each
    let answers = [];
    let answersAmount = [];
    for (let i = 0; i < info.length; i++) {
      let curIndex = answers.indexOf(info[i].Closeness_To_Dad);
      if (curIndex === -1){
        answers.push(info[i].Closeness_To_Dad);
        answersAmount.push(1);
        continue;
      }
      answersAmount[curIndex] += 1;
    }

    // update all the coords
    for (let i=0; i<allDots.length; i++) {
      // update the index for this dot
      allDots[i].cur_index = answers.indexOf(info[i].Closeness_To_Dad);

      // updateDotCoords
      updateDotNewPosition(p5, allDots[i], answers.length, i);
    }
  }

  function drawDots(p5){
    // TODO make this calculating stop when all dots are in place
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



  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      show && initializeDots(p5, info.length);
      first = false;
      second = true;
    }

    // update the new coords
    if (second){
      show && arrangeCircles(p5);
      second = false;
    }

    //draw
    p5.background(bgColor);
    drawDots(p5);



    // TODO how do we read states of the filter? what if we have few filters applied?

    // TODO add a nice swipe between prev arrangement to current

    // TODO Need to make sure that calculating only once for each filter change

  };

  return <Sketch setup={setup} draw={draw} />;
};
