export function getPieceByPosition(boardState: BoardState, boardPosition: BoardPosition) {
	return boardState.gamePieces.get(stringPos(boardPosition))
}


export function stringPos(boardPosition: BoardPosition) {
	return `${boardPosition.x}${boardPosition.y}`
}

export function objPos(string: string) {
		const boardPositionObj: BoardPosition = {x: "", y: 0}
	
		const letter = string[0]
		const number = string.slice(1)

		boardPositionObj.x = letter
		boardPositionObj.y = parseInt(number, 10)

		return boardPositionObj
}

export function getPlayerPieces(boardState: BoardState, color: GamePieceColor): GamePiece[] {
	return Array.from(boardState.gamePieces.values()).filter((piece) => piece.color === color)
}

/**Given a board position, this function returns a list of pieces that can reach that board position. */
export function getAttackingPieceFromPath(
	boardPosition: BoardPosition,
	boardState: BoardState,
	attackingColor: GamePieceColor,
) {
	const pieces = getPlayerPieces(boardState, attackingColor)

	if (!pieces) {
		console.error("No pieces found.")
		return null
	}

	for (const piece of pieces) {
		const path = getPathFromPiece(piece, boardState, attackingColor)

		if (!path) continue

		const canKill = path.some((position) => {
			return (
				position &&
				boardPosition &&
				position.x === boardPosition.x &&
				position.y === boardPosition.y
			)
		})

		if (canKill) {
			return piece // This will return the piece from the main function
		}
	}

	return null
}
export function getEnemyColor(color: GamePieceColor) {
	return color === "white" ? "black" : "white"
}

export function getPathFromPiece(
	gamePiece: GamePiece,
	boardState: BoardState,
	color: GamePieceColor,
) {
	let path: BoardPosition[] = []

	if (!gamePiece.boardPosition) return

	switch (gamePiece.type) {
		case "bishop":
			path = bishopMoves(
				gamePiece.boardPosition,
				boardState,

				color,
			)
			break
		case "castle":
			path = castleMoves(gamePiece.boardPosition, boardState, color)
		case "horse":
			path = horseMoves(gamePiece.boardPosition, boardState)
		case "king":
			path = kingMoves(gamePiece.boardPosition)
			break
		case "pawn":
			path = pawnMoves(gamePiece.boardPosition, boardState, color)
			break
		case "queen":
			path = queenMoves(gamePiece.boardPosition, boardState, color)
			break
	}
	return path
}

export function getAllPlayerPaths(boardState: BoardState, color: GamePieceColor): BoardPosition[] {
	const playerPieces = getPlayerPieces(boardState, color)
	let paths: BoardPosition[] = []

	playerPieces.forEach((piece) => {
		const path = getPathFromPiece(piece, boardState, color)
		if (path) paths.push(...path)
	})

	return paths
}
