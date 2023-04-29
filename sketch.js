const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Render = Matter.Render;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Composites = Matter.Composites;

var engine, world;
var scene, cutBtn, cutBtn2, cutBtn, muteBtn, melon, melonImg, rope, rope2, rope3, ground, rabbit, connect, connect2, connect3, airBlower;
var blinkAnimation, eatAnimation, sadAnimation;
var BM, RC, SS, ES, ABS;

function preload() {
  scene = loadImage("assets/background.png");
  melonImg = loadImage("assets/melon.png");

  blinkAnimation = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eatAnimation = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sadAnimation = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");

  blinkAnimation.playing = true;
  eatAnimation.playing = true;
  sadAnimation.playing = true;

  eatAnimation.looping = false;
  sadAnimation.looping = false;

  BM = loadSound("assets/sound1.mp3");
  RC = loadSound("assets/rope_cut.mp3");
  SS = loadSound("assets/sad.mp3");
  ES = loadSound("assets/eating_sound.mp3");
  ABS = loadSound("assets/air.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  BM.play();
  BM.setVolume(0.2);

  ground = new Ground(width / 2, height - 5, width, 10);

  rope = new Rope(7, {
    x: width/2,
    y: 30
  });

  rope2 = new Rope(10, {
    x: width/2 - 220,
    y: 90
  });

  rope3 = new Rope(9, {
    x: width/2 + 200,
    y: 90
  });

  melon = Bodies.circle(width/2, 10, 20);
  Matter.Composite.add(rope.body, melon);

  connect = new Link(rope, melon);
  connect2 = new Link(rope2, melon);
  connect3 = new Link(rope3, melon);

  blinkAnimation.frameDelay = 10;
  eatAnimation.frameDelay = 10;
  sadAnimation.frameDelay = 10;

  rabbit = createSprite(470, height - 120, 50, 50);
  rabbit.addAnimation("blink", blinkAnimation);
  rabbit.addAnimation("eat", eatAnimation);
  rabbit.addAnimation("sad", sadAnimation);
  rabbit.changeAnimation("blink");
  rabbit.scale = 0.3;

  cutBtn = createImg("assets/cut_btn.png");
  cutBtn.position(width / 2 - 50, 5);
  cutBtn.size(100, 50);
  cutBtn.mouseClicked(drop);

  cutBtn2 = createImg("assets/cut_btn.png");
  cutBtn2.position(width / 2 - 260, 90);
  cutBtn2.size(100, 50);
  cutBtn2.mouseClicked(drop2);

  cutBtn3 = createImg("assets/cut_btn.png");
  cutBtn3.position(width / 2 + 150, 90);
  cutBtn3.size(100, 50);
  cutBtn3.mouseClicked(drop3);

  airBlower = createImg("assets/balloon.png");
  airBlower.position(0, 200);
  airBlower.size(100, 100);
  airBlower.mouseClicked(blow);

  muteBtn = createImg("assets/mute.png");
  muteBtn.position(0, 10);
  muteBtn.size(50, 50);
  muteBtn.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(scene);
  Engine.update(engine);

  push();
  imageMode(CENTER);
  if (melon != null) {
    image(melonImg, melon.position.x, melon.position.y, 70, 70);
  }
  pop();

  if (collide(melon, rabbit) == true) {
    rabbit.changeAnimation("eat");
    ES.play();

    swal({
      title: `YOU WON!`,
      text: `CONGRATULATIONS`,
      imageUrl: `https://www.freepnglogos.com/uploads/trophy-png/trophy-award-winner-png-33.png`,
      imageSize: `150x150`,
      confirmButtonText: `Play Again`
    }, (isConfirm) => {
      if (isConfirm) {
        location.reload();
      }
    })
  }

  if (melon != null && melon.position.y >= height - 40) {
    rabbit.changeAnimation("sad");
    SS.play();
    melon = null;
    BM.stop();

    swal({
      title: `YOU LOSE!`,
      text: `YOU SNOOZE YOU LOSE`,
      imageUrl: `https://cdn-icons-png.flaticon.com/512/4099/4099871.png`,
      imageSize: `200x200`,
      confirmButtonText: `Play Again`
    }, (isConfirm) => {
      if (isConfirm) {
        location.reload();
      }
    })
  }

  rope.show();
  rope2.show();
  rope3.show();
  drawSprites();
}

function drop() {
  connect.cut();
  RC.play();
  rope.break();
}

function drop2() {
  connect2.cut();
  RC.play();
  rope2.break();
}

function drop3() {
  connect3.cut();
  RC.play();
  rope3.break();
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);

    if (d <= 100) {
      World.remove(world, melon);
      melon = null;
      return true
    } else {
      return false
    }
  }
}

function blow() {
  Matter.Body.applyForce(melon, {
    x: 0,
    y: 0
  }, {
    x: 0.01,
    y: 0
  });

  ABS.play();
}

function mute() {
  if (BM.isPlaying()) {
    BM.stop();
  } else {
    BM.play();
  }
}