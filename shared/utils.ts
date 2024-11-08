export function getPieceByPosition(boardState: BoardState, boardPosition: BoardPosition) {
	return boardState.gamePieces.get(stringPos(boardPosition))
}

/**A strigified version of the BoardPosition type is used for map id's */
export function stringPos(boardPosition: BoardPosition) {
	return `${boardPosition.x}${boardPosition.y}`
}

export function objPos(string: string) {
	const boardPositionObj: BoardPosition = { x: "", y: 0 }

	const letter = string[0]
	const number = string.slice(1)

	boardPositionObj.x = letter
	boardPositionObj.y = parseInt(number, 10)

	return boardPositionObj
}

export function getKingPiece(boardState: BoardState, color: GamePieceColor) {
	if (color === "black") {
		return boardState.gamePieces.get("g10") as GamePiece
	} else {
		return boardState.gamePieces.get("g1") as GamePiece
	}
}

export function getPlayerPieces(boardState: BoardState, color: GamePieceColor): GamePiece[] {
	return Array.from(boardState.gamePieces.values()).filter((piece) => piece.color === color)
}

export function getPathBetweenPositions(
	boardState: BoardState,
	position1: BoardPosition,
	position2: BoardPosition,
): BoardPosition[] {
	const color = "black" // not needed for this

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
	let positionFound = false
	let path = new Set() as Set<BoardPosition>

	// Try each direction until a path to position2 is found
	for (const _function of moveFunctions) {
		let cursorPos: BoardPosition = position1
		path = new Set()

		while (!positionFound) {
			path.add(cursorPos)
			cursorPos = _function(cursorPos)

			if (outOfBounds(cursorPos, boardState)) break
			const containsPiece = positionContainsPiece(cursorPos, boardState, color)

			if (containsPiece && (cursorPos.x !== position2.x || cursorPos.y !== position2.y)) {
				break // Blocked by another piece
			} else if (cursorPos.x === position2.x && cursorPos.y === position2.y) {
				positionFound = true
				path.add(cursorPos)
				break
			} else {
				path.add(cursorPos)
			}
		}

		if (positionFound) break
	}

	return positionFound ? Array.from(path) : []
}

export function generateUniqueId() {
	return `${Date.now()}-${Math.floor(Math.random() * 10000)}`
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
		const path = getPathFromPiece(piece, boardState)

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

export function getPathFromPiece(gamePiece: GamePiece, boardState: BoardState) {
	let path: BoardPosition[] = []

	if (!gamePiece.boardPosition) return

	switch (gamePiece.type) {
		case "bishop":
			path = bishopMoves(gamePiece.boardPosition, boardState, gamePiece.color)
			break

		case "castle":
			path = castleMoves(gamePiece.boardPosition, boardState, gamePiece.color)
			break

		case "horse":
			path = horseMoves(gamePiece.boardPosition, boardState)
			break

		case "king":
			path = kingMoves(gamePiece.boardPosition, boardState, gamePiece.color)
			break

		case "pawn":
			path = pawnMoves(gamePiece.boardPosition, boardState, gamePiece.color)
			break

		case "queen":
			path = queenMoves(gamePiece.boardPosition, boardState, gamePiece.color)
			break
	}
	return path
}

export function getAllPlayerPaths(
	boardState: BoardState,
	color: GamePieceColor,
	omitType?: GamePiece["type"],
) {
	const playerPieces = getPlayerPieces(boardState, color)
	const paths = new Set<string>()

	for (let gamePiece of playerPieces) {
		if (gamePiece.type === omitType) continue

		const path = getPathFromPiece(gamePiece, boardState)
		if (path) {
			path.forEach((position) => {
				paths.add(stringPos(position))
			})
		}
	}

	return Array.from(paths).map((string) => {
		return objPos(string)
	})
}
export function getAllPlayerPathsWithPieces(
	boardState: BoardState,
	color: GamePieceColor,
	omitType?: GamePiece["type"],
) {
	const playerPieces = getPlayerPieces(boardState, color)
	const paths = new Map<string, BoardPosition[]>()

	for (let gamePiece of playerPieces) {
		if (gamePiece.type === omitType) continue

		const path = getPathFromPiece(gamePiece, boardState)
		if (!path) continue

		paths.set(gamePiece.pieceId, path)
	}

	return paths
}
