export {}

declare global {
	interface GameInstance {
		id: string

		playerOne: Player
		playerTwo?: Player

		pieces: GamePiece[]

		joinId: string
	}

	interface Player {
		name?: string
		id: string
		color: "white" | "black"
	}

	interface GamePiece {
		type: "pawn" | "queen" | "king" | "bishop" | "castle" | "horse"
		color: "black" | "white"
		alive: boolean

		/**X and Y position */
		position: [number, number]
	}
}
