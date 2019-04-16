var cjs= createjs;
var stg= new cjs.Stage("canvasStage");
var sWidth, sHeight, queue, spriteConfig, starCount= 200, speed= 15;

var player, lives= 5, livesTxt, score= 0, scoreTxt;
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
        {id:"sprite", src:"assets/images/20150808203650401.png"},
        {id:"shot", src:"assets/sounds/shot.mp3"},
       
    ]);

    cjs.Ticker.on("tick", updateStageHandler);

    console.log("cjs->", cjs);
}


function completeLoadedHandler(){
    buildGame();
    setContorl();

    startGame();
}

function buildGame(){
    buildSpace();
    buildMsg();
    buildPlayer();
    buildEnemy();
}

function buildSpace(){
   
    var i, star, w, h, alpha;
    for (i=0; i<starCount; i++){
        starSky = new cjs.Container();
        star = new cjs.Shape();
        w = Math.floor(Math.random()*stg.canvas.width);
        h = Math.floor(Math.random()*stg.canvas.height);
        alpha = Math.random();
        star.graphics.beginFill("#FFF").drawCircle(0,1,10);
        star.x = w;
        star.y = h;
        star.alpha = alpha;
        starSky.addChild(star);
        starArr.push(star);//
        stg.addChild(starSky);
    }
}
function buildPlayer(){
    var data = {
        images:[queue.getResult("sprite")],
        frames:[
            [0,0,37,42],
            [37,0,42,42],
            [79,0,37,42],
            [116,0,42,42],
            [158,0,37,42],
            [0,70,64,64],
            [64,70,64,64],
            [128,70,64,64],
            [192,70,64,64],
            [256,70,64,64],
            [320,70,64,64],
            [384,70,64,64],
            [448,70,64,64],
            [512,70,64,64],
            [576,70,64,64],
            [640,70,64,64],
            [704,70,64,64],
            [768,70,64,64]
        ],
        animations:{
            ship:0,
            enemy1:1,
            enemy2:2,
            enemy3:3,
            enemy4:4,
            exp:{
                frames:[5,6,7,8,9,10,11,12,13,14,15,16],
                speed:.5
            }
        }
    };
    spriteConfig = new cjs.SpriteSheet(data);
    cjs.Sound.registerSound("assets/sounds/explosion.mp3", "explosion");
    player = new cjs.Sprite(spriteConfig, "ship");
    player.x = sWidth/2 -player.getBounds().width/2;
    player.y = sHeight - player.getBounds().height;
    stg.addChildAt(player,0);
}


function setContorl(){
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;

}
function handleKeyDown(e){
    e = !e ? window.event : e;
    switch(e.keyCode){
        case ARROW_KEY_LEFT:
            leftKeyDown = true;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = true;
            break;
    }
}

function handleKeyUp(e){
    e = !e ? window.event : e;
    switch(e.keyCode){
        case ARROW_KEY_LEFT:
            leftKeyDown = false;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = false;
            break;
        case SPACE_KEY:
            playFire();
    }
}
function playFire(){
    if(fireAble){
    var fire = new createjs.Shape();
    fire.graphics.beginFill("#FF0000").drawRect(0,0,2,5).endFill();
    fire.x = player.x + 18;
    fire.y = 658;
    cjs.Sound.play("shot");
    fires.push(fire);
    stg.addChild(fire);}
}


function buildMsg(){
    livesTxt = new createjs.Text("lives:" + lives, "20px Times", "#FFF");
    livesTxt.y = 5;
    livesTxt.x = 10;
    stg.addChild(livesTxt);

    scoreTxt = new createjs.Text("score:" + score, "20px Times", "#FFF");
    scoreTxt.y =5;
    scoreTxt.x = sWidth - 100;
    stg.addChild(scoreTxt);
}

function buildEnemy() {
    var i, e1, e2, e3, e4,e5,e6,e7;
    e1 = new cjs.Sprite(spriteConfig, "enemy1");
    e2 = new cjs.Sprite(spriteConfig, "enemy2");
    e3 = new cjs.Sprite(spriteConfig, "enemy3");
    e4 = new cjs.Sprite(spriteConfig, "enemy4");
	 e5 = new cjs.Sprite(spriteConfig, "enemy5");
	  e6 = new cjs.Sprite(spriteConfig, "enemy6");
	   e7 = new cjs.Sprite(spriteConfig, "enemy7");



    enemyClip.push(e1, e2, e3, e4,e5,e6,e7);
    buildEnemis();
}

function buildEnemis(){
    var i, j=0, en, en1,en2,en3;
    for(i=0;i<4;i++){
        en = enemyClip[i].clone();
		
       
            en1 = en.clone();
			 en1.x=100;
		     en1.y=-50;
		
            enemy.push(en1);
            cjs.Tween.get(en1).wait(1500*i).to({x:200,y:800}, 2000, cjs.Ease.sineInOut(-2))
            stg.addChild(en1);

			 en2 = enemyClip[i].clone();
       
	  
            en3 = en.clone();
			 en3.x=200;
		     en3.y=-50;
            enemy.push(en3);
            cjs.Tween.get(en3).wait(1000*i).to({x:500,y:1000}, 3000, cjs.Ease.sineInOut(-2))
            stg.addChild(en3);
        
        
    }
}


function updateStageHandler(event) {
    updateStar();
    updatePlayer();
    updateEnemy();
    updateFire();
    updateMsg();

    checkGame();
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
function updatePlayer(){
    var nextX = player.x;
    if(leftKeyDown){
        nextX = player.x - speed;
        if(nextX<0){
            nextX = 0;
        }
    }else if(rightKeyDown){
        nextX = player.x + speed;
        if(nextX > (sWidth - 37)){
            nextX = sWidth - 37;
        }
    }

    player.x = nextX;
}
function updateFire(){
    var i, nextY, fire;
    for (i=0;i<fires.length;i++){
        fire = fires[i];
        nextY = fire.y - 20;

       
        if(nextY <= 0 ){
            fires.splice(i,1)
            stg.removeChild(fire);
            continue;
        }
        fire.y = nextY;
    }
}


function updateEnemy(){
    var i, j, fire, enemyTemp, enemy1;
    for(var m=0;m<enemy.length;m++){
        enemyTemp = enemy[m];

        var tempx = enemyTemp.x;
        var tempy = enemyTemp.y;

        if(tempy>=sHeight+100 || tempx>=sWidth-100){
            enemy.splice(m,1);
            stg.removeChild(enemyTemp);
        }
    }

    for(i=0;i<fires.length;i++){
       
        for(j=0;j<enemy.length;j++){
            
            fire = fires[i];
            enemy1 = enemy[j];

            var fx = fire.x;
            var fy = fire.y;

            var ex = enemy1.x;
            var ey = enemy1.y;
            var ew = enemy1.getBounds().width;
            var eh = enemy1.getBounds().height;
            

            if(fy < ey+eh && fy > ey 
                && fx>ex && fx<ex+ew
                && ey > 0){
                score += 10;

                fire.y= -0;

                enemy.splice(j,1);
                stg.removeChild(enemy1);

              
                cjs.Sound.play("explosion");
                var exp1 = new cjs.Sprite(spriteConfig, "exp");
                exp1.x = ex;
                exp1.y = ey;
                exp1.addEventListener('animationend',function(e){
                    stg.removeChild(e.target);
                });
                stg.addChild(exp1);
            }

        }
    }
}
function updateMsg(){
    scoreTxt.text = "score:" + score;
    livesTxt.text = "lives:" + lives;
}


function startGame(){

}
function checkGame(){

    var i,en,pl;
    if(enemy.length==0){
        buildEnemis();
    }
    pl = player;
    plx = player.x;
    ply = player.y;
    plw = player.getBounds().width;
    plh = player.getBounds().height;

    for(i=0;i<enemy.length;i++){
        en = enemy[i];
        enx = en.x;
        eny = en.y;
        enw = en.getBounds().width;
        enh = en.getBounds().height;

        if(eny+enh<sHeight+100 && eny+enh > ply && enx > plx && enx < plx+plw && breakAble){
            stg.removeChild(player);
            pl = null;
            player = null;
            fireAble = false;
            breakAble = false;
            setTime = setTimeout(createPlayer,10);
            break;
        }

    }

}
function createPlayer(){
    clearTimeout(setTime);
    player = new cjs.Sprite(spriteConfig, "ship");
    player.x = sWidth/2- player.getBounds().width;
    player.y = sHeight - player.getBounds().height;
    player.alpha = 0;
    cjs.Tween.get(player).to({alpha:1}, 1000, cjs.Ease.getPowIn(1)).call(function(){
        if(lives >0){
		lives--;
        fireAble = true;
        breakAble = true;
		}
    });
    stg.addChildAt(player,0);
}

init();
