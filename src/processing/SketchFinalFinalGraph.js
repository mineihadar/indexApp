import React, { useState } from "react";
import Sketch from "react-p5";
import info from "../new_info.json";

// score = 0: none
// score = 1: similarity
// score = 2: difference
let prev_dad_score = 0;
let prev_mom_score = 0;
// options:
// None
// Sex
// Age
// Work_Category_Child
// Work_Category_Mom
// Work_Category_Dad
// Closeness_To_Dad
// Closeness_To_Mom
//let order_val = "Closeness_To_Mom";
let prev_order_val = "None";

// general
let first = true;

// text
let text = false;
let textSize = 12;
let category_arr = [];
let bigCircleR;

// Constance
let regularDotRadius = 4;
let inFilterDotRadius = 6;
let regularDotSpeed = 0.05;
let myDotRadius = 10;
let myDotSpeed = 0.01;
let IN_FILTER = 0;
let OUT_FILTER = 1;

// color
let bgColor;
let dotInitializeColor;
let myDotColor;
let inFilterColor;
let outOfFilterColor;
let hoverColor;
let font;
let textColor;

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
    this.other_color = color;
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

export default ({ dad_score, mom_score, order_val }) => {
  // State controlled by button press

  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(935, 759).parent(canvasParentRef);

    bigCircleR = p5.height / 2;
    bgColor = p5.color(5, 9, 28);
    dotInitializeColor = p5.color(253, 253, 253);
    myDotColor = p5.color(125, 73, 142);
    inFilterColor = dotInitializeColor;
    outOfFilterColor = bgColor;
    hoverColor = p5.color(119, 180, 228);
    textColor = dotInitializeColor;

    p5.background(bgColor);
  };

  /************************/
  /* dots handle functions /
  /************************/

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
      if (dot.cur_filter === OUT_FILTER) {
        p5.stroke(inFilterColor);
        p5.strokeWeight(1);
      } else {
        p5.noStroke();
      }
      if (info[i].Work_Type_Dad === "Design") {
        dot.r = myDotRadius;
      }

      dot.drawThisDot(p5);
    }
  }

  /**
   * Check if the new dot coords are overlapping previous dots
   * @param p5
   @param newDotCoords - the new coords
   @param newDotR - the new dot radius
   * @param dotIndexInAllDots - the index of the current dot
   * @returns {boolean}
   */
  function checkOverlapping(p5, newDotCoords, newDotR, dotIndexInAllDots) {
    for (let j = 0; j < dotIndexInAllDots; j++) {
      let other = allDots[j];
      let d = p5.dist(
        newDotCoords.x,
        newDotCoords.y,
        other.next_coords.x,
        other.next_coords.y
      );
      // overlap
      if (d < newDotR + other.r) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if our mouse is currently over a dot
   * @param p5
   */
  function checkIfHovering(p5) {
    let x = p5.mouseX;
    let y = p5.mouseY;

    for (let i = 0; i < allDots.length; i++) {
      let curDot = allDots[i];
      if (
        Math.abs(curDot.cur_coords.x - x) <= curDot.r * 2 &&
        Math.abs(curDot.cur_coords.y - y) <= curDot.r * 2
      ) {
        if (curDot.color !== hoverColor) {
          curDot.other_color = curDot.color;
          curDot.color = hoverColor;
        }
      } else {
        curDot.color = curDot.other_color;
      } // set color back
    }
  }

  /************************/
  /* initialize functions */
  /************************/

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
   * initialize dots with default colors and radius
   * making sure they are not overlapping
   * @param p5
   * @param dotsAmount - the amount of dots to initialize
   */
  function initializeDots(p5, dotsAmount) {
    let curDotCoords = new DotCoords(0, 0);

    // create a dot for each person
    // initialize all dots and add to an array
    for (let i = 0; i < dotsAmount - 1; i++) {
      let overlapping = true;
      while (overlapping === true) {
        // assuming not overlapping
        overlapping = false;

        // get coords for this dot
        curDotCoords = chooseCoordsOnShape(p5, 10, p5.height / 2, 1, [1]);

        // see if the coords won't create a dot that is overlapping with other dots
        overlapping = checkOverlapping(
          p5,
          curDotCoords,
          regularDotRadius,
          allDots.length
        );
      }

      let r = regularDotRadius;
      // TODO for now the special are the Work_Type_Dad=design but need to add to csv if have picture
      if (info[i].Work_Type_Dad === "Design") {
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
      overlapping = checkOverlapping(
        p5,
        curDotCoords,
        regularDotRadius,
        allDots.length
      );
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

  /************************/
  /**** order functions ***/
  /************************/
  /**
   * Choose dots position for dots that are out of the filter
   * @param p5
   * @param circleRadius - the radius of the circle that will bound the inner dots
   * @returns {DotCoords} - optional dot coords (without testing for overlapping)
   */
  function chooseCoordsOutOfFilter(p5, circleRadius) {
    while (true) {
      // Generate random point
      let x = p5.random(0, p5.width);
      let y = p5.random(0, p5.height);

      // Check if the point is outside of the circle
      let distance = p5.dist(x, y, p5.width / 2, p5.height / 2);
      if (distance > circleRadius) {
        return new DotCoords(x, y);
      }
    }
  }

  /**
   * Choose dots position for dots that are in the filter
   * * @param p5
   * @param circleRadius the radius of the circle that bounds the ordered dots
   * @param curOrder the order index for current dot
   * @param amountOfOrders amount of existing orders
   * @returns {DotCoords}  optional dot coords (without testing for overlapping)
   */
  function chooseCoordsInFilter(p5, circleRadius, curOrder, amountOfOrders) {
    let centerX = p5.width / 2;
    let centerY = p5.height / 2;
    let circleDiameter = 2 * circleRadius;
    let sideLength = circleDiameter / Math.sqrt(2);
    //let sideLength = circleDiameter - (circleDiameter / 20 );

    if (amountOfOrders === 1) {
      return chooseCoordsInSquare(p5, centerX, centerY, sideLength, sideLength);
    } else {
      /*
    else if (amountOfOrders === 2) {
      if (curOrder === 0) {
        return chooseCoordsInSquare(p5,centerX - (sideLength / 4), centerY, sideLength/ 2, sideLength / 2);
      }
      else if (curOrder === 1) {
        return chooseCoordsInSquare(p5,centerX + (sideLength / 4), centerY, sideLength / 2, sideLength / 2);
      }
    }*/
      // Check if n is a perfect square
      let sqrt = Math.sqrt(amountOfOrders);
      let sqrtBeforeDot = Math.ceil(sqrt);
      let row = Math.ceil((curOrder + 1) / sqrtBeforeDot) - 1;
      let part = ((curOrder + 1) / sqrtBeforeDot) % 1;
      if (part === 0) {
        part = 1;
      }
      let col = part * sqrtBeforeDot - 1;

      let radius = sideLength / sqrtBeforeDot;
      let radius_y;
      // see if the last row is necessary, if not- change the row height
      if (sqrtBeforeDot * sqrtBeforeDot - amountOfOrders >= sqrtBeforeDot) {
        // last row is not necessary
        radius_y = sideLength / (sqrtBeforeDot - 1);
      } else {
        radius_y = radius;
      }

      let leftUpX = centerX - sideLength / 2;
      let leftUpY = centerY - sideLength / 2;
      let x = leftUpX + radius * col + radius / 2;
      let y = leftUpY + radius_y * row + radius / 2;

      return chooseCoordsInSquare(
        p5,
        x,
        y,
        radius - textSize,
        radius - textSize
      );
    }
  }

  /**
   * Choose coords on a circle in a square
   * @param p5
   * @param centerX - x val for center of the square
   * @param centerY - y val for center of the square
   * @param w - width of the square that bounds the circle
   * @param h - height of the square that bounds the circle
   * @returns {DotCoords}
   */
  function chooseCoordsInSquare(p5, centerX, centerY, w, h) {
    let max_r;
    if (w > h) {
      max_r = h / 2;
    } else {
      max_r = w / 2;
    }
    let cur_r = p5.random(0, max_r);
    let angle = p5.random(0, p5.TWO_PI);

    let x = centerX + cur_r * p5.cos(angle);
    let y = centerY + cur_r * p5.sin(angle);

    return new DotCoords(x, y);
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
  function chooseCoordsOnShape(
    p5,
    minRadius,
    maxRadius,
    curOrder,
    dotsInSectionArr
  ) {
    let radius = p5.random(minRadius, maxRadius);
    let angle = p5.random(0, p5.TWO_PI);
    let x, y;

    if (dotsInSectionArr.length === 1) {
      // without inner order
      // Convert polar coordinates to Cartesian coordinates
      x = p5.width / 2 + radius * p5.cos(angle);
      y = p5.height / 2 + radius * p5.sin(angle);
    } else {
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
      for (let i = 0; i < curOrder; i++) {
        startAngle += dotAngle * dotsInSectionArr[i];
      }

      let dx =
        p5.width / 2 +
        maxRadius * Math.cos(p5.radians(startAngle + sectionAngle / 2));
      let dy =
        p5.height / 2 +
        maxRadius * Math.sin(p5.radians(startAngle + sectionAngle / 2));

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
   * choose new coords for a dot
   * @param p5
   * @param dot - dot object
   * @param dotIndexInAllDots - the index of this dot in the allDots array
   * @param arriveFromOrder -did we get here from the order function?
   * @param sectionsAmount - amount of sections to divide the dots to
   * * * (to check if not overlapping with dots that are already have new coords)
   */
  function updateDotNewPosition(
    p5,
    dot,
    dotIndexInAllDots,
    arriveFromOrder,
    sectionsAmount
  ) {
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
      if (dot.cur_filter === IN_FILTER) {
        newDotCoords = chooseCoordsInFilter(
          p5,
          bigCircleR,
          dot.cur_order,
          sectionsAmount
        );
      }
      if (dot.cur_filter === OUT_FILTER) {
        newDotCoords = chooseCoordsOutOfFilter(p5, bigCircleR);
      }

      // see if the coords won't create a dot that is overlapping with other dots
      overlapping = checkOverlapping(
        p5,
        newDotCoords,
        dot.r,
        dotIndexInAllDots
      );
    }

    // found coords that are not overlapping! change the coords
    dot.updateCurCoords(newDotCoords);
  }

  /**
   * Order the dots according to a parameter
   * @param p5
   */
  function orderDots(p5) {
    allDotsInFilter = 0;
    // array of results of current category
    category_arr = [];

    // How many answer do I have? and update the current order for each dot
    for (let i = 0; i < allDots.length; i++) {
      // NOTE that this order the batches order according to what come first,
      // so if we have something with numeric values, then this won't necessarily be dispelled by order

      let res = info[i][order_val];

      if (allDots[i].cur_filter === IN_FILTER) {
        allDotsInFilter++;

        // if this is the first time we saw this category
        if (!category_arr.includes(res)) {
          category_arr.push(res);
        }
      }

      // get the index for this category and update it in the current dot
      allDots[i].cur_order = category_arr.indexOf(res);
    }

    for (let i = 0; i < allDots.length; i++) {
      // change color to category color (but the last one which is you)
      if (allDots[i].cur_filter === IN_FILTER && i !== allDots.length - 1) {
        allDots[i].color = inFilterColor;
        allDots[i].other_color = inFilterColor;
      }
      // update dot coords
      updateDotNewPosition(p5, allDots[i], i, true, category_arr.length);
    }
  }

  function drawText(p5) {
    let centerX = p5.width / 2;
    let centerY = p5.height / 2;
    let amountOfOrders = category_arr.length;
    let circleDiameter = 2 * bigCircleR;
    let sideLength = circleDiameter / Math.sqrt(2);

    let sqrt = Math.sqrt(amountOfOrders);
    let sqrtBeforeDot = Math.ceil(sqrt);
    for (let curOrder = 0; curOrder < amountOfOrders; curOrder++) {
      let row = Math.ceil((curOrder + 1) / sqrtBeforeDot) - 1;
      let part = ((curOrder + 1) / sqrtBeforeDot) % 1;
      if (part === 0) {
        part = 1;
      }
      let col = part * sqrtBeforeDot - 1;

      let radius = sideLength / sqrtBeforeDot;
      let radius_y;
      // see if the last row is necessary, if not- change the row height
      if (sqrtBeforeDot * sqrtBeforeDot - amountOfOrders >= sqrtBeforeDot) {
        // last row is not necessary
        radius_y = sideLength / (sqrtBeforeDot - 1);
      } else {
        radius_y = radius;
      }

      let leftUpX = centerX - sideLength / 2;
      let leftUpY = centerY - sideLength / 2;
      // write under batch
      let x = leftUpX + radius * col + radius / 2;
      let y = leftUpY + radius_y * row + radius + 5;
      // write above batch
      // let x = leftUpX + (radius * col) + (radius / 2);
      // let y = leftUpY + (radius_y * row) + (radius / 2);
      p5.textSize(textSize);
      p5.fill(textColor);
      p5.text(category_arr[curOrder], x, y);
    }
  }

  /************************/
  /**** filter functions ***/
  /************************/

  /**
   * Update for do in dotIndex if it's in the filter or not
   * It depends on whether we care about this filter (mom_score and dad_score)
   * and if it answers the need to be in that filter is so
   */
  function chooseFilters(dotIndex) {
    // score = 0: none
    // score = 1: similarity
    // score = 2: difference

    allDots[dotIndex].cur_filter = OUT_FILTER; // otherwise-out of filter

    if (dad_score === 0 && mom_score === 0) {
      // dad doesn't matter, mom doesn't matter
      allDots[dotIndex].cur_filter = IN_FILTER;
      return;
    }
    if (dad_score === 1 && mom_score === 0) {
      // similarity to dad, mom doesn't matter
      if (info[dotIndex]["Similarity_Dad"] >= 50) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 0) {
      // difference from dad, mom doesn't matter
      if (info[dotIndex]["Difference_Dad"] >= 50) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 0 && mom_score === 1) {
      // dad doesn't matter, similarity to mom
      if (info[dotIndex]["Similarity_Mom"] >= 50) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 1 && mom_score === 1) {
      // similarity to dad, similarity to mom
      if (
        info[dotIndex]["Similarity_Dad"] >= 50 &&
        info[dotIndex]["Similarity_Mom"] >= 50
      ) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 1) {
      // difference from dad, similarity to mom
      if (
        info[dotIndex]["Difference_Dad"] >= 50 &&
        info[dotIndex]["Similarity_Mom"] >= 50
      ) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 0 && mom_score === 2) {
      // dad doesn't matter, difference from mom
      if (info[dotIndex]["Difference_Mom"] >= 50) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 1 && mom_score === 2) {
      // similarity to dad, difference from mom
      if (
        info[dotIndex]["Similarity_Dad"] >= 50 &&
        info[dotIndex]["Difference_Mom"] >= 50
      ) {
        allDots[dotIndex].cur_filter = IN_FILTER;
        return;
      }
    }
    if (dad_score === 2 && mom_score === 2) {
      // difference from dad, difference from mom
      if (
        info[dotIndex]["Difference_Dad"] >= 50 &&
        info[dotIndex]["Difference_Mom"] >= 50
      ) {
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

      if (i !== allDots.length - 1) {
        if (allDots[i].cur_filter === IN_FILTER) {
          allDots[i].color = inFilterColor;
          allDots[i].other_color = inFilterColor;
          allDots[i].r = inFilterDotRadius;
        } else {
          allDots[i].color = outOfFilterColor;
          allDots[i].other_color = outOfFilterColor;
          allDots[i].r = regularDotRadius;
        }
      }
      allDots[i].cur_order = 0;

      // update dot coords
      updateDotNewPosition(p5, allDots[i], i, false, [1]);
    }
  }

  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      show && initializeDots(p5, info.length);
      first = false;
    }

    // filter dots
    if (prev_dad_score !== dad_score || prev_mom_score !== mom_score) {
      show && filterDots(p5);
      prev_mom_score = mom_score;
      prev_dad_score = dad_score;
      text = false;
      prev_order_val = "None";
      order_val = "None";
    }

    if ( order_val !== prev_order_val) {
      console.log(order_val);
      show && orderDots(p5);
      prev_order_val = order_val;
      text = true;
    }

    //draw
    p5.background(bgColor);
    checkIfHovering(p5);
    drawDots(p5);
    if (text) {
      drawText(p5);
    }
  };

  return (
    <div style={{display: "flex", justifyContent:"flex-start"}}>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
};
