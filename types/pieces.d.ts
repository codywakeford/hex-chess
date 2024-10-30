export {}

declare global {
	interface GamePiece {
		type: "pawn" | "queen" | "king" | "bishop" | "castle" | "horse"
		color: "black" | "white"
		alive: boolean

		/**X and Y position */
		boardPosition: BoardPosition
	}

	/**This is the name of the board position. E.g a1, g7, k11 - files and ranks*/
	interface BoardPosition {
		x: string
		y: number
	}

	interface Pawn extends GamePiece {
		type: "pawn"
		firstTurn: boolean
	}
}
