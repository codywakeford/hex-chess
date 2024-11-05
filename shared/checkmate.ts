// A king is checkmate if:
// He has no moves that arent covered by an enemy path
// If the defending color cannot kill the piece that has him in check
// The defending peices cannot block the attacking piece by moving in their path.
export function isCheckmate(boardState: BoardState, defenderColor: GamePieceColor) {
	const game = useGameStore()

	const attackerColor = defenderColor === "white" ? "black" : "white"

	const defenderKing = getKingPiece(boardState, defenderColor)

	if (!defenderKing || !defenderKing.boardPosition) {
		console.error("[isCheckmate()] King has no boardPosition value.")
		return false
	}

	const attackerPaths = game.paths(attackerColor)
	const kingsMoves = kingMoves(defenderKing.boardPosition, boardState, defenderColor)
	console.log(kingsMoves)

	const attackingPiece = getAttackingPieceFromPath(
		defenderKing.boardPosition,
		boardState,
		attackerColor,
	)

	if (!attackingPiece || !attackingPiece.boardPosition) {
		return false // no opponents pieces are able to attack the king
	}

	// Check if there is at least one king move that is not covered by any enemy path
	const kingHasSafeMove = kingsMoves.some((move) => {
		return attackerPaths.has(move)
	})

	console.log(kingHasSafeMove)
	if (kingHasSafeMove) return false // the king can escape; thus not checkmate

	const defenderPaths = game.paths(defenderColor)

	// if any defending paths can reach the attackers position : checkmate = false
	// const attackerCanBeKilled = defenderPaths.some((boardPosition) => {
	// 	return (
	// 		attackingPiece.boardPosition &&
	// 		boardPosition.x === attackingPiece.boardPosition.x &&
	// 		boardPosition.y === attackingPiece.boardPosition.y
	// 	)
	// })

	// if (attackerCanBeKilled) return false

	// const attackingPiecePath = getPathFromPiece(attackingPiece, boardState)

	// if (!attackingPiecePath) {
	// 	console.error("[isCheckmate()] Error finding attacking piece path.")
	// 	return false
	// }

	// // if any defending piece can block the kings checker then : false
	// const attackerCanBeBlocked = attackingPiecePath.some((boardPosition) => {
	// 	return defenderPaths.some((defendingPosition) => {
	// 		return (
	// 			defendingPosition.x === boardPosition.x && defendingPosition.y === boardPosition.y
	// 		)
	// 	})
	// })

	// if (attackerCanBeBlocked) return false
	return false
}

export function isCheck(boardState: BoardState, defenderColor: GamePieceColor) {
	const game = useGameStore()

	// Get the king's position for the defender
	const defenderKing = getKingPiece(boardState, defenderColor)

	if (!defenderKing) {
		console.error("Defender's king not found")
		return false
	}

	const attackerPaths = game.paths(defenderColor)

	const kingPosition = defenderKing.boardPosition

	if (!kingPosition) throw new Error("King not found")

	const check = Array.from(attackerPaths).some(
		(position) => position.x === kingPosition.x && position.y === kingPosition.y,
	)

	return check
}
