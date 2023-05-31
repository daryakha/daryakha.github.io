let socket;
let lines = [];
let color = "black";
let lineWidth = "1";

function preload() {
  socket = io.connect("http://localhost:3000");
  socket.on("connect", () => {
    console.log("Connected to server");
  });
}
function setup() {
  createCanvas(700, 440);
  background(255);
  frameRate(90);

  socket.on("update_lines", (linedata) => {
    lines = linedata;
  });
}

function draw() {
  // clear();
  background("white");

  // condition line drawing
  if (mouseIsPressed) {
    socket.emit("line_drawn", {
      x1: mouseX,
      y1: mouseY,
      x2: pmouseX,
      y2: pmouseY,
      color: color,
      lineWidth: lineWidth,
    });
  }

  // condition clear canvas
  if (
    mouseX > 45 &&
    mouseX < 120 &&
    mouseY > 405 &&
    mouseY < 435 &&
    mouseIsPressed
  ) {
    socket.emit("clear");
  }

  // conditions brush color
  // conditions brush color
  const colorOptions = [
    { color: "red", yMin: 0, yMax: 40 },
    { color: "orange", yMin: 40, yMax: 80 },
    { color: "yellow", yMin: 80, yMax: 120 },
    { color: "green", yMin: 120, yMax: 160 },
    { color: "lightblue", yMin: 160, yMax: 200 },
    { color: "blue", yMin: 200, yMax: 240 },
    { color: "purple", yMin: 240, yMax: 280 },
    { color: "pink", yMin: 280, yMax: 320 },
    { color: "magenta", yMin: 320, yMax: 360 },
    { color: "white", yMin: 360, yMax: 400 },
    { color: "black", yMin: 400, yMax: 440 },
  ];

  for (let option of colorOptions) {
    if (
      mouseX < 40 &&
      mouseY > option.yMin &&
      mouseY < option.yMax &&
      mouseIsPressed
    ) {
      color = option.color;
    }
  }

  // conditions line width
  const lineWidthOptions = [
    { width: 25, xMin: 130, xMax: 170 },
    { width: 10, xMin: 165, xMax: 175 },
    { width: 1, xMin: 180, xMax: 191 },
  ];

  for (let option of lineWidthOptions) {
    if (
      mouseX > option.xMin &&
      mouseX < option.xMax &&
      mouseY > 400 &&
      mouseIsPressed
    ) {
      lineWidth = option.width;
    }
  }

  drawLines();
  // tool box
  push();
  strokeWeight(lineWidth);

  // border shows what color is picked
  stroke(color);
  line(46, 0, 46, 400);
  line(45, 395, 263, 395);
  line(264, 395, 264, 440);
  pop();

  push();
  noStroke();

  fill("white");
  rect(0, 0, 45, 440); //vertical
  rect(0, 396, 263, 49); //horizontal

  // color picker setup

  // doesn't work for some reason :(
  /*
  console.log(colorOptions.length);
  for (let i = 0; i < colorOptions.length; i++) {
    fill(colorOptions[i]);
    rect(0, i * 40, 40, 40);
  }
  */

  fill("red");
  rect(0, 0, 40, 40);
  fill("orange");
  rect(0, 40, 40, 40);
  fill("yellow");
  rect(0, 80, 40, 40);
  fill("green");
  rect(0, 120, 40, 40);
  fill("lightblue");
  rect(0, 160, 40, 40);
  fill("blue");
  rect(0, 200, 40, 40);
  fill("purple");
  rect(0, 240, 40, 40);
  fill("pink");
  rect(0, 280, 40, 40);
  fill("magenta");
  rect(0, 320, 40, 40);
  fill("white");
  rect(0, 360, 40, 40);
  fill("black");
  rect(0, 400, 40, 40);

  // clear button
  rect(45, 405, 75, 30, 10);
  fill("white");
  textSize(25);
  text("clear", 55, 428);

  // brush width picker setup
  fill("black");
  rect(130, 400, 25, 40); //thick
  rect(165, 400, 10, 40); //medium
  rect(185, 400, 1, 40); //narrow

  textSize(15);
  text("line width", 195, 425);

  pop();
}

function drawLines() {
  for (let i = 0; i < lines.length; i++) {
    let data = lines[i];
    push();
    stroke(data.color);
    strokeWeight(data.lineWidth);
    line(data.x1, data.y1, data.x2, data.y2);
    pop();
  }
}
