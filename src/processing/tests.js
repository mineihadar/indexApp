import React from 'react';
import Sketch from 'react-p5';

var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 1200
var GRAPHH = 800

var ARROWW = 5
var ARROWL = 15

var AXESLEN = 700

var DEFAULT_RADIAN = 10

var HASHMARKL = 5
var PADDINGX = 20
var PADDINGY = 45

var table
var numRows
var numColumns
var time
var ratings
var serial
var sex
var title
var colors
var highlightColor


// var x = 50;
// var speed = 5;
function P5Sketch() {
    // let x = 1400;
    // let y = 800;
    // let myColor;

    const preload = (p5) => {
        // make sure the file is in the 'public' directory so this works
        table = p5.loadTable("like_father_mother.csv", "csv", "header")
        console.log(table)
    }

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(CANVASW, CANVASH)
        //count the columns
        numRows = table.getRowCount()
        numColumns = table.getColumnCount()

        time = table.getColumn("Closeness_To_Dad") // x axis
        ratings = table.getColumn("Closeness_To_Mom") // y axis
        serial = table.getColumn("Serial_Number")
        sex = table.getColumn("Sex")

        title = "Like Father / Mother, Like Son / Daughter?"

        colors = [
            // p5.color(50, 70, 117),
            // p5.color(67, 103, 186),
            // p5.color(84, 129, 235),
            p5.color(140, 175, 255),
            p5.color(255, 192, 203)
        ]

        highlightColor = p5.color(150, 82, 217)
        // p5.createCanvas(x, y).parent(canvasParentRef);
        // p5.background(255, 255, 255);
        // p5.colorMode(p5.HSB);
        // p5.noStroke()
        //
        // //set the initial values when the sketch starts
        // myColor = p5.color(0, 100, 100);
    }

    const draw = (p5) => {
        p5.background(255)
        drawGraph(p5)
        // if (p5.mouseIsPressed) {
        //     p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
        // }
        // else {
        //     myColor = p5.color((5 * p5.frameCount) % 360, 100, 100);
        //     p5.fill(myColor);
        //     p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
        // }
    }

    function drawGraph(p5) {
        drawAxes(p5)
        drawPoints(p5)
        drawLegends(p5)
        drawTitle(p5)
    }

    // Axes related stuff
    function drawAxes(p5) {
        // p5.beginShape()
        // p5.vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
        // p5.vertex(GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH)
        // p5.vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
        // p5.endShape()
        p5.stroke(51)
        p5.line(GRAPH_ORIGINX, GRAPH_ORIGINY, GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH)
        p5.line(GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH, GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)

        drawArrows(p5)
        drawHashMarks(p5)
    }

    function drawArrows(p5) {
        p5.fill(51)
        // arrow for y axis
        p5.beginShape(p5.TRIANGLES)
        p5.vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
        p5.vertex(GRAPH_ORIGINX - ARROWW, GRAPH_ORIGINY + ARROWL)
        p5.vertex(GRAPH_ORIGINX + ARROWW, GRAPH_ORIGINY + ARROWL)
        p5.endShape()

        // arrow for x axis
        p5.beginShape(p5.TRIANGLES)
        p5.vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
        p5.vertex(GRAPH_ORIGINX + GRAPHW - ARROWL, GRAPH_ORIGINY + GRAPHH - ARROWW)
        p5.vertex(GRAPH_ORIGINX + GRAPHW  - ARROWL, GRAPH_ORIGINY + GRAPHH + ARROWW)
        p5.endShape()
    }

    function drawHashMarks(p5) {
        drawHashMarksForYAxes(p5)
        drawHashMarksForXAxes(p5)
    }

    function drawHashMarksForYAxes(p5) {
        var numHashMarks = 5
        var hashMarkL = GRAPH_ORIGINX
        var hashMarkR = hashMarkL + HASHMARKL
        var dist = (GRAPHH - PADDINGY) / numHashMarks
        for (var i = 1; i <= numHashMarks; ++i) {
            var hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist)
            // if (i % 10 == 0) {
            //     drawTextForYHashMarkAtY(hashMarkY, hashMarkR, i.toString(), p5)
            //     p5.stroke(51)
            //     p5.line(hashMarkL, hashMarkY, hashMarkR, hashMarkY)
            // }
            drawTextForYHashMarkAtY(hashMarkY, hashMarkR, i.toString(), p5)
            p5.stroke(51)
            p5.line(hashMarkL, hashMarkY, hashMarkR, hashMarkY)
        }
        // attribute name for y axis
        drawTextForYHashMarkAtY(GRAPH_ORIGINY, hashMarkR, "Mom", p5)
    }

    function drawHashMarksForXAxes(p5) {
        // var numHashMarks = numRows
        var numHashMarks = 5
        var dist = GRAPHW - 2 * PADDINGX
        var unitDist = dist / numHashMarks
        var startX = GRAPH_ORIGINX + PADDINGX
        var hashMarkB = GRAPH_ORIGINY + GRAPHH - 1
        var hashMarkU = hashMarkB - HASHMARKL
        for (var i = 1; i <= numHashMarks; ++i) {
            var hashMarkX = startX + (i * unitDist)

            // if (i % 4 == 0) {
            p5.stroke(51)
            p5.line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
            p5.push()
            var x = hashMarkX
            var y = hashMarkB + 5
            p5.translate(x, y)
            p5.rotate(p5.PI / 4)
            // drawTextForXHashMark(0, 0, time[i], p5)
            drawTextForXHashMark(0, 0, i.toString(), p5)
            p5.pop()
            // }
        }
        // attribute name for x axis
        var x = GRAPH_ORIGINX + GRAPHW
        var y = GRAPH_ORIGINY + GRAPHH
        drawTextForXHashMark(x, y, "Dad", p5)
    }

    function drawTextForYHashMarkAtY(hashMarkY, hashMarkL, str, p5) {
        var len = str.length * 10
        var height = 15;
        var padding = 10
        var x = hashMarkL - padding - len
        var y = hashMarkY - height / 2

        p5.textAlign(p5.RIGHT)
        p5.text(str, x, y, len, height)
    }

    function drawTextForXHashMark(x, y, str, p5) {
        var len = str.length * 10
        var height = 15

        p5.text(str, x, y, len, height)
    }

    function drawPoints(p5) {
        // var distY = (GRAPHH - PADDINGY) / 100
        var distY = (GRAPHH - PADDINGY) / 5
        // var distX = (GRAPHW - 2 * PADDINGX) / numRows
        var distX = (GRAPHW - 2 * PADDINGX) / 5

        var startX = GRAPH_ORIGINX + PADDINGX
        var toAdd = 1
        var sign = 1
        for (var i = 0; i < numRows; ++i) {
            // var y = GRAPH_ORIGINY +GRAPHH - parseFloat(ratings[i]) * distY
            // var x = startX + (i * distX)
            var y = GRAPH_ORIGINY + GRAPHH - parseFloat(ratings[i]) * distY + (toAdd%20)*sign
            var x = startX + (time[i] * distX) + (toAdd%5)*sign
            toAdd++
            sign *= -1

            var color
            if (sex[i] === 'Male'){
                color = 0
            }
            else {
                color = 1
            }
            // can change what the hover shows here
            // p5.fill(getColorForPoint(i % 4, x, y, DEFAULT_RADIAN, serial[i], p5))
            p5.fill(getColorForPoint(color, x, y, DEFAULT_RADIAN, serial[i], p5))
            p5.noStroke()
            p5.ellipse(x, y, DEFAULT_RADIAN, DEFAULT_RADIAN)
        }
    }

    function getColorForPoint(index, x, y, r, val, p5) {
        if (p5.mouseX > x - r && p5.mouseX < x + r && p5.mouseY > y-r && p5.mouseY < y + r) {
            drawToolTipForVal(val, x, y, r, p5)
            return highlightColor
        }
        return colors[index]
    }

    function drawToolTipForVal(val, x, y, w, p5) {
        p5.fill(51)
        p5.stroke(51)
        p5.textStyle(p5.NORMAL)
        p5.textAlign(p5.CENTER)
        p5.text(val, x, y - 20, w, 100)
    }

    function drawLegends(p5) {
        // for the containing box
        var width = 80
        var height = 100
        var x = GRAPH_ORIGINX + GRAPHW - width
        var y = GRAPH_ORIGINY

        p5.noFill()
        p5.stroke(51)
        p5.rect(x, y, width, height)

        // for contained boxes
        var padding = 10
        var boxL = 15
        var gap = (height - 2 * padding - 4 * boxL) / 3
        var textPadding = 10

        var originY = y + padding
        var originX = x + padding
        for (var i = 0; i < 2; ++i) {
            var curY = originY + i * (boxL + (i > 0 ? gap : 0))
            p5.noStroke()
            p5.fill(colors[i])
            p5.rect(originX, curY, boxL, boxL)

            p5.fill(51)
            p5.textAlign(p5.LEFT)
            // var str = "=  Q" + (i+1).toString()
            var str
            if (i === 0) {
                str = "= Male"
            }
            else {
                str = "= Female"
            }
            var textLen = p5.textWidth(p5.text)
            p5.text(str, originX + boxL + textPadding, curY, textLen, boxL)
        }
    }

    function drawTitle(p5) {
        var textLen = p5.textWidth(title)
        var padding = (GRAPHW - textLen) / 2

        p5.fill(125)
        p5.textAlign(p5.CENTER)
        p5.textStyle(p5.BOLD)
        p5.text(title, GRAPH_ORIGINX + padding, GRAPH_ORIGINY, textLen + 50, 20)
    }

    return (
        <Sketch preload={preload} setup={setup} draw={draw} />
    )
}

export default P5Sketch;
        