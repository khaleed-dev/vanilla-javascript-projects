// Game UI / Design
import { 
    TILE_STATUSES,
    creatBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose
} from './minesweeper.js'

// game difficutly rules
const beginnerRules = {BOARD_SIZE: 8, NUMBER_OF_MINES: 10}
const intermediateRules = {BOARD_SIZE: 16, NUMBER_OF_MINES: 40}
const expertRules = {BOARD_SIZE: 32, NUMBER_OF_MINES: 99}
const testRules = {BOARD_SIZE: 8, NUMBER_OF_MINES: 4}
// DOM Elements
const boardElement = document.querySelector('.board')
const messageText = document.querySelector('.notification')
const minesLeftText = document.querySelector('[data-mine-count]')
const UIDifficulty = document.querySelector('#difficulty')
const timer = document.querySelector('.timer')

// start game (initial board)
paintUI('beginner')
document.addEventListener('click', (e) => {
    // reset game on emoji click
    if(e.target.matches('[data-emoji]')){
        boardElement.removeEventListener('click', stopProp, { capture: true })
        boardElement.removeEventListener('contextmenu', stopProp, { capture: true })
        messageText.textContent = ''
        paintUI(UIDifficulty.value)
    }
})
UIDifficulty.addEventListener('change', (e) => {
    // get difficulty from UI
    boardElement.removeEventListener('click', stopProp, { capture: true })
    boardElement.removeEventListener('contextmenu', stopProp, { capture: true })
    messageText.textContent = ''
    paintUI(e.target.value)
})
boardElement.addEventListener('contextmenu', e => {
    // prevent right click menu
    e.preventDefault()
})

// functions

function paintUI(difficulty){
    // paint ui accourding to difficulty
    let board;
    document.querySelector('[data-emoji]').textContent = '😀'
    switch (difficulty){
        case "beginner":
            boardElement.style.setProperty('--size', beginnerRules.BOARD_SIZE)
            board = creatBoard(beginnerRules.BOARD_SIZE, beginnerRules.NUMBER_OF_MINES)
            showBoardElements(board, beginnerRules.NUMBER_OF_MINES)
            listMinesLeft(board, beginnerRules.NUMBER_OF_MINES)
            break;
        case "intermediate":
            boardElement.style.setProperty('--size', intermediateRules.BOARD_SIZE)
            board = creatBoard(intermediateRules.BOARD_SIZE, intermediateRules.NUMBER_OF_MINES)
            showBoardElements(board, intermediateRules.NUMBER_OF_MINES)
            listMinesLeft(board, intermediateRules.NUMBER_OF_MINES)
            break;
        case "expert":
            boardElement.style.setProperty('--size', expertRules.BOARD_SIZE)
            board = creatBoard(expertRules.BOARD_SIZE, expertRules.NUMBER_OF_MINES)
            showBoardElements(board, expertRules.NUMBER_OF_MINES)
            listMinesLeft(board, expertRules.NUMBER_OF_MINES)
            break;
        case "test":
            boardElement.style.setProperty('--size', testRules.BOARD_SIZE)
            board = creatBoard(testRules.BOARD_SIZE, testRules.NUMBER_OF_MINES)
            showBoardElements(board, testRules.NUMBER_OF_MINES)
            listMinesLeft(board, testRules.NUMBER_OF_MINES)
            break;
        default:
            boardElement.style.setProperty('--size', beginnerRules.BOARD_SIZE)
            board = creatBoard(beginnerRules.BOARD_SIZE, beginnerRules.NUMBER_OF_MINES)
            showBoardElements(board, beginnerRules.NUMBER_OF_MINES)    
            listMinesLeft(board, beginnerRules.NUMBER_OF_MINES)
            break;
    }
}
function showBoardElements(board, numberOfMines){
    boardElement.innerHTML = ''
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener('click', (e) => {
                revealTile(board, tile)
                checkGameEnd(board)
            })
            tile.element.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                markTile(tile)
                listMinesLeft(board, numberOfMines)
            })
        })
    })
    
}
function listMinesLeft(board, numberOfMines){
    const markedTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
    }, 0)
    minesLeftText.textContent = (numberOfMines - markedTilesCount).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}
function checkGameEnd(board){
    const win = checkWin(board)
    const lose = checkLose(board)
    if(win || lose){
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    }
    if(win){
        messageText.textContent = 'You Win! 🎉'
        document.querySelector('[data-emoji]').textContent = '😎'
    }
    if(lose){
        messageText.textContent = 'Exploded 💥'
        document.querySelector('[data-emoji]').textContent = '😵'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) revealTile(board, tile)
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile) & revealTile(board, tile)
            })
        })
    } 
}
function stopProp(e){
    // stop propagation if game is over
    e.stopImmediatePropagation()
}
function startTimer(){
    let seconds = 0
    let minutes = 0
    let hours = 0
    let timerInterval = setInterval(() => {
        seconds++
        if(seconds === 60){
            seconds = 0
            minutes++
        }
        if(minutes === 60){
            minutes = 0
            hours++
        }
        timer.textContent = `${hours}:${minutes}:${seconds}`
    }, 1009)
    return timerInterval
}