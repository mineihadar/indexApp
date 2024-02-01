import React from "react";
import Sketch from "react-p5";

let shapes = []; // an array that will hold our shapes
let numberOfShapes = 50; // how many shapes to draw
let mouseThreshold = 20; // how close can your mouse get to a shape before it moves
let moveDistance = 20; // how far shapes move away from your mouse
let animateDistance = 50; // how much each shape animates

let space = 6;
let radius = 3;


// create a "shape" class that holds all information about each shape
class Shape {
    constructor(p5, x, y) {
        this.x = x // each shape has a random x position
        this.y = y // and a random y position
        this.radius = radius; // give each shape a random size between two values
        this.color = p5.color(0); // black
    }

    // create a function that moves a shape away from your mouse
    updateShape(p5) {
        let mouseDistance = p5.int(p5.dist(this.x, this.y, p5.mouseX, p5.mouseY)); // check the distance from your mouse to the shape
        if (mouseDistance <= mouseThreshold) { // if your mouse gets closer than the threshold...
            this.x += p5.random(-moveDistance, moveDistance); // give the shape a new x position
            this.y += p5.random(-moveDistance, moveDistance); // and a new y position
            //this.x = lerp(this.x, random(this.x - moveDistance, this.x + moveDistance), 0.5);
            //this.y = lerp(this.y, random(this.y - moveDistance, this.y + moveDistance), 0.5);
        }
    }

    // create a function to animate each shape
    animateShape(p5){
        this.x = p5.lerp(this.x, p5.random(this.x - animateDistance, this.x + animateDistance), 0.01);
        this.y = p5.lerp(this.y, p5.random(this.y - animateDistance, this.y + animateDistance), 0.01);
    }

    // create a function to draw each shape
    drawShape(p5) {
        p5.fill(this.color);
        p5.ellipse(this.x, this.y, this.radius, this.radius);
    }
}

export default () => {
    const setup = async (p5) => {
        p5.createCanvas(1500, 800); // create a canvas that fills the whole screen
        p5.noStroke(); // don't outline objects

        // create a bunch of shape objects
        let midx = 750-((numberOfShapes/2)*space);
        let midy = 400-((numberOfShapes/2)*space);
        for (let i = 0; i < numberOfShapes; i++){
            for (let j = 0; j < numberOfShapes; j++){
                shapes.push(new Shape(p5,  midx + i * space, midy + j * space));
            }
        }
    };

    const draw = (p5, show = true) => {
        p5.background(244);

        // update shape positions based off of the mouse location
        // and draw them to the screen
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].updateShape(p5);
            // shapes[i].animateShape(p5);
            shapes[i].drawShape(p5);
        }

        // // draw ellipse that follows mouse
        // p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    };


    return <Sketch setup={setup} draw={draw} />;
};