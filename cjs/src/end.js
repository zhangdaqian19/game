var cjs= createjs;
var stg= new cjs.Stage("canvasStage");
var sWidth, sHeight, queue, spriteConfig, starCount= 200, speed= 15;

var player, lives= 0, livesTxt, score= 0, scoreTxt;
var enemyClip=[];
var starArr= [], fires= [], enemy= [], fireAble= true, breakAble= true;


const ARROW_KEY_LEFT = 37;
const ARROW_KEY_RIGHT = 39;
const SPACE_KEY = 32;
var leftKeyDown = false, rightKeyDown = false;

function init(){
    sWidth = stg.canvas.width;
    sHeight = stg.canvas.height;
    queue = new cjs.LoadQueue(true);
    
    cjs.Sound.registerPlugins([cjs.HTMLAudioPlugin]);
    queue.installPlugin(cjs.Sound);

    queue.on("complete", completeLoadedHandler);
    queue.loadManifest([
        {id:"sprite", src:"assets/images/spacex.png"},
        {id:"shot", src:"assets/sounds/shot.mp3"},
      //  {id:"nextLevel", src:"level2.html"},
    ]);

    cjs.Ticker.on("tick", updateStageHandler);

    console.log("cjs->", cjs);
}


function completeLoadedHandler(){
    buildGame();
    startGame();
}

function buildGame(){
    buildSpace();
    buildMsg();
 
}

function buildSpace(){
   
    var i, star, w, h, alpha;
    for (i=0; i<starCount; i++){
        starSky = new cjs.Container();
        star = new cjs.Shape();
        w = Math.floor(Math.random()*stg.canvas.width);
        h = Math.floor(Math.random()*stg.canvas.height);
        alpha = Math.random();
        star.graphics.beginFill("#FFF").drawCircle(0,0,1);
        star.x = w;
        star.y = h;
        star.alpha = alpha;
        starSky.addChild(star);
        starArr.push(star);//
        stg.addChild(starSky);
    }
}

function buildMsg(){
    livesTxt = new createjs.Text("Game - Over", "60px Times", "#FFF");
    livesTxt.y = 450;
    livesTxt.x = 90;
    stg.addChild(livesTxt);

    logo = new createjs.Bitmap("assets/images/spacex.png");
    logo.x = 30;
    logo.y = 50;
    stg.addChild(logo);
}

function updateStageHandler(event) {
    updateStar();
    stg.update(event);
}
function updateStar(){
    var i,star,yPos;
    for(i=0;i<200;i++){
        star = starArr[i];
        yPos = star.y + 5*star.alpha;
        if(yPos >= stg.canvas.height){
            yPos = 0;
        }
        star.y = yPos;
    }
}


function updateMsg(){
    scoreTxt.text = "score:" + score;
    livesTxt.text = "lives:" + lives;
}

init();
