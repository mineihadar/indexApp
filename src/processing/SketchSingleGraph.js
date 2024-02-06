import React, {useState} from "react";
import Sketch from "react-p5";
import info from "../info.json";
import {groupFilters} from "../helpers/groupFilters";

//Filters
let filters = ["Closeness_To_Mom", "Closeness_To_Dad"];

// Constance
let regularDotRadius = 3;
let regularDotSpeed = 0.05;
let myDotRadius = 5;
let myDotSpeed = 0.01;
let IN_INDEX = 0;
let OUT_INDEX = 1;

// bg color
let bgColor;
let dotInitializeColor;
let myDotColor;
let inFilterColor;
let outOfFilterColor;

// general
let first = true;
let moveEverytime = true;

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

  updateCurCoords(newCoords) {
    this.next_coords = newCoords;
  }

  drawThisDot(p5) {
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
    dotInitializeColor = p5.color(197, 149, 96);
    myDotColor = p5.color(0);
    inFilterColor = p5.color(228, 171, 135);
    outOfFilterColor = p5.color(82, 129, 184);

    p5.background(bgColor);
  };

  /**
   * draw all the dots according to cur_coords
   * @param p5
   */
  function initDrawDots(p5) {
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
  function drawDots(p5) {
    for (let i = 0; i < allDots.length; i++) {
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
   * choose the coordinates on inner or outer circle, according to the radius
   * @param p5
   * @param min_radius - min radius of the big circle that the dots can be on
   * @param max_radius - max radius of the big circle that the dots can be on
   * * @returns {DotCoords}
   */
  function chooseCoordsOnShape(p5, min_radius, max_radius) {

    let radius = p5.random(min_radius, max_radius);
    let angle = p5.random(0, p5.TWO_PI);

    // Convert polar coordinates to Cartesian coordinates
    let x = (p5.width / 2) + radius * p5.cos(angle);
    let y = (p5.height / 2) + radius * p5.sin(angle);

    return new DotCoords(x, y);
  }

  /**
   * Check if the new dot coords are overlapping previous dots
   * @param p5
   @param newDotCoords - the new coords
   @param newDotR - the new dot radius
   * @param dotIndexInAllDots - the index of the current dot
   * @returns {boolean}
   */
  function checkOverlapping(p5, newDotCoords, newDotR, dotIndexInAllDots){
    for (let j = 0; j < dotIndexInAllDots; j++) {
      let other = allDots[j];
      let d = p5.dist(
          newDotCoords.x,
          newDotCoords.y,
          other.cur_coords.x,
          other.cur_coords.y
      );
      // overlap
      if (d < newDotR + other.r) {
        return true;
      }
    }
    return false;
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
    curDotCoords = chooseCoordsOnShape(p5, 10, p5.height / 2);
    allDots.push(
      new DotObject(
        curDotCoords.x,
        curDotCoords.y,
        myDotRadius,
        myDotColor,
        myDotSpeed
      )
    );

    // create a dot for each person
    // initialize all dots and add to an array
    for (let i = 0; i < dotsAmount; i++) {
      let overlapping = true;
      while (overlapping === true) {
        // assuming not overlapping
        overlapping = false;

        // get coords for this dot
        curDotCoords = chooseCoordsOnShape(p5, 10, p5.height / 2);

        // see if the coords won't create a dot that is overlapping with other dots
        overlapping = checkOverlapping(p5, curDotCoords, regularDotRadius, allDots.length);
      }

      // found coords that are not overlapping! create a new dot
      allDots.push(
        new DotObject(
          curDotCoords.x,
          curDotCoords.y,
          regularDotRadius,
          dotInitializeColor,
          regularDotSpeed
        )
      );
    }

    // draw all the dots
    initDrawDots(p5);
  }

  /**
   * choose new coords for a dot
   * @param p5
   * @param dot - dot object
   * @param dotIndexInAllDots - the index of this dot in the allDots array
   * (to check if not overlapping with dots that are already have new coords)
   */
  function updateDotNewPosition(p5, dot, dotIndexInAllDots) {
    // TODO add the num of dots in current filter to size the inner and outer circle
    let newDotCoords;
    let d;
    let overlapping = true;

    while (overlapping === true) {
      // assuming not overlapping
      overlapping = false;

      // get new coords for this dot
      let min_radius, max_radius; // TODO update this according to amount of dots in current filter
      if (dot.cur_index === IN_INDEX){
        min_radius = 10;
        max_radius = p5.height / 6;
      }
      if (dot.cur_index === OUT_INDEX){
        min_radius = p5.height / 4;
        max_radius = p5.height / 2;
      }

      newDotCoords = chooseCoordsOnShape(p5, min_radius, max_radius, dot.cur_index);

      // see if the coords won't create a dot that is overlapping with other dots
      overlapping = checkOverlapping(p5, newDotCoords, dot.r, dotIndexInAllDots);
    }

    // found coords that are not overlapping! change the coords
    dot.updateCurCoords(newDotCoords);
  }

  function filterDots(p5) {
    // what is the variety of answers
    let groups = groupFilters(filters);

    // TODO get the amount of dot in the filter- in order to size the inner circle

    // place the first dot, using the groups object
    // TODO- change this to really get if in the filter or out of the filter
    let first_index = groups[filters.map((filter) => info[0][filter]).join("&")];
    if (first_index > 0){
      first_index = 1;
    }

    if (allDots[0].cur_index === first_index){

    }
    
    allDots[0].cur_index = first_index;

    // updateDotCoords
    updateDotNewPosition(p5, allDots[0], 0);

    // update all the coords
    for (let i = 0; i < allDots.length - 1; i++) {
      // update the index for this dot

      // TODO- change this to really get if in the filter or out of the filter
      let cur_index = groups[filters.map((filter) => info[i][filter]).join("&")];
      if (cur_index > IN_INDEX){ // in filter
        cur_index = OUT_INDEX;
        allDots[i + 1].color = inFilterColor; // change dot color
      }
      else // out of filter
      {
        allDots[i + 1].color = outOfFilterColor; // change dot color
      }
      allDots[i + 1].cur_index = cur_index;

      // updateDotCoords
      updateDotNewPosition(p5, allDots[i + 1], i);
    }
  }

  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      show && initializeDots(p5, info.length);
      first = false;
    }

    if (isOrderDots) {
      show && filterDots(p5);
      setIsOrderDots(false);
    }

    //draw
    p5.background(bgColor);
    drawDots(p5);
  };

  return (
    <div>
      <button onClick={() => setIsOrderDots(true)}>Rearrange</button>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
};
