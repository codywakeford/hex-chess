// take board state
// work out all possible moves
// for each move work out a score based on factors
// move to the piece with the highest score

export function getCpuMove(boardState: BoardState, cpu: Player) {
	const cpuLevel = boardState.cpuLevel
	const potentialMoves = getAllPlayerPathsWithPieces(boardState, cpu.color)

	if (cpuLevel === 1) {
		// Step 1: Get a random key (piece) from the map
		const pieces = Array.from(potentialMoves.keys()) // Convert map keys to an array
		const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]

		// Step 2: Get a random move from that piece's array of moves
		const moves = potentialMoves.get(randomPiece)
		if (!moves) throw new Error("no moves")
		const randomMove = moves[Math.floor(Math.random() * moves.length)]

		return { piece: randomPiece, move: randomMove }
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
