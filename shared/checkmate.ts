/**
 *  1. Check if king has moves not covered by the enemy. (safe moves)
 *  2. Check if the challenging piece can be killed. (Only one piece could possibly have the king in check.)
 *  3. Check if the challenging pieces path can be intercepted.
 */
export function isCheckmate(boardState: BoardState, defenderColor: GamePieceColor) {
	const attackerColor = defenderColor === "white" ? "black" : "white"
	const defenderKing = getKingPiece(boardState, defenderColor)

	if (!defenderKing || !defenderKing.boardPosition) {
		throw new Error("King has no boardPosition value.")
	}

	const kingsMoves = kingMoves(defenderKing.boardPosition, boardState, defenderColor)

	const attackerPaths = getAllPlayerPaths(boardState, attackerColor)

	if (!attackerPaths) throw new Error("Attacker paths not found.")

	const kingHasSafeMove = kingsMoves.some((move) => {
		return !attackerPaths.some((position) => move.x === position.x && move.y === position.y)
	})

	if (kingHasSafeMove) return false // not checkmate

	const defenderPaths = getAllPlayerPaths(boardState, defenderColor, "king")

	const attackingPiecePosition = boardState.latestMoves[attackerColor].to
	if (!attackingPiecePosition) throw new Error("Attacking piece not found.")
	const attackingPieceId = boardState.boardPieces.get(stringPos(attackingPiecePosition))?.pieceId
	if (!attackingPieceId) throw new Error("Attacking piece id not found")
	const attackingPiece = boardState.gamePieces.get(attackingPieceId)

	if (!attackingPiece || !attackingPiece.boardPosition) {
		console.error("No attacking piece found.")
		return false // no opponents pieces are able to attack the king
	}

	// if any defending paths can reach the attackers position : checkmate = false
	const attackerCanBeKilled = defenderPaths.some((boardPosition) => {
		return (
			attackingPiece.boardPosition &&
			boardPosition.x === attackingPiece.boardPosition.x &&
			boardPosition.y === attackingPiece.boardPosition.y
		)
	})

	if (attackerCanBeKilled) return false // no checkmate

	const attackingPiecePath = getPathFromPiece(attackingPiece, boardState)

	if (!attackingPiecePath) {
		console.error("Error finding attacking piece path.")
		return false
	}

	const pathBetweenKingAndAttacker = getPathBetweenPositions(
		boardState,
		attackingPiece.boardPosition,
		defenderKing.boardPosition,
	)

	// if any defending piece can block the kings checker then : false
	const attackerCanBeBlocked = pathBetweenKingAndAttacker.some((boardPosition) => {
		return defenderPaths.some((defendingPosition) => {
			return (
				boardPosition &&
				defendingPosition.x === boardPosition.x &&
				defendingPosition.y === boardPosition.y
			)
		})
	})

	if (attackerCanBeBlocked) return false // no checkmate
	return true // checkmate
}

export function isCheck(
	boardState: BoardState,
	defenderColor: GamePieceColor,
	enemyNewPosition: BoardPosition,
) {
	const enemyPieceId = boardState.boardPieces.get(stringPos(enemyNewPosition))?.pieceId
	if (!enemyPieceId) throw new Error("Enemy Piece id not defined:")

	const enemyPiece = boardState.gamePieces.get(enemyPieceId) // only the last moved piece is checked to see if they challenge the king
	if (!enemyPiece) throw new Error("Enemy Piece not found.")

	const defenderKing = getKingPiece(boardState, defenderColor)
	if (!defenderKing) {
		console.error("Defender's king not found")
		return false
	}

	const attackerPath = getPathFromPiece(enemyPiece, boardState)
	const kingPosition = defenderKing.boardPosition

	if (!kingPosition) throw new Error("King not found")
	if (!attackerPath) throw new Error("attacker path not found")

	console.log(kingPosition)
	// console.log(attackerPath)

	const check = attackerPath.some((position) => {
		return position.x === kingPosition.x && position.y === kingPosition.y
	})

	return check
}
