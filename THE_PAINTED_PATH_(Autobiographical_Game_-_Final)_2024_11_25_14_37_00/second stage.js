//this game inspired from this assignment https://editor.p5js.org/feliciatiffany/sketches/02r6mHOqX and learn here https://www.youtube.com/watch?v=eHZXvR6NDLo 

//opening, little intro
function openingConcert(){
  if (calmsong.isPlaying()) {
    calmsong.pause()
  } else if (!upbeatsong.isPlaying()){
    upbeatsong.play()
  }
  
  image (stage2_opening,0,0, 600,400)
  firstFrame++;
  if (firstFrame >= 500) {
    firstFrame = 0; // Reset frame counter
    gameState = "opening second stage";
  }
}

//still second intro and instruction page, changing the duration with changing the number in here (firstFrame >= 400)
function startConcert (){
  background (0)
  image (stage2_opening2,0,0, 600,400)
  firstFrame++;
  if (firstFrame >= 400) {
    firstFrame = 0; // Reset frame counter
    gameState = "second stage"; 
  }
  
//   fill(255);
//   textSize(24);
//   text("Getting to Front of Concert", width / 2, height / 2 - 40);
//   textSize(16);
//   text("Survive for 20 seconds by dodging the bouncing balls.", width / 2, height / 2);
  
  firstFrame++;
  if (firstFrame >= 300) {
    firstFrame = 0; // Reset frame counter
    gameState = "second stage"; // Switch to quiz state after 5 seconds
  }

}

//game dodging the ball start
function concert() {
  image (concertbackground,0,0,600,400)
  
 if (!concertOver && !concertWon) {
    // Update timer
    timer -= deltaTime / 1000;

    // Display timer
    fill(255);
    text("Time Left: " + timer.toFixed(1) + "s", width / 2, 30); // one decimal place

    // Check if the player survived for 20 seconds
    if (timer <= 0) {
      concertWon = true;
      winConcert();
    }

    // for player
    playerConcert.move();
    playerConcert.render();

    // generate new balls over time, higher divider, slower it will show
    if (frameCount % 150 == 0) {
      balls.push(new Ball());
    }

    //display each ball
    for (let i = balls.length - 1; i >= 0; i--) {
      balls[i].move();
      balls[i].render();

      //check collision with player
      if (balls[i].hits(playerConcert)) {
        concertOver = true;
        endConcert(); //realize I actually can just change the game state 
      }
    } 
  } else if (concertWon==true){
    winConcert();
  }
}

// go to game over page if lose
function endConcert() {
  // fill(255, 0, 0);
  // textSize(32);
  // text("Game Over!", width / 2, height / 2);
  // textSize(20);
  // text("You couldn't survive 20 seconds!", width / 2, height / 2 + 40);
  gameState = "game over"
}

// play winning message before going to the maze again
function winConcert() {
  // fill(0, 255, 0);
  // textSize(32);
  // text("You Win!", width / 2, height / 2);
  // textSize(20);
  // text("You survived 20 seconds!", width / 2, height / 2 + 40);
  image (stage2_ending,0,0,600,400)
  
  firstFrame++;
  if (firstFrame >= 300) {
    firstFrame = 0; // reset frame
    gameState = "play"; 
  }
}

// Player class, using the same player sprite, similar concept
class PlayerConcert {
  constructor() {
    this.size = 30; //ball size
    this.x = width / 2;
    this.y = height - this.size * 2;
    
    this.sprite_left = [left1, left2, left3, left4]
    this.sprite_right = [right1,right2, right3, right4]
    this.sprite_front = [front1,front2,front3,front4]
    this.sprite_behind = [behind1,behind2,behind3,behind4]
    this.currentSprites = this.sprite_front; //face front at first
    this.img_counter = 0;
    this.frameCounter = 0; // Counter for animation speed
    this.animationSpeed = 10; 
    
  }

  //SHAPE of player
  render() {
    // fill(0, 200, 255);
    // ellipse(this.x, this.y, this.size, this.size);
    
     image(this.currentSprites[this.img_counter], this.x-15, this.y-16,this.size+10,this.size+13)
      
    
  }
  //MOVING PLAYER
  move() {
   
    if (keyIsDown(37)) {
      this.x -= 5;
      this.currentSprites = this.sprite_left;
    } else if (keyIsDown(39)) {
      this.x += 5;
      this.currentSprites = this.sprite_right;
    } else if (keyIsDown(38)) {
      this.y -= 5;
      this.currentSprites = this.sprite_behind;
    } else if (keyIsDown(40)) {
      this.y += 5;
      this.currentSprites = this.sprite_front;
    }
    this.moveCounter++;
    
    //keep player inside the canvas
      this.frameCounter++;

    // Change the sprite only if the frameCounter reaches the animation speed
    if (this.frameCounter >= this.animationSpeed) {
      this.img_counter++;
      if (this.img_counter >= this.currentSprites.length) {
        this.img_counter = 0; // Loop back to the first frame
      }
      this.frameCounter = 0; // Reset the frame counter
    }
    this.x = constrain(this.x, this.size / 2, width - this.size / 2); 
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
  }
  

  
}

      
// Ball class for bouncing obstacles
class Ball {
  constructor() {
    this.size = random(20, 40);
    this.x = random(this.size / 2, width - this.size / 2);
    this.y = random(this.size / 2, height - this.size / 2);
    // speed of ball
    this.xSpeed = random(0, 6);
    this.ySpeed = random(0, 6); 
  }

  render() {
    // fill(255, 100, 100);
    // ellipse(this.x, this.y, this.size);
  image(ball1,this.x-this.size / 2,this.y-this.size / 2,this.size,this.size)

  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce off right left
    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.xSpeed *= -1; //speed reverses/bounce
    }

    // Bounce off top and bottom
    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.ySpeed *= -1;
    }
  }


  hits(PlayerConcert) {
    // Check for collision with the player
    let d = dist(this.x, this.y, PlayerConcert.x, playerConcert.y);
    return d < this.size / 2 + PlayerConcert.size / 2; // if < then it's overlap and return true
  }
}