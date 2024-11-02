export function isCheckmate(
        boardState: BoardState,
        attackerPaths: BoardPosition[],
        gamePieces: GamePiece[],
        color: GamePieceColor
        attackerPiece: GamePiece
    ) {
    // get attackers paths and pieces
    const kingPos: BoardPosition = {
        x: "a",
        y: 1,
    }

    // get kings move
    const kingsMoves = kingMoves(kingPos)

    const enemyPieces = getPlayerPieces(gamePieces, color)

    let enemyPaths: BoardPosition[] = []
    enemyPieces.forEach((piece) => {
        enemyPaths.push(getPathFromPiece(boardState))
    })

    // check if king has any moves that arent covered by the enemy
    const kingHasMoves = kingsMoves.some(move => {
        return enemyPaths.some(boardPosition => {
            return move.x === boardPosition.x &&
                move.y === boardPosition.y
        })
    })

    if (kingHasMoves) return false

    const defendingPieces = getPlayerPieces(gamePieces, color)

    let defendingPaths: BoardPosition[]
    defendingPieces.forEach(piece => {
        defendingPaths.push(getPathFromPiece(boardState))
    })

    // if any defending paths are can reach the attackers position : checkmate = false
    const attackerCanBeKilled = defendingPaths.some(boardPosition => {
        return (
            attackerPiece.boardPosition &&
            boardPosition.x === attackerPiece.boardPosition.x &&
            boardPosition.y === attackerPiece.boardPosition.y
        )
    })

    if (attackerCanBeKilled) return false

    // if any defending piece can block the kings checker then : false
    const attackerCanBeBlocked = attackingPaths.some(boardPosition => {
        return defendingPaths.some(defendingPosition => {
            return defendingPosition.x === boardPosition.x &&
            defendingPosition.y === boardPosition.y
        })
    })

    if (!attackerCanBeBlocked) return true
}

export function isCheck(boardState: BoardState, attackerPaths: BoardPosition[]) {
    // does any of the opponents paths land on king : return true
    // if true : isCheckmate()
    let check = false

    attackerPaths.forEach((boardPosition) => {
        const piece = getPieceByPosition(boardState.gamePieces, boardPosition)
        if (piece && piece.type === "king") {
            check = true
        }
    })

    return check
}
