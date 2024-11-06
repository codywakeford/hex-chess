// adjacent hex pieces

/**
 * A chess piece can move on 6 planes; 3 for horizontal and 3 for diagonal.
 *
 * Horizontal: Where faces meet - 3
 * - Top to bottom
 * - top-left to bottom-right
 * - bottom-left to bottom-left
 *
 * Diagonal: Where vertices point - 3
 * - These are not intuitive at first.
 * - The vertices of the hexagons point to their 'diagonal' partners.
 * - All diagonal pieces are the same color.
 *
 */

export const letters = "abcdefghijk"

export function iterateUp(position: BoardPosition): BoardPosition {
	return { x: position.x, y: position.y + 1 }
}

export function iterateDown(position: BoardPosition): BoardPosition {
	return { x: position.x, y: position.y - 1 }
}

export function iterateTopRight(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)
	let topRightPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 5) {
		xPos = letters[index + 1]
		yPos = position.y + 1
	} else {
		xPos = letters[index + 1]
		yPos = position.y
	}
	topRightPosition = { x: xPos, y: yPos }
	return topRightPosition
}

export function iterateTopLeft(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let topLeftPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 6) {
		xPos = letters[index - 1]
		yPos = position.y
	} else {
		xPos = letters[index - 1]
		yPos = position.y + 1
	}

	topLeftPosition = { x: xPos, y: yPos }
	return topLeftPosition
}

export function iterateBottomLeft(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let bottomLeftPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 6) {
		xPos = letters[index - 1]
		yPos = position.y - 1
	} else {
		xPos = letters[index - 1]
		yPos = position.y
	}

	bottomLeftPosition = { x: xPos, y: yPos }
	return bottomLeftPosition
}

export function iterateBottomRight(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let bottomRightPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 5) {
		xPos = letters[index + 1]
		yPos = position.y
	} else {
		xPos = letters[index + 1]
		yPos = position.y - 1
	}

	bottomRightPosition = { x: xPos, y: yPos }
	return bottomRightPosition
}

export function iterateHorizontalRight(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)
	const isEven = index + (1 % 2) === 0

	let newPosition: BoardPosition = { x: letters[index + 2], y: 0 }

	if (!isEven && index < 5) {
		// case where x === e

		if (position.x === "e") {
			newPosition.y = position.y

			return newPosition
		}

		newPosition.y = position.y + 1

		return newPosition
	} else if (!isEven && index >= 6) {
		newPosition.y = position.y - 1

		return newPosition
	}

	if (isEven && index < 5) {
		newPosition.y = position.y + 1
		return newPosition
	} else {
		newPosition.y = position.y - 1
		return newPosition
	}
}

export function iterateHorizontalLeft(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)
	const isEven = index + (1 % 2) === 0

	let newPosition: BoardPosition = { x: letters[index - 2], y: 0 }

	if (!isEven && index < 5) {
		newPosition.y = position.y - 1

		return newPosition
	} else if (!isEven && index >= 6) {
		if (position.x === "g") {
			newPosition.y = position.y

			return newPosition
		}

		newPosition.y = position.y + 1

		return newPosition
	}

	if (isEven && index <= 5) {
		newPosition.y = position.y - 1
		return newPosition
	} else {
		newPosition.y = position.y - 1
		return newPosition
	}
}

export function iterateDiagonalDownRight(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)

	let newPosition = { x: letters[index + 1], y: 0 }

	if (index < 5) {
		newPosition.y = position.y - 1
	} else {
		newPosition.y = position.y - 2
	}

	return newPosition
}

export function iterateDiagonalDownLeft(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)

	let newPosition = { x: letters[index - 1], y: 0 }

	if (index < 6) {
		newPosition.y = position.y - 2
	} else {
		newPosition.y = position.y - 1
	}

	return newPosition
}

export function iterateDiagonalUpRight(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)

	let newPosition = { x: letters[index + 1], y: 0 }

	if (index < 5) {
		newPosition.y = position.y + 2
	} else {
		newPosition.y = position.y + 1
	}

	return newPosition
}

export function iterateDiagonalUpLeft(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)

	let newPosition = { x: letters[index - 1], y: 0 }

	if (index <= 5) {
		newPosition.y = position.y + 1
	} else {
		newPosition.y = position.y + 2
	}

	return newPosition
}

export function getStraightPaths(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor,
): BoardPosition[] {
	/**
	 * each of these functions will return the next boardPiece in a particular direction until hitting a gamePiece or the board edge.
	 */
	let directionFunctions = [
		iterateBottomRight,
		iterateBottomLeft,
		iterateTopLeft,
		iterateTopRight,
		iterateDown,
		iterateUp,
	]

	let boardPieces = new Set<BoardPosition>()

	directionFunctions.forEach((_function) => {
		let cursorPos = position
		let isOutOfBounds = false

		while (!isOutOfBounds) {
			boardPieces.add(cursorPos)
			cursorPos = _function(cursorPos)
			if (outOfBounds(cursorPos, boardState)) return

			const side = positionContainsPiece(cursorPos, boardState, color)
			if (side === "enemy") {
				boardPieces.add(cursorPos)
				break
			} else if (side === "ally") {
				break
			}
		}
	})

	return Array.from(boardPieces)
}

export function getDiagonalPaths(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor,
): BoardPosition[] {
	/**
	 * each of these functions will return the next boardPiece in a particular direction until hitting a gamePiece.
	 */

	let directionFunctions = [
		iterateHorizontalRight,
		iterateHorizontalLeft,
		iterateDiagonalDownRight,
		iterateDiagonalDownLeft,
		iterateDiagonalUpRight,
		iterateDiagonalUpLeft,
	]

	const diagonalHexagons = new Set<BoardPosition>()

	directionFunctions.forEach((_function) => {
		let cursorPos = position
		let isOutOfBounds = false

		while (!isOutOfBounds) {
			diagonalHexagons.add(cursorPos)
			cursorPos = _function(cursorPos)
			if (outOfBounds(cursorPos, boardState)) return

			const side = positionContainsPiece(cursorPos, boardState, color)

			if (side === "enemy") {
				diagonalHexagons.add(cursorPos)
				break
			} else if (side === "ally") {
				break
			}
		}
	})

	return Array.from(diagonalHexagons)
}

/**
 * Check if there's any matching board piece.
 */
export function outOfBounds(position: BoardPosition, boardState: BoardState): boolean {
	if (!position.x) return true
	if (!position.y) return true

	const isInBounds = boardState.boardPieces.has(stringPos(position))

	return !isInBounds
}

export function positionContainsPiece(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor = "black",
): Side {
	const boardPiece = boardState.boardPieces.get(stringPos(position))

	if (!boardPiece) {
		console.error("Error finding board piece.")
		return null
	}

	if (!boardPiece.pieceId) return null

	const gamePiece = boardState.gamePieces.get(boardPiece.pieceId)

	if (!gamePiece) throw new Error("Piece not found at provided ID.")

	if (gamePiece.color === color) return "ally"

	return "enemy"
}
