let data = [];
let maxData;
let table;

function preload() {
  table = loadTable('assets/data.csv', 'csv', 'noHeader');
  openSans = loadFont('assets/OpenSans-Regular.ttf');
  playfairDisplay = loadFont('assets/PlayfairDisplay-Regular.ttf');
  lineChicken = loadImage('assets/lineChicken.png');
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  rectMode(BOTTOM);

  for (var r = 0; r < table.getRowCount(); r++) {
    let row = table.getRow(r);
    let time = row.getString(0);
    let light = row.getNum(1);
    let temp = row.getNum(2);
    let sound = row.getNum(3);

    sound = map(sound, 0, 100, 0, 450);
    temp = map(temp, 0, 1, 0, 255);
    light = map(light, 0, 1, 0, 255);

    // Using an array of objects instead of a bunch of different arrays that correspond
    data.push({
      time: time,
      sound: sound,
      temp: temp,
      light: light
    });
  }
  maxData = max(data.map(({sound}) => sound));
}

function draw() {
  background(43, 53, 63);
  fill(139, 171, 203);

  var angleSeparation = 360 / data.length;
  var padding = 10;

  if (frameCount <= 400) {
    maxValue = constrain(frameCount * 2, 0, 400);
  } else {
    maxValue = 400;
  }
  let offset = 200;
  let dataMultiplier = (height / 2 - offset - padding) / maxData;

  for (let i = 0; i < data.length; i++) {
    push();
    let currentSound = data[i].sound;
    let currentTemp = data[i].temp;
    let currentLight = data[i].light;

    let finalHeight = currentSound * dataMultiplier;
    let animatedHeight = map(maxValue, 0, 400, 0, finalHeight);

    translate(width / 2, height / 2);
    rotate(180 + (angleSeparation * i));

    stroke(currentTemp, 0, 255 - currentTemp);
    rect(0, offset, angleSeparation * 2, animatedHeight);
    stroke (255, 207, 50, currentLight);
    rect(0, offset, angleSeparation * 2, -animatedHeight);

    rotate(-(180 + (angleSeparation * i)));
    let multiplier = finalHeight === 0 ? 0 : animatedHeight / finalHeight;
    timestamp(data[i].time, map(multiplier, 0, 1, 0, 120));

    pop();
  }
  stroke (150);
  fill (150);
  ellipse(400,400,120,120);
  image (lineChicken,360,360,80,80);
}

function timestamp(timeData, multiplier) {
  fill(255);
  stroke(255);
  textAlign (CENTER, CENTER);
  textFont (playfairDisplay);
  textSize (16);
  let date = new Date(timeData);
  if (date.getMinutes() === 0) {
    text(date.getHours(),((200-multiplier)*cos(90-(15*date.getHours()))),(-3)-((200-multiplier)*sin(90-(15*date.getHours()))));
  }
}
