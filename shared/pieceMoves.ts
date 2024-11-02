// castle
// horse
// bishop
// pawn
// king
// queen

/**
 * If a pawn is in this position it gets two moves. These are the starting positions.
 *
 * Hardcoded because what the hell.
 */
const pawnDoublePositions = {
    black: [
        { x: "b", y: 1 },
        { x: "c", y: 2 },
        { x: "d", y: 3 },
        { x: "e", y: 4 },
        { x: "f", y: 5 },
        { x: "g", y: 4 },
        { x: "h", y: 3 },
        { x: "i", y: 2 },
        { x: "j", y: 1 },
    ] as BoardPosition[],

    white: [
        { x: "b", y: 7 },
        { x: "c", y: 7 },
        { x: "d", y: 7 },
        { x: "e", y: 7 },
        { x: "f", y: 7 },
        { x: "g", y: 7 },
        { x: "h", y: 7 },
        { x: "i", y: 7 },
        { x: "j", y: 7 },
    ],
}

export function queenMoves(
    position: BoardPosition,
    boardPieces: HexBoardPiece[],
    gamePieces: GamePiece[],
    color: GamePieceColor
) {
    const diagonalPaths = getDiagonalPaths(position, boardPieces, gamePieces, color)
    const straightPaths = getStraightPaths(position, boardPieces, gamePieces, color)

    return [...diagonalPaths, ...straightPaths]
}

export function kingMoves(position: BoardPosition): BoardPosition[] {
    let kingMoves: BoardPosition[] = []

    // one move in any direction
    const moveFunctions = [
        iterateBottomRight,
        iterateBottomLeft,
        iterateTopLeft,
        iterateTopRight,
        iterateDown,
        iterateUp,
        iterateHorizontalRight,
        iterateHorizontalLeft,
        iterateDiagonalDownRight,
        iterateDiagonalDownLeft,
        iterateDiagonalUpRight,
        iterateDiagonalUpLeft,
    ]

    moveFunctions.forEach((_function) => {
        const newPosition = _function(position)

        kingMoves.push(newPosition)
    })

    return kingMoves
}

export function pawnMoves(position: BoardPosition, gamePieces: GamePiece[], color: GamePieceColor) {
    // add pawn attack moves
    let pawnMoves: BoardPosition[] = []
    let diagonalsToCheck = []

    if (color === "white") {
        const topLeftHex = iterateTopLeft(position)
        const topRightHex = iterateTopRight(position)

        diagonalsToCheck.push(topLeftHex, topRightHex)
    } else {
        const bottomLeftHex = iterateBottomLeft(position)
        const bottomRightHex = iterateBottomRight(position)

        diagonalsToCheck.push(bottomLeftHex, bottomRightHex)
    }

    diagonalsToCheck.forEach((boardPosition) => {
        if (positionContainsPiece(boardPosition, gamePieces, color)) {
            pawnMoves.push(boardPosition)
        }
    })

    // if white move down // if on start pos move twice
    if (color === "white") {
        const canMoveTwice = pawnDoublePositions.black.some((boardPosition) => {
            return boardPosition.x === position.x && boardPosition.y === position.y
        })

        let positionUp = iterateUp(position)
        const positionUpContainsPiece = positionContainsPiece(positionUp, gamePieces, color)

        if (!positionUpContainsPiece) {
            pawnMoves.push(positionUp)
        }

        if (canMoveTwice && !positionUpContainsPiece) {
            positionUp = iterateUp(positionUp)
            if (!positionContainsPiece(positionUp, gamePieces, color)) {
                pawnMoves.push(positionUp)
            }
        }
    }

    // if black move up // if on start pos move twice
    if (color === "black") {
        const canMoveTwice = pawnDoublePositions.white.some((boardPosition) => {
            return boardPosition.x === position.x && boardPosition.y === position.y
        })

        let positionDown = iterateDown(position)
        const positionDownContainsPiece = positionContainsPiece(positionDown, gamePieces, color)

        if (!positionDownContainsPiece) {
            pawnMoves.push(positionDown)
        }

        if (canMoveTwice && !positionDownContainsPiece) {
            positionDown = iterateDown(positionDown)
            if (!positionContainsPiece(positionDown, gamePieces, color)) {
                pawnMoves.push(positionDown)
            }
        }
    }

    return pawnMoves
}

export function castleMoves(
    position: BoardPosition,
    boardPieces: HexBoardPiece[],
    gamePieces: GamePiece[],
    color: GamePieceColor
) {
    const straightPaths = getStraightPaths(position, boardPieces, gamePieces, color)

    return straightPaths
}

export function bishopMoves(
    position: BoardPosition,
    boardPieces: HexBoardPiece[],
    gamePieces: GamePiece[],
    color: GamePieceColor
) {
    const diagonalPaths = getDiagonalPaths(position, boardPieces, gamePieces, color)

    return diagonalPaths
}

export function horseMoves(position: BoardPosition, boardPieces: HexBoardPiece[]) {
    let horseMoves: BoardPosition[] = []

    const moveChains = [
        [iterateUp, iterateUp, iterateTopLeft],
        [iterateUp, iterateUp, iterateTopRight],
        [iterateTopRight, iterateTopRight, iterateUp],
        [iterateTopRight, iterateTopRight, iterateBottomRight],
        [iterateBottomRight, iterateBottomRight, iterateTopRight],
        [iterateBottomRight, iterateBottomRight, iterateDown],
        [iterateDown, iterateDown, iterateBottomLeft],
        [iterateDown, iterateDown, iterateBottomRight],
        [iterateBottomLeft, iterateBottomLeft, iterateTopLeft],
        [iterateBottomLeft, iterateBottomLeft, iterateDown],
        [iterateTopLeft, iterateTopLeft, iterateUp],
        [iterateTopLeft, iterateTopLeft, iterateBottomLeft],
    ]

    for (const chain of moveChains) {
        let currentPos = position

        for (const _function of chain) {
            currentPos = _function(currentPos)
        }
        if (outOfBounds(currentPos, boardPieces)) continue
        horseMoves.push(currentPos)
    }

    return horseMoves
}
