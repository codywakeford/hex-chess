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
		boardPieces: HexBoardPiece[]
		gamePieces: GamePieceMap
		selectedBoardPiece: HexBoardPiece | null
		checkState: CheckState
	}

	/** Sent Apon Create Request */
	interface CreateBoardState {
		boardPieces: HexBoardPiece[]
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

	interface Player {
		id: string
		color: "white" | "black"
	}

	interface HexBoardPiece {
		boardPosition: BoardPosition

		highlight: null | "move" | "attack" | "selected"

		/**Position in px */
		position: number[]

		color: string
	}

	interface checkState {
		white: null | "check" | "checkmate"
		black: null | "check" | "checkmate"
	}

	interface InitialGameRequest {
		gameData: GameInstance
	}
}
