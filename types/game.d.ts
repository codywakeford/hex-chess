export {}

declare global {
	interface GameInstance {
		id: string

		playerOne: Player | null
		playerTwo: Player | null

		boardState: BoardState
	}

	interface TransmissionGameInstance extends GameInstance {
		boardState: TransmissionBoardState
	}

	/**Id is game id */
	type GameInstanceCache = Map<string, ServerGameInstance>

	interface BoardState {
		/**Contains information about the board piece, its position and so on. */
		boardPieces: BoardPieceMap
		gamePieces: GamePieceMap
		selectedBoardPiece: BoardPiece | null
		checkState: CheckState
		latestMoves: LatestMoves
		turn: GamePieceColor
	}

	interface ServerBoardState extends BoardState {
		gamePieces: Map<string, GamePiece>
		boardPieces: Map<string, BoardPiece>
	}

	/** Sent Apon Create Request */
	interface TransmissionBoardState {
		boardPieces: BoardPiece[]
		gamePieces: GamePiece[]
		selectedBoardPiece: HexBoardPiece | null
		checkState: CheckState
		latestMoves: LatestMoves
		turn: GamePieceColor
	}

	interface selectedBoardPiece {
		boardPosition: BoardPosition
		highlight: "selected" | "attack" | "move" | null
	}

	interface GameState {
		gameId: string
		playerOne: Player | null
		playerTwo: Player | null

		/**Allows one player to play both sides. */
		playBoth: boolean
	}

	interface BoardPieceMap extends Map<string, BoardPiece> {}

	interface Player {
		id: string
		color: "white" | "black"
	}

	interface LatestMoves {
		white: {
			to: BoardPosition | null
			from: BoardPosition | null
		}
		black: {
			to: BoardPosition | null
			from: BoardPosition | null
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
