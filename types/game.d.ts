export {}

declare global {
	interface GameInstance {
		id: string

		playerOne: Player
		playerTwo: Player | null

		boardState: CreateBoardState
	}

	type GameInstanceCache = Map<string, GameInstance>

	interface BoardState {
		/**Contains information about the board piece, its position and so on. */
		boardPieces: BoardPieceMap
		gamePieces: GamePieceMap
		selectedBoardPiece: HexBoardPiece | null
		checkState: CheckState
		latestMoves: LatestMoves
	}

	/** Sent Apon Create Request */
	interface CreateBoardState {
		boardPieces: BoardPiece[]
		gamePieces: GamePiece[]
		selectedBoardPiece: HexBoardPiece | null
		checkState: CheckState
	}

	interface GameState {
		gameId: string
		playerOne: Player
		playerTwo: Player | null
		turn: GamePieceColor
	}

	interface BoardPieceMap extends Map<string, BoardPiece> {}

	interface Player {
		id: string
		color: "white" | "black"
	}

	interface LatestMoves {
		white: {
			to: {}
			from: {}
		}
		black: {
			to: {}
			from: {}
		}
	}

	interface BoardPiece {
		boardPosition: BoardPosition

		highlight: null | "move" | "attack" | "selected"

		/**Position in px */
		position: number[]
		colorIndex: number

		/**Stores the id of the piece on the hex. */
		pieceId: string | null
	}

	interface checkState {
		white: null | "check" | "checkmate"
		black: null | "check" | "checkmate"
	}

	interface InitialGameRequest {
		gameData: GameInstance
	}
}
