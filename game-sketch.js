/************************************************************

Game Project Sumbission Code

## How to play the game

    - The game's instructions are displayed when the HTML page is loaded. Press the space bar to start the game.
    - The objective of the game is to collect all 7 fishes. There are 4 fishes that can be collected by jumping from the ground, and 3 fishes that requires the player to jump from a platform to collect.
    - The player has 3 lives. Lives can be lost by falling into canyons. Each life remaining at the end of the game contributes to 1 point.
    - There are 2 ways the game ends: by completing the level, or by losing all lives.
    - The level is completed once the player reaches the flagpole with all 7 fishes collected. The location of the flagpole is randomly allocated during the game's set up.
    - The player gets a hint of the location of the flagpole on the top right hand corner of the screen.


## Extension 1: Added sounds

    - Types of sounds added:
        1. A sound that plays on loop, only while the game is being played.
        2. A sound that is played once the level has been completed.
        3. A sound that is played once when the character jumps.
        4. A sound that is played once when the character falls through the canyon.

    - Difficulties and Lessons Learnt:
        1. At the initial stages of developing the code, the sounds to be played when the game enters a state of plummeting into a canyon and when the character completes the level played infinitely. I had difficulties getting the sound to stop playing after it has played once.
        To use this sound.isPlaying() was used as a condition to play the sound only if it is not already playing, within the condition that checks if the state has been entered.
        I learnt the importance of searching through the online community with people who have encountered such issues, and building on the lessons from the solutions suggested by other coders.


## Extension 2: Platforms with factory pattern

    - Platforms were created using the user-defined function createPlatforms(x,y,length, draw, checkContact) function. Draw and checkContact are subfunctions. To make the player utilize the platform, 3 of the collectables will be located in a y-position that can only be reached if the user uses the platform.

    - Difficulties and lessons learnt:
        Initally, I had difficulties with the character's states when it was on a platform. When moving left and right on the platform, the character was in a "isLeft" and "isFalling" state, since the character is above the platform level.
        To tackle this, instead of setting isFalling to true whenever the character is above the ground level, a new variable isContact was defined within the conditional statement. I parsed through all items of the platforms object to identify if the character is on the platform. This ensures that isFalling is true only when then character is not in contact with the platform. It was only through multiple iterations and re-looking at what each code does, that this was identified.
        I learnt the importance of having good code formatting practice (indentations and new lines) and keeping extensive documentation of codes. Even though I was the one who developed the codes from the start, after some time, it can be easy to forget what each section of the code does if documentation is not proper.

************************************************************/

// Define Variables for game character position
var gameChar_x;
var gameChar_y;
var gameChar_world_x;

// Define Variables for game environment
var floorPos_y;
var scrollPos;

// Define variables for game character direction
var isLeft;
var isRight;
var isFalling;
var isPlummeting;

// Define variables for game background objects
var trees;
var clouds;
var canyons;
var mountains;
var collectables;
var platforms;

// Define variables for game progress
var game_score;
var lives;
var flagPole;

// Define variables for game state
var pregame;


function setup()
{
    // Create canvas
    var c = createCanvas(800,500);
    c.parent('app');

    // Initialise floor position
    floorPos_y = height * 3/4;

    // Initialise lives to 3
    lives=3;

    // Initialise game_score to 0
    game_score=0;

    // StartGame function initialises variables
    startGame();

    restartChar();

    // Set pregame status to true
    pregame=true;

}

function draw()
{
    // sky blue
	background(100, 155, 255);

    // green ground
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4);

    // Start a new drawing state
    push();

    // Translate screen's x position by scrollPos value
    translate(scrollPos,0);

    // Draw clouds
    drawClouds();

    // Draw mountains
    drawMountains();

    // Draw trees
    drawTrees();

    // Draw canyons
    for (var i=0; i<canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    // Draw collectable items
    for (var i=0; i<collectables.length; i++){
        if(collectables[i].is_found==false){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    // Draw platforms
    for (var i=0; i<platforms.length; i++){
        platforms[i].draw();
    }

    if (pregame==true){

        // Load instructions pregame
        noStroke();
        fill(200,220);
        rect(100,100,width-200,height-200);
        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(20);
        text("Explore the forest and collect all " + collectables.length + " fishes.", width/2,200);
        text("Jump over all canyons. Lose a life when you fall into a canyon.", width/2,250);
        text("Find the flag pole once all salmon have been collected.", width/2,300);
        text("You have " +lives +" lives now. Earn 1 point for each extra life left at the end.",width/2,350);
        textSize(30);
        text("PRESS THE SPACE BAR TO BEGIN", width/2,450);

    }

    // Draw the game character and game displays only if the state is not in pregame
    if (pregame==false){

        // Update real position of gameChar for collision detection.
        gameChar_world_x = gameChar_x - scrollPos;

        // Render flag pole and check if flagpole is reached
        renderFlagPole();

        if(!flagPole.isReached){
            checkFlagPole();
        }

        // Restore original state
        pop();

        // Draw game character.
        drawGameChar();

        // Game displays
        fill(0);
        noStroke();
        textSize(20);
        textAlign("left");

        // Display Number of Salmon Collected
        text("COLLECTED: " + game_score + "/"+ collectables.length, 30, 30);

        // Display Lives left
        text("LIVES: ", 30, 60);
        for (var i=0; i<lives; i++){
            fill(255,0,0);
            ellipse(110+(22*i),50,20,20);
        }

        // Flag pole displays
        fill(0);
        noStroke();
        textAlign(RIGHT);

         // Display instruction to find flagpole if all collectables have been found
        if (game_score==collectables.length && !flagPole.isReached && lives >0){
            text("FIND THE FLAGPOLE TO COMPLETE LEVEL", width-20,60);
        }

        // Display Flagpole direction
        text("FLAGPOLE DIRECTION:", width-100, 30);

        // Draw arrow direction
        stroke(0);
        strokeWeight(3);

        // Arrow line
        line(width-30,25,width-80,25);
        if((gameChar_world_x-(flagPole.x_pos)) > 0){
            triangle(width-80,25,width-70,20,width-70,30)
        }

        // Arrow head dependent on character's location relative to the flagpole
        if((gameChar_world_x-(flagPole.x_pos)) < 0){
            triangle(width-30,25,width-40,20,width-40,30);
        }

        // Display warning if character is beyond -5000/5000 pixels from fram
        noStroke();
        textAlign(CENTER);

        if(gameChar_world_x < (-5000)){
           text("No more salmons in this direction", width/2, height-100);
        }

        if(gameChar_world_x > (5000)){
           text("No more salmons in this direction", width/2, height-100);
        }

    }

    // Character control

        // Make the character look like it is moving to the left of the screen
    	if(isLeft)
        {
            if(gameChar_x > width * 0.3)
            {
                // Move x position of game character if the character is still less than 30% off the side of the left side of the screen
                gameChar_x -= 5;
            }
            else
            {
                // Move screen if the character is more than 30% off the side of the left side of the screen
                scrollPos += 5;
            }
        }

        // Make the character look like it is moving to the right of the screen
        if(isRight)
        {
            if(gameChar_x < width * 0.7)
            {
                // Move x position of game character if the character is still less than 30% off the side of the right  side of the screen
                gameChar_x  += 5;
            }
            else
            {
                // Move screen if the character is more than 30% off the side of the right side of the screen
                scrollPos -= 5;
            }
        }

        // Character fall if Plummeting.
        if(isPlummeting){
            isLeft=false;
            isRight=false;
            isFalling=false;
            gameChar_y+=5;
        }

        // Make the game character rise and fall
        if(gameChar_y<floorPos_y){

            // Check if character is below a platform when character is jumping
            var  isContact=false;

            for (var i=0; i<platforms.length; i++){
                if(platforms[i].checkContact(gameChar_world_x,gameChar_y)==true){
                    isContact=true;
                    break;
                }
            }

            if(!isContact){
                gameChar_y+=2;
                isFalling=true;

            }
            else if (isContact){
//                gameChar_y+=2
                isFalling=false;
            }
        }
        else{
            isFalling=false;
        }

    if(isPlummeting){
        gameChar_y += 10;
    }


    // Check if the game character is dead
    checkPlayerDie();

    // Game over message when 0 lives are left
    if(lives<=0){
        noStroke();
        fill(200,220);
        rect(100,100,width-200,height-200);
        fill(0);
        stroke(0);
        textSize(50);
        textAlign("center");
        text("Game Over.",width/2, height/2);
        text("Press Space to Play Again.",width/2, height/2+100);
        // Calculate total score
        text("Total Score: " + (game_score + lives) ,width/2, height/2-100);

        return;
    }

    // Level complete message if flagpole is reached
    if (flagPole.isReached){
        noStroke();
        fill(200,220);
        rect(100,100,width-200,height-200);
        fill(0);
        stroke(0);
        textSize(50);
        textAlign("center");
        text("Level Complete.",width/2, height/2);
        text("Press Space to Play Again.",width/2, height/2+100);
        // Calculate total score
        text("Total Score: " + (game_score+lives),width/2, height/2-100);


        return;
    }

}


// Key Controls

function keyPressed()
{
    // Press left key to move left. Only allow character to move left if there are still lives and level not complete.
    if(lives>0 && flagPole.isReached==false && pregame==false
       && keyCode==37){
        isLeft=true;
    }

    // Press right key to move right. Only allow character to move right if there are still lives and level not complete.
    if(lives>0 && flagPole.isReached==false && pregame==false
       && keyCode==39){
        isRight=true;
    }

    // Press space bar to jump. Allow jumps only when character is on the ground, anad if there are still lives and level not complete.
    if(lives>0 && flagPole.isReached==false && pregame==false
       && keyCode==32
       && gameChar_y==floorPos_y){
        gameChar_y-=100;
    }

    // Press space bar to jump when character is on the platform. Allow jumps only when character is on the platform only if there are still lives and level not complete.
    for (var i=0; i<platforms.length; i++){
        if(platforms[i].checkContact(gameChar_world_x,gameChar_y)==true && keyCode==32){
            gameChar_y-=100;
        }
    }

    // Reset game upon space bar if the game is over or if the level has been completed.
    if((lives<=0 || flagPole.isReached)
       && keyCode==32){
        setup();
    }

    // If space bar is pressed during pregame state, change state to game state.
    if(keyCode==32 && pregame==true){

        // Set pregame to false;
        pregame=false;
    }
}

function keyReleased()
{
	// Stop moving left when key is released
    if(keyCode==37){
        isLeft=false;
    }

    // Stop moving right when key is released
    if(keyCode==39){
        isRight=false;
    }
}


// Initialise variables for game scene background

function startGame()
{

    // Initialize array of trees, randomly spread across game space, with different shades of green.
    trees=[];
    for (var i=0; i<50; i++){
        trees.push({pos_x:round(random(-15000,5000)),
                    colour_green:round(random(100,150))
                   });
    }

    // Initialise array of clouds, randomly spread across game space at random intervals and sizes
    clouds=[];
    for (var i=0; i<150; i++){
        clouds.push({pos_x:round(random(-15000,15000)),
                     pos_y:round(random(90,160)),
                     size: round(random(80,130))
                   });
    }

    // Initialise array of mountains, randomly spread across the game space at random intervals and  sizes
    mountains=[];
    for (var i =0; i<30; i++){
        mountains.push({pos_x:round(random(-15000,15000)),
                       pos_y:floorPos_y,
                       size:round(random(50,150))
                       });
    }

    // Initialise array of canyons at random intervals, separated into 2 loops to prevent canyons from appearing too early in the game
    canyons=[];
    for (var i =0; i<5; i++){
        canyons.push({pos_x:round(random(-5000,-1000)),
                       pos_y:floorPos_y,
                       width:round(random(60,120))
                       });
    }
    for (var i =0; i<5; i++){
        canyons.push({pos_x:round(random(1000,5000)),
                       pos_y:floorPos_y,
                       width:round(random(60,140))
                       });
    }

    // Initialise array of collectables at random locations across the game for normal level
    collectables=[];
    for (var i =0; i<4; i++){
        collectables.push({pos_x:round(random(-5000,5000)),
                           pos_y:round(random(310,320)),
                           size:round(random(90,100)),
                           is_found:false
                          });
    }


    // Initialise end point (flagPole object)
    flagPole={
        isReached:false,
        x_pos: random(-5000,5000)
    }

    // Initialise array of platforms
    platforms=[];
    for (var i = 0; i<5; i++){
        platforms.push(createPlatforms(random(-4000,4000),
                                       floorPos_y-90,
                                       random(150,100)));
        if(i==0 || i==1 || i==2){
            // Add collectable at first 3 random locations
            collectables.push({pos_x:platforms[i].x-random(0,50),
                               pos_y:round(random(230,240)),
                               size:round(random(90,100)),
                               is_found:false
                          });
        }

    }
}


// Initialise variables starting character position and state

function restartChar()
{
    // Set the starting position of character
    gameChar_x = width/2;
	  gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
}


// Render game character

function drawGameChar()
{
    // Draw character falling/jumping left
    if(isLeft && isFalling){

        // arms
        fill(205,100,63);
        ellipse(gameChar_x-20,gameChar_y-96,20,20);
        ellipse(gameChar_x+20,gameChar_y-96,20,20);

        // legs
        ellipse(gameChar_x-12,gameChar_y-52,24,30);
        ellipse(gameChar_x+12,gameChar_y-52,24,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-80,50,60);
        fill(245,222,179);
        ellipse(gameChar_x-10,gameChar_y-80,20,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x+10,gameChar_y-130,20,20);
        ellipse(gameChar_x-22,gameChar_y-130,20,20);
        fill(245,222,179);
        ellipse(gameChar_x+10,gameChar_y-130,8,8);
        ellipse(gameChar_x-22,gameChar_y-130,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x-6,gameChar_y-120,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x-14,gameChar_y-114,20,16);
        fill(55,20,30);
        ellipse(gameChar_x-16,gameChar_y-114,10,6)

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x-18,gameChar_y-126,6,6);
        ellipse(gameChar_x-6,gameChar_y-126,6,6);
	}

    // Draw character falling/jumping right
	else if(isRight && isFalling){

        // arms
        fill(205,100,63);
        ellipse(gameChar_x+20,gameChar_y-96,20,20);
        ellipse(gameChar_x-20,gameChar_y-96,20,20);

        // legs
        ellipse(gameChar_x+12,gameChar_y-52,24,30);
        ellipse(gameChar_x-12,gameChar_y-52,24,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-80,50,60);
        fill(245,222,179);
        ellipse(gameChar_x+10,gameChar_y-80,20,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x-10,gameChar_y-130,20,20);
        ellipse(gameChar_x+22,gameChar_y-130,20,20);
        fill(245,222,179);
        ellipse(gameChar_x-10,gameChar_y-130,8,8);
        ellipse(gameChar_x+22,gameChar_y-130,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x+6,gameChar_y-120,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x+14,gameChar_y-114,20,16);
        fill(55,20,30);
        ellipse(gameChar_x+16,gameChar_y-114,10,6)

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x+18,gameChar_y-126,6,6);
        ellipse(gameChar_x+6,gameChar_y-126,6,6);
	}

	// draw character moving left
    else if(isLeft) {

        // arms
        fill(205,100,63);
        ellipse(gameChar_x-20,gameChar_y-50,20,20);
        ellipse(gameChar_x+20,gameChar_y-50,20,20);

        // legs
        ellipse(gameChar_x-10,gameChar_y-10,20,30);
        ellipse(gameChar_x+10,gameChar_y-10,20,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-40,50,60);
        fill(245,222,179);
        ellipse(gameChar_x-10,gameChar_y-40,20,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x-16,gameChar_y-90,20,20);
        ellipse(gameChar_x+16,gameChar_y-90,20,20);
        fill(245,222,179);
        ellipse(gameChar_x-16,gameChar_y-90,8,8);
        ellipse(gameChar_x+16,gameChar_y-90,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-80,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x-8,gameChar_y-72,20,16);
        fill(55,20,30);
        ellipse(gameChar_x-10,gameChar_y-72,10,6)

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x-12,gameChar_y-86,6,6);
        ellipse(gameChar_x,gameChar_y-86,6,6);
	}

    // Draw character moving right
    else if(isRight){

        // arms
        fill(205,100,63);
        ellipse(gameChar_x+20,gameChar_y-50,20,20);
        ellipse(gameChar_x-20,gameChar_y-50,20,20);
        //teddy legs
        ellipse(gameChar_x+10,gameChar_y-10,20,30);
        ellipse(gameChar_x-10,gameChar_y-10,20,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-40,50,60);
        fill(245,222,179);
        ellipse(gameChar_x+10,gameChar_y-40,20,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x-16,gameChar_y-90,20,20);
        ellipse(gameChar_x+16,gameChar_y-90,20,20);
        fill(245,222,179);
        ellipse(gameChar_x-16,gameChar_y-90,8,8);
        ellipse(gameChar_x+16,gameChar_y-90,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-80,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x+8,gameChar_y-74,20,16);
        fill(55,20,30);
        ellipse(gameChar_x+10,gameChar_y-74,10,6)

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x+12,gameChar_y-86,6,6);
        ellipse(gameChar_x,gameChar_y-86,6,6);
	}


    // Draw character plummeting down
	else if(isPlummeting){

        // arms
        fill(205,100,63);
        ellipse(gameChar_x-24,gameChar_y-80,20,20);
        ellipse(gameChar_x+24,gameChar_y-80,20,20);

        // legs
        ellipse(gameChar_x-10,gameChar_y-36,24,30);
        ellipse(gameChar_x+10,gameChar_y-36,24,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-60,50,60);
        fill(245,222,179);
        ellipse(gameChar_x,gameChar_y-60,36,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x-16,gameChar_y-116,20,20);
        ellipse(gameChar_x+16,gameChar_y-116,20,20);
        fill(245,222,179);
        ellipse(gameChar_x-16,gameChar_y-116,8,8);
        ellipse(gameChar_x+16,gameChar_y-116,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-100,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x,gameChar_y-94,20,16);
        fill(55,20,30);
        ellipse(gameChar_x,gameChar_y-94,10,6);

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x-6,gameChar_y-106,6,6);
        ellipse(gameChar_x+6,gameChar_y-106,6,6);
	}

    // Draw character when it is not moving
	else{

        // arms
        fill(205,100,63);
        ellipse(gameChar_x-24,gameChar_y-50,20,20);
        ellipse(gameChar_x+24,gameChar_y-50,20,20);

        // legs
        ellipse(gameChar_x-10,gameChar_y-10,20,30);
        ellipse(gameChar_x+10,gameChar_y-10,20,30);

        // tummy
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-40,50,60);
        fill(245,222,179);
        ellipse(gameChar_x,gameChar_y-40,36,40);

        // ears
        fill(205,100,63);
        ellipse(gameChar_x-16,gameChar_y-90,20,20);
        ellipse(gameChar_x+16,gameChar_y-90,20,20);
        fill(245,222,179);
        ellipse(gameChar_x-16,gameChar_y-90,8,8);
        ellipse(gameChar_x+16,gameChar_y-90,8,8);

        // head
        fill(205,100,63);
        ellipse(gameChar_x,gameChar_y-80,40,40);

        // nose
        fill(245,222,179);
        ellipse(gameChar_x,gameChar_y-74,20,16);
        fill(55,20,30);
        ellipse(gameChar_x,gameChar_y-74,10,6);

        // eyes
        fill(55,20,30);
        ellipse(gameChar_x-6,gameChar_y-86,6,6);
        ellipse(gameChar_x+6,gameChar_y-86,6,6);
    }
}


//Render background

function drawClouds()
{

    for (var i=0; i<clouds.length; i++){
            noStroke();
            fill(255);
            ellipse(clouds[i].pos_x,
                    clouds[i].pos_y,
                    80*clouds[i].size/100,
                    80*clouds[i].size/100);
            ellipse(clouds[i].pos_x+(50*clouds[i].size/100),
                    clouds[i].pos_y,
                    100*clouds[i].size/100,
                    100*clouds[i].size/100);
            ellipse(clouds[i].pos_x+(100*clouds[i].size/100),
                    clouds[i].pos_y,
                    80*clouds[i].size/100,
                    80*clouds[i].size/100);
    }
}

function drawMountains()
{

    for (var i=0; i<mountains.length; i++){

        noStroke();

        //base
        fill(50,80,80);
        triangle(mountains[i].pos_x,
                 mountains[i].pos_y-(232*mountains[i].size/100),
                 mountains[i].pos_x-(250*mountains[i].size/100),
                 mountains[i].pos_y,
                 mountains[i].pos_x+(250*mountains[i].size/100),
                 mountains[i].pos_y);
        triangle(mountains[i].pos_x+(100*mountains[i].size/100),
                 mountains[i].pos_y-(182*mountains[i].size/100),
                 mountains[i].pos_x-(250*mountains[i].size/100),
                 mountains[i].pos_y,
                 mountains[i].pos_x+(250*mountains[i].size/100),
                 mountains[i].pos_y);

        //ice cap
        fill(255,248,220);
        triangle(mountains[i].pos_x,
                 mountains[i].pos_y-(232*mountains[i].size/100),
                 mountains[i].pos_x-(108*mountains[i].size/100),
                 mountains[i].pos_y-(132*mountains[i].size/100),
                 mountains[i].pos_x+(111*mountains[i].size/100),
                 mountains[i].pos_y-(132*mountains[i].size/100));
        triangle(mountains[i].pos_x+(100*mountains[i].size/100),
                 mountains[i].pos_y-(182*mountains[i].size/100),
                 mountains[i].pos_x-(108*mountains[i].size/100),
                 mountains[i].pos_y-(132*mountains[i].size/100),
                 mountains[i].pos_x+(141*mountains[i].size/100),
                 mountains[i].pos_y-(132*mountains[i].size/100));

    }
}

function drawTrees()
{

    for(var i=0; i< trees.length; i++){

        noStroke();

        // trunk
        fill(139,69,19);
        rect(trees[i].pos_x-50,
             floorPos_y-120,
             50,
             120);

        //bushes
        fill(46,trees[i].colour_green,87);
        triangle(trees[i].pos_x-75,
                 floorPos_y-120,
                 trees[i].pos_x-25,
                 floorPos_y-220,
                 trees[i].pos_x+25,
                 floorPos_y-120);
        triangle(trees[i].pos_x-75,
                 floorPos_y-70,
                 trees[i].pos_x-25,
                 floorPos_y-170,
                 trees[i].pos_x+25,
                 floorPos_y-70);

    }
}

function drawCanyon(t_canyon)
{

    // render canyon objects

    //sand
    fill(244,164,96);
    rect(t_canyon.pos_x,
         t_canyon.pos_y-5,
         15,
         195);
    rect(t_canyon.pos_x+15+t_canyon.width,
         t_canyon.pos_y-5,
         15,
         195);

    //water
    fill(0,255,255);
    rect(t_canyon.pos_x+15,
         t_canyon.pos_y,
         t_canyon.width,
         190);
}

function createPlatforms(x,y,length)
{

    var p={
        x:x,
        y:y,
        length:length,
        draw: function(){
            noStroke();
            fill(255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y){

            if(gc_x> this.x-15 && gc_x< (this.x+this.length+20)){

                var d= this.y- gc_y;
                if (d>=-2 && d<5){
                    return true;
                }
                return false; // if it is not on the platform
            }
        }
    }

    return p;
}


// Check if player is falling down the canyon and is loses a life
function checkCanyon(t_canyon)
{

    // Check if character is 20 pixels in canyon
    if(gameChar_world_x>t_canyon.pos_x+20 &&
       gameChar_world_x<(t_canyon.pos_x+t_canyon.width)-20 &&
       gameChar_y>=floorPos_y){
        isPlummeting=true;
    }
}

function checkPlayerDie()
{

    if(gameChar_y>height && lives>=1){

        // Reduce life count by 1
        lives-=1;

        // check if there are still lives
        if (lives>0){
            restartChar();
        }
    }
}


// Render Collectable items

function drawCollectable(t_collectable)
{

    fill(253,171,159);
    noStroke();

    //upper tail
    triangle(t_collectable.pos_x+(5*t_collectable.size/100),
             t_collectable.pos_y,
             t_collectable.pos_x,
             t_collectable.pos_y-(25*t_collectable.size/100),
             t_collectable.pos_x+(30*t_collectable.size/100),
             t_collectable.pos_y);
    // lower tail
    triangle(t_collectable.pos_x,
             t_collectable.pos_y+(25*t_collectable.size/100),
             t_collectable.pos_x+(5*t_collectable.size/100),
             t_collectable.pos_y,
             t_collectable.pos_x+(30*t_collectable.size/100),
             t_collectable.pos_y);
    // body
    ellipse(t_collectable.pos_x+(40*t_collectable.size/100),
            t_collectable.pos_y,
            (60*t_collectable.size/100),
            (30*t_collectable.size/100));

    // Eye
    fill(0);
    ellipse(t_collectable.pos_x+(60*t_collectable.size/100),
            t_collectable.pos_y-(5*t_collectable.size/100),
            (8*t_collectable.size/100),
            (8*t_collectable.size/100));

    // Gill
    stroke(0);
    strokeWeight(1);
    line(t_collectable.pos_x+(50*t_collectable.size/100),
         t_collectable.pos_y-(10*t_collectable.size/100),
         t_collectable.pos_x+(50*t_collectable.size/100),
         t_collectable.pos_y+(5*t_collectable.size/100));
}

function checkCollectable(t_collectable)
{

    // Variable d measures radial distance between character and each collectable.
    d=dist(gameChar_world_x,
           gameChar_y-30,
           t_collectable.pos_x,
           t_collectable.pos_y);

    // allow collectable to be reached within 50pixel radius
    if(d<40){
        t_collectable.is_found=true;
        game_score+=1;
    }
}


// Render Flagpole

function renderFlagPole()
{

    // Pole
    stroke(200);
    strokeWeight(5);
    line(flagPole.x_pos,floorPos_y,flagPole.x_pos,floorPos_y-250);

    // Flag
    if (flagPole.isReached){

        // Raise flag
        fill(46,139,87);
        noStroke();
        rect(flagPole.x_pos,floorPos_y-250,100,50);

        // Draw character ears
        fill(205,100,63);
        ellipse(flagPole.x_pos+35-10,floorPos_y-105-130,20,20);
        ellipse(flagPole.x_pos+35+22,floorPos_y-105-130,20,20);
        fill(245,222,179);
        ellipse(flagPole.x_pos+35-10,floorPos_y-105-130,8,8);
        ellipse(flagPole.x_pos+35+22,floorPos_y-105-130,8,8);

        // Draw character head
        fill(205,100,63);
        ellipse(flagPole.x_pos+35+6,floorPos_y-105-120,40,40);

        // Draw character nose
        fill(245,222,179);
        ellipse(flagPole.x_pos+35+14,floorPos_y-105-114,20,16);
        fill(55,20,30);
        ellipse(flagPole.x_pos+35+16,floorPos_y-105-114,10,6)
        // Draw character eyes
        fill(55,20,30);
        ellipse(flagPole.x_pos+35+18,floorPos_y-105-126,6,6);
        ellipse(flagPole.x_pos+35+6,floorPos_y-105-126,6,6);
    }

    // Flag down until it is reached
    else{
        fill(255,0,0);
        noStroke();
        rect(flagPole.x_pos,floorPos_y-50,100,50)
    }
}

function checkFlagPole()
{

    // Measure distance between character and flagpole
    var d= abs(gameChar_world_x-flagPole.x_pos);

    // check if x distance between character and pole is less than 5 and if all collectables have been collected.
    if (d<=5 && game_score==collectables.length){
        flagPole.isReached=true;

    }
}
