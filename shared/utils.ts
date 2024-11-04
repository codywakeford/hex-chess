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

/**Given a board position, this function returns a list of pieces that can reach that board position. */
export function getAttackingPieceFromPath(
	boardPosition: BoardPosition,
	boardState: BoardState,
	attackingColor: GamePieceColor,
) {
	const pieces = getPlayerPieces(boardState.gamePieces, attackingColor)

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
				boardState.boardPieces,
				boardState.gamePieces,
				color,
			)
			break
		case "castle":
			path = castleMoves(
				gamePiece.boardPosition,
				boardState.boardPieces,
				boardState.gamePieces,
				color,
			)
		case "horse":
			path = horseMoves(gamePiece.boardPosition, boardState.boardPieces)
		case "king":
			const attackerPaths = getAllPlayerPaths(boardState, getEnemyColor(color))
			path = kingMoves(gamePiece.boardPosition, attackerPaths)
			break
		case "pawn":
			path = pawnMoves(gamePiece.boardPosition, boardState.gamePieces, color)
			break
		case "queen":
			path = queenMoves(
				gamePiece.boardPosition,
				boardState.boardPieces,
				boardState.gamePieces,
				color,
			)
			break
	}
	return path
}

export function getAllPlayerPaths(boardState: BoardState, color: GamePieceColor): BoardPosition[] {
	const playerPieces = getPlayerPieces(boardState.gamePieces, color)
	let paths: BoardPosition[] = []

	playerPieces.forEach((piece) => {
		const path = getPathFromPiece(piece, boardState, color)
		if (path) paths.push(...path)
	})

	return paths
}
