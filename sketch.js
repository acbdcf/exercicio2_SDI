let mySound;
let myEnvelope;
let grainSize = 0.1;
let vol = 0.5;

let lastGrain = 0;
let grainInterval = 50;

function preload() {
  soundFormats ('mp3', 'ogg');
  mySound = loadSound('assets/amen_break');
}

function setup() {
  // const c vai permitir-me adicionar a capacide drop ao meu canvas
  const c = createCanvas(600, 300);
  // gotFile é o nome da função que eu vou chamar
  c.drop(gotFile);
  // mimics the autoplay policy
  getAudioContext().suspend();
}

function draw() {
  background(220);
  if(mySound.isLoaded()) {
    let peaks = mySound.getPeaks(width);
    translate(0, height * 0.5);
    stroke(10);
    for(let i = 0; i < peaks.length; i++) {
      line(i, peaks[i] * height * 0.5, i, peaks[i] * height * -0.5);
    }
  }
}

function mousePressed() {
  userStartAudio();
}

function mouseDragged() {
  if(millis() > lastGrain + grainInterval) {
    let midiNote = 69 + (((mouseY - (height * 0.5)) / (height * 0.5)) * -12);
    let rate = midiToFreq(midiNote) / 440.0;
    
    if (keyIsDown (ENTER)) {
      grainInterval = grainInterval + 2; 
   // print (grainInterval);
    }
    
    if (keyIsDown (SHIFT)) {
      grainInterval = grainInterval -2;
      if (grainInterval <= 25) {
        grainInterval = 25}
   //   print (grainInterval);
    }
    
    if (keyIsDown (UP_ARROW)){
       vol = vol + 0.005;
         if (vol >= 0.9 ){
         vol = 0.9; }    
  //print (vol);
      }
  
   if (keyIsDown (DOWN_ARROW)){
      vol = vol - 0.005;
       if (vol <= 0.0001 ){
       vol = 0.0001; }
   //print (vol);
     }
    
   if (keyIsDown (LEFT_ARROW)){
     grainSize = grainSize - 0.001;
       if (grainSize <  0.015){
       grainSize = 0.015; }
    //print (grainSize);
  }
  
    if (keyIsDown (RIGHT_ARROW)){
      grainSize = grainSize + 0.001;
       if (grainSize > 0.2 ){
        grainSize = 0.2; }
    //  print (grainSize);
     }
    
  let t1 = 0.0001; // attack time in seconds
  let l1 = vol; // attack level 0.0 to 1.0
  let t2 = grainSize; // decay time in seconds
  let l2 = 0.0; // decay level  0.0 to 1.0
  myEnvelope = new p5.Envelope(t1, l1, t2, l2);
    
    mySound.play(0, rate, 0.0, (mouseX / width) * mySound.duration(), grainSize);
    myEnvelope.play(mySound);
    lastGrain = millis();
  }
}

function gotFile(file) {
  if (file.type === 'audio') {
    mySound = loadSound(file);
    console.log('got new audio file');
  } else {
    console.log('Not an audio file!');
  }
}