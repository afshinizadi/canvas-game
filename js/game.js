

var _gameWidth =window.innerWidth;
var _gameHeight = window.innerHeight;
var _marginTop=0;
var _lineHeight=80;
var _mainCircleRadius = 50;
var _headCircleRadius=11;
var _angle=0;
var throwBallNumber=10;
var _obestacles= [];
var _rotateSpeed=0.002;
var _animation=0;
var centerX = _gameWidth / 2;
var centerY = _gameHeight / 2;
var _userThrowedColor="red";

var gameArea = {
    canvas: createHiDPICanvas(_gameWidth, _gameHeight),
    start : function() {
		this.canvas.id='canvas';
		if ("ontouchstart" in document.documentElement){
			this.canvas.addEventListener("touchend", handleEnd, false);
		}else{
			this.canvas.addEventListener("mouseup", handleEnd, false);
		}
		document.getElementById('canvas-holder').appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		gameArea.context.textAlign="center";
		gameArea.context.textBaseline="middle";
		initGame();
		
		GameLoopManager.run(GameTick);
		
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



gameArea.start();










function initGame(){
	/*gameArea.context.beginPath();
	gameArea.context.arc(centerX, centerY, _mainCircleRadius, 0, 2 * Math.PI);
	gameArea.context.fillStyle = 'white';
	gameArea.context.fill();
	gameArea.context.closePath();
	gameArea.context.font = "30px Arial";
	gameArea.context.fillText("0",centerX,centerY);*/
	createObestacles();
}






//var x=0;
//var y=0;
function GameTick(elapsed)
{
    	drawGame();
}



function drawGame(){
	gameArea.clear();
	drawCenterCircle();
	drawObestacles();
	
	changeObestaclesPos();
	drawThrowingBallAtBelow();
   	drawLevel();
	_animation+=_rotateSpeed;
}

function addThrowedBall(){
	var angle = 0.5 * Math.PI ;//+ _animation;
	var x = centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos( angle ) );
	var y = centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( angle ) );
	_obestacles[_obestacles.length]={
		"x" : x,
		"y" : y,
		"angle" : angle,
		"user_throwed": true
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
	for(var i=0;i<10; i++)
	{		
		// calculating end point of a circle with the center of x and y
		// x = xStartPoint + ( radius * cos(angle) )
		// y = yStartPoint + (radius * sin(angle) )
		_angle = i/(10/2) * Math.PI;//+ _animation;
		var x = centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos( _angle ) );
		var y = centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( _angle ) );
		
		_obestacles[i] = {
			"x": x,
			"y": y,	
			"angle": _angle,
			"user_throwed": false	
		}
	
	}
}


function drawObestacles(){
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for( var i = 0 ; i < _obestacles.length ; i++ ){
		//console.log(_obestacles[i].x);
		gameArea.context.beginPath();
			gameArea.context.moveTo(centerX,centerY);
			gameArea.context.lineTo(_obestacles[i].x,_obestacles[i].y);
			gameArea.context.strokeStyle = 'white';
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			//gameArea.context.shadowBlur=20;
			//gameArea.context.shadowColor="white";
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
var dlt = -2;
function changeObestaclesPos(){
	/*_angle += dlt;
	if (_angle < -360 || _angle > 0) _angle=0;
	_angle *= Math.PI / 180;*/
	var angle=0;
	for( var i=0 ; i < _obestacles.length ; i++ ){
		_obestacles[i].angle = _obestacles[i].angle + _rotateSpeed;
		
		
		
		//console.log(angle);
		 
		 _obestacles[i].x = centerX + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.cos(_obestacles[i].angle ) );
		 _obestacles[i].y = centerY + ( ( _mainCircleRadius + ( _headCircleRadius / 2 ) + _lineHeight ) * Math.sin( _obestacles[i].angle ) );
	}
}


var bottomBallAnimateY=0;
function drawThrowingBallAtBelow(){
	var distance=0;
	if (bottomBallAnimateY > 0 ){
		bottomBallAnimateY -= 5;
	}
	var ballToThrowY = centerY + _lineHeight + _marginTop + _headCircleRadius * 6;
	gameArea.context.font = "bold 12px Arial";
	
	for( var i = 0 ; i < throwBallNumber ; i++ ){
		gameArea.context.save();
		ballToThrowY += ( _headCircleRadius * 3 );
		gameArea.context.beginPath();
		//gameArea.context.shadowBlur=20;
		//gameArea.context.shadowColor="white";
		gameArea.context.fillStyle = 'white';
			
			/*if(i==0){
				gameArea.context.fillStyle = 'white';
			}*/
			gameArea.context.arc(centerX, ballToThrowY + bottomBallAnimateY, _headCircleRadius, 0, 2 * Math.PI);
			if(i==0){
				//gameArea.context.shadowBlur=60;
				//gameArea.context.shadowColor="white";
				
				gameArea.context.lineWidth = 5;
				 gameArea.context.strokeStyle = 'black';
				gameArea.context.stroke();
				gameArea.context.fillStyle = 'white';
			}
			gameArea.context.fill();
			
			
			
		gameArea.context.closePath();
		

		gameArea.context.restore();

		gameArea.context.fillStyle = 'black';
		gameArea.context.fillText( throwBallNumber - i , centerX , ballToThrowY + 1 + bottomBallAnimateY);
		gameArea.context.restore();		
	}
}

function collisionDetection(newBall) {
	for( var i=0 ; i < _obestacles.length-1 ; i++ ){
		if((_obestacles[i].x + _headCircleRadius * 2 > newBall.x && newBall.x > _obestacles[i].x-_headCircleRadius * 2) && 
		   (_obestacles[i].y + _headCircleRadius * 2 > newBall.y && newBall.y > _obestacles[i].y-_headCircleRadius * 2) ){
			return i;
		}	
	}
	
	return false;
}

function handleEnd(){
	bottomBallAnimateY=_headCircleRadius * 3;
	
	if(throwBallNumber > 0){
		throwBallNumber--;
		addedBall=addThrowedBall();
		var result=collisionDetection(addedBall);
		if (result){
			GameLoopManager.stop();
			drawEndGame( result , _obestacles.length-1 );
			return;
		}
		
	}
	if(throwBallNumber == 0){ // game win
			alert("gameWin"); 
	}
	
}

function drawEndGame(obestacle1,obestacle2){
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for( var i = 0 ; i < _obestacles.length ; i++ ){
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
    var ctx = document.createElement("canvas").getContext("2d"),
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
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}






