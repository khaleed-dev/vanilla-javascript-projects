// Game Logic
export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}
export function creatBoard(boardSize, numberOfMines){
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)
    for(let x = 0; x < boardSize; x++){
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some((mp) => {
                    return positionMatch(mp, {x, y})
                }),
                // mine: minePositions.some(positionMatch.bind(null, {x, y})),
                get status(){
                    return this.element.dataset.status
                },
                set status(value){
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}
export function markTile(tile){
    // if the tile we are marking is eligable to be marked
    // we can only mark tiles that are:
        // hidden
        // unmark a tile that is already market
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED){
        return
    }
    if(tile.status === TILE_STATUSES.HIDDEN){
        tile.status = TILE_STATUSES.MARKED

    }else{
        tile.status = TILE_STATUSES.HIDDEN
    }
}
export function revealTile(board, tile){
    // make sure tile is eligable for reveal
    if(tile.status !== TILE_STATUSES.HIDDEN) return
    if(tile.mine){
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter((t) => t.mine)
    if(mines.length === 0){
        adjacentTiles.forEach((AT) => {
            revealTile(board, AT)
        })
    }else{
        tile.element.textContent = mines.length
    }
}
export function checkWin(board){
    // check if every single tile revealed except for mines is hidden or marked.
    return board.every(row => {
        return row.every(tile => {
            // is a tile a number? || (is a mine 'AND' hidden || marked)
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN ||tile.status === TILE_STATUSES.MARKED))
        })
    })
}
export function checkLose(board){
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines){
    const positions = []
    while(positions.length < numberOfMines){
        const position = {
            x: getRandomNumber(boardSize),
            y: getRandomNumber(boardSize)
        }
        if(!positions.some(p => positionMatch(p, position))){
            positions.push(position)
        }
    }
    return positions
}
function positionMatch(a, b){
    return a.x === b.x && a.y === b.y
}
function getRandomNumber(size){
    return Math.floor(Math.random() * size)
}
function nearbyTiles(board, {x, y}){
    const tiles = []
    for(let xOffset = -1; xOffset <= 1; xOffset++){
        for(let yOffset = -1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset]
            if(tile) tiles.push(tile)
        }   
    }
    return tiles
}