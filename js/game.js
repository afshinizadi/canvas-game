"use strict";
var _gameWidth =window.innerWidth;
var _gameHeight = window.innerHeight;
var _marginTop=0;
var _lineHeight=80;
var _mainCircleRadius = 50;
var _headCircleRadius=11;
var _angle=0;
var throwBallNumber=30;
var _obestacles= [];
var _rotateSpeed=0.015;
var _animation=0;
var centerX = _gameWidth / 2;
var centerY = _gameHeight / 2;
var _userThrowedColor="red";
var throwAudio = new Audio('./assets/throw.mp3');
var lostAudio = new Audio('./assets/lost.mp3');
var x,y,angle,i=0;
var fps = 50;
var stop=false;
var addedBall;
var throwAngle=0.5 * Math.PI,
    throwX=(centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos( throwAngle ) )).toFixed(1),
    throwY=(centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( throwAngle ) )).toFixed(1);

var fpsInterval, startTime, now, then, elapsed;
var rotation = 0;

var gameArea = {
    canvas: createHiDPICanvas(_gameWidth, _gameHeight),
    start : function() {
		this.canvas.id='canvas';
		if ("ontouchstart" in document.documentElement){
			this.canvas.addEventListener("touchstart", handleEnd, false);
		}else{
			this.canvas.addEventListener("mousedown", handleEnd, false);
		}
		document.getElementById('canvas-holder').appendChild(this.canvas);
		this.context = this.canvas.getContext("2d",{ alpha: false });
		gameArea.context.textAlign="center";
		gameArea.context.textBaseline="middle";
		initGame();
		
		//GameLoopManager.run(GameTick);
		startAnimating(fps);
		//renderGameByFps();
		
        },
    clear : function() {
	//canvas.width = canvas.width;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



gameArea.start();










function initGame(){
	createObestacles();
}



function GameTick(elapsed)
{
    	drawGame();
}


function rotateTest() {

	//gameArea.context.save();
	gameArea.context.setTransform(0, 0, 0, 0, gameArea.canvas.width/2, gameArea.context.canvas.height/2);
	gameArea.context.translate( gameArea.canvas.width/2, gameArea.context.canvas.height/2 );
	gameArea.context.rotate( rotation );
	//gameArea.context.translate( -gameArea.canvas.width/2, -gameArea.context.canvas.height/2 );
	//gameArea.context.drawImage( myImageOrCanvas, 0, 0 );
	//gameArea.context.restore();
    // reset transforms before clearing
    //gameArea.context.setTransform(1, 0, 0, 1, 0, 0);
    //gameArea.context.clearRect(0, 0, canvas.width, canvas.height);

    // tramslate and rotate an absolute rotation value
   // gameArea.context.translate(gameArea.canvas.width/2, gameArea.canvas.height/2);
    //gameArea.context.rotate(rotation);




    // update rotation value and request new frame
    rotation += 0.04;

    //requestAnimationFrame(draw)
}
function drawGame(){
	gameArea.clear();
	drawCenterCircle();
	drawObestacles();
	
	//changeObestaclesPos();
	drawThrowingBallAtBelow();
   	drawLevel();
	_animation+=_rotateSpeed;
}

function addThrowedBall(){
	//angle = 0.5 * Math.PI ;//+ _animation;
	x = throwX;//(centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos( angle ) )).toFixed(2);
	y = throwY;//(centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( angle ) )).toFixed(2);
	//console.log();
	//console.log(y);
	_obestacles[_obestacles.length]={
		"x" : x,
		"y" : y,
		"angle" : throwAngle,
		"user_throwed": 1
	}

	gameArea.context.beginPath();
			gameArea.context.moveTo(centerX,centerY);
			gameArea.context.lineTo(x,y);
			gameArea.context.strokeStyle = 'white';
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			gameArea.context.beginPath();
				gameArea.context.fillStyle = 'white';
				gameArea.context.arc(x,y, _headCircleRadius, 0, 2 * Math.PI);
				gameArea.context.fill();
			gameArea.context.closePath();
		gameArea.context.restore();
	return _obestacles[_obestacles.length-1];
	
}


function drawCenterCircle(color="white"){
	gameArea.context.beginPath();
	gameArea.context.arc(centerX, centerY, _mainCircleRadius, 0, 2 * Math.PI);
	gameArea.context.fillStyle = color;
	gameArea.context.fill();
	gameArea.context.closePath();
}
function drawLevel(color="black"){
	gameArea.context.font = "bold 50px Arial";
	gameArea.context.fillStyle = color;
	gameArea.context.fillText("99",centerX,centerY+5);
}



function createObestacles(){
	for(i=0;i<10; i++)
	{		
		// calculating end point of a circle with the center of x and y
		// x = xStartPoint + ( radius * cos(angle) )
		// y = yStartPoint + (radius * sin(angle) )
		_angle = i/(10/2) * Math.PI;//+ _animation;
		x = (centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos( _angle ) )).toFixed(1);
		y = (centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( _angle ) )).toFixed(1);
		
		_obestacles[i] = {
			"x": x,
			"y": y,	
			"angle": _angle,
			"user_throwed": 0	
		}
	
	}
}


function drawObestacles(){
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for(i = 0 ; i < _obestacles.length ; i++ ){
		gameArea.context.beginPath();
			gameArea.context.moveTo(centerX,centerY);
			gameArea.context.lineTo(_obestacles[i].x,_obestacles[i].y);
			gameArea.context.strokeStyle = 'white';
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			gameArea.context.beginPath();
				if (_obestacles[i].user_throwed){
					gameArea.context.fillStyle = 'white';
				}else{
					gameArea.context.fillStyle = 'black';
				}
				gameArea.context.arc(_obestacles[i].x, _obestacles[i].y, _headCircleRadius, 0, 2 * Math.PI);
				gameArea.context.fill();
			gameArea.context.closePath();
		gameArea.context.restore();
	}	
}

function changeObestaclesPos(){
	//angle=0;
	for( i=0 ; i < _obestacles.length ; i++ ){
		_obestacles[i].angle = _obestacles[i].angle + _rotateSpeed;
		_obestacles[i].x = (centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos(_obestacles[i].angle ) )).toFixed(1);
		_obestacles[i].y = (centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( _obestacles[i].angle ) )).toFixed(1);
	}
}


var bottomBallAnimateY=0,distance=0,ballToThrowY,ballMarginTop=( _headCircleRadius * 3 );
function drawThrowingBallAtBelow(){
	if (bottomBallAnimateY > 0 ){
		bottomBallAnimateY -= 5;
	}
	ballToThrowY = centerY + _lineHeight + _marginTop + _headCircleRadius * 6;
	gameArea.context.font = "bold 12px Arial";
	
	for( i = 0 ; i < throwBallNumber ; i++ ){
		gameArea.context.save();
		ballToThrowY += ballMarginTop;
		gameArea.context.beginPath();
		gameArea.context.fillStyle = 'white';
			gameArea.context.arc(centerX, ballToThrowY + bottomBallAnimateY, _headCircleRadius, 0, 2 * Math.PI);
			gameArea.context.fill();
			
			
			
		gameArea.context.closePath();
		

		gameArea.context.restore();

		gameArea.context.fillStyle = 'black';
		gameArea.context.fillText( throwBallNumber - i , centerX , ballToThrowY + 1 + bottomBallAnimateY);
		gameArea.context.restore();		
	}
}
var a,b,lineDistance;
function collisionDetection(newBall) {
	for( i=0 ; i < _obestacles.length-1 ; i++ ){
		a = ( _obestacles[i].x > newBall.x ) ? _obestacles[i].x - newBall.x : newBall.x - _obestacles[i].x;
		b = ( _obestacles[i].y > newBall.y ) ? _obestacles[i].y - newBall.y : newBall.y - _obestacles[i].y;
		lineDistance = Math.floor(Math.sqrt( a*a + b*b ));
		
		if(lineDistance < (_headCircleRadius * 2)){return i+1;}	
	}
	return 0;
}
var result;
function handleEnd(){
	bottomBallAnimateY=_headCircleRadius * 3;
	
	if(throwBallNumber > 0){
		throwBallNumber--;
		addedBall=addThrowedBall();
		result=collisionDetection(addedBall);
		if (result){
			//GameLoopManager.stop();
			drawEndGame( result-1 , _obestacles.length-1 );
			stop=true;
			lostAudio.play();
			return;
		}
		
		throwAudio.play();
		if(throwBallNumber == 0){ // game win
			alert("gameWin"); 
		}
	}
	
	
}

function drawEndGame(obestacle1,obestacle2){
	gameArea.clear();
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for( i = 0 ; i < _obestacles.length ; i++ ){
		gameArea.context.beginPath();
			gameArea.context.moveTo(centerX,centerY);
			gameArea.context.lineTo(_obestacles[i].x,_obestacles[i].y);
			if(i == obestacle1 || i == obestacle2){
				gameArea.context.strokeStyle = 'red';
			}else{
				gameArea.context.strokeStyle = 'white';
			}
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			gameArea.context.beginPath();
				if (_obestacles[i].user_throwed){
					gameArea.context.fillStyle = 'white';
				}else{
					gameArea.context.fillStyle = 'black';
				}
				if(i == obestacle1 || i == obestacle2){
					gameArea.context.fillStyle = 'red';
				}
				gameArea.context.arc(_obestacles[i].x, _obestacles[i].y, _headCircleRadius, 0, 2 * Math.PI);
				gameArea.context.fill();
			gameArea.context.closePath();
		gameArea.context.restore();
	}
	drawCenterCircle("red");
	drawLevel("white");
}

// finding the ration of the device
function calculatePixelRatio() {
    var ctx = document.createElement("canvas").getContext("2d",{ alpha: false }),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}

// create element with the ration of the device
function createHiDPICanvas(w, h, ratio) {
    var PIXEL_RATIO = calculatePixelRatio();
    if(PIXEL_RATIO > 1 ) PIXEL_RATIO *= 0.7;
    if (!ratio) { ratio = PIXEL_RATIO; }
	
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}
function animate() {

    // request another frame
	if(!stop){
    	  requestAnimationFrame(animate);
	

	    // calc elapsed time since last loop

	    now = Date.now();
	    elapsed = now - then;

	    // if enough time has elapsed, draw the next frame

	    if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);

		drawGame();
		rotateTest();

	    }
   	}
}






