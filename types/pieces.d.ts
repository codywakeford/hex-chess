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
		x: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k"
		y: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
	}

	interface Pawn extends GamePiece {
		type: "pawn"
		firstTurn: boolean
	}
}
