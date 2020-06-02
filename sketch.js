var gameChar_x;
var gameChar_y;
var gameChar_world_x;
var floorPos_y;
var scrollPos;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees;
var clouds;
var canyons;
var mountains;
var collectables;
var platforms;
var game_score;
var lives;
var flagPole;
var pregame;
function setup()
{
createCanvas(1024, 576);
floorPos_y = height * 3/4;
lives=3;
game_score=0;
startGame();
restartChar();
pregame=true;
}
function draw()
{
background(100, 155, 255);
noStroke();
fill(0,155,0);
rect(0, floorPos_y, width, height/4);
push();
translate(scrollPos,0);
drawClouds();
drawMountains();
drawTrees();
for (var i=0; i<canyons.length; i++){
drawCanyon(canyons[i]);
checkCanyon(canyons[i]);
}
for (var i=0; i<collectables.length; i++){
if(collectables[i].is_found==false){
drawCollectable(collectables[i]);
checkCollectable(collectables[i]);
}
}
for (var i=0; i<platforms.length; i++){
platforms[i].draw();
}
if (pregame==true){
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
if (pregame==false){
gameChar_world_x = gameChar_x - scrollPos;
renderFlagPole();
if(!flagPole.isReached){
checkFlagPole();
}
pop();
drawGameChar();
fill(0);
noStroke();
textSize(20);
textAlign("left");
text("COLLECTED: " + game_score + "/"+ collectables.length, 30, 30);
text("LIVES: ", 30, 60);
for (var i=0; i<lives; i++){
fill(255,0,0);
ellipse(110+(22*i),50,20,20);
}
fill(0);
noStroke();
textAlign(RIGHT);
if (game_score==collectables.length && !flagPole.isReached && lives >0){
text("FIND THE FLAGPOLE TO COMPLETE LEVEL", width-20,60);
}
text("FLAGPOLE DIRECTION:", width-100, 30);
stroke(0);
strokeWeight(3);
line(width-30,25,width-80,25);
if((gameChar_world_x-(flagPole.x_pos)) > 0){
triangle(width-80,25,width-70,20,width-70,30)
}
if((gameChar_world_x-(flagPole.x_pos)) < 0){
triangle(width-30,25,width-40,20,width-40,30);
}
noStroke();
textAlign(CENTER);
if(gameChar_world_x < (-5000)){
text("No more salmons in this direction", width/2, height-100);
}
if(gameChar_world_x > (5000)){
text("No more salmons in this direction", width/2, height-100);
}
}
if(isLeft)
{
if(gameChar_x > width * 0.3)
{
gameChar_x -= 5;
}
else
{
scrollPos += 5;
}
}
if(isRight)
{
if(gameChar_x < width * 0.7)
{
gameChar_x  += 5;
}
else
{
scrollPos -= 5;
}
}
if(isPlummeting){
isLeft=false;
isRight=false;
isFalling=false;
gameChar_y+=5;
}
if(gameChar_y<floorPos_y){
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
isFalling=false;
}
}
else{
isFalling=false;
}
if(isPlummeting){
gameChar_y += 10;
}
checkPlayerDie();
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
text("Total Score: " + (game_score + lives) ,width/2, height/2-100);
return;
}
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
text("Total Score: " + (game_score+lives),width/2, height/2-100);
return;
}
}
function keyPressed()
{
if(lives>0 && flagPole.isReached==false && pregame==false
&& keyCode==37){
isLeft=tue;
}
if(lives>0 && flagPole.isReached==false && pregame==false
&& keyCode==39){
isRight=true;
}
if(lives>0 && flagPole.isReached==false && pregame==false
&& keyCode==32
&& gameChar_y==floorPos_y){
gameChar_y-=100;
}
for (var i=0; i<platforms.length; i++){
if(platforms[i].checkContact(gameChar_world_x,gameChar_y)==true && keyCode==32){
gameChar_y-=100;
}
}
if((lives<=0 || flagPole.isReached)
&& keyCode==32){
setup();
}
if(keyCode==32 && pregame==true){
pregame=false;
}
}
function keyReleased()
{
if(keyCode==37){
isLeft=false;
}
if(keyCode==39){
isRight=false;
}
}
function startGame()
{
trees=[];
for (var i=0; i<50; i++){
trees.push({pos_x:round(random(-15000,5000)),
colour_green:round(random(100,150))
});
}
clouds=[];
for (var i=0; i<150; i++){
clouds.push({pos_x:round(random(-15000,15000)),
 pos_y:round(random(90,160)),
 size: round(random(80,130))
});
}
mountains=[];
for (var i =0; i<30; i++){
mountains.push({pos_x:round(random(-15000,15000)),
   pos_y:floorPos_y,
   size:round(random(50,150))
   });
}
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
collectables=[];
for (var i =0; i<4; i++){
collectables.push({pos_x:round(random(-5000,5000)),
       pos_y:round(random(310,320)),
       size:round(random(90,100)),
       is_found:false
      });
}
flagPole={
isReached:false,
x_pos: random(-5000,5000)
}
platforms=[];
for (var i = 0; i<5; i++){
platforms.push(createPlatforms(random(-4000,4000),
                   floorPos_y-90,
                   random(150,100)));
if(i==0 || i==1 || i==2){
collectables.push({pos_x:platforms[i].x-random(0,50),
           pos_y:round(random(230,240)),
           size:round(random(90,100)),
           is_found:false
      });
}
}
}
function restartChar()
{
gameChar_x = width/2;
gameChar_y = floorPos_y;
scrollPos = 0;
gameChar_world_x = gameChar_x - scrollPos;
isLeft = false;
isRight = false;
isFalling = false;
isPlummeting = false;
}
function drawGameChar()
{
if(isLeft && isFalling){
fill(205,100,63);
ellipse(gameChar_x-20,gameChar_y-96,20,20);
ellipse(gameChar_x+20,gameChar_y-96,20,20);
ellipse(gameChar_x-12,gameChar_y-52,24,30);
ellipse(gameChar_x+12,gameChar_y-52,24,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-80,50,60);
fill(245,222,179);
ellipse(gameChar_x-10,gameChar_y-80,20,40);
fill(205,100,63);
ellipse(gameChar_x+10,gameChar_y-130,20,20);
ellipse(gameChar_x-22,gameChar_y-130,20,20);
fill(245,222,179);
ellipse(gameChar_x+10,gameChar_y-130,8,8);
ellipse(gameChar_x-22,gameChar_y-130,8,8);
fill(205,100,63);
ellipse(gameChar_x-6,gameChar_y-120,40,40);
fill(245,222,179);
ellipse(gameChar_x-14,gameChar_y-114,20,16);
fill(55,20,30);
ellipse(gameChar_x-16,gameChar_y-114,10,6)
fill(55,20,30);
ellipse(gameChar_x-18,gameChar_y-126,6,6);
ellipse(gameChar_x-6,gameChar_y-126,6,6);
}
else if(isRight && isFalling){
fill(205,100,63);
ellipse(gameChar_x+20,gameChar_y-96,20,20);
ellipse(gameChar_x-20,gameChar_y-96,20,20);
ellipse(gameChar_x+12,gameChar_y-52,24,30);
ellipse(gameChar_x-12,gameChar_y-52,24,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-80,50,60);
fill(245,222,179);
ellipse(gameChar_x+10,gameChar_y-80,20,40);
fill(205,100,63);
ellipse(gameChar_x-10,gameChar_y-130,20,20);
ellipse(gameChar_x+22,gameChar_y-130,20,20);
fill(245,222,179);
ellipse(gameChar_x-10,gameChar_y-130,8,8);
ellipse(gameChar_x+22,gameChar_y-130,8,8);
fill(205,100,63);
ellipse(gameChar_x+6,gameChar_y-120,40,40);
fill(245,222,179);
ellipse(gameChar_x+14,gameChar_y-114,20,16);
fill(55,20,30);
ellipse(gameChar_x+16,gameChar_y-114,10,6)
fill(55,20,30);
ellipse(gameChar_x+18,gameChar_y-126,6,6);
ellipse(gameChar_x+6,gameChar_y-126,6,6);
}
else if(isLeft) {
fill(205,100,63);
ellipse(gameChar_x-20,gameChar_y-50,20,20);
ellipse(gameChar_x+20,gameChar_y-50,20,20);
ellipse(gameChar_x-10,gameChar_y-10,20,30);
ellipse(gameChar_x+10,gameChar_y-10,20,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-40,50,60);
fill(245,222,179);
ellipse(gameChar_x-10,gameChar_y-40,20,40);
fill(205,100,63);
ellipse(gameChar_x-16,gameChar_y-90,20,20);
ellipse(gameChar_x+16,gameChar_y-90,20,20);
fill(245,222,179);
ellipse(gameChar_x-16,gameChar_y-90,8,8);
ellipse(gameChar_x+16,gameChar_y-90,8,8);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-80,40,40);
fill(245,222,179);
ellipse(gameChar_x-8,gameChar_y-72,20,16);
fill(55,20,30);
ellipse(gameChar_x-10,gameChar_y-72,10,6)
fill(55,20,30);
ellipse(gameChar_x-12,gameChar_y-86,6,6);
ellipse(gameChar_x,gameChar_y-86,6,6);
}
else if(isRight){
fill(205,100,63);
ellipse(gameChar_x+20,gameChar_y-50,20,20);
ellipse(gameChar_x-20,gameChar_y-50,20,20);
ellipse(gameChar_x+10,gameChar_y-10,20,30);
ellipse(gameChar_x-10,gameChar_y-10,20,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-40,50,60);
fill(245,222,179);
ellipse(gameChar_x+10,gameChar_y-40,20,40);
fill(205,100,63);
ellipse(gameChar_x-16,gameChar_y-90,20,20);
ellipse(gameChar_x+16,gameChar_y-90,20,20);
fill(245,222,179);
ellipse(gameChar_x-16,gameChar_y-90,8,8);
ellipse(gameChar_x+16,gameChar_y-90,8,8);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-80,40,40);
fill(245,222,179);
ellipse(gameChar_x+8,gameChar_y-74,20,16);
fill(55,20,30);
ellipse(gameChar_x+10,gameChar_y-74,10,6)
fill(55,20,30);
ellipse(gameChar_x+12,gameChar_y-86,6,6);
ellipse(gameChar_x,gameChar_y-86,6,6);
}
else if(isPlummeting){
fill(205,100,63);
ellipse(gameChar_x-24,gameChar_y-80,20,20);
ellipse(gameChar_x+24,gameChar_y-80,20,20);
ellipse(gameChar_x-10,gameChar_y-36,24,30);
ellipse(gameChar_x+10,gameChar_y-36,24,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-60,50,60);
fill(245,222,179);
ellipse(gameChar_x,gameChar_y-60,36,40);
fill(205,100,63);
ellipse(gameChar_x-16,gameChar_y-116,20,20);
ellipse(gameChar_x+16,gameChar_y-116,20,20);
fill(245,222,179);
ellipse(gameChar_x-16,gameChar_y-116,8,8);
ellipse(gameChar_x+16,gameChar_y-116,8,8);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-100,40,40);
fill(245,222,179);
ellipse(gameChar_x,gameChar_y-94,20,16);
fill(55,20,30);
ellipse(gameChar_x,gameChar_y-94,10,6);
fill(55,20,30);
ellipse(gameChar_x-6,gameChar_y-106,6,6);
ellipse(gameChar_x+6,gameChar_y-106,6,6);
}
else{
fill(205,100,63);
ellipse(gameChar_x-24,gameChar_y-50,20,20);
ellipse(gameChar_x+24,gameChar_y-50,20,20);
ellipse(gameChar_x-10,gameChar_y-10,20,30);
ellipse(gameChar_x+10,gameChar_y-10,20,30);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-40,50,60);
fill(245,222,179);
ellipse(gameChar_x,gameChar_y-40,36,40);
fill(205,100,63);
ellipse(gameChar_x-16,gameChar_y-90,20,20);
ellipse(gameChar_x+16,gameChar_y-90,20,20);
fill(245,222,179);
ellipse(gameChar_x-16,gameChar_y-90,8,8);
ellipse(gameChar_x+16,gameChar_y-90,8,8);
fill(205,100,63);
ellipse(gameChar_x,gameChar_y-80,40,40);
fill(245,222,179);
ellipse(gameChar_x,gameChar_y-74,20,16);
fill(55,20,30);
ellipse(gameChar_x,gameChar_y-74,10,6);
fill(55,20,30);
ellipse(gameChar_x-6,gameChar_y-86,6,6);
ellipse(gameChar_x+6,gameChar_y-86,6,6);
}
}
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
fill(139,69,19);
rect(trees[i].pos_x-50,
floorPos_y-120,
50,
120);
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
fill(244,164,96);
rect(t_canyon.pos_x,
t_canyon.pos_y-5,
15,
195);
rect(t_canyon.pos_x+15+t_canyon.width,
t_canyon.pos_y-5,
15,
195);
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
return false;
}
}
}
return p;
}
function checkCanyon(t_canyon)
{
if(gameChar_world_x>t_canyon.pos_x+20 &&
gameChar_world_x<(t_canyon.pos_x+t_canyon.width)-20 &&
gameChar_y>=floorPos_y){
isPlummeting=true;
}
}
function checkPlayerDie()
{
if(gameChar_y>height && lives>=1){
lives-=1;
if (lives>0){
restartChar();
}
}
}
function drawCollectable(t_collectable)
{
fill(253,171,159);
noStroke();
triangle(t_collectable.pos_x+(5*t_collectable.size/100),
t_collectable.pos_y,
t_collectable.pos_x,
t_collectable.pos_y-(25*t_collectable.size/100),
t_collectable.pos_x+(30*t_collectable.size/100),
t_collectable.pos_y);
triangle(t_collectable.pos_x,
t_collectable.pos_y+(25*t_collectable.size/100),
t_collectable.pos_x+(5*t_collectable.size/100),
t_collectable.pos_y,
t_collectable.pos_x+(30*t_collectable.size/100),
t_collectable.pos_y);
ellipse(t_collectable.pos_x+(40*t_collectable.size/100),
t_collectable.pos_y,
(60*t_collectable.size/100),
(30*t_collectable.size/100));
fill(0);
ellipse(t_collectable.pos_x+(60*t_collectable.size/100),
t_collectable.pos_y-(5*t_collectable.size/100),
(8*t_collectable.size/100),
(8*t_collectable.size/100));
stroke(0);
strokeWeight(1);
line(t_collectable.pos_x+(50*t_collectable.size/100),
t_collectable.pos_y-(10*t_collectable.size/100),
t_collectable.pos_x+(50*t_collectable.size/100),
t_collectable.pos_y+(5*t_collectable.size/100));
}
function checkCollectable(t_collectable)
{
d=dist(gameChar_world_x,
gameChar_y,
t_collectable.pos_x,
t_collectable.pos_y);
if(d<50){
t_collectable.is_found=true;
game_score+=1;
}
}
function renderFlagPole()
{
stroke(200);
strokeWeight(5);
line(flagPole.x_pos,floorPos_y,flagPole.x_pos,floorPos_y-250);
if (flagPole.isReached){
fill(46,139,87);
noStroke();
rect(flagPole.x_pos,floorPos_y-250,100,50);
fill(205,100,63);
ellipse(flagPole.x_pos+35-10,floorPos_y-105-130,20,20);
ellipse(flagPole.x_pos+35+22,floorPos_y-105-130,20,20);
fill(245,222,179);
ellipse(flagPole.x_pos+35-10,floorPos_y-105-130,8,8);
ellipse(flagPole.x_pos+35+22,floorPos_y-105-130,8,8);
fill(205,100,63);
ellipse(flagPole.x_pos+35+6,floorPos_y-105-120,40,40);
fill(245,222,179);
ellipse(flagPole.x_pos+35+14,floorPos_y-105-114,20,16);
fill(55,20,30);
ellipse(flagPole.x_pos+35+16,floorPos_y-105-114,10,6)
fill(55,20,30);
ellipse(flagPole.x_pos+35+18,floorPos_y-105-126,6,6);
ellipse(flagPole.x_pos+35+6,floorPos_y-105-126,6,6);
}
else{
fill(255,0,0);
noStroke();
rect(flagPole.x_pos,floorPos_y-50,100,50)
}
}
function checkFlagPole()
{
var d= abs(gameChar_world_x-flagPole.x_pos);
if (d<=5 && game_score==collectables.length){
flagPole.isReached=true;
}
}
