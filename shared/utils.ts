import {
    kingMoves,
    pawnMoves,
    queenMoves,
    bishopMoves,
    horseMoves,
    castleMoves,
} from "~/shared/pieceMoves"

// client/server shared move validation logic

// check checkmate
// check check
// check pawn is on oposite side

export function getPieceByPosition(gamePieces: GamePiece[], boardPosition: BoardPosition) {
    return gamePieces.find((piece) => {
        return (
            piece.boardPosition &&
            piece.boardPosition.x === boardPosition.x &&
            piece.boardPosition.y === boardPosition.y
        )
    })
}

export function getPlayerPieces(gamePieces: GamePiece[], color: GamePieceColor): GamePiece[] {
    return gamePieces.filter((piece) => {
        return piece.color === color
    })
}

export function getPathFromPiece(
    gamePiece: GamePiece,
    boardPieces: HexBoardPiece[],
    gamePieces: GamePiece[],
    color: GamePieceColor
) {
    let path: BoardPosition[] = []

    if (!gamePiece.boardPosition) return

    switch (gamePiece.type) {
        case "bishop":
            path = bishopMoves(gamePiece.boardPosition, boardPieces, gamePieces, color)
            break
        case "castle":
            path = castleMoves(gamePiece.boardPosition, boardPieces, gamePieces, color)
        case "horse":
            path = horseMoves(gamePiece.boardPosition, boardPieces)
        case "king":
            path = kingMoves(gamePiece.boardPosition)
            break
        case "pawn":
            path = pawnMoves(gamePiece.boardPosition, gamePieces, color)
            break
        case "queen":
            path = queenMoves(gamePiece.boardPosition, boardPieces, gamePieces, color)
            break
    }
    return path
}
