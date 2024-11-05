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

export function queenMoves(position: BoardPosition, boardState: BoardState, color: GamePieceColor) {
	const diagonalPaths = getDiagonalPaths(position, boardState, color)
	const straightPaths = getStraightPaths(position, boardState, color)

	return [...diagonalPaths, ...straightPaths]
}

export function kingMoves(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor,
): BoardPosition[] {
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

	// one move in every direction
	moveFunctions.forEach((_function) => {
		const newPosition = _function(position)

		if (outOfBounds(newPosition, boardState)) return
		const pieceSide = positionContainsPiece(newPosition, boardState, color)

		if (pieceSide === "enemy" || pieceSide === null) {
			kingMoves.push(newPosition)
		}
	})

	return kingMoves
}

export function pawnMoves(position: BoardPosition, boardState: BoardState, color: GamePieceColor) {
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
		if (positionContainsPiece(boardPosition, boardState, color)) {
			pawnMoves.push(boardPosition)
		}
	})

	// if white move down // if on start pos move twice
	if (color === "white") {
		const canMoveTwice = pawnDoublePositions.black.some((boardPosition) => {
			return boardPosition.x === position.x && boardPosition.y === position.y
		})

		let positionUp = iterateUp(position)
		const positionUpContainsPiece = positionContainsPiece(positionUp, boardState, color)

		if (!positionUpContainsPiece) {
			pawnMoves.push(positionUp)
		}

		if (canMoveTwice && !positionUpContainsPiece) {
			positionUp = iterateUp(positionUp)
			if (!positionContainsPiece(positionUp, boardState, color)) {
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
		const positionDownContainsPiece = positionContainsPiece(positionDown, boardState, color)

		if (!positionDownContainsPiece) {
			pawnMoves.push(positionDown)
		}

		if (canMoveTwice && !positionDownContainsPiece) {
			positionDown = iterateDown(positionDown)
			if (!positionContainsPiece(positionDown, boardState, color)) {
				pawnMoves.push(positionDown)
			}
		}
	}

	return pawnMoves
}

export function castleMoves(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor,
) {
	const straightPaths = getStraightPaths(position, boardState, color)

	return straightPaths
}

export function bishopMoves(
	position: BoardPosition,
	boardState: BoardState,
	color: GamePieceColor,
) {
	const diagonalPaths = getDiagonalPaths(position, boardState, color)

	return diagonalPaths
}

export function horseMoves(position: BoardPosition, boardState: BoardState) {
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
		if (outOfBounds(currentPos, boardState)) continue
		horseMoves.push(currentPos)
	}

	return horseMoves
}
