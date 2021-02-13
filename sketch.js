var START
var PLAY = 1;
var END = 0;
var gameState = START;

var runner, runnerImg;
var ground, invisibleGround, groundImage;

var bg,bgImg;

var star,startImg;

var obstacles,obstaclesGroup,obstaclesImg;

var score = 0;

var gameOver, restart;

function preload(){
  runnerImg =   loadAnimation("Runner1.png","Runner2.png","Runner3.png","Runner4.png","Runner5.png","Runner6.png","Runner7.png","Runner8.png","Runner9.png","Runner10.png");
  
  bgImg = loadImage("road.png");
  
  obstaclesImg = loadImage("obstacle.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  startImg = loadImage("start.png");
}

function setup() {
  createCanvas(600, 400);
  
  ground = createSprite(700,435,400,20);
  ground.scale = 2.2;
  ground.addImage(bgImg);
  ground.x = ground.width /2;
  ground.velocityX = -(3 + 2*score/100);
  
  runner = createSprite(50,370,20,20);
  runner.addAnimation("running", runnerImg);
  runner.scale = 0.4;
  
  start = createSprite(300,300);
  start.addImage(startImg);
  start.scale = 0.25;
  
  score = 0;
  
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,295);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  start.visible = false;
  
  
  invisibleGround = createSprite(200,370,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  
}

function play(){
  gameState = PLAY;
  runner.visible = true;
  start.visible = false;
  gameOver.visible = true;
  restart.visible = true;
  obstaclesGroup.setVelocityXEach(0);
}

function draw() {
  // runner.debug = true;
  background(200)
  
  if (gameState === START){
    start.visible = true;
    runner.visible = false;
  
    if(mousePressedOver(start)){
        gameState = PLAY;
        play();
    }
  }
  
  if (gameState===PLAY){
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(3 + 2*score/200);
  
    if(keyDown("space") && runner.y >= 280) {
      runner.velocityY = -12.5;
    }
  
    runner.velocityY = runner.velocityY + 0.7;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    runner.collide(invisibleGround);
    spawnObstacle();
  
    if(obstaclesGroup.isTouching(runner)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    runner.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  fill("black");
  textSize(20);
  text("Score: "+ score, 470,50);
  
}

function spawnObstacle() {
//   //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    obstacles = createSprite(600,328,30,30);
    obstacles.addImage(obstaclesImg);
    obstacles.scale = 0.05;
    obstacles.velocityX = -(5 + 1.2*score/100);
    obstacles.setCollider("circle",0,0,400);
    // obstacles.debug = true;
    
    
//      //assign lifetime to the variable
    obstacles.lifetime = 200;
    
//     //adjust the depth
    obstacles.depth = runner.depth;
    runner.depth = runner.depth + 1;
    
//     //add each cloud to the group
    obstaclesGroup.add(obstacles);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  
  score = 0;
  
}