window.oncontextmenu = (e) => { return false }
let amount :number = Number(localStorage.getItem('amount'))
let chance :number = Number(localStorage.getItem('chance'))

if(amount === 0) amount = 11
if(chance === 0) chance = 25

let colors :string[] = ['white', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'brown', 'orange']

const code = () => {

    const flag :HTMLCanvasElement= document.querySelector("#flag")!
    const ctxFlag :CanvasRenderingContext2D = flag.getContext('2d')!

    const canvas :HTMLCanvasElement = document.querySelector("#canvas")!
    const ctx :CanvasRenderingContext2D = canvas.getContext('2d')!

    const creating = (figure :string, ctx :CanvasRenderingContext2D, color :string, x :number, y:number, length:number) => {

        ctx.beginPath()
        ctx.fillStyle = color
        ctx.moveTo(x, y)

        if(figure === 'square'){

            ctx.lineTo(length*2 + x, y)
            ctx.lineTo(length*2 + x, y + length)
        }
        if(figure === 'flag'){

            ctx.lineTo(length*2 + x, y + length/2)
        }

        ctx.lineTo(x, y + length)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.fill()
    }

    const paintingCanvas = (y :number, x :number) =>{

        if(arrey_bomb[y][x] === `bomb`){

            alert('БУУУМ!')
            window.location.reload()
        }

        for (let c = 0; c < colors.length; c++)
            if(Number(arrey_bomb[y][x]) === c){

                creating('square', ctx, colors[c], (x-1)*300 / amount, (y-1)*150 / amount, 150 / amount)

                arrey_bomb[y][x] = `${colors[c]}`

                let score :number = 0

                for(let f = 1; f < amount + 1; f++)
                    for(let s = 1; s < amount + 1; s++){

                        if( Number.isInteger( Number(arrey_bomb[f][s])) ) score = 0

                        else score++
                    }
                
                if(score === amount**2) alert('Поздравляю! Ты умеешь играть!')
            }
    }
    const white = (j :number, i :number) =>{

        for(let f = 0; f < 3; f++)
            for(let s = 0; s < 3; s++)

                if(arrey_bomb[ j + f ] [ i + s ] === '0'){

                    paintingCanvas(j + f, i + s)
                    white(j + f - 1, i + s - 1)
                }
                else paintingCanvas(j + f , i + s)

    }
    const click = (mausclick :string, event :MouseEvent) =>{

        let mauseX :number = event.offsetX
        let mauseY :number = event.offsetY

        for(let i = 0; i < amount; i++) 

            if( i*800 / amount < mauseX && mauseX < ( i + 1 )*800 / amount)

                for(let j = 0; j < amount; j++)

                    if( j*800 / amount < mauseY && mauseY < ( j + 1 )*800 / amount ){

                        if(mausclick === 'left'){

                            if(Number(arrey_bomb[ j + 1 ][ i + 1 ]) === 0){

                                paintingCanvas(j + 1, i + 1)
                                white(j, i)
                                break
                            }
                            else paintingCanvas(j + 1, i + 1)
                            break

                        }else if(mausclick === 'right' && (arrey_bomb[ j + 1 ][ i + 1 ] === 'bomb' || Number.isInteger( Number(arrey_bomb[ j + 1 ][ i + 1 ])))){
                            
                            creating('flag', ctx, 'red', (i*300 + 60) / amount, (j*150 + 20) / amount, 100 / amount)
                            break
                        }
                    }
    }

    const noFlags = () => {

        creating('flag', ctxFlag, 'grey', 36, 17, 100)

        flag.onclick = () => newFlags()
        canvas.onclick = (event :MouseEvent) => click('left', event)
    }

    const newFlags = () => {

        creating('flag', ctxFlag, 'red', 36, 17, 100)

        flag.onclick = () => noFlags()
        canvas.onclick = (event :MouseEvent) => click('right', event)
    }

    creating('square', ctx, 'grey', 0, 0, 800)//field of play    
    creating('square', ctxFlag, 'grey', 0, 0, 800)//!!topright!!
    creating('flag', ctxFlag, 'grey', 36, 17, 100)//flag

    flag.onclick = () => newFlags()
    canvas.onclick = (event :MouseEvent) => click('left', event)
    canvas.oncontextmenu = (event :MouseEvent) => click('right', event)


    for(let f = 0; f < amount; f++){

        ctx.beginPath()
        ctx.moveTo(0, f*150 / amount)
        ctx.lineTo(800, f*150 / amount)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(f*300 / amount, 0)
        ctx.lineTo(f*300 / amount, 800)
        ctx.stroke()
    }

    let nonBombs = 0
    let arrey_bomb :string[][] = []

    for(let i = 0; i < amount + 2; i++) arrey_bomb[i] = []

    for(let y = 1; y < amount + 1 ; y++)
        for(let x = 1; x < amount + 1 ; x++)

            if( Math.floor(Math.random() * 100) < chance) arrey_bomb[y][x] = 'bomb'

            else {
                arrey_bomb[y][x] = "non"
                nonBombs++
            }
        
    const HTMLbombs :HTMLElement = document.querySelector('#bombs')!
    HTMLbombs.innerHTML = String(amount**2 - nonBombs)

    let threat = 0

    for(let y = 1; y < amount + 1; y++)
        for(let x = 1; x < amount + 1; x++)
            if(arrey_bomb[y][x] === 'non'){

                for(let f = -1; f < 2; f++)
                    for(let s = -1; s < 2; s++)
                        if(arrey_bomb[y + f][x + s] === 'bomb') threat++
                    
                arrey_bomb[y][x] = String(threat)
                threat = 0
            }
}

const setON = () =>{

    const buttonSettings :HTMLButtonElement = document.querySelector('#button_settings')!
    buttonSettings.onclick = () => {

        const game :HTMLElement = document.querySelector('#game')!
        game.innerHTML = 
        `
            <center> 
                <div id='settings'>
                    <div id="name">Количество ячеек</div>
                    <input id="amount" type="range" min="1" max="30" value="${amount}">
                    <div id="name_amount">${amount}X${amount}</div>

                    <div id="name">Шанс выпадения бомбы</div>
                    <input id="chance" type="range" min="1" max="100" value="${chance}">
                    <div id="name_chance">${chance}%</div>
                </div> 
            </center> 
        `
        const InpAmount :HTMLInputElement = document.querySelector('#amount')!
        const InpChance :HTMLInputElement = document.querySelector('#chance')!

        InpAmount.oninput = function<HTMLInputElement>() {

            const InpNameAmount :HTMLElement = document.querySelector<HTMLElement>('#name_amount')!

            InpNameAmount.innerHTML = this.value+`X${this.value}`

            localStorage.setItem('amount', this.value)
            amount = Number(this.value)
        }

        InpChance.oninput = function<HTMLInputElement>() {

            const InpNameChance :HTMLElement = document.querySelector('#name_chance')!

            InpNameChance.innerHTML = this.value+`X${this.value}`

            localStorage.setItem('chance', this.value)
            chance = Number(this.value)
        }
        setOFF()
    }
}

const setOFF = () =>{

    const buttonSettings :HTMLButtonElement = document.querySelector('#button_settings')!
    buttonSettings.onclick = () => {

        const game :HTMLElement = document.querySelector('#game')!
        game.innerHTML = 
        ` 
            <span id="spanish">
                <div class = 'number'><font color='white' > 0 </font></div>
                <div class = 'number'><font color='blue'  > 1 </font></div>
                <div class = 'number'><font color='green' > 2 </font></div>
                <div class = 'number'><font color='red'   > 3 </font></div>
                <div class = 'number'><font color='purple'> 4 </font></div>
                <div class = 'number'><font color='yellow'> 5 </font></div>
                <div class = 'number'><font color='pink'  > 6 </font></div>
                <div class = 'number'><font color='brown' > 7 </font></div>
                <div class = 'number'><font color='orange'> 8 </font></div>
            </span>
            <center>
                <canvas id="canvas"></canvas>
            </center>
            <canvas id="flag"></canvas>
            <span size="10" id='bombs'></span>
        `
        code()   
        setON()
    }            
}                

code()
setON()