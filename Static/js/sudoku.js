const newGrid = (size) => {
    let arr = new Array(size);

    for(let i = 0; i < size; i++){
        arr[i] = new Array(size);
    }

    for(let i = 0; i < Math.pow(size, 2); i++){
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }

    return arr;
}

//Revisar numeros duplicados en las columnas.
const isColSafe = (grid,col,value) => {
    for(let row = 0; row < CONSTANT.GRID_SIZE; row++){
        if(grid[row][col] === value) return false;
    }

    return true;
}

// Revisar numero duplicados en las filas.
const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

//Revisar numeros duplicados en una caja de 3X3
const isBoxSafe = (grid, box_row, box_col, value) => {
    for(let row = 0; row < CONSTANT.BOX_SIZE; row++){
        for(let col = 0; col < CONSTANT.BOX_SIZE; col++){
            if(grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}

//Revisar fila, columna y caja 3X3.
const isSafe = (grid, row, col, value) => {
    return isColSafe(grid,col,value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row%3, col - col%3, value) && value != CONSTANT.UNASSIGNED;
}

//celdas sin asignar.
const findUnassignedPos = (grid, pos) => {
    for(let row = 0; row < CONSTANT.GRID_SIZE; row++){
        for(let col = 0; col < CONSTANT.GRID_SIZE; col++){
            if(grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }

    return false;
}

//Barajar el arreglo.
const shuffleArray = (arr) => {
    let curr_index = arr.length;

    while(curr_index !== 0){
        let rand_index = Math.floor(Math.random() * curr_index);
        curr_index -= 1;

        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }

    return arr;
}

//Revisar si el sudoku esta completo.
const isFulGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row : -1,
        col : -1
    }

    if(!findUnassignedPos(grid, unassigned_pos)) return true;

    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    number_list.forEach((num,i) => {
        
        if(isSafe(grid,row,col,num)){
            grid[row][col] = num;

            if(isFulGrid(grid)){
                return true;
            }else{
                if(sudokuCreate(grid)){
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFulGrid(grid);
}

const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)) {
                if (isFullGrid(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    })

    return isFullGrid(grid);
}

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid];
    let attemps = level;
    while (attemps > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--;
    }
    return res;
}

// generar el sudoku en base al nivel.
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}