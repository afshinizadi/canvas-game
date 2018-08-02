

var _gameWidth =window.innerWidth;
var _gameHeight = window.innerHeight;
var _marginTop=0;
var _lineHeight=130;
var _mainCircleRadius = 50;
var _headCircleRadius=11;
var _diameter = _headCircleRadius*2;
var _angle=0;
var throwBallNumber=10;
var _obestacles= [];
var _rotateSpeed=0.01;
var _animation=0;
var PIXEL_RATIO=1;
var throwAudio = new Audio('./assets/throw.mp3');
var lostAudio = new Audio('./assets/lost.mp3');
var pi2=2 * Math.PI;
var bottomBallAnimate=_headCircleRadius * 3;
var i=0,x,y,angle;
var startPosX,startPosY,endPosX,endPosY,newLineX,newLineY;
var bottomBallAnimateY=0,ballToThrowY=0;
var gameArea = {
    
    canvas: createHiDPICanvas(_gameWidth, _gameHeight),
    canvas2: createHiDPICanvas(_gameWidth, _gameHeight),
    start : function() {
		this.canvas.id='canvas';
		this.canvas2.id='canvas2';
		if ("ontouchstart" in document.documentElement){
			this.canvas2.addEventListener("touchend", handleEnd, false);
		}else{
			this.canvas2.addEventListener("mouseup", handleEnd, false);
		}
		var canvasHolder=document.getElementById('canvas-holder');
		
		canvasHolder.appendChild(this.canvas);
		canvasHolder.appendChild(this.canvas2);
		endPosX=this.canvas.width;
		endPosY=this.canvas.height;
		this.context = this.canvas.getContext("2d",{ alpha: false });
		this.context.translate(endPosX / (2 * PIXEL_RATIO), endPosY / (2 * PIXEL_RATIO));

		this.context2 = this.canvas2.getContext("2d",{ alpha: false });
		this.context2.translate(endPosX / (2 * PIXEL_RATIO), endPosY / (2 * PIXEL_RATIO));
		startPos1=-(_lineHeight+_headCircleRadius) ;
		endPos1=(_lineHeight+_headCircleRadius)*2;
		gameArea.context.textAlign="center";
		gameArea.context.textBaseline="middle";

		gameArea.context2.textAlign="center";
		gameArea.context2.textBaseline="middle";
		angle = 0.5 * Math.PI;
		newLineX =    _lineHeight * Math.cos( angle ) ;
	 	newLineY =   _lineHeight  * Math.sin( angle ) ;
		initGame();
		
		GameLoopManager.run(GameTick);
		
        },
    clear : function() {
        //this.context.clearRect(startPosX, startPosY, endPosX, endPosY);
	this.context.clearRect( startPos1 ,startPos1, endPos1, endPos1);
    },
    clear2 : function() {
	
        this.context2.clearRect(-(_headCircleRadius+5), _lineHeight+20, _headCircleRadius*2+5, endPos1);
    }
}



gameArea.start();










function initGame(){
	createObestacles();
	drawCenterCircle();
	drawThrowingBallAtBelow();
   	drawLevel();
}



function GameTick(elapsed)
{
    	drawGame();
	if (bottomBallAnimateY > 0 ){
		drawThrowingBallAtBelow();
	}
}



function drawGame(){
	gameArea.clear();
	drawObestacles();
	changeObestaclesPos();
	
	_animation+=_rotateSpeed;
}

function addThrowedBall(){
	 //angle = 0.5 * Math.PI ;//+ _animation;
	 //x =    _lineHeight * Math.cos( angle ) ;
	 //y =   _lineHeight  * Math.sin( angle ) ;

	_obestacles[_obestacles.length]={
		"x" : newLineX,
		"y" : newLineY,
		"angle" : angle,
		"user_throwed": 1
	}

	gameArea.context.beginPath();
			gameArea.context.moveTo(0,0);
			gameArea.context.lineTo(x,y);
			gameArea.context.strokeStyle = 'white';
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			gameArea.context.beginPath();
				gameArea.context.fillStyle = 'white';
				gameArea.context.arc(x,y, _headCircleRadius, 0, pi2);
				gameArea.context.fill();
			gameArea.context.closePath();
		gameArea.context.restore();
	return _obestacles[_obestacles.length-1];
	
}


function drawCenterCircle(color="white"){
	gameArea.context2.beginPath();
	gameArea.context2.arc(0, 0, _mainCircleRadius, 0, pi2);
	gameArea.context2.fillStyle = color;
	gameArea.context2.fill();
	gameArea.context2.closePath();
}
function drawLevel(color="black"){
	gameArea.context2.font = "bold 50px Arial";
	gameArea.context2.fillStyle = color;
	gameArea.context2.fillText("99",0,5);
}



function createObestacles(){
	for(i=0;i<10; i++)
	{		
		// calculating end point of a circle with the center of x and y
		// x = xStartPoint + ( radius * cos(angle) )
		// y = yStartPoint + (radius * sin(angle) )
		_angle = i/(10/2) * Math.PI;//+ _animation;
		x =  _lineHeight  * Math.cos( _angle ) ;
		y = _lineHeight  * Math.sin( _angle ) ;
		
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
	//gameArea.context.font = "12px Arial";
	for(i = 0 ; i < _obestacles.length ; i++ ){
		gameArea.context.beginPath();
			gameArea.context.moveTo(0,0);
			gameArea.context.lineTo(_obestacles[i].x,_obestacles[i].y);
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		//gameArea.context.closePath();

		//gameArea.context.save();
			gameArea.context.beginPath();
				if (_obestacles[i].user_throwed){
					gameArea.context.fillStyle = 'white';
				}else{
					gameArea.context.fillStyle = 'black';
				}
				gameArea.context.arc(_obestacles[i].x, _obestacles[i].y, _headCircleRadius, 0, pi2);
				gameArea.context.fill();
			gameArea.context.closePath();
		//gameArea.context.restore();
	}	
}

function changeObestaclesPos(){
	//_angle=0;
	for( i=0 ; i < _obestacles.length ; i++ ){
		_obestacles[i].angle = _obestacles[i].angle + _rotateSpeed;
		_obestacles[i].x =  _lineHeight  * Math.cos(_obestacles[i].angle ) ;
		_obestacles[i].y =  _lineHeight  * Math.sin( _obestacles[i].angle ) ;
	}
}



function drawThrowingBallAtBelow(){
	gameArea.clear2();
	if (bottomBallAnimateY > 0 ){
		bottomBallAnimateY -= 5;
	}
	ballToThrowY =  _lineHeight+10;
	gameArea.context2.font = "bold 12px Arial";
	gameArea.context2.save();
	for( i = 0 ; i < throwBallNumber ; i++ ){
		ballToThrowY += 30;
		gameArea.context2.beginPath();
		gameArea.context2.fillStyle = 'white';
		gameArea.context2.arc(0, ballToThrowY + bottomBallAnimateY, _headCircleRadius, 0, pi2);
		gameArea.context2.fill();

		gameArea.context2.fillStyle = 'black';
		gameArea.context2.fillText( throwBallNumber - i , 0 , ballToThrowY + 1 + bottomBallAnimateY);			
	}
	
}
var a,b,lineDistance;
function collisionDetection(newBall) {
	for(i=0 ; i < _obestacles.length-1 ; i++ ){
		a = Math.round( ( _obestacles[i].x > newBall.x ) ? _obestacles[i].x - newBall.x : newBall.x - _obestacles[i].x );
		b = Math.round( ( _obestacles[i].y > newBall.y ) ? _obestacles[i].y - newBall.y : newBall.y - _obestacles[i].y );
		lineDistance = Math.round( Math.sqrt( a*a + b*b ) );

		// to avoid type checking in later we will plus i to 1 and then we will minus it later
		if(lineDistance < (_diameter)){return i+1;} 
	
	}
	
	return false;
}
var result;
function handleEnd(){
	bottomBallAnimateY=bottomBallAnimate;
	
	if(throwBallNumber > 0){
		throwBallNumber--;
		addedBall=addThrowedBall();
		result=collisionDetection(addedBall);
		if (result){
			GameLoopManager.stop();
			drawEndGame( result-1 , _obestacles.length-1 );
			lostAudio.play();
			return;
		}
		throwAudio.load();
		throwAudio.play();
		
	}
	if(throwBallNumber == 0){ // game win
			alert("gameWin"); 
	}
	
}

function drawEndGame(obestacle1,obestacle2){
	gameArea.clear();
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for(i = 0 ; i < _obestacles.length ; i++ ){
		gameArea.context.beginPath();
			gameArea.context.moveTo(0,0);
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
				gameArea.context.arc(_obestacles[i].x, _obestacles[i].y, _headCircleRadius, 0, pi2);
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
    PIXEL_RATIO = calculatePixelRatio();
	if(PIXEL_RATIO > 1.5){
    PIXEL_RATIO *= 0.8;}
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}






