export {}

declare global {
	interface GameInstance {
		id: string

		playerOne: Player | null
		playerTwo: Player | null

		boardState: BoardState
	}

	type OpponentType = "cpu" | "human"
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
		opponent: OpponentType
		cpuLevel: number
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
		opponent: OpponentType
		cpuLevel: number
	}

	interface selectedBoardPiece {
		boardPosition: BoardPosition
		highlights: BoardPieceHighlights
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

	type BoardPieceHighlight = "move" | "attack" | "selected" | "previous"
	type BoardPieceHighlights = Set<BoardPieceHighlight>

	interface BoardPiece {
		boardPosition: BoardPosition

		highlights: BoardPieceHighlights

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
