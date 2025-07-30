document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    updateIcons(isDarkMode);
    //Cambiar el tema en dispositivos mobiles.
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
})

// Screens
const startScreen = document.querySelector('#start-screen');
const game_Screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
const result_time = document.querySelector('#result-time');
//-------------------------------------

const cells = document.querySelectorAll('.main-grid-cell');
const nameInput = document.querySelector('#input-name');
const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const name_input = document.querySelector('#input-name');
const number_inputs = document.querySelectorAll('.number');

let indexLevel = 0;
let level = CONSTANT.LEVEL[indexLevel];
let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_answer = undefined;

let selected_cell = -1;

const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');

//añadir espacio para las 9 celdas
const initGameGrid = () =>{
    let index = 0;

    for(let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        if(row === 2 || row === 5) cells[index].style.marginBottom = '10px';
        if(col === 2 || col === 5) cells[index].style.marginRight = '10px';

        index++;
    }
};
//-----------

const setPlayerName = (name) => localStorage.setItem('player_name',name);
const getPlayerName = () => localStorage.getItem('player_name');

//const showTime = (seconds) => new Date(seconds*100).toISOString().substring(11,8);
const showTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const clearSudoku =() => {
    for(let i =0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++){
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initSudoku = () => {
    //limpiar el tablero de sudoku.
    clearSudoku();
    resetBG();

    //Generar el sudoku
    su = sudokuGen(level);
    su_answer = [...su.question];
    seconds = 0;

    saveGameInfo();

    //mostrar el sudoku
    for(let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute('data-value',su.question[row][col]);

        if(su.question[row][col] !== 0){
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }
    }
}

const loadSudoku = () => {
    let game = getGameInfo();

    game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level];

    su = game.su;

    su_answer = su.answer;
    game_time.innerHTML = showTime(seconds);

    indexLevel = game.level;

    //mostrar el sudoku
    for(let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute('data-value',su_answer[row][col]);
        cells[i].innerHTML = su_answer[row][col] !== 0  ? su_answer[row][col] : '';

        if(su.question[row][col] !== 0){
            cells[i].classList.add('filled');
        }
    }
}

const hoverBG = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for(let i = 0; i < CONSTANT.BOX_SIZE; i++){
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++){
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
        }
    }

    let step = 9;
    while(index - step >= 0){
        cells[index -step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while(index + step < 81){
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while(index - step >= 9*row){
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
    while(index + step < 9*row + 9){
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

const resetBG = () => {
    cells.forEach(e => e.classList.remove('hover'));
};

const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    }

    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) addErr(cell);
        }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < 9*row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}

const removerErr = () => cells.forEach(e => e.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: indexLevel,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }

    localStorage.setItem('game', JSON.stringify(game));
}

const removeGameInfo = () => {
    localStorage.removeItem('game');
    document.querySelector('#btn-continue').style.display = 'none';
}

const isGameWin =  () => sudokuCheck(su_answer);

const showResult = () => {
    clearInterval(timer);
    result_screen.classList.add('active');
    result_time.innerHTML = showTime(seconds);
}

const initNumberInputEvent = () => {
    number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if(!cells[selected_cell].classList.contains('filled')){
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute('data-value', index + 1);

                //añadir la respuesta
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index + 1;

                //Guardar juego
                saveGameInfo();
                //-------------
                removerErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                },500);

                if(isGameWin()){
                    removeGameInfo();
                    showResult();
                }
            }
        })
    })
}

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBG();
                hoverBG(index);
            }
        })
    })
}

const startGame = () => {
    startScreen.classList.remove('active');
    game_Screen.classList.add('active');

    player_name.innerHTML = nameInput.value.trim();
    setPlayerName(nameInput.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[indexLevel];

    seconds = 0;
    showTime(seconds);

    timer = setInterval(() => {
        if(!pause){
            seconds  = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    },1000)
}

const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    startScreen.classList.add('active');
    game_Screen.classList.remove('active');
    pause_screen.classList.remove('active');
    result_screen.classList.remove('active');
}

//----Añadir botones para el sudoku
document.querySelector('#btn-level').addEventListener('click', (e) => {
    indexLevel = indexLevel + 1 > CONSTANT.LEVEL.length - 1 ? 0 : indexLevel + 1;
    level = CONSTANT.LEVEL[indexLevel];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[indexLevel];
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if(nameInput.value.trim().length > 0){
        initSudoku();
        startGame();
    }else{
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500)
    }
})

document.querySelector('#btn-pause').addEventListener('click', ()  => {
    pause_screen.classList.add('active');
    pause = true;
})

document.querySelector('#btn-resume').addEventListener('click', ()  => {
    pause_screen.classList.remove('active');
    pause = false;
})

document.querySelector('#btn-new-game').addEventListener('click', ()  => {
    returnStartScreen();
})

document.querySelector('#btn-new-game-2').addEventListener('click', ()  => {
    returnStartScreen();
})

document.querySelector('#btn-delete').addEventListener('click', () => {
    cells[selected_cell].innerHTML = '';
    cells[selected_cell].setAttribute('data-value',0);

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;

    su_answer[row][col] = 0;

    removerErr();
})

document.querySelector('#btn-continue').addEventListener('click', () => {
    if(nameInput.value.trim().length > 0){
        loadSudoku();
        startGame();
    }else{
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500)
    }
})

//------------------------------------

const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    const isDark = darkmode === 'true';

    if (isDark) {
        document.body.classList.add('dark');
    }

    updateIcons(isDark);

    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();

    if(getPlayerName()){
        nameInput.value = getPlayerName();
    }else{
        nameInput.focus();
    }
};

const updateIcons = (isDark) => {
    document.querySelector('.bxs-sun').style.display = isDark ? 'inline-block' : 'none';
    document.querySelector('.bxs-moon').style.display = isDark ? 'none' : 'inline-block';
};


init();