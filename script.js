window.oncontextmenu = (e) => {
    return false
}

let amount = 10//max 30(?)
let chance = 25
let colors = ['white', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'brown', 'orange']

const ctx = document.querySelector("#canvas").getContext('2d');
creatingSquare(ctx, 'grey', 0, 0, 800)

getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}
for(f=0; f<amount; f++){
    ctx.beginPath()
    ctx.moveTo(0, f*150/amount)
    ctx.lineTo(800, f*150/amount)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(f*300/amount, 0)
    ctx.lineTo(f*300/amount, 800)
    ctx.stroke()
}

let arrey_bomb = []
for(i=0; i<amount+2; i++){
    arrey_bomb[i] = []
}

for(y=1; y<amount+1; y++){
    for(x=1; x<amount+1; x++){
        if(getRandomInt(100) < chance) arrey_bomb[y][x] = 'bomb';
        else arrey_bomb[y][x] = 'non'
    }
}
let threat = 0

for(y=1; y<amount+1; y++){
    for(x=1; x<amount+1; x++){
        if(arrey_bomb[y][x] === 'non'){
            for(f=-1;f<2;f++){
                for(s=-1;s<2;s++){
                    if(arrey_bomb[y+f][x+s] === 'bomb') threat++
                }
            }
            arrey_bomb[y][x] = threat
            threat = 0
        }
    }
}

function creatingSquare(ctx, color, x, y, length) {
	ctx.beginPath()
	ctx.fillStyle = color
	ctx.moveTo(x, y)
	ctx.lineTo(length*2 + x, y)
	ctx.lineTo(length*2 + x, y + length)
	ctx.lineTo(x, y + length)
	ctx.lineTo(x, y)
	ctx.stroke()
	ctx.fill()
}
function creatingFlag(ctx, x, y, length) {
	ctx.beginPath()
	ctx.fillStyle = 'red'
	ctx.moveTo(x, y)
	ctx.lineTo(length*2 + x, y + length/2)
	ctx.lineTo(x, y + length)
	ctx.lineTo(x, y)
	ctx.stroke()
	ctx.fill()
}
paintingCanvas = (y,x) =>{
        if(arrey_bomb[y][x] === `bomb`){
            alert('БУУУМ!')
            window.location.reload()
        }
        for (c = 0; c < colors.length; c++) {
            if(arrey_bomb[y][x] === c){
                creatingSquare(ctx, colors[c], (x-1)*300/amount, (y-1)*150/amount, 150/amount)
            }
        }

}
canvas.onclick = (event) => {
	mauseX = event.offsetX;
	mauseY = event.offsetY;
    for(i=0; i<amount; i++){

        if( (i*800/amount)<mauseX && mauseX <((i+1)*800/amount)){

            for(j=0; j<amount; j++){

                if(j*800/amount < mauseY && mauseY <(j+1)*800/amount){

                    if(arrey_bomb[j+1][i+1] === 0){

                        for(f=0; f<3; f++){
                            for(s=0; s<3; s++){
                                paintingCanvas(j+f,i+s)
                    
                            }
                        }

                    }else paintingCanvas(j+1,i+1)
                }
            }
        }
    }
}
canvas.oncontextmenu = (event) => {
    mauseX = event.offsetX;
    mauseY = event.offsetY;
    for(i=0; i<amount; i++){

        if( (i*800/amount)<mauseX && mauseX <((i+1)*800/amount)){

            for(j=0; j<amount; j++){

                if(j*800/amount < mauseY && mauseY <(j+1)*800/amount){
                    creatingFlag(ctx, (i*300+60)/amount, (j*150+20)/amount, 100/amount)
                                    
                }
            }
        }
    }
}
console.log(arrey_bomb);