export {}

declare global {
	interface GamePiece {
		type: "pawn" | "queen" | "king" | "bishop" | "castle" | "horse"
		color: "black" | "white"
		alive: boolean

		/**X and Y position */
		position: string
	}

	interface Pawn extends GamePiece {
		type: "pawn"
		firstTurn: boolean
	}
}
