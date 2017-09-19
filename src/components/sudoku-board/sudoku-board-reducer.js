import buildActionName from '../../redux/build-action-name';
import { validateCell, validateErrorCells } from './utilities/sudoku-board-validator';
import solve from './utilities/sudoku-AI';

const reducerName = 'sudokuBoardReducer';

export const UPDATE_BOARD = buildActionName(reducerName, 'UPDATE_BOARD');
export const UPDATE_ERROR_CELLS = buildActionName(reducerName, 'UPDATE_ERROR_CELLS');
export const UPDATE_SOLVED_CELLS = buildActionName(reducerName, 'UPDATE_SOLVED_CELLS');
export const RESET = buildActionName(reducerName, 'RESET');

export function getInitialState() {
    return {
        board: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        errorCells: [
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false]
        ],
        solvedCells: [
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false]
        ],
        isValid: true,
        isSolved: false
    };
}

export function updateCell(y, x, value) {
    return (dispatch, getState) => {
        let { board, errorCells } = getState().sudokuBoard;
        board[y][x] = parseInt(value);
        if (validateCell(y, x, board)) {
            errorCells[y][x] = false;
            dispatch(updateBoardAction({ board }));
            dispatch(updateErrorCellsAction({ errorCells, isValid: validateErrorCells(errorCells) }));
        } else {
            errorCells[y][x] = true;
            if (!board[y][x] || board[y][x] < 1 || board[y][x] > 9) {
                board[y][x] = 0;
            }
            dispatch(updateBoardAction({ board }));
            dispatch(updateErrorCellsAction({ errorCells, isValid: false }));
        }
    };
}

export function clearBoardErrors() {
    return (dispatch, getState) => {
        let { board, errorCells } = getState().sudokuBoard;
        errorCells = errorCells.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if ((cell && board[rowIndex][colIndex] === 0) || validateCell(rowIndex, colIndex, board)) {
                    return false;
                }
                return cell;
            })
        );
        dispatch(updateErrorCellsAction({ errorCells, isValid: validateErrorCells(errorCells) }));
    };
}

export function solveBoard() {
    return (dispatch, getState) => {
        let { board } = getState().sudokuBoard;
        const solvedCells = board.map(row =>
            row.map(cell => {
                return cell === 0;
            })
        );
        if (solve(board)) {
            dispatch(updateBoardAction({ board }));
            dispatch(updateSolvedCellsAction({ solvedCells, isSolved: true }));
        }
    };
}

export function reset() {
    return resetAction();
}

export function resetSolution() {
    return (dispatch, getState) => {
        let { board, solvedCells } = getState().sudokuBoard;
        board = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (solvedCells[rowIndex][colIndex]) {
                    return 0;
                }
                return cell;
            })
        );
        dispatch(updateBoardAction({ board }));
        dispatch(updateSolvedCellsAction({ solvedCells: getInitialState().solvedCells, isSolved: false }));
    };
}

function updateBoardAction(payload) {
    return {
        type: UPDATE_BOARD,
        payload
    };
}

function updateErrorCellsAction(payload) {
    return {
        type: UPDATE_ERROR_CELLS,
        payload
    };
}

function updateSolvedCellsAction(payload) {
    return {
        type: UPDATE_SOLVED_CELLS,
        payload
    };
}

function resetAction() {
    return {
        type: RESET
    };
}

export default function SudokuBoardReducer(state = getInitialState(), action) {
    switch (action.type) {
        case UPDATE_BOARD:
            return {
                ...state,
                board: action.payload.board
            };
        case UPDATE_ERROR_CELLS:
            return {
                ...state,
                errorCells: action.payload.errorCells,
                isValid: action.payload.isValid
            };
        case UPDATE_SOLVED_CELLS:
            return {
                ...state,
                solvedCells: action.payload.solvedCells,
                isSolved: action.payload.isSolved
            };
        case RESET:
            return getInitialState();
    }
    return state;
}
