var myShip;
var enemyShip = [];
var myBullet = [];
var explosionIm;
var score = 0 ;
var mybackground;

document.getElementById("score").innerHTML = score.toString().padStart(5, "0");;

function startGame() {
    myGameArea.start();
    myShip = new component(40, 40, "../media/static/ship.png", 230, 580,"image");
    explosionIm = new component(0, 0,"../media/effect/kill_effect.gif", 100, 100, "image");
    mybackground = new component(480,630,"../media/background/space.jpg",0,0,"background");
}

function updateScore(){
	document.getElementById("score").innerHTML = score.toString().padStart(5, "0");;
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 630;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.bulletFreq = 0;
        this.interval = setInterval(updateGameArea,20);
        window.addEventListener('keydown',function(e){
            myGameArea.keys = myGameArea.keys || [];
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e){
            myGameArea.keys[e.keyCode] = false;
        })
        // window.addEventListener('mousemove',function(e){
        //     if(e.movementX>0){
        //         myGameArea.mouseRight = true;
        //         myGameArea.mouseLeft = false;
        //     }
        //     if(e.movementX<0){
        //         myGameArea.mouseRight = false;
        //         myGameArea.mouseLeft = true;
        //     }
        // })
    },
    clear : function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval)
    }
}

function everyinterval(n){
    if ((myGameArea.frameNo / n)%1 == 0){
        return true;
    }
    return false;
}

function everybullet(n){
    if ((myGameArea.bulletFreq / n)%1 == 0){
        return true;
    }
    return false;
}

function explosion(x,y){
    explosionIm.x = x;
    explosionIm.y = y;
    explosionIm.height = 80;
    explosionIm.width = 80;
    score++;
    updateScore();
    setTimeout(function(){
        explosionIm.height =0;
        explosionIm.width =0;
    },200);
}

function component(width, height, color, x, y,type) {
    this.type = type;
    if(type=="image" || type =="background"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){    
        ctx = myGameArea.context;
        if(this.type == "image" || this.type == "background"){
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);    
        }
    }
    this.newPos = function(){
        if(this.x > 0 && this.speedX < 0){
            this.x += this.speedX;
        }
        if(this.x < 440 && this.speedX > 0){
            this.x += this.speedX;
        }
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y == (this.height)) {
              this.y = 0;
            }
        }
    }
    this.crashwith = function(otherobj){
        var myleft = this.x;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var myright = this.x + this.width;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop)||(mytop > otherbottom)||(myright<otherleft)||(myleft>otherright)){
            crash = false;
        }
        return crash;
    }
}

function updateGameArea(){
    myGameArea.clear();
    mybackground.speedY = 2;
    mybackground.newPos();
    mybackground.update();
    for(i=0;i<enemyShip.length;i+=1){
        for(j=0;j<myBullet.length;j+=1){
            if (enemyShip[i].crashwith(myBullet[j])){
                ex=enemyShip[i].x;
                ey=enemyShip[i].y;
                explosion(ex,ey);
                enemyShip.splice(i,1);
                myBullet.splice(j,1);
            }
        }
    }
    myGameArea.frameNo +=1;
    if( myGameArea.frameNo == 1 || everyinterval(100)){
        x = myGameArea.canvas.width;
        y = Math.floor(Math.random()*(200))
        enemyShip.push(new component(60, 60, "../media/static/enemy.png", x, y,"image")); 
    }
    for(i=0;i<enemyShip.length;i+=1){
        enemyShip[i].x += -1.5;
        enemyShip[i].update();
    }
    myShip.speedX = 0;
    myShip.speedY = 0;
    if ((myGameArea.keys && myGameArea.keys[37,65]) || (myGameArea.mouseLeft && myGameArea.mouseLeft===true)){
        myShip.speedX = -2;
    }
    if ((myGameArea.keys && myGameArea.keys[39,68]) || (myGameArea.mouseRight && myGameArea.mouseRight===true)){
        myShip.speedX = 2;
    }
    myGameArea.bulletFreq+=1;
    if (myGameArea.keys && myGameArea.keys[13]){
        if(myGameArea.bulletFreq && everybullet(20)){
            xm = myShip.x;
            ym = myShip.y;
            myBullet.push(new component(25, 25, "../media/static/missile.gif", xm, ym,"image")); 
        }
    }
    for(j=0;j<myBullet.length;j+=1){
        myBullet[j].y -= 2;
        myBullet[j].update();
    }
    myShip.newPos();
    myShip.update();
    explosionIm.update()
}