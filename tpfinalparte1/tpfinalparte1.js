// TP#Final Parte 1 - Comisión 3, David Bedoian
// Oberti Fermin 119102/7 - Medina Salvador 119087/8
// Tematica: mitologias y what if, caja de pandora
let apuntador = 0;
let pantalla = 0;
let textos = [];
let imagenes = [];
let textosEC, parrafos, titulos = [];
let botonSI = "SI";
let botonNO = "NO";
let botonEMP = "COMENZAR";
let botonRESET = "REINICIAR";
let botonSOUND= "SONIDO";
let sonido;

function preload() {
  textosEC = loadStrings("data/textos.txt");
  for (let i = 0; i < 15; i++) {
    imagenes[i] = loadImage("data/imagenes/imagen" + nf(i+1, 2) + ".png");
    parrafos = loadFont("data/LibertinusSerifDisplay-Regular.ttf");
    titulos = loadFont("data/GODOFWAR.ttf");
  }
  soundFormats('mp3');
    sonido = loadSound('data/gordosmusica');
}
function setup() {
  createCanvas(640, 480);
  for (let i = 0; i < textosEC.length; i++) {
    let linea = textosEC[i];
    let lineaArray = split(linea, "#");
    textos[lineaArray[0]] = lineaArray[1];
  }
}

function draw() {
  background(0);
  image(imagenes[pantalla], 0, 0, 640, 480);
fill(255);
textSize(20);
text("pantalla: " + pantalla, 100, 20);
text("mouseX: " + mouseX + " mouseY: " + mouseY, 100, 40);

  //Mostrar textos
  fill(255);
  stroke(0);
  textSize(30);
  textAlign(CENTER);
  textFont(parrafos);
  text(textos[pantalla], 30, 150, 580, 250);
   //Mostrar botón RESET en las pantallas 9, 13 y 14
if (pantalla === 9 || pantalla === 13 || pantalla === 14) {
  dibujobotonRESET();
} else if (pantalla === 0) {
  // portada
  dibujobotonEMP();
  // ... (título y créditos)
    //Mostrar titulo 
    fill(213, 214, 0);
    textSize(40);
    textAlign(CENTER);
    textFont (titulos);
    text("Pandora what if", 30, 50, 580, 250);
    //Mostrar creditos
    fill(255);
    stroke(0);
    textSize(25);
    textAlign(CENTER);
    textFont(parrafos);
    //text("Oberti Fermin 119102/7 - Medina Salvador 119087/8", 5, 100, 250, 300);
  } else {
    dibujoboton();
  }
}

function dibujoboton() {
  fill(255);
  textSize(20);
  textAlign(CENTER);

  //Botón "SI"
  fill(255);
  rect(150, height - 80, 100, 50); // Botón en la parte inferior
  fill(0);
  text(botonSI, 150 + 50, height - 80 + 35); // Centrar texto en el botón

  //Botón "NO"
  fill(255);
  rect(400, height - 80, 100, 50); // Botón en la parte inferior
  fill(0);
  text(botonNO, 400 + 50, height - 80 + 35); // Centrar texto en el botón
}
function dibujobotonRESET() {
  fill(255);
  textSize(20);
  textAlign(CENTER);

  //Botón "REINICIAR"
  fill(255);
  rect(150, height - 80, 100, 50); // Botón en la parte inferior
  fill(0);
  text(botonRESET, 150 + 50, height - 80 + 35); // Centrar texto en el botón
}
function dibujobotonEMP() {
  fill(255);
  textSize(20);
  textAlign(CENTER);

  //Botón "COMENZAR"
  fill(255);
  rect(150, height - 80, 100, 50); // Botón en la parte inferior
  fill(0);
  text(botonEMP, 150 + 50, height - 80 + 35); // Centrar texto en el botón
}

function mousePressed() {
  // ------------------------------
  // 0) PANTALLA DE PORTADA
  // ------------------------------
  if (pantalla === 0) {
    // Botón COMENZAR (mismas coords que dibujobotonEMP)
    if (colisionBoton(150, height - 80, 100, 50)) {
      pantalla = 1;   // pasa a "Zeus crea a Pandora"
    }
     if (!sonido.isPlaying()) {
      sonido.loop();
    }
    return;
  }

  // ------------------------------------
  // 1) FINALES → BOTÓN REINICIAR
  // (FINAL GATO, FINAL ESPERANZA, FINAL CAOS)
  // ------------------------------------
  if (pantalla === 9 || pantalla === 13 || pantalla === 14) {
    // Botón REINICIAR (mismas coords que dibujobotonRESET)
    if (colisionBoton(150, height - 80, 100, 50)) {
      pantalla = 0;   // volver a la portada
    }
    return;
  }

  // ------------------------------------
  // 2) DECISIÓN 1: ¿ABRIR LA CAJA? (pantalla 1)
  // ------------------------------------
  if (pantalla === 1) {
    // Botón "SI" → la abre → rama derecha
    if (colisionBoton(150, height - 80, 100, 50)) {
      pantalla = 10;         // "empiezan a salir los males de la caja"
      return;
    }
    // Botón "NO" → no la abre → rama izquierda
    if (colisionBoton(400, height - 80, 100, 50)) {
      pantalla = 6;          // "pasan los días y la caja intenta atraerla..."
      return;
    }
  }

  // ------------------------------------
  // 3) RAMA IZQUIERDA (NO LA ABRE)
  // 6 → 7 → 8 → 9 (final)
  // ------------------------------------
  if (pantalla === 6 || pantalla === 7 || pantalla === 8) {
    // En estas pantallas, ambos botones se usan como "CONTINUAR"
    if (colisionBoton(150, height - 80, 100, 50) ||
        colisionBoton(400, height - 80, 100, 50)) {
      pantalla++;        // avanza a la siguiente de la rama
    }
    return;
  }

  // ------------------------------------
  // 4) RAMA DERECHA ANTES DE LA DECISIÓN 2
  // 10 → 11 → 12
  // ------------------------------------
  if (pantalla === 10 || pantalla === 11) {
    // de nuevo, cualquier botón avanza
    if (colisionBoton(150, height - 80, 100, 50) ||
        colisionBoton(400, height - 80, 100, 50)) {
      pantalla++;   // 10→11, 11→12
    }
    return;
  }

  // ------------------------------------
  // 5) DECISIÓN 2: ¿MIRAR AL FONDO O CERRAR?
  // pantalla 12
  // ------------------------------------
  if (pantalla === 12) {
    // "SI" → mirar más al fondo → final esperanza
    if (colisionBoton(150, height - 80, 100, 50)) {
      pantalla = 13;      // "encuentra la esperanza..."
      return;
    }
    // "NO" → cerrar la caja → final caos
    if (colisionBoton(400, height - 80, 100, 50)) {
      pantalla = 14;      // "nunca hubo esperanza..."
      return;
    }
  }
}




function colisionBoton(x, y, w, h) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}
