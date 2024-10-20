let ancho = 640;
let alto = 480;

let imagen = [];
let texto = [];
let musicaFondo;


let pantallaActiva;
let pantallasBotSig = [1, 2, 3, 5,6,7,9,10,11,12,21,22,23,24,31,32,33];
let pantallas = [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,21,22,23,24,31,32,33];

let button;

function preload()
{
  musicaFondo = loadSound('data/greenhill.mp3');
  for (let i=0; i<=33; i++ ) 
  {
    if(pantallas.includes(i))
    {
      imagen[i] = loadImage("data/pantalla_"+nf(i, 2)+".png");
    }
  }
  texto = loadStrings('data/texto.txt');
}

function setup() 
{
  
  createCanvas(ancho, alto);
  
  pantallaActiva = 0;
  
   
   
   
  button = createButton('On/off musica');
  button.position(10, 10);
  button.mousePressed(toggleSound); 
  musicaFondo.setVolume(0.8);
   
   
}

function toggleSound() {
  if (musicaFondo.isPlaying()) {
    musicaFondo.stop(); 
  } else {
    musicaFondo.play(); 
  }
}

function draw() 
{
  background(100,0 ,0 );
  
  
  ControlImagen();
  
  
}

function mousePressed()
{
  if (pantallaActiva == 0) {pantallaActiva++}
  else
  {
    ControlClicks();
  }
}

function ControlImagen()
{
  
  CargarImagen();
  if (pantallaActiva !== 13){CargarTexto();}
  
  
  if (pantallasBotSig.includes(pantallaActiva))
  {
    DibujarBotonSiguiente();
  }
  
  if (pantallaActiva === 4 || pantallaActiva === 8)
  {
  DibujarBotonDecisiones();
  
  }
}

function CargarImagen()
{
  image(imagen[pantallaActiva], 0, 0, 640, 480);
}

function CargarTexto() {
  if (pantallaActiva < texto.length) {
    let textColor = 255; 
    let backgroundColor = color(0, 0, 0, 150); 

    textSize(20);
    textAlign(LEFT, TOP); 
    
    let lineHeight = 24; 
    let x = 20; 
    let y = 50; 
    let currentText = texto[pantallaActiva];
    
   
    let words = currentText.split(" ");
    let line = "";
    let lines = []; 
    let maxWidth = 0; 

    
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      let testWidth = textWidth(testLine);
      
      if (testWidth > 560 - x * 2) { 
        lines.push(line); 
        maxWidth = max(maxWidth, textWidth(line));
        line = words[i] + " "; 
        y += lineHeight; 
      } else {
        line = testLine; 
      }
    }
    lines.push(line); 
    maxWidth = max(maxWidth, textWidth(line)); 

    
    let backgroundHeight = lines.length * lineHeight; 
    fill(backgroundColor); 
    rect(x - 5, 50 - 5, maxWidth + 10, backgroundHeight + 10, 10); 
    
    
    fill(textColor); 
    y = 50; 
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], x, y);
      y += lineHeight;
    }
  }
}

function ControlClicks()
{
  if (pantallasBotSig.includes(pantallaActiva))
  {
    ClickBotonSiguiente();
  } 
  else
  {
    if (pantallaActiva === 4 || pantallaActiva === 8)
    {
      ClickBotonDecisiones()
    } 
    else 
    { 
      if (pantallaActiva === 24 || pantallaActiva === 33)
      {
        pantallaActiva = 13;
      }
      else 
      {
        if (pantallaActiva == 13)
        {
          pantallaActiva = 0;
        }
      }
    }
  }
}



function DibujarBotonSiguiente()
{
  //x:560, 640
  //y: 0, 480
  fill(0,0,0,100);
  rect(560, 0, 80, 480);
  triangle(580,210,580,270,620,240);
}

function ClickBotonSiguiente()
{
  //x:560, 640
  //y: 0, 480
  
  if (pantallaActiva !== 24 && pantallaActiva !== 33)
  {
     if ((mouseX <= 640 && mouseX >= 560 && mouseY <= 480 && mouseY >= 0))
    {
      pantallaActiva++;
    }
  } 
  else
  {
    pantallaActiva = 13;
  }
}

function DibujarBotonDecisiones()
{
  //x:   0, 320          320, 640    
  //y: 400, 480          400, 480
  fill(0,0,0,100);
  rect(0, 400, 320, 80);

  fill(0,0,0,100);
  rect(320, 400, 320, 80);
  
  if (pantallaActiva === 4){
    
    textAlign(CENTER, CENTER);
    fill(240);
    text('seguir solo',120, 440);
    text('ir con tom', 450, 440);
  }
  else
  {
    textAlign(CENTER, CENTER);
    fill(240);
    text('ir al planeta hongo',120, 440);
    text('quedarse en la tierra', 450, 440);
  }
  
}

function ClickBotonDecisiones()
{
  //x:   0, 320          320, 640    
  //y: 400, 480          400, 480
  if (mouseX >= 0 && mouseX <= 320 && mouseY >= 400 && mouseY <= 480)
  {
    if (pantallaActiva === 4){
      pantallaActiva = 21;
    }
    else{
      pantallaActiva = 31;
    }
  }
  if (mouseX >= 320 && mouseX <= 640 && mouseY >= 400 && mouseY <= 480)
  {
    if (pantallaActiva === 4){
      pantallaActiva = 5;
    }
    else{
      pantallaActiva = 9;
    }
  }
}
