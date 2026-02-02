// TP Final Parte 2 - Mini juego (p5.js) - Pandora: "Atrapar la Esperanza"
// Oberti Fermin 119102/7 - Medina Salvador 119087/8
// Requisitos: 640x480, ARREGLOS, OBJETOS, IMÁGENES, SONIDO, POO (4+ clases)

let game;

const W = 640, H = 480;
let assets = {};
let sounds = {};

function preload() {
  // Imágenes
  assets.bg = loadImage("data/imagenes/bg.png");
  assets.pandora = loadImage("data/imagenes/pandora.png");
  assets.spirit = loadImage("data/imagenes/spirit.png");
  assets.hope = loadImage("data/imagenes/hope.png");
  assets.button = loadImage("data/imagenes/button.png");

  // Sonido (WAV para que funcione seguro local)
  soundFormats('wav');
  sounds.bg = loadSound("data/bg.wav");
  sounds.win = loadSound("data/win.wav");
  sounds.lose = loadSound("data/lose.wav");
}

function setup() {
  createCanvas(W, H);
  imageMode(CENTER);
  textFont("system-ui");
  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}

function keyPressed() {
  game.onKeyPressed(key, keyCode);
}

function mousePressed() {
  game.onMousePressed(mouseX, mouseY);
}

// ===========================
// CLASES (POO 4+)
// ===========================

class Game {
  constructor() {
    this.state = "INSTRUCTIONS"; // INSTRUCTIONS, PLAY, WIN, LOSE, CREDITS
    this.player = new Player(W/2, H-70);
    this.spirits = [];      // ARREGLO de enemigos
    this.particles = [];    // ARREGLO de partículas
    this.hope = new Hope(W/2, 90);
    this.spawnTimer = 0;
    this.timeLimit = 30;    // segundos
    this.t0 = millis();
    this.soundEnabled = true;
    this.musicStarted = false;

    this.btnStart = new Button(W/2, H-70, "COMENZAR");
    this.btnRetry = new Button(W/2, H-70, "REINICIAR");
    this.btnCredits = new Button(W/2, H-15, "CRÉDITOS", 140, 38);
    this.btnBack = new Button(W/2, H-70, "VOLVER");
    this.btnSound = new Button(W-85, 28, "SONIDO", 150, 38);
  }

  resetGame() {
    this.player = new Player(W/2, H-70);
    this.spirits = [];
    this.particles = [];
    this.hope = new Hope(random(80, W-80), random(80, 180));
    this.spawnTimer = 0;
    this.t0 = millis();
    this.state = "PLAY";
  }

  elapsedSeconds() {
    return (millis() - this.t0) / 1000.0;
  }

  ensureAudioUnlocked() {
    // En muchos navegadores el audio sólo arranca tras interacción del usuario
    if (!this.musicStarted) {
      userStartAudio();
      if (this.soundEnabled && sounds.bg && !sounds.bg.isPlaying()) {
        sounds.bg.setLoop(true);
        sounds.bg.play();
      }
      this.musicStarted = true;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      if (sounds.bg && sounds.bg.isPlaying()) sounds.bg.stop();
    } else {
      this.ensureAudioUnlocked();
    }
  }

  update() {
    // Partículas siempre
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].dead) this.particles.splice(i, 1);
    }

    if (this.state !== "PLAY") return;

    // Tiempo
    const t = this.elapsedSeconds();
    if (t >= this.timeLimit) {
      this.toLose();
      return;
    }

    // Player
    this.player.update();

    // Spawn de espíritus
    this.spawnTimer -= deltaTime;
    if (this.spawnTimer <= 0) {
      this.spawnSpirit();
      // aumenta dificultad con el tiempo
      const difficulty = map(t, 0, this.timeLimit, 900, 350);
      this.spawnTimer = difficulty;
    }

    // Enemigos
    for (let i = this.spirits.length - 1; i >= 0; i--) {
      const s = this.spirits[i];
      s.update();

      // Colisión con Pandora
      if (s.collides(this.player)) {
        this.toLose();
        return;
      }

      // Fuera de pantalla
      if (s.y > H + 80) {
        this.spirits.splice(i, 1);
      }
    }

    // Hope
    this.hope.update();
    if (this.hope.collides(this.player)) {
      this.toWin();
    }
  }

  spawnSpirit() {
    const x = random(40, W-40);
    const speed = random(1.4, 2.6) + this.elapsedSeconds() * 0.03;
    this.spirits.push(new Spirit(x, -40, speed));
  }

  toWin() {
    this.state = "WIN";
    this.makeBurst(W/2, H/2, 40);
    if (this.soundEnabled && sounds.win) sounds.win.play();
  }

  toLose() {
    this.state = "LOSE";
    this.makeBurst(W/2, H/2, 25, true);
    if (this.soundEnabled && sounds.lose) sounds.lose.play();
  }

  makeBurst(x, y, count, dark=false) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, dark));
    }
  }

  draw() {
    // Fondo
    image(assets.bg, W/2, H/2, W, H);

    // UI superior
    this.btnSound.draw(this.soundEnabled ? "SONIDO: ON" : "SONIDO: OFF");
    if (this.state === "PLAY") {
      this.drawHUD();
    }

    // Estado
    if (this.state === "INSTRUCTIONS") {
      this.drawInstructions();
      this.btnStart.draw();
      this.btnCredits.draw();
      return;
    }

    if (this.state === "CREDITS") {
      this.drawCredits();
      this.btnBack.draw();
      return;
    }

    // Gameplay draw (en PLAY/WIN/LOSE)
    this.hope.draw();
    for (const s of this.spirits) s.draw();
    this.player.draw();

    for (const p of this.particles) p.draw();

    if (this.state === "WIN") {
      this.drawOverlay("¡GANASTE!", "Atrapaste la Esperanza antes de que el tiempo termine.");
      this.btnRetry.draw();
    } else if (this.state === "LOSE") {
      this.drawOverlay("PERDISTE", "Los males te alcanzaron (o se acabó el tiempo).");
      this.btnRetry.draw();
    }
  }

  drawHUD() {
    const t = this.elapsedSeconds();
    const remaining = max(0, this.timeLimit - t);

    push();
    noStroke();
    fill(0, 140);
    rect(10, 10, 210, 58, 10);

    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    text("Objetivo: atrapá la Esperanza", 20, 18);
    text("Tiempo: " + remaining.toFixed(1) + "s", 20, 38);
    pop();
  }

  drawOverlay(title, subtitle) {
    push();
    noStroke();
    fill(0, 170);
    rect(0, 0, W, H);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(title, W/2, H/2 - 40);
    textSize(18);
    text(subtitle, W/2, H/2 + 10);
    textSize(14);
    text("Tip: Flechas para moverte. Presioná R para reiniciar.", W/2, H/2 + 45);
    pop();
  }

  drawInstructions() {
    push();
    noStroke();
    fill(0, 160);
    rect(0, 0, W, H);
    fill(255);
    textAlign(CENTER, TOP);
    textSize(32);
    text("Mini Juego: Atrapar la Esperanza", W/2, 40);

    textSize(16);
    text(
      "Instrucciones:\n" +
      "• Movete con ← → ↑ ↓\n" +
      "• Evitá los males que caen\n" +
      "• Atrapá la Esperanza antes de 30s\n\n" +
      "Resultados:\n" +
      "• Si agarrás la Esperanza: GANÁS\n" +
      "• Si te toca un mal o se acaba el tiempo: PERDÉS\n\n" +
      "Controles:\n" +
      "• Botón SONIDO: activar/desactivar\n" +
      "• Tecla R: reiniciar (en juego o al final)\n",
      W/2, 95
    );
    pop();
  }

  drawCredits() {
    push();
    noStroke();
    fill(0, 170);
    rect(0, 0, W, H);
    fill(255);
    textAlign(CENTER, TOP);
    textSize(34);
    text("Créditos", W/2, 60);
    textSize(18);
    text(
      "TP Final - Parte 2 (p5.js)\n" +
      "Comisión 3 - David Bedoian\n\n" +
      "Oberti Fermín 119102/7\n" +
      "Medina Salvador 119087/8\n\n" +
      "Temática: Pandora (what if)\n" +
      "Imágenes + sonidos incluidos en /data\n",
      W/2, 120
    );
    pop();
  }

  onKeyPressed(k, kc) {
    if (k === 'r' || k === 'R') {
      if (this.state === "PLAY" || this.state === "WIN" || this.state === "LOSE") {
        this.resetGame();
      }
    }
  }

  onMousePressed(mx, my) {
    // Sonido siempre clickeable
    if (this.btnSound.hit(mx, my)) {
      this.ensureAudioUnlocked();
      this.toggleSound();
      return;
    }

    if (this.state === "INSTRUCTIONS") {
      if (this.btnStart.hit(mx, my)) {
        this.ensureAudioUnlocked();
        this.resetGame();
        return;
      }
      if (this.btnCredits.hit(mx, my)) {
        this.state = "CREDITS";
        return;
      }
      this.ensureAudioUnlocked();
    }

    if (this.state === "CREDITS") {
      if (this.btnBack.hit(mx, my)) {
        this.state = "INSTRUCTIONS";
      }
      return;
    }

    if (this.state === "WIN" || this.state === "LOSE") {
      if (this.btnRetry.hit(mx, my)) {
        this.resetGame();
      }
      return;
    }
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 54;
    this.speed = 4.0;
  }
  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;

    this.x = constrain(this.x, this.size/2, W - this.size/2);
    this.y = constrain(this.y, this.size/2 + 50, H - this.size/2);
  }
  draw() {
    image(assets.pandora, this.x, this.y, this.size, this.size);
  }
  radius() { return this.size * 0.35; }
}

class Spirit {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = random(36, 54);
    this.wiggle = random(0.8, 1.6);
    this.phase = random(0, TWO_PI);
  }
  update() {
    this.y += this.speed;
    this.x += sin(frameCount * 0.05 * this.wiggle + this.phase) * 0.6;
  }
  draw() {
    image(assets.spirit, this.x, this.y, this.size, this.size);
  }
  collides(player) {
    const d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size*0.32 + player.radius());
  }
}

class Hope {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 44;
    this.bob = random(0, TWO_PI);
  }
  update() {
    this.bob += 0.05;
    this.y += sin(this.bob) * 0.4;
  }
  draw() {
    image(assets.hope, this.x, this.y, this.size, this.size);
    push();
    noFill();
    stroke(255, 230, 140, 90);
    strokeWeight(2);
    circle(this.x, this.y, this.size + 20 + sin(this.bob)*6);
    pop();
  }
  collides(player) {
    const d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size*0.30 + player.radius());
  }
}

class Particle {
  constructor(x, y, dark=false) {
    this.x = x;
    this.y = y;
    this.vx = random(-2.5, 2.5);
    this.vy = random(-3.5, -0.5);
    this.life = 60;
    this.dark = dark;
    this.dead = false;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.life--;
    this.dead = this.life <= 0;
  }
  draw() {
    push();
    noStroke();
    const a = map(this.life, 0, 60, 0, 160);
    if (this.dark) fill(40, 40, 40, a);
    else fill(255, 220, 140, a);
    circle(this.x, this.y, map(this.life, 0, 60, 2, 8));
    pop();
  }
}

class Button {
  constructor(x, y, label, w=180, h=50) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }
  draw(overrideLabel=null) {
    const lbl = overrideLabel ?? this.label;
    image(assets.button, this.x, this.y, this.w, this.h);
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(lbl, this.x, this.y+1);
    pop();
  }
  hit(mx, my) {
    return (mx > this.x - this.w/2 && mx < this.x + this.w/2 &&
            my > this.y - this.h/2 && my < this.y + this.h/2);
  }
}
