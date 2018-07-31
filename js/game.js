

var _gameWidth =window.innerWidth;
var _gameHeight = window.innerHeight;
var _marginTop=0;
var _lineHeight=80;
var _mainCircleRadius = 50;
var _headCircleRadius=11;
var _angle=0;
var throwBallNumber=10;

var gameArea = {
    canvas: createHiDPICanvas(_gameWidth, _gameHeight),
    start : function() {
		this.canvas.id='canvas';
		document.getElementById('canvas-holder').appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		this.frameNo = 0;
		GameLoopManager.run(GameTick);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



gameArea.start();






var centerX = _gameWidth / 2;
var centerY = _gameHeight / 2; /*_mainCircleRadius+_marginTop+_lineHeight;*/

gameArea.context.beginPath();
gameArea.context.arc(centerX, centerY, _mainCircleRadius, 0, 2 * Math.PI);
gameArea.context.fillStyle = 'white';
gameArea.context.fill();
gameArea.context.closePath();
gameArea.context.font = "30px Arial";
gameArea.context.fillText("0",centerX,centerY);






var animation=0;
gameArea.context.textAlign="center";
gameArea.context.textBaseline="middle"; 
var x=0;
var y=0;
function GameTick(elapsed)
{
    	gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
	gameArea.context.beginPath();
	gameArea.context.arc(centerX, centerY, _mainCircleRadius, 0, 2 * Math.PI);
	gameArea.context.fillStyle = 'white';
	gameArea.context.fill();
	gameArea.context.closePath();

	
	gameArea.context.strokeStyle = 'white';
	gameArea.context.font = "12px Arial";
	for(var i=0;i<30; i++)
	{
		// calculating end point of a circle with the center of x and y
		// x = xStartPoint + ( radius * cos(angle) )
		// y = yStartPoint + (radius * sin(angle) )
		_angle = i/(30/2) * Math.PI + animation;
		x = centerX+((_mainCircleRadius+(_headCircleRadius/2)+_lineHeight)*Math.cos(_angle));
		y = centerY+((_mainCircleRadius+(_headCircleRadius/2)+_lineHeight)*Math.sin(_angle));

		gameArea.context.shadowBlur="0";
		gameArea.context.shadowColor="none";
		gameArea.context.beginPath();
			gameArea.context.moveTo(centerX,centerY);
			gameArea.context.lineTo(x,y);
			gameArea.context.lineWidth = 2;
			gameArea.context.stroke();
		gameArea.context.closePath();

		gameArea.context.save();
			gameArea.context.shadowBlur=20;
			gameArea.context.shadowColor="blue";
			gameArea.context.beginPath();
				gameArea.context.fillStyle = 'white';
				gameArea.context.arc(x, y, _headCircleRadius, 0, 2 * Math.PI);
				gameArea.context.fill();
			gameArea.context.closePath();
		gameArea.context.restore();
		
	}
	
	gameArea.context.font = "50px Arial";
	gameArea.context.fillStyle = 'black';
	gameArea.context.fillText("99",centerX,centerY+5);
	drawFiveBallAtBelow();
	animation+=0.01;
   
}

function drawFiveBallAtBelow(){
	var distance=0;
	var ballToThrowY = centerY + _lineHeight + _marginTop + _headCircleRadius * 6;
	gameArea.context.font = "12px Arial";
	
	for( var i = 0 ; i < throwBallNumber ; i++ ){
		gameArea.context.save();
		ballToThrowY += ( _headCircleRadius * 3 );
		gameArea.context.beginPath();
		gameArea.context.shadowBlur=20;
		gameArea.context.shadowColor="white";
		gameArea.context.fillStyle = 'red';
			if(i==0){
				gameArea.context.shadowColor="green";
				gameArea.context.fillStyle = 'green';
			}
			
			gameArea.context.arc(centerX, ballToThrowY, _headCircleRadius, 0, 2 * Math.PI);
			gameArea.context.fill();
			
			
			
		gameArea.context.closePath();
		

		gameArea.context.restore();

		gameArea.context.fillStyle = 'white';
		gameArea.context.fillText( throwBallNumber - i , centerX , ballToThrowY + 1);
		gameArea.context.restore();		
	}
}

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



