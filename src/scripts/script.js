"use strict";
window.oncontextmenu = (e) => { return false; };
let amount = Number(localStorage.getItem('amount'));
let chance = Number(localStorage.getItem('chance'));
if (amount === 0)
    amount = 11;
if (chance === 0)
    chance = 25;
let colors = ['white', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'brown', 'orange'];
const code = () => {
    const flag = document.querySelector("#flag");
    const ctxFlag = flag === null || flag === void 0 ? void 0 : flag.getContext('2d');
    const canvas = document === null || document === void 0 ? void 0 : document.querySelector("#canvas");
    const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    const creating = (figure, ctx, color, x, y, length) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(x, y);
        if (figure === 'square') {
            ctx.lineTo(length * 2 + x, y);
            ctx.lineTo(length * 2 + x, y + length);
        }
        if (figure === 'flag') {
            ctx.lineTo(length * 2 + x, y + length / 2);
        }
        ctx.lineTo(x, y + length);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fill();
    };
    const paintingCanvas = (y, x) => {
        if (arrey_bomb[y][x] === `bomb`) {
            alert('БУУУМ!');
            window.location.reload();
        }
        for (let c = 0; c < colors.length; c++)
            if (Number(arrey_bomb[y][x]) === c) {
                if (ctx)
                    creating('square', ctx, colors[c], (x - 1) * 300 / amount, (y - 1) * 150 / amount, 150 / amount);
                arrey_bomb[y][x] = `${colors[c]}`;
                let score = 0;
                for (let f = 1; f < amount + 1; f++)
                    for (let s = 1; s < amount + 1; s++) {
                        if (Number.isInteger(Number(arrey_bomb[f][s])))
                            score = 0;
                        else
                            score++;
                    }
                if (score === amount ** 2)
                    alert('Поздравляю! Ты умеешь играть!');
            }
    };
    const white = (j, i) => {
        for (let f = 0; f < 3; f++) {
            for (let s = 0; s < 3; s++) {
                if (arrey_bomb[j + f][i + s] === '0') {
                    paintingCanvas(j + f, i + s);
                    white(j + f - 1, i + s - 1);
                }
                else
                    paintingCanvas(j + f, i + s);
            }
        }
    };
    const click = (mausclick, event) => {
        let mauseX = event.offsetX;
        let mauseY = event.offsetY;
        for (let i = 0; i < amount; i++)
            if (i * 800 / amount < mauseX && mauseX < (i + 1) * 800 / amount)
                for (let j = 0; j < amount; j++)
                    if (j * 800 / amount < mauseY && mauseY < (j + 1) * 800 / amount)
                        if (mausclick === 'left') {
                            if (Number(arrey_bomb[j + 1][i + 1]) === 0) {
                                paintingCanvas(j + 1, i + 1);
                                white(j, i);
                            }
                            else
                                paintingCanvas(j + 1, i + 1);
                        }
                        else if (mausclick === 'right' && (Number.isInteger(arrey_bomb[j + 1][i + 1]) || arrey_bomb[j + 1][i + 1] === 'bomb')) {
                            if (ctx)
                                creating('flag', ctx, 'red', (i * 300 + 60) / amount, (j * 150 + 20) / amount, 100 / amount);
                        }
    };
    const noFlags = () => {
        if (ctxFlag)
            creating('flag', ctxFlag, 'grey', 36, 17, 100);
        if (flag)
            flag.onclick = () => newFlags();
        if (canvas)
            canvas.onclick = (event) => click('left', event);
    };
    const newFlags = () => {
        if (ctxFlag)
            creating('flag', ctxFlag, 'red', 36, 17, 100);
        if (flag)
            flag.onclick = () => noFlags();
        if (canvas)
            canvas.onclick = (event) => click('right', event);
    };
    if (ctx)
        creating('square', ctx, 'grey', 0, 0, 800); //field of play
    if (ctxFlag)
        creating('square', ctxFlag, 'grey', 0, 0, 800); //!!topright!!
    if (ctxFlag)
        creating('flag', ctxFlag, 'grey', 36, 17, 100); //flag
    if (flag)
        flag.onclick = () => newFlags();
    if (canvas)
        canvas.onclick = (event) => click('left', event);
    if (canvas)
        canvas.oncontextmenu = (event) => click('right', event);
    if (ctx)
        for (let f = 0; f < amount; f++) {
            ctx.beginPath();
            ctx.moveTo(0, f * 150 / amount);
            ctx.lineTo(800, f * 150 / amount);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(f * 300 / amount, 0);
            ctx.lineTo(f * 300 / amount, 800);
            ctx.stroke();
        }
    let nonBombs = 0;
    let arrey_bomb = [];
    for (let i = 0; i < amount + 2; i++)
        arrey_bomb[i] = [];
    for (let y = 1; y < amount + 1; y++)
        for (let x = 1; x < amount + 1; x++)
            if (Math.floor(Math.random() * 100) < chance)
                arrey_bomb[y][x] = 'bomb';
            else {
                arrey_bomb[y][x] = "non";
                nonBombs++;
            }
    const HTMLbombs = document === null || document === void 0 ? void 0 : document.querySelector('#bombs');
    if (HTMLbombs)
        HTMLbombs.innerHTML = String(amount ** 2 - nonBombs);
    let threat = 0;
    for (let y = 1; y < amount + 1; y++)
        for (let x = 1; x < amount + 1; x++)
            if (arrey_bomb[y][x] === 'non') {
                for (let f = -1; f < 2; f++) {
                    for (let s = -1; s < 2; s++) {
                        if (arrey_bomb[y + f][x + s] === 'bomb')
                            threat++;
                    }
                }
                arrey_bomb[y][x] = String(threat);
                threat = 0;
            }
};
const setON = () => {
    const buttonSettings = document.querySelector('#button_settings');
    if (buttonSettings)
        buttonSettings.onclick = () => {
            const game = document.querySelector('#game');
            if (game)
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
        `;
            const InpAmount = document.querySelector('#amount');
            if (InpAmount)
                InpAmount.oninput = function () {
                    const InpNameAmount = document.querySelector('#name_amount');
                    if (InpNameAmount)
                        InpNameAmount.innerHTML = this.value + `X${this.value}`;
                    localStorage.setItem('amount', this.value);
                    amount = Number(this.value);
                };
            const InpChance = document.querySelector('#chance');
            if (InpChance)
                InpChance.oninput = function () {
                    const InpNameChance = document.querySelector('#name_chance');
                    if (InpNameChance)
                        InpNameChance.innerHTML = this.value + `X${this.value}`;
                    localStorage.setItem('chance', this.value);
                    chance = Number(this.value);
                };
            setOFF();
        };
};
const setOFF = () => {
    const buttonSettings = document.querySelector('#button_settings');
    if (buttonSettings)
        buttonSettings.onclick = () => {
            const game = document.querySelector('#game');
            if (game)
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

        `;
            code();
            setON();
        };
};
code();
setON();
