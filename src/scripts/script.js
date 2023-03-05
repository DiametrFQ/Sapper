"use strict";
window.oncontextmenu = (e) => { return false; };
let amountFields = 16;
let chance = Number(localStorage.getItem('chance'));
if (chance === 0)
    chance = 25;
const colors = ['yellow', 'blue', 'green', 'red', '#00008b', '#964b00', '#30d5c8', 'black', 'white'];
let seconds = 999;
let Interval;
const code = () => {
    const HTMLbombs = document.querySelector('#bombs');
    const HTMLseconds = document.querySelector("#seconds");
    const flag = document.querySelector("#flag");
    const ctxFlag = flag.getContext('2d');
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    const face = document.querySelector('#img');
    face.onclick = () => {
        window.location.reload();
    };
    let firstClick = true;
    const arreyCrdntFlags = [];
    const arreyCrdntQuestions = [];
    const checkCrdnt = (crdnts, x, y) => {
        for (const crdnt of crdnts) {
            if (crdnt.x === x && crdnt.y === y) {
                let index = crdnts.indexOf(crdnt);
                crdnts.splice(index);
                return true;
            }
        }
        return false;
    };
    const dead = () => {
        click = (mausclick, event) => { };
        canvas.onmousedown = () => { };
        canvas.onmouseup = () => { };
        face.src = './../../public/FaceDead.png';
        clearInterval(Interval);
        length = 800 / amountFields;
        for (let x = 0; x <= amountFields + 1; x++) {
            for (let y = 0; y <= amountFields + 1; y++) {
                if (arrey_bomb[y][x] === 'bomb') {
                    ctx.beginPath();
                    ctx.fillStyle = 'black';
                    ctx.arc(((x - 1) * 300) / (amountFields) + (150 / amountFields), ((y - 1) * 150) / amountFields + (75 / amountFields), 64 / amountFields, 0, 2 * Math.PI, false);
                    ctx.fill();
                }
            }
        }
    };
    const drawQuestions = (x, y, length) => {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(length + x, y + length / 2 - 1, length / 3, Math.PI, Math.PI / 2, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(length + x, y + length + 2 / 2 - 1, 1, 0, Math.PI, false);
        ctx.fill();
    };
    const draw = (figure, ctx, color, x, y, length) => {
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
            if (firstClick) {
                arrey_bomb[y][x] = 'non';
                let countBomb = 0;
                for (let i = -1; i < 2; i++)
                    for (let j = -1; j < 2; j++)
                        if (arrey_bomb[y + i][x + j] === `bomb`)
                            countBomb++;
                arrey_bomb[y][x] = `${countBomb}`;
                if (+arrey_bomb[y][x] === 0) {
                    white(y - 1, x - 1);
                    return;
                }
            }
            else {
                dead();
            }
        }
        firstClick = false;
        for (let c = 0; c < colors.length; c++)
            if (+arrey_bomb[y][x] === c) {
                draw('square', ctx, colors[c], (x - 1) * 300 / amountFields, (y - 1) * 150 / amountFields, 150 / amountFields);
                arrey_bomb[y][x] = `${colors[c]}`;
                let score = 0;
                for (let f = 1; f < amountFields + 1; f++)
                    for (let s = 1; s < amountFields + 1; s++) {
                        if (Number.isInteger(+arrey_bomb[f][s]))
                            score = 0;
                        else
                            score++;
                    }
                if (score === amountFields ** 2) {
                    alert('Поздравляю! Ты умеешь играть!');
                    clearInterval(Interval);
                    face.src = './../../public/FaceGlass.png';
                }
            }
    };
    const white = (j, i) => {
        for (let f = 0; f < 3; f++)
            for (let s = 0; s < 3; s++)
                if (arrey_bomb[j + f][i + s] === '0') {
                    paintingCanvas(j + f, i + s);
                    white(j + f - 1, i + s - 1);
                }
                else
                    paintingCanvas(j + f, i + s);
    };
    let click = (mausclick, event) => {
        console.log(arrey_bomb);
        let mauseX = event.offsetX;
        let mauseY = event.offsetY;
        for (let i = 0; i < amountFields; i++)
            if (i * 800 / amountFields < mauseX && mauseX < (i + 1) * 800 / amountFields)
                for (let j = 0; j < amountFields; j++)
                    if (j * 800 / amountFields < mauseY && mauseY < (j + 1) * 800 / amountFields)
                        if (mausclick === 'left') {
                            if (+arrey_bomb[j + 1][i + 1] === 0) {
                                paintingCanvas(j + 1, i + 1);
                                white(j, i);
                                break;
                            }
                            else
                                paintingCanvas(j + 1, i + 1);
                            break;
                        }
                        else if (mausclick === 'right' && (arrey_bomb[j + 1][i + 1] === 'bomb' || Number.isInteger(+arrey_bomb[j + 1][i + 1]))) {
                            if (checkCrdnt(arreyCrdntQuestions, i, j)) {
                                draw('square', ctx, 'gray', (i * 300 + 10) / amountFields, (j * 150 + 10) / amountFields, 140 / amountFields);
                            }
                            else if (checkCrdnt(arreyCrdntFlags, i, j)) {
                                draw('square', ctx, 'gray', (i * 300 + 10) / amountFields, (j * 150 + 10) / amountFields, 140 / amountFields);
                                drawQuestions((i * 300 + 60) / amountFields, (j * 150 + 20) / amountFields, 100 / amountFields);
                                arreyCrdntQuestions.push({ x: i, y: j });
                            }
                            else {
                                draw('flag', ctx, 'red', (i * 300 + 60) / amountFields, (j * 150 + 20) / amountFields, 100 / amountFields);
                                arreyCrdntFlags.push({ x: i, y: j });
                            }
                            return;
                        }
    };
    const noFlags = () => {
        draw('flag', ctxFlag, 'grey', 36, 17, 100);
        flag.onclick = () => newFlags();
        canvas.onclick = (event) => click('left', event);
    };
    const newFlags = () => {
        draw('flag', ctxFlag, 'red', 36, 17, 100);
        flag.onclick = () => noFlags();
        canvas.onclick = (event) => click('right', event);
    };
    draw('square', ctx, 'grey', 0, 0, 800);
    draw('square', ctxFlag, 'grey', 0, 0, 800);
    draw('flag', ctxFlag, 'grey', 36, 17, 100);
    flag.onclick = () => newFlags();
    canvas.onclick = (event) => click('left', event);
    canvas.oncontextmenu = (event) => click('right', event);
    canvas.onmousedown = () => {
        face.src = './../../public/FaceWow.png';
    };
    canvas.onmouseup = () => {
        face.src = './../../public/FaceStandart.png';
    };
    for (let f = 0; f < amountFields; f++) {
        ctx.beginPath();
        ctx.moveTo(0, f * 150 / amountFields);
        ctx.lineTo(800, f * 150 / amountFields);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(f * 300 / amountFields, 0);
        ctx.lineTo(f * 300 / amountFields, 800);
        ctx.stroke();
    }
    let countBombs = 40;
    let arrey_bomb = [];
    for (let i = 0; i <= amountFields + 1; i++)
        arrey_bomb[i] = [];
    const haveBomb = () => {
        const x = Math.floor(Math.random() * (amountFields) + 1);
        const y = Math.floor(Math.random() * (amountFields) + 1);
        if (arrey_bomb[y][x] === "bomb") {
            haveBomb();
        }
        else {
            arrey_bomb[y][x] = "bomb";
        }
    };
    for (let i = 0; i < countBombs + 2; i++) {
        haveBomb();
    }
    HTMLbombs.innerHTML = String(countBombs);
    let threat = 0;
    for (let y = 1; y <= amountFields; y++) {
        for (let x = 1; x <= amountFields; x++) {
            if (!(arrey_bomb[y][x] === 'bomb')) {
                for (let f = -1; f < 2; f++)
                    for (let s = -1; s < 2; s++)
                        if (arrey_bomb[y + f][x + s] === 'bomb')
                            threat++;
                arrey_bomb[y][x] = String(threat);
                threat = 0;
            }
        }
    }
    Interval = setInterval(() => {
        --seconds;
        HTMLseconds.textContent = `${seconds}`;
        if (seconds === 0) {
            dead();
        }
    }, 1000);
};
const settingsON = () => {
    const buttonSettings = document.querySelector('#button_settings');
    buttonSettings.onclick = () => {
        clearInterval(Interval);
        const game = document.querySelector('#game');
        game.innerHTML =
            `
            <center> 
                <div id='settings'>
                    <div class="name">
                        Количество ячеек <br>
                        PS: Здесь реально можно изменить количество ячеек, но из-за условия VK в 40 мин,
                        количество ячеек 7X7 или меньше приведет к ошибке
                    </div>
                    <input id="amount" type="range" min="8" max="30" value="${amountFields}">
                    <div id="name_amount">${amountFields}X${amountFields}</div>

                    <div class="name">
                        Здесь вы могли изменить шанс выпадения бомбы, но так как вы находитесь на версии для VK это нарушает правило в 40 мин. 
                        Да я не использовал ваши спрайты и по этому провалил задание, зато как то разноображу вам контент,
                        а то устали смотреть на одно и тоже. Возми 5ти минтутный перерыв, встань, подвигайся выпей кофейку, я разрешаю
                    </div>

                    <input id="chance" type="range" min="1" max="100" value="${chance}">
                    <div id="name_chance">${chance}%</div>
                </div> 
            </center> 
        `;
        const InpAmount = document.querySelector('#amount');
        const InpChance = document.querySelector('#chance');
        InpAmount.oninput = function () {
            const InpNameAmount = document.querySelector('#name_amount');
            InpNameAmount.innerHTML = this.value + `X${this.value}`;
            localStorage.setItem('amount', this.value);
            amountFields = +this.value;
        };
        InpChance.oninput = function () {
            const InpNameChance = document.querySelector('#name_chance');
            InpNameChance.innerHTML = `${this.value}%`;
            localStorage.setItem('chance', this.value);
            chance = +this.value;
        };
        settingsOFF();
    };
};
const settingsOFF = () => {
    seconds = 999;
    const buttonSettings = document.querySelector('#button_settings');
    buttonSettings.onclick = () => {
        const game = document.querySelector('#game');
        game.innerHTML =
            ` 
            <span id="spanish" >
            <div class = 'number'><font color='yellow' > 0 </font></div>
            <div class = 'number'><font color='blue'   > 1 </font></div>
            <div class = 'number'><font color='green'  > 2 </font></div>
            <div class = 'number'><font color='red'    > 3 </font></div>
            <div class = 'number'><font color='#00008b'> 4 </font></div>
            <div class = 'number'><font color='#964b00'> 5 </font></div>
            <div class = 'number'><font color='#30d5c8'> 6 </font></div>
            <div class = 'number'><font color='black'  > 7 </font></div>
            <div class = 'number'><font color='white'  > 8 </font></div>
            </span>

            <center>
                <canvas id="canvas"></canvas>
            </center>

            <span id='seconds'> 999 </span>

            <canvas id="flag"></canvas>

            <span size="10" id='bombs'></span>

            <span id="faceSpan">
                <img id="img" src="./public/FaceStandart.png">
            </span>
        `;
        code();
        settingsON();
    };
};
code();
settingsON();
//# sourceMappingURL=script.js.map