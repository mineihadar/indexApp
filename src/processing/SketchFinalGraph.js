import React, {useState} from "react";
import Sketch from "react-p5";
import info from "../new_info.json";
import {groupFilters} from "../helpers/groupFilters";

// TODO temp- this I need to get from outside
// score = 0: none
// score = 1: similarity
// score = 2: difference
let dad_score = 0;
let mom_score = 1;
let filter = true;
let order_val = "Sex";

// Constance
let regularDotRadius = 4;
let regularDotSpeed = 0.05;
let myDotRadius = 6;
let myDotSpeed = 0.01;
let IN_FILTER = 0;
let OUT_FILTER = 1;

// bg color
let bgColor;
let dotInitializeColor;
let myDotColor;
let inFilterColor;
let outOfFilterColor;
let optionsColors = [];

// general
let first = true;

// array of dots
// allDots[0]- me!
let allDots = [];
let allDotsInFilter;

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
    this.cur_filter = 0;
    this.cur_order = 0;
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
    bgColor = p5.color(237, 245, 242);
    dotInitializeColor = p5.color(217,217,217);
    myDotColor = p5.color(28, 0, 86);
    inFilterColor = p5.color(70, 27, 123);
    outOfFilterColor = p5.color(139,126,170);


    optionsColors.push(p5.color(198, 208, 87));
    optionsColors.push(p5.color(82, 62, 205));
    optionsColors.push(p5.color(125, 20, 0));
    optionsColors.push(p5.color(102, 51, 81));
    optionsColors.push(p5.color(125, 93, 94));
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
   * @param minRadius - min radius of the big circle that the dots can be on
   * @param maxRadius - max radius of the big circle that the dots can be on
   * @param curOrder - dot cluster index
   * @param dotsInSectionArr - amount of don't in this dot section
   * * * @returns {DotCoords}
   */
  function chooseCoordsOnShape(p5, minRadius, maxRadius, curOrder, dotsInSectionArr) {

    let radius = p5.random(minRadius, maxRadius);
    let angle = p5.random(0, p5.TWO_PI);
    let x, y;

    if (dotsInSectionArr.length === 1){ // without inner order
      // Convert polar coordinates to Cartesian coordinates
      x = (p5.width / 2) + radius * p5.cos(angle);
      y = (p5.height / 2) + radius * p5.sin(angle);
    }
    else{
      // Pie chart
      /*
      let angleGap = 10;
      let dotAngle = 360 / allDotsInFilter;
      let sectionAngle = dotAngle * dotsInSectionArr[curOrder] - angleGap;
      let startAngle = 0;
      for (let i= 0; i < curOrder; i++){
        startAngle += dotAngle * dotsInSectionArr[i];
      }
      let endAngle = startAngle + sectionAngle;

      // Generate a random angle within the section's range
      const randomAngle = Math.random() * (endAngle - startAngle) + startAngle;

      // Convert polar coordinates to Cartesian coordinates
      x = (p5.width / 2) + radius * Math.cos(p5.radians(randomAngle));
      y = (p5.height / 2) + radius * Math.sin(p5.radians(randomAngle));
*/
      // batches
      let dotAngle = 360 / allDotsInFilter;
      let sectionAngle = dotAngle * dotsInSectionArr[curOrder];
      let startAngle = 0;
      for (let i= 0; i < curOrder; i++){
        startAngle += dotAngle * dotsInSectionArr[i];
      }

      let dx = (p5.width / 2) + maxRadius * Math.cos(p5.radians(startAngle + (sectionAngle / 2)));
      let dy = (p5.height / 2) + maxRadius * Math.sin(p5.radians(startAngle + (sectionAngle / 2)));

      let dotSpace = (p5.TWO_PI * maxRadius) / allDotsInFilter;
      let sectionSpace = dotSpace * dotsInSectionArr[curOrder];

      let sectionRadius = p5.random(5, sectionSpace / 5);

      // Convert polar coordinates to Cartesian coordinates
      x = dx + sectionRadius * Math.cos(angle);
      y = dy + sectionRadius * Math.sin(angle);

    }
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
    let curDotCoords;

    // create a dot for each person
    // initialize all dots and add to an array
    for (let i = 0; i < dotsAmount - 1; i++) {
      let overlapping = true;
      while (overlapping === true) {
        // assuming not overlapping
        overlapping = false;

        // get coords for this dot
        curDotCoords = chooseCoordsOnShape(p5, 10, p5.height / 2, 1,  [1]);

        // see if the coords won't create a dot that is overlapping with other dots
        overlapping = checkOverlapping(p5, curDotCoords, regularDotRadius, allDots.length);
      }

      let r = regularDotRadius;
      // TODO for now the special are the Work_Type_Dad=design but need to add to csv if have picture
      if (info[i].Work_Type_Dad === "Design"){
        r = myDotRadius;
      }
      // found coords that are not overlapping! create a new dot
      allDots.push(
        new DotObject(
          curDotCoords.x,
          curDotCoords.y,
            r,
          dotInitializeColor,
          regularDotSpeed
        )
      );
    }

    // create a dot for my answers
    let overlapping = true;
    while (overlapping === true) {
      curDotCoords = chooseCoordsOnShape(p5, 10, p5.height / 2, 1, [1]);
      overlapping = checkOverlapping(p5, curDotCoords, regularDotRadius, allDots.length);
    }
    allDots.push(
        new DotObject(
            curDotCoords.x,
            curDotCoords.y,
            myDotRadius,
            myDotColor,
            myDotSpeed
        )
    );


    // draw all the dots
    initDrawDots(p5);
  }

  /**
   * choose new coords for a dot
   * @param p5
   * @param dot - dot object
   * @param dotIndexInAllDots - the index of this dot in the allDots array
   * @param arriveFromOrder -did we get here from the order function?
   * @param dotsInSectionArr - TODO
   * * * (to check if not overlapping with dots that are already have new coords)
   */
  function updateDotNewPosition(p5, dot, dotIndexInAllDots, arriveFromOrder, dotsInSectionArr) {
    let newDotCoords;
    let overlapping = true;

    // if we arrived from order we don't want to move the dots that are out of the filter
    if (dot.cur_filter === OUT_FILTER && arriveFromOrder) {
      return;
    }

      while (overlapping === true) {
      // assuming not overlapping
      overlapping = false;

      // get new coords for this dot
      let min_radius, max_radius;
      if (dot.cur_filter === IN_FILTER){
        min_radius = 40;
        max_radius = p5.height / 5;
      }
      if (dot.cur_filter === OUT_FILTER){
        min_radius = p5.height / 3;
        max_radius = p5.height / 2 - 20;
      }

      newDotCoords = chooseCoordsOnShape(p5, min_radius, max_radius, dot.cur_order, dotsInSectionArr);

      // see if the coords won't create a dot that is overlapping with other dots
      overlapping = checkOverlapping(p5, newDotCoords, dot.r, dotIndexInAllDots);
    }

    // found coords that are not overlapping! change the coords
    dot.updateCurCoords(newDotCoords);
  }

  /**
   * Update for do in dotIndex if it's in the filter or not
   * It depends on whether we care about this filter (mom_score and dad_score)
   * and if it answers the need to be in that filter is so
   */
  function chooseFilters(dotIndex){
    // score = 0: none
    // score = 1: similarity
    // score = 2: difference

    allDots[dotIndex].cur_filter = OUT_FILTER; // otherwise-out of filter

    if (dad_score === 0 && mom_score === 0){ // dad doesn't matter, mom doesn't matter
      allDots[dotIndex].cur_filter = IN_FILTER;
      return;
    }
    if (dad_score === 1 && mom_score === 0) { // similarity to dad, mom doesn't matter
      if (info[dotIndex]["Similarity_Dad"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 0) { // difference from dad, mom doesn't matter
      if (info[dotIndex]["Difference_Dad"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 0 && mom_score === 1) { // dad doesn't matter, similarity to mom
      if (info[dotIndex]["Similarity_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 1 && mom_score === 1) { // similarity to dad, similarity to mom
      if (info[dotIndex]["Similarity_Dad"] >= 50 && info[dotIndex]["Similarity_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 1) { // difference from dad, similarity to mom
      if (info[dotIndex]["Difference_Dad"] >= 50 && info[dotIndex]["Similarity_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 0 && mom_score === 2) { // dad doesn't matter, difference from mom
      if (info[dotIndex]["Difference_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 1 && mom_score === 2) { // similarity to dad, difference from mom
      if (info[dotIndex]["Similarity_Dad"] >= 50 && info[dotIndex]["Difference_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 2) { // difference from dad, difference from mom
      if (info[dotIndex]["Difference_Dad"] >= 50 && info[dotIndex]["Difference_Mom"] >= 50)
      {
        allDots[dotIndex].cur_filter = IN_FILTER;
      }
    }
  }

  /**
   * filter all the dots to- in and out
   * @param p5
   */
  function filterDots(p5) {
    for (let i = 0; i < allDots.length; i++) {
     // is the dot in the filter or out of the filter
      chooseFilters(i);

      // zero the order
      if (i !== allDots.length-1)
      {
        if (allDots[i].cur_filter === IN_FILTER)
        {
          allDots[i].color = inFilterColor;
        }
        else {
          allDots[i].color = outOfFilterColor;
        }
      }
      allDots[i].cur_order = 0;

      // update dot coords
      updateDotNewPosition(p5, allDots[i], i, false, [1]);
    }
  }

  function orderDots(p5) {
    allDotsInFilter = 0;
    // array of results of current category
    let category_arr = [];
    let category_amount_arr = [];
    console.log(category_arr);

    // How many answer do I have? and update the current order for each dot
    for (let i = 0; i < allDots.length; i++) {
      // NOTE that this order the batches order according to what come first,
      // so if we have something with numeric values, then this won't necessarily be dispelled by order

      let res = info[i][order_val];

      if (allDots[i].cur_filter === IN_FILTER){
        allDotsInFilter++;

        // if this is the first time we saw this category
        if (!category_arr.includes(res)) {
          category_arr.push(res);
          category_amount_arr.push(1); // first category result
        }
        else
        {
          category_amount_arr[category_arr.indexOf(res)]++; // add one to category
        }
      }

      // get the index for this category and update it in the current dot
      allDots[i].cur_order = category_arr.indexOf(res);
    }

      for (let i = 0; i < allDots.length; i++) {
        // change color to category color (but the last one which is you)
        if (allDots[i].cur_filter === IN_FILTER && i !== (allDots.length -1))
        {
          allDots[i].color = optionsColors[category_arr.indexOf(info[i][order_val])];
        }
        // update dot coords
        updateDotNewPosition(p5, allDots[i], i, true, category_amount_arr);
    }
  }


  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      show && initializeDots(p5, info.length);
      first = false;
    }

    // filter dots
    // TODO this when I'll have the bool from Hadar
    // if (isFilterDots) {
    //   show && filterDots(p5);
    //   setIsFilterDots(false);
    // }

    // temp filter dots
    if (filter) {
      show && filterDots(p5);
      filter = false;
    }

    // order dots
     if (isOrderDots) {
       show && orderDots(p5);
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
