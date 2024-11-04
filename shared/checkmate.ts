import { TestingAttackerPiece, TestingBoardState, TestingKingPiece } from "./testingData"
import { getAttackingPieceFromPath } from "./utils"

// A king is checkmate if:
// He has no moves that arent covered by an enemy path
// If the defending color cannot kill the piece that has him in check
// The defending peices cannot block the attacking piece by moving in their path.
export function isCheckmate(
	boardState: BoardState,
	defenderColor: GamePieceColor,
	defendingKingPiece: GamePiece,
) {
	const attackerColor = defenderColor === "white" ? "black" : "white"

	if (!defendingKingPiece.boardPosition) {
		console.error("[isCheckmate()] King has no boardPosition value.")
		return false
	}

	const kingsMoves = kingMoves(defendingKingPiece.boardPosition)
	const enemyPaths = getAllPlayerPaths(boardState, attackerColor)

	const attackingPiece = getAttackingPieceFromPath(
		defendingKingPiece.boardPosition,
		boardState,
		attackerColor,
	)

	if (!attackingPiece || !attackingPiece.boardPosition) return false // no opponents pieces are able to attack the king

	// check if king has any moves that arent covered by the enemy
	const kingHasMoves = kingsMoves.some((move) => {
		return enemyPaths.some((boardPosition) => {
			return move.x === boardPosition.x && move.y === boardPosition.y
		})
	})

	if (kingHasMoves) return false

	const defenderPaths = getAllPlayerPaths(boardState, defenderColor)

	// if any defending paths can reach the attackers position : checkmate = false
	const attackerCanBeKilled = defenderPaths.some((boardPosition) => {
		return (
			attackingPiece.boardPosition &&
			boardPosition.x === attackingPiece.boardPosition.x &&
			boardPosition.y === attackingPiece.boardPosition.y
		)
	})

	if (attackerCanBeKilled) return false

	const attackingPiecePath = getPathFromPiece(attackingPiece, boardState, attackerColor)

	if (!attackingPiecePath) {
		console.error("[isCheckmate()] Error finding attacking piece path.")
		return false
	}

	// if any defending piece can block the kings checker then : false
	const attackerCanBeBlocked = attackingPiecePath.some((boardPosition) => {
		return defenderPaths.some((defendingPosition) => {
			return (
				defendingPosition.x === boardPosition.x && defendingPosition.y === boardPosition.y
			)
		})
	})

	if (!attackerCanBeBlocked) return true // checkmate
}

export function isCheck(boardState: BoardState, defenderColor: GamePieceColor) {
	// does any of the opponents paths land on king : return true
	// if true : isCheckmate()
	let check = false

	const attackerColor = defenderColor === "white" ? "black" : "white"
	const attackerPaths = getAllPlayerPaths(boardState, attackerColor)

	attackerPaths.forEach((boardPosition) => {
		const piece = getPieceByPosition(boardState.gamePieces, boardPosition)
		if (piece && piece.type === "king") {
			check = true
		}
	})

	return check
}

// isCheckmate(TestingBoardState, "black", TestingAttackerPiece, TestingKingPiece)
