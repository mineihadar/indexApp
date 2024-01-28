import React from "react";
import Sketch from "react-p5";
import info from "./info.json";

// Constance
let regularCircleRadius = 3;
let regularCircleSpeed = 1;

// initialize circles
let first = true;

// our circle object
class CircleObject {
  constructor(x, y, r, color, s) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.speed = s;
  }
}

export default () => {
  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(1500, 800).parent(canvasParentRef);
    p5.background(255, 124, 134);
  };

  /**
   * Create a circle on a random coordinate inside the main shape (for now- it's a circle)
   * @param p5
   * @param circleRadius- the radius of the small circle, will be needed for general circle vs. your circle
   * @param circleSpeed - the speed of the small circle, will be needed for general circle vs. your circle
   * @param circleColor - the color of the small circle
   * @param shapeAmount - amount of circles the contains small circles
   * @param shapeNum - the current num of shape
   * @returns {CircleObject}
   */
  function createCircleOnShape(p5, circleRadius, circleSpeed, circleColor, shapeAmount, shapeNum) {
    // choose offset on the shape (which is for now- a big circle) according to amount of shapes
    let offsetX =  p5.width * ( (shapeNum + 1) / (shapeAmount + 1));
    let offsetY =  p5.height / 2;

    // choose random x,y on a circle

    let radius = p5.random(10, (p5.width / (2 * shapeAmount)) - 50); // Adjust the radius range as needed
    let angle = p5.random(0, p5.TWO_PI);

    // Convert polar coordinates to Cartesian coordinates
    let x = offsetX + radius * p5.cos(angle);
    let y = offsetY + radius * p5.sin(angle);

    return new CircleObject(x, y, circleRadius, circleColor, circleSpeed);
  }
  function drawCirclesOnShape(p5, circlesAmount, curColor, shapeAmount, shapeNum){
    let overlapping, d;
    let allCircles = [];

    // create a circle for each person
    // initialize all circles and add to an array
    while (allCircles.length < circlesAmount) {
      let currentCircle = createCircleOnShape(p5, regularCircleRadius, regularCircleSpeed, curColor, shapeAmount, shapeNum);

      // make sure the circles don't overlap
      // notice that this takes lots of calculation- for every circle, checks all the prev circles
      overlapping = false;
      for (let j = 0; j < allCircles.length; j++){
        let other = allCircles[j];
        d = p5.dist(currentCircle.x, currentCircle.y, other.x, other.y);
        // overlap
        if (d < currentCircle.r + other.r) {
          overlapping = true;
          break;
        }
      }
      // not overlapping
      if (!overlapping){
        allCircles.push(currentCircle);
      }
    }
    // draw the circles
    // circle settings
    p5.noStroke();
    for (let i = 0; i < allCircles.length; i++) {
      p5.fill(allCircles[i].color);
      p5.ellipse(allCircles[i].x, allCircles[i].y, allCircles[i].r * 2, allCircles[i].r * 2);
    }
  }

  function initialize(p5) {
    let curColor = p5.color(255);
    drawCirclesOnShape(p5, info.length, curColor, 1, 0);
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

    // for loop on the amount of answers, and send the num of answers
    for (let i=0; i<answers.length; i++){
      let curColor = p5.color(255); // TODO how to choose different color for each
      drawCirclesOnShape(p5, answersAmount[i], curColor, answers.length, i);
    }
  }


  function generateRect(p5) {
    for (var i = 0; i < info.length; i++) {
      let height = info[i].Closeness_To_Dad * 100;
      p5.fill(123, 243, 123);
      p5.noStroke();
      p5.rect(i * 25 + 30, 100, 10, height);
    }
  }

  const draw = (p5, show = true) => {
    // initialize circles
    if (first) {
      //show && initialize(p5);
      show && arrangeCircles(p5);
      first = false;
    }

    // TODO add a nice swipe between prev arrangement to current

    // TODO Need to make sure that calculating only once for each filter chnage
    // show && arrangeCircles(p5);

  };

  return <Sketch setup={setup} draw={draw} />;
};
