import {Vector} from "./vector.js";
import {Triangle} from "./triangle.js";


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let screenBuffer;

const vertices = [];
const triangles = [];

resize();

/*vertices.push(new Vector(143, 100, 90));
vertices.push(new Vector(113, 33, 120));
vertices.push(new Vector(83, 100, 90));
vertices.push(new Vector(83, 100, 150));
vertices.push(new Vector(143, 100, 150));*/

vertices.push(new Vector(143, 100, 90));
vertices.push(new Vector(113, 33, 120));
vertices.push(new Vector(83, 100, 90));
vertices.push(new Vector(83, 100, 150));
vertices.push(new Vector(143, 100, 150));

const rotatedVertices = Array.from({length: vertices.length}, () => new Vector());

const center = new Vector(113, 66, 120); //Center of the example pyramid

const red = new Vector(205, 0, 0);
const dr = new Vector(100, 6, 200);
const blu = new Vector(0, 0, 205);
const lg = new Vector(66, 195, 192);

const tri1Indices = [0, 1, 2];
const tri2Indices = [2, 1, 3];
const tri3Indices = [3, 1, 4];
const tri4Indices = [4, 1, 0];

const tri1 = new Triangle(tri1Indices, screenBuffer);
const tri2 = new Triangle(tri2Indices, screenBuffer);
const tri3 = new Triangle(tri3Indices, screenBuffer);
const tri4 = new Triangle(tri4Indices, screenBuffer);

triangles.push(tri1);
triangles.push(tri2);
triangles.push(tri3);
triangles.push(tri4);

let angle = 0;
let angleSpeed = 0;

const lightPoint = new Vector(200, 60, 120);

draw();

function resize() {
    canvas.width = window.innerWidth * 0.2;
    canvas.height = window.innerHeight * 0.2;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    screenBuffer = ctx.createImageData(window.innerWidth * 0.2, window.innerHeight * 0.2);
}



function rotateZ(angle) {
    const deg2rad = Math.PI / 180;

    for (let i = 0; i < vertices.length; i++) {
        const v = new Vector(vertices[i]);

        v.sub(center);

        const r = rotatedVertices[i];

        r[0] = (v[0] * Math.cos(-angle * deg2rad) + v[2] * Math.sin(-angle * deg2rad));
        r[1] = v[1]; //Math.round(v[1] * Math.sin(angle * deg2rad) + v[1] * Math.cos(angle * deg2rad));
        r[2] = (-1 * v[0] * Math.sin(-angle * deg2rad) + v[2] * Math.cos(-angle * deg2rad));

        r.add(center);
    }
}

function draw() {
    const fps = 60;

    setTimeout(() => {requestAnimationFrame(draw);}, 1000/fps);

    rotateZ(angle);
    screenBuffer.data.fill(0);

    tri1.draw(rotatedVertices, lg, lightPoint);
    tri2.draw(rotatedVertices, lg, lightPoint);
    tri3.draw(rotatedVertices, lg, lightPoint);
    tri4.draw(rotatedVertices, lg, lightPoint);

    ctx.putImageData(screenBuffer, 0, 0);
    angle += angleSpeed;
}

function toggle() {
    if (angleSpeed != 0) {
        angleSpeed = 0;
    }
    else {
        angleSpeed = 0.30;
    }
}

let clicked;
let xpos;
let xposold;

function mouseTracking() {
    document.addEventListener("mousemove", (e) => {
        xpos = e.clientX;
    })

    setInterval(test, 100);
}

function test(){
    xposold = xpos;
}

document.addEventListener("DOMContentLoaded", mouseTracking);

function clickin() {
    clicked = true;
}

function spin(e) {
    if (clicked) {
        angleSpeed += (xpos - xposold) / 1000;
    }
}

function gravity() {
    requestAnimationFrame(gravity);
    if (angleSpeed > 0.30) {
        angleSpeed -= 0.01;
    }
    if (angleSpeed < 0.30) {
        angleSpeed += 0.01;
    }
}

gravity();

function unclicked() {
    clicked = false;
}

document.getElementById("body").onkeydown = function() {toggle()};

document.addEventListener("mousedown", clickin, false);
document.addEventListener("mousemove", spin);
document.addEventListener("mouseup", unclicked);
//window.addEventListener("resize", resize);