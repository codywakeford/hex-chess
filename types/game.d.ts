export {}

declare global {
	interface GameState {
		id: string

		playerOne: Player
		playerTwo?: Player
		joinId: string
	}

	interface BoardState {
		/**Contains information about the board piece, its position and so on. */
		boardPieces: HexBoardPiece[]
		gamePieces: GamePiece[]
		selectedBoardPiece: HexBoardPiece
	}
	interface Player {
		name?: string
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
}
