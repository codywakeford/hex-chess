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
		selectedBoardPiece: GamePiece
	}
	interface Player {
		name?: string
		id: string
		color: "white" | "black"
	}

	interface HexBoardPiece {
		/**This is the name of the board position. E.g a1, g7, k11 */
		name: string

		highlight: null | "move" | "attack" | "selected"

		/**Position in px */
		position: number[]

		color: string
	}
}
