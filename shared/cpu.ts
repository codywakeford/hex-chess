// take board state
// work out all possible moves
// for each move work out a score based on factors
// move to the piece with the highest score

export function getCpuMove(boardState: BoardState, cpu: Player) {
	const cpuLevel = boardState.cpuLevel
	const potentialMoves = getAllPlayerPathsWithPieces(boardState, cpu.color)

	// level 1 : return random piece
	if (cpuLevel === 1) {
		const pieces = Array.from(potentialMoves.keys()) // Convert map keys to an array
		let randomPieceId: string | undefined
		let moves: BoardPosition[] | undefined

		// Keep selecting a random piece until we find one with valid moves
		do {
			randomPieceId = pieces[Math.floor(Math.random() * pieces.length)]
			moves = potentialMoves.get(randomPieceId)
		} while (!moves || moves.length === 0)

		const randomMove = moves[Math.floor(Math.random() * moves.length)]
		const piece = boardState.gamePieces.get(randomPieceId)

		if (!piece) throw new Error("Game piece not found")

		return { piece: piece, fromPosition: piece.boardPosition, toPosition: randomMove }
	}
	// iterate over each move,
	// work out score
	// save scores
	// move the best move
}

function getMoveScore(boardState: BoardState, position: BoardPosition): number {
	// if piece can be kill -number
	return 0
}
